import {MCEvent} from "@managed-components/types";
import {CreateTrackerCoreOptions} from "./types";
import {createIdManager} from "./id";
import {createPageManager} from "./page";
import {createCookieManager} from "./cookie";
import {createPayloadBuilder} from "./payload-builder";

export const createCore = (options: CreateTrackerCoreOptions) => {
  const {settings, manager} = options;
  return {
    createIdManager: (event: MCEvent) => createIdManager(event, settings),
    createCookieManager: (event: MCEvent) => createCookieManager(event, settings),
    createPageManager: (event: MCEvent) => createPageManager(event, settings),
    createPayloadBuilder: (event: MCEvent) => createPayloadBuilder(event, settings),
    getSettings: () => settings,
    getManager: () => manager,
  };
};