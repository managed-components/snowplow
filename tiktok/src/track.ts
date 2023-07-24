import { ComponentSettings, MCEvent } from '@managed-components/types'
import * as crypto from 'crypto'

const USER_DATA: Record<string, { hashed?: boolean }> = {
  email: { hashed: true },
  phone_number: { hashed: true },
}

const getTtclid = (event: MCEvent) => {
  const { client } = event
  let ttclid = client.get('ttclid') || ''

  if (client.url.searchParams?.get('ttclid')) {
    ttclid = client.url.searchParams.get('ttclid') ?? ''
    client.set('ttclid', ttclid)
  }
  return ttclid
}

const getBaseRequestBody = (
  eventType: string,
  event: MCEvent,
  settings: ComponentSettings
) => {
  const { client, payload } = event
  const eventId = String(Math.round(Math.random() * 100000000000000000))

  const body: { [k: string]: any } = {
    event:
      (eventType === 'pageview' ? 'ViewContent' : payload.ev) ||
      event.name ||
      event.type,
    event_id: eventId,
    timestamp: new Date(client.timestamp!).toISOString(),
    context: {
      page: {
        url: client.url.href,
      },
      ...(!settings.hideClientIP && {
        user_agent: client.userAgent,
        ip: client.ip,
      }),
      user: {},
      ad: {},
    },
    properties: {},
  }
  delete payload.ev

  return body
}

export const getRequestBody = async (
  eventType: string,
  event: MCEvent,
  settings: ComponentSettings
) => {
  let payload
  if (eventType === 'ecommerce') {
    payload = event.payload.ecommerce
  } else {
    payload = event.payload
  }
  const ttclid = getTtclid(event)
  const body = getBaseRequestBody(eventType, event, settings)

  // appending hashed user data
  const encoder = new TextEncoder()
  for (const [key, options] of Object.entries(USER_DATA)) {
    let value = payload[key]
    if (value) {
      if (options.hashed) {
        const data = encoder.encode(value.trim().toLowerCase())
        value = await crypto.createHash('sha256').update(data).digest('hex')
      }
      body.context.user[key] = value
      delete payload[key]
    }
  }

  if (ttclid) {
    body.context.ad = {
      callback: ttclid,
    }
  }

  return body
}
