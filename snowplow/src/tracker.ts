import {MCEvent} from "@managed-components/types";
import {createCore} from "./core";
import {createCookieManager} from "./cookie";
import {createPageManager} from "./page";
import {
  createIdManager,
  incrementEventIndex,
  incrementVisitCount,
  updateEventIndex,
  updateFirstEventId,
  updateFirstEventTs,
  updateLastVisitTs,
  updateNowTs,
  updatePreviousSessionId,
  updateSessionId,
} from "./id";
import {createPayloadBuilder} from "./payload-builder";
import {EventType, Id} from "./types";

export class Tracker {
  public id: ReturnType<typeof createIdManager>;
  public page: ReturnType<typeof createPageManager>;
  public cookie: ReturnType<typeof createCookieManager>;
  public payload: ReturnType<typeof createPayloadBuilder>;

  constructor(
    private core: ReturnType<typeof createCore>,
    private event: MCEvent,
  ) {
    this.id = core.createIdManager(event);
    this.page = core.createPageManager(event);
    this.cookie = core.createCookieManager(event);
    this.payload = core.createPayloadBuilder(event);
  }

  public init() {
    this.initVariables();
    this.initId();
    this.updateCookies();

    return this;
  }

  public track(type: EventType) {
    const payload = this.payload.build({
      type,
      duid: this.id.get(Id.UserId),
      vid: this.id.get(Id.VisitCount),
      sid: this.id.get(Id.SessionId),
      uid: this.page.get('uid'),
      cx: this.payload.getCx(this.page.get('pvid')),
    });

    console.log('Going to track', type);

    this.id.update(
      updateNowTs(),
      updateFirstEventId(payload.eid),
      updateFirstEventTs(payload.dtm),
      incrementEventIndex(),
    );

    this.updateCookies();

    const props = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': this.event.client.ip,
        'User-Agent': this.event.client.userAgent,
      },
      body: JSON.stringify({
        schema: 'iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4',
        data: [payload]
      }),
    };

    console.log('Going to fetch', props)

    return this.core.getManager()
      .fetch(
        `${this.core.getSettings().endpoint}/com.snowplowanalytics.snowplow/tp2`,
        props,
      )
      .catch((err) => {
        console.error(`Tracker.track() error:`, err);
      });
  }

  private initVariables() {
    this.page.initVariables();
  }

  private initId() {
    this.id.update(
      () => this.id.parse(this.cookie.get('id')),
    );

    const isFirstSession = !this.cookie.get('id') && !this.cookie.get('ses');
    if (isFirstSession) {
      this.id.update(
        incrementVisitCount(),
        updateNowTs(),
      );
      return;
    }

    const isSessionExpired = !this.cookie.get('ses');
    if (isSessionExpired) {
      this.id.update(
        incrementVisitCount(),
        updateLastVisitTs(),
        updatePreviousSessionId(),
        updateSessionId(),
        updateNowTs(),
        updateFirstEventId(),
        updateFirstEventTs(),
        updateEventIndex(),
      );
      return;
    }

    this.id.update(
      updateNowTs(),
    );
  }

  private updateCookies() {
    this.cookie.set('id', this.id.build(), {
      expiry: 1000 * 60 * 60 * 24 * 365, // 1 year
      scope: 'session',
    });
    this.cookie.set('ses', '*', {
      expiry: 1000 * 60 * 30, // 30 minutes
      scope: 'session',
    });
  }
}

