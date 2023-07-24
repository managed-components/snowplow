import { createPageManager } from '../src/page';

declare const jest: any;

describe('createPageManager', () => {
  let mockEvent;
  let mockClient;

  beforeEach(() => {
    // Mock 'event' object and 'client' object with necessary properties
    mockClient = {
      url: {
        hostname: 'example.com',
        href: 'https://example.com/page1'
      },
      get: jest.fn(),
      set: jest.fn(),
      referer: ''
    };
    mockEvent = { client: mockClient, payload: {} };
  });

  it('should set a "pvid" variable with a UUID as value', () => {
    const pageManager = createPageManager(mockEvent, {} as any);
    pageManager.initVariables();
    expect(mockClient.set).toHaveBeenCalledWith('pvid', expect.any(String), { scope: 'page' });
  });

  it('should init variables', () => {
    const ev = Object.assign({}, mockEvent, {payload: {customerEmail: 'test@example.com'}});
    const pageManager = createPageManager(ev, {} as any);
    pageManager.initVariables();
    expect(mockClient.set).toHaveBeenCalledWith('pvid', expect.any(String), { scope: 'page' });
    expect(mockClient.set).toHaveBeenCalledWith('uid', 'test@example.com', { scope: 'page' });
  });

  it('should not set an "email" variable if it already exists in the client object', () => {
    mockClient.get.mockReturnValueOnce('test@example.com');
    const pageManager = createPageManager(mockEvent, {} as any);
    pageManager.set('uid', 'test@example.com');
    expect(mockClient.set).not.toHaveBeenCalled();
  });
});
