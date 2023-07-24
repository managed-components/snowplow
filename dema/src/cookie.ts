import { MCEvent } from '@managed-components/types'

export const updateAndReturnUid = (event: MCEvent): string => {
  const uid = event.client.get('uid') || crypto.randomUUID()
  event.client.set('uid', uid, {
    expiry: 15778476000, // 6 months
    scope: 'session',
  })
  return uid
}
