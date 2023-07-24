# TikTok Managed Component

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

### Pixel Code `string` _required_

`pixelCode` is a long number that identifies your Facebook Ads account.

###  API Access Token _required_

`accessToken` is a string used to authenticate when sending server side events in your name. You can obtain it [following the information here](https://ads.tiktok.com/marketing_api/docs?id=1727537566862337n).

### Test Event Code

`testKey` is used to test your app or web browser events using test events tool [Learn more](https://ads.tiktok.com/marketing_api/docs?id=1727537566862337)

## 🧱 Fields Description

> Fields are properties that can/must be sent with certain events

### Tiktok Event Name `string` _required_

`ev` can be \"ContentView\", \"PlaceAnOrder\", \"Add to Cart\" one of [the standard Tiktok events](https://ads.tiktok.com/marketing_api/docs?id=1727541103358977).


### Email `string`

`email` user email

### Phone Number `string`

`phone-mumber` remove symbols, letters, and any leading zeros. Phone numbers must include a country code to be used for matching (e.g., the number 1 must precede a phone number in the United States). Always include the country code as part of your customers' phone numbers, even if all of your data is from the same country.