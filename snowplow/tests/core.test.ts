//
// import { MCEvent } from "@managed-components/types";
// import {CreateTrackerCoreOptions, Id} from "../src/types";
// import {createIdManager} from "../src/id";
// import {createPageManager} from "../src/page";
// import {createCookieManager} from "../src/cookie";
// import {createPayloadBuilder} from "../src/payload-builder";
// import {createCore} from "../src/core";
//
// declare const jest: any;
//
// jest.mock("./id");
// jest.mock("./page");
// jest.mock("./cookie");
// jest.mock("./payload-builder");
//
// describe("createCore", () => {
//   const mockSettings = {
//     appId: "mockAppId",
//     namespace: "mockNamespace",
//     endpoint: "mockEndpoint",
//     platform: "web",
//   };
//   const mockManager = { track: jest.fn() };
//   const options = {
//     settings: mockSettings,
//     manager: mockManager,
//   };
//   const mockEvent: MCEvent = {
//     name: "test",
//   };
//
//   beforeEach(() => {
//     (createIdManager as jest.Mock).mockReturnValue(jest.fn());
//     (createPageManager as jest.Mock).mockReturnValue(jest.fn());
//     (createCookieManager as jest.Mock).mockReturnValue(jest.fn());
//     (createPayloadBuilder as jest.Mock).mockReturnValue(jest.fn());
//   });
//
//   afterEach(() => {
//     jest.resetAllMocks();
//   });
//
//   it("should create core with correct methods", () => {
//     const core = createCore(options as CreateTrackerCoreOptions);
//     expect(core.createIdManager(mockEvent)).toBeDefined();
//     expect(core.createCookieManager(mockEvent)).toBeDefined();
//     expect(core.createPageManager(mockEvent)).toBeDefined();
//     expect(core.createPayloadBuilder(mockEvent)).toBeDefined();
//     expect(core.getSettings()).toEqual(mockSettings);
//     expect(core.getManager()).toEqual(mockManager);
//     expect(createIdManager).toHaveBeenCalledWith(mockEvent, mockSettings);
//     expect(createPageManager).toHaveBeenCalledWith(mockEvent, mockSettings);
//     expect(createCookieManager).toHaveBeenCalledWith(mockEvent, mockSettings);
//     expect(createPayloadBuilder).toHaveBeenCalledWith(mockEvent, mockSettings);
//   });
//
//   it("should correctly create an id manager", () => {
//     const idManager = createIdManager(mockEvent, mockSettings);
//     expect(idManager.get).toBeDefined();
//     expect(idManager.set).toBeDefined();
//     expect(idManager.parse).toBeDefined();
//     expect(idManager.update).toBeDefined();
//     expect(idManager.build).toBeDefined();
//     expect(idManager.toJSON).toBeDefined();
//   });
//
//   it("should correctly create a page manager", () => {
//     const pageManager = createPageManager(mockEvent, mockSettings);
//     expect(pageManager.get).toBeDefined();
//     expect(pageManager.set).toBeDefined();
//     expect(pageManager.initVariables).toBeDefined();
//   });
//
//   it("should correctly create a cookie manager", () => {
//     const cookieManager = createCookieManager(mockEvent, mockSettings);
//     expect(cookieManager.get).toBeDefined();
//     expect(cookieManager.set).toBeDefined();
//   });
//
//   it("should correctly create a payload builder", () => {
//     const payloadBuilder = createPayloadBuilder(mockEvent, mockSettings);
//     expect(payloadBuilder.build).toBeDefined();
//     expect(payloadBuilder.common).toBeDefined();
//     expect(payloadBuilder.getCx).toBeDefined();
//     expect(payloadBuilder.event).toBeDefined();
//     expect(payloadBuilder.ecommerce).toBeDefined();
//     expect(payloadBuilder.pageview).toBeDefined();
//   });
// });

// core.test.js

import {createCore} from '../src/core';

declare const jest: any;

const options = {
  settings: { endpoint: 'https://example.com', namespace: 'test' },
  manager: { addEventListener: jest.fn(), fetch: jest.fn() }
};

describe('createCore', () => {
  test('creates a core object with the expected methods', () => {
    const core = createCore(options as any);

    expect(core).toHaveProperty('createIdManager');
    expect(core).toHaveProperty('createCookieManager');
    expect(core).toHaveProperty('createPageManager');
    expect(core).toHaveProperty('createPayloadBuilder');
    expect(core).toHaveProperty('getSettings');
    expect(core).toHaveProperty('getManager');
  });
});

describe('createIdManager', () => {
  test('creates an ID manager object', () => {
    const idManager = createCore(options as any)
      .createIdManager({} as any);

    expect(idManager.set).toBeInstanceOf(Function);
    expect(idManager.get).toBeInstanceOf(Function);
  });
});

describe('createCookieManager', () => {
  test('creates a cookie manager object', () => {
    const cookieManager = createCore(options as any)
      .createCookieManager({client: {url: { hostname: 'https://exmaple.com' }}} as any);

    expect(cookieManager.set).toBeInstanceOf(Function);
    expect(cookieManager.get).toBeInstanceOf(Function);
  });
});

describe('createPageManager', () => {
  test('creates a page manager object', () => {
    const pageManager = createCore(options as any)
      .createPageManager({} as any);

    expect(pageManager.set).toBeInstanceOf(Function);
    expect(pageManager.get).toBeInstanceOf(Function);
  });
});

describe('createPayloadBuilder', () => {
  test('creates a payload builder object', () => {
    const payloadBuilder = createCore(options as any)
      .createPayloadBuilder({} as any);

    expect(payloadBuilder.common).toBeInstanceOf(Function);
    expect(payloadBuilder.build).toBeInstanceOf(Function);
    expect(payloadBuilder.ecommerce).toBeInstanceOf(Function);
  });
});

describe('getSettings', () => {
  test('returns the settings object passed to createCore', () => {
    const core = createCore(options as any);

    expect(core.getSettings()).toEqual(options.settings);
  });
});

describe('getManager', () => {
  test('returns the manager object passed to createCore', () => {
    const core = createCore(options as any);

    expect(core.getManager()).toEqual(options.manager);
  });
});
