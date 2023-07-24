import {
  getDefaultIdStructure,
  incrementVisitCount,
  updateNowTs,
  updateLastVisitTs,
  updatePreviousSessionId,
  updateSessionId,
  updateFirstEventId,
  updateFirstEventTs,
  updateEventIndex,
  createIdManager
} from '../src/id';

describe('getDefaultIdStructure', () => {
  it('should return an array with default values', () => {
    const expectedStructure = [
      expect.any(String), // UserId
      expect.any(String), // CreateTs
      expect.any(String), // VisitCount
      expect.any(String), // NowTs
      expect.any(String), // LastVisitTs
      expect.any(String), // SessionId
      expect.any(String), // PreviousSessionId
      expect.any(String), // FirstEventId
      expect.any(String), // FirstEventTs
      expect.any(String), // EventIndex
    ];
    expect(getDefaultIdStructure()).toEqual(expectedStructure);
  });
});

describe('incrementVisitCount', () => {
  it('should increment visit count by 1', () => {
    const structure = ['user-id', '1234567890', '0'];
    const expectedStructure = ['user-id', '1234567890', '1'];
    const updatedStructure = incrementVisitCount()(structure);
    expect(updatedStructure).toEqual(expectedStructure);
  });
});

describe('updateNowTs', () => {
  it('should update NowTs to current timestamp', () => {
    const structure = ['user-id', '1234567890', '0', '1234567890'];
    const expectedStructure = ['user-id', '1234567890', '0', expect.any(String)];
    const updatedStructure = updateNowTs()(structure);
    expect(updatedStructure).toEqual(expectedStructure);
  });
});

describe('updateLastVisitTs', () => {
  it('should update LastVisitTs to NowTs', () => {
    const structure = ['user-id', '1234567890', '0', '1234567890', ''];
    const expectedStructure = ['user-id', '1234567890', '0', '1234567890', '1234567890'];
    const updatedStructure = updateLastVisitTs()(structure);
    expect(updatedStructure).toEqual(expectedStructure);
  });
});

describe('updatePreviousSessionId', () => {
  it('should update PreviousSessionId to SessionId', () => {
    const structure = ['user-id', '1234567890', '0', '1234567890', '', 'session-id', ''];
    const expectedStructure = ['user-id', '1234567890', '0', '1234567890', '', 'session-id', 'session-id'];
    const updatedStructure = updatePreviousSessionId()(structure);
    expect(updatedStructure).toEqual(expectedStructure);
  });
});

describe('updateSessionId', () => {
  it('should generate a new SessionId', () => {
    const structure = ['user-id', '1234567890', '0', '1234567890', '', 'session-id'];
    const updatedStructure = updateSessionId()(structure.slice());
    expect(structure[5]).not.toEqual(updatedStructure[5]);
  });
});

describe('updateFirstEventId', () => {
  it('should update FirstEventId with the provided value', () => {
    const structure = ['user-id', '1234567890', '0', '1234567890', '', 'session-id', '', ''];
    const expectedStructure = ['user-id', '1234567890', '0', '1234567890', '', 'session-id', '', 'first-event-id'];
    const updatedStructure = updateFirstEventId('first-event-id')(structure);
    expect(updatedStructure).toEqual(expectedStructure);
  });
});

describe('updateFirstEventTs', () => {
  it('should update FirstEventTs with the provided value', () => {
    const structure = ['user-id', '1234567890', '0', '1234567890', '', 'session-id', '', '', ''];
    const expectedStructure = ['user-id', '1234567890', '0', '1234567890', '', 'session-id', '', '', '1234567890'];
    const updatedStructure = updateFirstEventTs('1234567890')(structure);
    expect(updatedStructure).toEqual(expectedStructure);
  });
});

describe('updateEventIndex', () => {
  it('should update EventIndex with the provided value', () => {
    const structure = ['user-id', '1234567890', '0', '1234567890', '', 'session-id', '', '', '1234567890', '0'];
    const expectedStructure = ['user-id', '1234567890', '0', '1234567890', '', 'session-id', '', '', '1234567890', '1'];
    const updatedStructure = updateEventIndex('1')(structure);
    expect(updatedStructure).toEqual(expectedStructure);
  });
});

describe("createIdManager", () => {
  describe("parse", () => {
    test("parses a string ID and returns an array of ID values", () => {
      const id = "1234567890.abcdefg.hijklmnop";
      const manager = createIdManager(null, null);
      const parsed = manager.parse(id);

      expect(parsed.length).toEqual(10);
      expect(parsed[0]).toEqual("1234567890");
      expect(parsed[1]).toEqual("abcdefg");
      expect(parsed[2]).toEqual("hijklmnop");
      expect(parsed[3]).toEqual(expect.any(String));
      expect(parsed[4]).toEqual(expect.any(String));
      expect(parsed[5]).toEqual(expect.any(String));
      expect(parsed[6]).toEqual(expect.any(String));
      expect(parsed[7]).toEqual("");
      expect(parsed[8]).toEqual("");
      expect(parsed[9]).toEqual("0");
    });

    test("fills in missing ID fields with default values", () => {
      const id = "1234567890";
      const manager = createIdManager(null, null);
      const parsed = manager.parse(id);

      expect(parsed.length).toEqual(10);
      expect(parsed[0]).toEqual("1234567890");
      expect(parsed[1]).not.toEqual("");
      expect(parsed[2]).toEqual("0");
      expect(parsed[3]).toEqual(expect.any(String));
      expect(parsed[4]).toEqual(expect.any(String));
      expect(parsed[5]).toEqual(expect.any(String));
      expect(parsed[6]).toEqual(expect.any(String));
      expect(parsed[7]).toEqual("");
      expect(parsed[8]).toEqual("");
      expect(parsed[9]).toEqual("0");
    });
  });

  describe("update", () => {
    test("applies a series of update functions to the ID structure", () => {
      const manager = createIdManager(null, null);

      manager.update(
        () => getDefaultIdStructure(),
        (structure) => {
          structure[2] = "1";
          return structure;
        },
        (structure) => {
          structure[4] = "1234567890";
          return structure;
        }
      );

      expect(manager.structure).toEqual([
        expect.any(String),
        expect.any(String),
        "1",
        expect.any(String),
        "1234567890",
        expect.any(String),
        expect.any(String),
        "",
        "",
        "0"
      ]);
    });
  });

  describe("build", () => {
    test("joins the ID fields together into a string", () => {
      const manager = createIdManager(null, null);
      manager.set(0, "1234567890");
      manager.set(1, "abcdefg");
      manager.set(2, "1");
      manager.set(3, "1234567890");
      manager.set(4, "0987654321");
      manager.set(5, "asdfghjk");
      manager.set(6, "qwertyui");
      manager.set(7, "");
      manager.set(8, "");
      manager.set(9, "0");

      const builtId = manager.build();
      expect(builtId).toEqual("1234567890.abcdefg.1.1234567890.0987654321.asdfghjk.qwertyui...0");
    });
  });
});
