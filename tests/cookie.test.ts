import {ClientSetOptions, MCEvent} from "@managed-components/types";
import {createCookieManager} from "../src/cookie";
import {TrackerSettings} from "../src/types";

declare const jest: any;

describe('createCookieManager', () => {
  it('should call event.client.get with expected arguments', () => {
    const clientGetMock = jest.fn();
    const event = {
      client: {
        url: {hostname: 'example.com'},
        set: jest.fn(),
        get: clientGetMock,
      }
    };
    const settings = {namespace: 'test'};
    const cookieManager = createCookieManager(event as MCEvent, settings as TrackerSettings);

    cookieManager.get('foo');

    expect(clientGetMock).toHaveBeenCalledWith('test_foo.recp');
  });

  it('should return empty string if event.client.get returns falsy', () => {
    const event = {
      client: {
        url: {hostname: 'example.com'},
        set: jest.fn(),
        get: jest.fn(() => undefined),
      }
    };
    const settings = {namespace: 'test'};
    const cookieManager = createCookieManager(event as MCEvent, settings as TrackerSettings);

    expect(cookieManager.get('foo')).toEqual('');
  });

  it('should allow setting ClientSetOptions when calling event.client.set', () => {
    const clientSetMock = jest.fn();
    const event = {
      client: {
        url: {hostname: 'example.com'},
        set: clientSetMock,
        get: jest.fn(),
      }
    };
    const settings = {namespace: 'test'};
    const cookieManager = createCookieManager(event as MCEvent, settings as TrackerSettings);
    const options = {expires: new Date('2030-01-01')};

    cookieManager.set('foo', 'bar', options as ClientSetOptions);

    expect(clientSetMock).toHaveBeenCalledWith('test_foo.recp', 'bar', options);
  });
});

