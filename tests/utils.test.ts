import {getDomainHash, getEventPayloadValue, uuidv4} from "../src/utils";

describe('getDomainHash', () => {
  it('should return a string of length 4', () => {
    const result = getDomainHash('example.com');
    expect(result).toHaveLength(4);
  });

  it('should return a hash that only contains lowercase letters and digits', () => {
    const result = getDomainHash('example.com');
    const validCharacters = /^[a-z0-9]+$/;
    expect(result).toMatch(validCharacters);
  });

  it('should return the same hash for the same input string', () => {
    const input = 'example.com';
    const result1 = getDomainHash(input);
    const result2 = getDomainHash(input);
    expect(result1).toEqual(result2);
  });

  it('should return different hashes for different input strings', () => {
    const input1 = 'example.com';
    const input2 = 'example.org';
    const result1 = getDomainHash(input1);
    const result2 = getDomainHash(input2);
    expect(result1).not.toEqual(result2);
  });
});

describe('getDomainHash', () => {
  test('should return a 4 character string', () => {
    const hash = getDomainHash('example.com');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(4);
  });

  test('should return different hashes for different input strings', () => {
    const hash1 = getDomainHash('example1.com');
    const hash2 = getDomainHash('example2.com');
    expect(hash1).not.toBe(hash2);
  });

  test('should handle empty input string', () => {
    const hash = getDomainHash('');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(4);
  });

  test('should handle input strings with only numbers', () => {
    const hash = getDomainHash('12345');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(4);
  });

  test('should handle input strings with only alphabets', () => {
    const hash = getDomainHash('example');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(4);
  });

  test('should handle input strings with special characters', () => {
    const hash = getDomainHash('ex@mple.com');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(4);
  });

  test('should return the same hash for the same input domain', () => {
    const domain = 'example.com';
    const hash1 = getDomainHash(domain);
    const hash2 = getDomainHash(domain);
    expect(hash1).toBe(hash2);
  });
});

describe('getEventPayloadValue', () => {
  it('should return null if event payload is undefined or null', () => {
    expect(getEventPayloadValue({} as any, 'key')).toBeNull();
    expect(getEventPayloadValue({ payload: null } as any, 'key')).toBeNull();
  });

  it('should return null if key not found in event payload', () => {
    expect(getEventPayloadValue({ payload: {} } as any, 'key')).toBeNull();
    expect(getEventPayloadValue({ payload: { ecommerce: {} } } as any, 'key')).toBeNull();
  });

  it('should return value if key found in event payload', () => {
    expect(getEventPayloadValue({ payload: { key: 'value' } } as any, 'key')).toEqual('value');
    expect(getEventPayloadValue({ payload: { ecommerce: { key: 'value' } } } as any, 'key')).toEqual('value');
  });
});

