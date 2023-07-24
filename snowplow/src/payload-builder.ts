import {MCEvent} from "@managed-components/types";
import {EventType, TrackerSettings} from "./types";
import {uuidv4} from "./utils";

export const createPayloadBuilder = (event: MCEvent, settings: TrackerSettings) => {
  const builder = {
    common: (obj) => {
      return {
        e: obj.type,
        duid: obj.duid,
        vid: obj.vid,
        sid: obj.sid,
        cx: obj.cx,
        url: event.client.url.href,
        refr: event.client.referer,
        uid: obj.uid,
        page: event.client.title,
        eid: uuidv4(),
        tv: "zaraz-1.0.0",
        tna: settings.namespace,
        aid: settings.appId,
        p: settings.platform,
        cookie: "1",
        lang: event.client.language
          .split(',')
          .shift(),
        dtm: new Date().getTime().toString(),
        stm: new Date().getTime().toString(),
        // don't know at the moment how to get values for these fields
        cs: "UTF-8",
        res: "1440x900",
        cd: "24",
        vp: "1750x187",
        ds: "1750x6747",
      };
    },
    pageview: (obj) => {
      return {
        e: 'pv',
      };
    },
    event: (obj) => {
      return {
        ...builder.ecommerce(obj),
        se_ac: event.payload.evt,
      };
    },
    ecommerce: (obj) => {
      const payload = event.payload.ecommerce || event.payload;
      const action = event.name || event.payload.name || event.payload.ecommerce.name;
      const category = 'ecom';
      const label = payload.order_id || payload.product_id || payload.checkout_id;
      const property = payload.currency;
      const value = payload.value || payload.price || payload.total || payload.revenue;
      return {
        e: 'se',
        se_ac: action,
        se_ca: category,
        se_la: label,
        se_pr: property,
        se_va: value?.toString(),
      };
    },
    build: (object: Record<'type', EventType> & Record<string, any>) => {
      return Object.assign(
        builder.common(object),
        builder[object.type?.toLowerCase()]?.(object) || {},
      );
    },
    getCx: (pageViewId: string) => {
      const data = {
        "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
        "data": [{
          "schema": "iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0",
          "data": {"id": pageViewId}
        }]
      };
      return btoa(JSON.stringify(data));
    }
  };

  return builder;
};