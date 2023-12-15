import {ComponentSettings, Manager, MCEvent} from "@managed-components/types"
import {createCore} from "./core";
import {CreateTrackerCoreOptions} from "./types";
import {Tracker} from "./tracker";

export default async function (manager: Manager, settings: ComponentSettings) {
  const core = createCore({settings, manager} as CreateTrackerCoreOptions);

  const track = (name: string, event: MCEvent) => new Tracker(core, event)
    .init()
    .track(name);

  ['pageview', 'ecommerce', 'event'].forEach(
    name => manager.addEventListener(
      name,
      async event => track(name, event),
    ),
  );
}