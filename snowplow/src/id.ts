import {MCEvent} from "@managed-components/types";
import {Id, TrackerSettings, IdStructure, IdUpdateFn} from "./types";
import {uuidv4} from "./utils";

export const getDefaultIdStructure = (): IdStructure => {
  const now = new Date();
  const nowTs = Math.round(now.getTime() / 1000);
  const structure: IdStructure = [];

  structure[Id.UserId] = uuidv4();
  structure[Id.CreateTs] = String(nowTs);
  structure[Id.VisitCount] = '0';
  structure[Id.NowTs] = String(nowTs);
  structure[Id.LastVisitTs] = '';
  structure[Id.SessionId] = uuidv4();
  structure[Id.PreviousSessionId] = '';
  structure[Id.FirstEventId] = '';
  structure[Id.FirstEventTs] = '';
  structure[Id.EventIndex] = '0';

  return structure;
};

export const incrementVisitCount: IdUpdateFn = () => (structure: (string | number)[]): IdStructure => {
  structure[Id.VisitCount] = String(Number(structure[Id.VisitCount] || 0) + 1);
  return structure as IdStructure;
};

export const updateNowTs: IdUpdateFn = () => (structure: (string | number)[]): IdStructure => {
  structure[Id.NowTs] = String(Math.round(new Date().getTime() / 1000));
  return structure as IdStructure;
};

export const updateLastVisitTs: IdUpdateFn = () => (structure: IdStructure): IdStructure => {
  structure[Id.LastVisitTs] = String(structure[Id.NowTs]);
  return structure;
};

export const updatePreviousSessionId: IdUpdateFn = () => (structure: IdStructure): IdStructure => {
  structure[Id.PreviousSessionId] = String(structure[Id.SessionId]);
  return structure;
};

export const updateSessionId: IdUpdateFn = () => (structure: IdStructure): IdStructure => {
  structure[Id.SessionId] = uuidv4();
  return structure;
};

export const updateFirstEventId: IdUpdateFn = (value = '') => (structure: IdStructure): IdStructure => {
  structure[Id.FirstEventId] = String(value);
  return structure;
};

export const updateFirstEventTs: IdUpdateFn = (value = '') => (structure: IdStructure): IdStructure => {
  structure[Id.FirstEventTs] = String(value);
  return structure;
};

export const updateEventIndex: IdUpdateFn = (value = '0') => (structure: IdStructure): IdStructure => {
  structure[Id.EventIndex] = String(value);
  return structure;
};

export const incrementEventIndex: IdUpdateFn = () => (structure: IdStructure): IdStructure => {
  structure[Id.EventIndex] = String(Number(structure[Id.EventIndex] || 0) + 1);
  return structure;
};

export const createIdManager = (event: MCEvent, settings: TrackerSettings) => {
  const structure: IdStructure = [];
  const manager = {
    get structure(): IdStructure {
      return structure;
    },
    get: (index: Id): IdStructure[keyof IdStructure] | undefined => {
      return structure[index];
    },
    set: (index: Id, value: string | number): void => {
      structure[index] = String(value);
    },
    parse: (id: string): IdStructure => {
      const existing = (id || '').split('.');
      return getDefaultIdStructure()
        .map((defaultValue, index) => existing[index] || defaultValue);
    },
    update: (...fns: Array<ReturnType<IdUpdateFn>>): void => fns
      .reduce(
        (structure, fn) => fn(structure),
        structure.slice(),
      )
      .forEach((elem, index) => structure[index] = elem),
    build: (): string => manager.structure.join('.'),
    toJSON: (): object => Object
      .keys(Id)
      .filter(key => isNaN(Number(key)))
      .reduce(
        (acc, key) => Object.assign(acc, {[key]: structure[Id[key]]}), 
        {},
      ),
  };

  return manager;
};