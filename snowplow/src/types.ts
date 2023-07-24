import {ComponentSettings, Manager} from "@managed-components/types";

export type IdStructure = (string | number)[];

export enum Id {
  UserId,
  CreateTs,
  VisitCount,
  NowTs,
  LastVisitTs,
  SessionId,
  PreviousSessionId,
  FirstEventId,
  FirstEventTs,
  EventIndex,
}

export type IdUpdateFn = (value?: string | undefined) => (structure: IdStructure) => IdStructure;

export interface TrackerSettings extends ComponentSettings {
  appId: string;
  namespace: string;
  endpoint: string;
  platform: string;
}

export interface CreateTrackerCoreOptions {
  settings: TrackerSettings;
  manager: Manager;
}

export type EventType =
  | 'pageview'
  | 'ecommerce'
  | string
  ;
