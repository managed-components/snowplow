import {createPayloadBuilder} from "../src/payload-builder";

describe('createPayloadBuilder', () => {
  const event = {
    payload: {
      ecommerce: {
        name: 'Test Product',
        order_id: '12345',
        price: 99.99,
        currency: 'USD'
      }
    },
    name: 'purchase',
    client: {
      url: {
        href: 'https://example.com/page'
      },
      referer: 'https://google.com',
      title: 'Example Page',
      language: 'en-US',
    }
  };

  const settings = {
    namespace: 'test',
    appId: '123',
    platform: 'web',
  };

  it('should build a common payload object', () => {
    const builder = createPayloadBuilder(event as any, settings as any);
    const payload = builder.common({ type: 'pageview', duid: 'abc123' });
    expect(payload).toMatchObject({
      e: 'pageview',
      duid: 'abc123',
      vid: undefined,
      sid: undefined,
      cx: undefined,
      url: 'https://example.com/page',
      refr: 'https://google.com',
      uid: undefined,
      page: 'Example Page',
      eid: expect.any(String),
      tv: 'zaraz-1.0.0',
      tna: 'test',
      aid: '123',
      p: 'web',
      cookie: '1',
      lang: 'en-US',
      dtm: expect.any(String),
      stm: expect.any(String),
      cs: 'UTF-8',
      res: '1440x900',
      cd: '24',
      vp: '1750x187',
      ds: '1750x6747',
    });
  });

  it('should build a pageview payload object', () => {
    const builder = createPayloadBuilder(event as any, settings as any);
    const payload = builder.pageview({});
    expect(payload.e).toBe('pv');
  });

  it('should build an ecommerce payload object', () => {
    const builder = createPayloadBuilder(event as any, settings as any);
    const payload = builder.ecommerce({});
    expect(payload).toMatchObject({
      e: 'se',
      se_ac: 'purchase',
      se_ca: 'ecom',
      se_la: '12345',
      se_pr: 'USD',
      se_va: '99.99',
    });
  });

  it('should build a custom payload object', () => {
    const builder = createPayloadBuilder(event as any, settings as any);
    const payload = builder.build({ type: 'custom', foo: 'bar' });

    expect(payload).toMatchObject({
      e: 'custom',
      duid: undefined,
      vid: undefined,
      sid: undefined,
      cx: undefined,
      url: 'https://example.com/page',
      refr: 'https://google.com',
      uid: undefined,
      page: 'Example Page',
      eid: expect.any(String),
      tv: 'zaraz-1.0.0',
      tna: 'test',
      aid: '123',
      p: 'web',
      cookie: '1',
      lang: 'en-US',
      dtm: expect.any(String),
      stm: expect.any(String),
      cs: 'UTF-8',
      res: '1440x900',
      cd: '24',
      vp: '1750x187',
      ds: '1750x6747',
    });
  });
});
