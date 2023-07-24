import {createCore} from "../src/core";
import {Tracker} from "../src/tracker";
import {incrementEventIndex, updateFirstEventId, updateFirstEventTs, updateNowTs} from "../src/id";

declare const jest: any;

describe("Tracker", () => {
  let settings, event, core, tracker;

  beforeEach(() => {
    settings = {
      appId: "test-app",
      namespace: "test",
      endpoint: "https://example.com",
      platform: "web"
    };
    event = {
      name: "Test Event",
      payload: {
        ecommerce: {
          name: "Test Ecommerce Event"
        }
      },
      client: {
        get: jest.fn(),
        set: jest.fn(),
        url: {
          href: "https://example.com"
        },
        referer: "",
        language: "en-US,en;q=0.5",
        title: "Example Domain",
        ip: "127.0.0.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      }
    };
    const manager = {
      addEventListener: jest.fn(),
      fetch: jest.fn().mockResolvedValue(undefined as any)
    };
    core = createCore({settings, manager} as any);
    tracker = new Tracker(core, event);
  });

  describe("#init()", () => {
    it("should initialize variables", () => {
      tracker.initVariables = jest.fn();

      tracker.init();

      expect(tracker.initVariables).toHaveBeenCalled();
    });

    it("should initialize ID", () => {
      tracker.initId = jest.fn();

      tracker.init();

      expect(tracker.initId).toHaveBeenCalled();
    });

    it("should update cookies", () => {
      tracker.updateCookies = jest.fn();

      tracker.init();

      expect(tracker.updateCookies).toHaveBeenCalled();
    });
  });

  describe("#track()", () => {
    beforeEach(() => {
      tracker.id.update(
        updateNowTs(),
        updateFirstEventId("test-event-id"),
        updateFirstEventTs("12345"),
        incrementEventIndex()
      );
    });

    it("should build payload with common attributes", () => {
      const payload = tracker.payload.build({
        type: "pageview",
        duid: "123",
        vid: "1",
        sid: "abc",
        uid: "user@example.com",
        cx: "eyJzY2hlbWEiOiAiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25v"
      });

      expect(payload).toEqual(expect.objectContaining({
        e: "pv",
        duid: "123",
        vid: "1",
        sid: "abc",
        uid: "user@example.com",
        cx: "eyJzY2hlbWEiOiAiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25v",
        url: "https://example.com",
        refr: "",
        page: "Example Domain",
        eid: expect.any(String),
        tv: "zaraz-1.0.0",
        tna: "test",
        aid: "test-app",
        p: "web",
        cookie: "1",
        lang: "en-US",
        dtm: expect.any(String),
        stm: expect.any(String),
        cs: "UTF-8",
        res: "1440x900",
        cd: "24",
        vp: "1750x187",
        ds: "1750x6747"
      }));
    });

    it("should update ID", () => {
      tracker.id.update = jest.fn();
      tracker.track("pageview");

      expect(tracker.id.update).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
        expect.any(Function)
      );
    });

    it("should update cookies", () => {
      tracker.updateCookies = jest.fn();
      tracker.track("pageview");

      expect(tracker.updateCookies).toHaveBeenCalled();
    });

    it("should send payload to endpoint", async () => {
      tracker.track();
      expect(tracker.core.getManager().fetch).toHaveBeenCalledWith(settings.endpoint + '/com.snowplowanalytics.snowplow/tp2', expect.objectContaining({
        method: "POST",
      }));
    });
  });
});