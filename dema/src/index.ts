import { ComponentSettings, Manager } from '@managed-components/types'
import { getTrackRequest } from './getTrackRequest'
import { getOrderPayload, getPageviewPayload } from './payload'

export default function (manager: Manager, settings: ComponentSettings) {
  manager.addEventListener('pageview', async event => {
    const response = await Promise.resolve(getPageviewPayload(event, settings))
      .then(getTrackRequest)
      .then(manager.fetch.bind(manager))

    console.log('Response: ', JSON.stringify(response))
    return
  })

  manager.addEventListener('ecommerce', async event => {
    const action =
      event.name || event.payload.name || event.payload.ecommerce.name

    switch (action) {
      case 'Product Viewed': {
        const response = await Promise.resolve(
          getPageviewPayload(event, settings)
        )
          .then(getTrackRequest)
          .then(manager.fetch.bind(manager))

        console.log('Response: ', JSON.stringify(response))
        return
      }

      case 'Order Completed': {
        const response = await Promise.resolve(getOrderPayload(event, settings))
          .then(getTrackRequest)
          .then(manager.fetch.bind(manager))

        console.log('Response: ', JSON.stringify(response))
        return
      }

      default: {
        console.log('Unknown ecommerce event: ', action, JSON.stringify(event))
        return
      }
    }
  })
}
