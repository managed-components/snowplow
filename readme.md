# Snowplow Managed Component

Simplified implementation of **snowplow** library for tracking web events.
<br>Supports working with cookies (_id, _ses) and sending ecommerce events.

Find out more about Managed Components [here](https://blog.cloudflare.com/zaraz-open-source-managed-components-and-webcm/) for inspiration and motivation details.

[![Released under the Apache license.](https://img.shields.io/badge/license-apache-blue.svg)](./LICENSE)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## 🚀 Quickstart local dev environment

1. Make sure you're running node version >=17.
2. Install dependencies with `npm i`
3. Run unit test watcher with `npm run test:dev`

## ⚙️ Tool Settings

> Settings are used to configure the tool in a Component Manager config file

### App ID `string` _required_

`appId`, application id, [official documentation.](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracker-setup/initialization-options/#setting-the-application-id)

### Namespace `string` _required_

`namespace`, the tracker namespace.

### Endpoint `string` _required_

`endpoint`, the collector endpoint.

### Platform `string` _required_

`platform`, for now it is hardcoded as "web"



## 🧱 Fields Description

> Fields are properties that can/must be sent with certain events

### Email `string`

`customerEmail`, if set, will be sent to the collector endpoint as `uid` field.

#### Fields that are part of a trackStructEvent, [official documentation](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracking-specific-events/#trackstructevent)

### Action `string`

`event.payload.ecommerce.name`, name of the event.

### Label `string`

`payload.order_id || payload.product_id || payload.checkout_id`, label of the event.

### Property `string`

`payload.currency`, property of the event.

### Value `string`

`payload.value || payload.price || payload.total || payload.revenue`, value of the event.


