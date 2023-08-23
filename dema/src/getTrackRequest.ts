import { DemaPayload } from './types'

export const prepareUrl = (payload: DemaPayload): URL => {
  const url = new URL('https://tracker.dema.ai/track.js')

  for (const [key, value] of Object.entries(payload)) {
    url.searchParams.set(key, value)
  }

  return url
}

export const getTrackRequest = async (
  payload: DemaPayload
): Promise<Request> => {
  const endpoint = prepareUrl(payload).toString()
  console.log(
    'create Request object using payload',
    JSON.stringify(payload),
    endpoint
  )
  return new Request(endpoint, {
    headers: {
      'User-Agent': payload.ua ?? '',
      'x-dema-ip': payload.ip ?? '',
      'x-dema-user-agent': payload.ua ?? '',
    },
  })
}
