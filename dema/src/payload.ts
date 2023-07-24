import { ComponentSettings, MCEvent } from '@managed-components/types'
import { updateAndReturnUid } from './cookie'
import { DemaOrder, DemaPayload, EventOrder } from './types'

export const commonPayload = (event: MCEvent): Partial<DemaPayload> => ({
  uid: updateAndReturnUid(event),
  u: event.client.url.toString(),
  ua: event.client.userAgent,
  r: event.client.referer,
  v: '1.0.0',
  _nc: Date.now().toString(),
})

export const getPageviewPayload = (
  event: MCEvent,
  settings: ComponentSettings
): DemaPayload => {
  console.log('creating pageview payload', JSON.stringify({ event, settings }))
  return <DemaPayload>{
    ...commonPayload(event),
    e: 'pageview',
    i: settings.demaId,
    m: JSON.stringify({
      id: event.payload.ecommerce?.sku ?? '',
      productId: event.payload.ecommerce?.product_id ?? '',
      ip: event.client.ip,
      country: event.client.ip,
    }),
  }
}

export const getOrderPayload = (
  event: MCEvent,
  settings: ComponentSettings
): DemaPayload => {
  const payload: EventOrder = event.payload.ecommerce || event.payload
  return <DemaPayload>{
    ...commonPayload(event),
    e: 'order',
    i: settings.demaId,
    m: JSON.stringify({
      order: <DemaOrder>{
        orderId: String(payload.order_id ?? ''),
        total: String(payload.total ?? ''),
        shipping: String(payload.shipping ?? ''),
        currency: String(payload.currency ?? ''),
        tax: String(payload.tax ?? ''),
        voucher: '',
        products: payload.products.map(product => ({
          id: String(product.sku ?? ''),
          productId: String(product.product_id ?? ''),
          price: String(product.price ?? ''),
          quantity: product.quantity ?? 1,
        })),
        customer: {
          idFields: {
            customerId: String(
              payload._customerEmail ?? payload.customerEmail ?? ''
            ),
          },
        },
      },
      ip: event.client.ip,
      country: event.client.ip,
    }),
  }
}
