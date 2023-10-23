export interface EventOrder {
  order_id: string
  event: string
  currency: string
  country: string
  total: number
  id: string
  revenue: number
  tax: number
  shipping: number
  products: EventProduct[]
  customerEmail?: string
  _customerEmail?: string
}

export interface EventProduct {
  id: string
  product_id: string
  sku: string
  name: string
  brand: string
  department: string
  productType: string
  category: string
  shortname: string
  color: string
  image: string
  url_path: string
  price: number
  quantity: number
  size: string
  size_id: string
  country: string
  zaraz: {
    product_id: string
    sku: string
  }
}

export interface DemaOrder {
  orderId: string
  total: string
  shipping: string
  currency: string
  tax: string
  voucher: string
  products: DemaProduct[]
  customer: DemaCustomer
}

export interface DemaProduct {
  id: string
  productId: string
  price: string
  quantity: number
}

export interface DemaCustomer {
  idFields: DemaIdFields
}

export interface DemaIdFields {
  customerId: string
}

export interface DemaTrackingData {
  ip: string
  country: string
}

export interface DemaPayload {
  e: 'pageview' | 'order'
  i: string
  m: string
  uid: string
  u: string
  r: string
  v: string
  _nc: string
  ua?: string
  ip?: string
}
