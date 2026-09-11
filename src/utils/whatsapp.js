/**
 * WhatsApp order-message generation.
 *
 * Note on what this does: it opens WhatsApp with the order pre-filled.
 * The customer still has to press Send — a website cannot send a WhatsApp
 * message on someone's behalf, and nothing here pretends it can.
 */

import { CONTACT, ADDRESS, BUSINESS, UPI } from '../config/site.js'
import { formatINR, tidy, prettyPhone } from './format.js'

export const PAYMENT_METHODS = {
  UPI: 'upi',
  CASH: 'cash',
}

export const PAYMENT_LABELS = {
  [PAYMENT_METHODS.UPI]: 'UPI',
  [PAYMENT_METHODS.CASH]: 'Cash on Delivery / Cash Payment',
}

/**
 * Build the plain-text order message.
 * @param {object} order
 * @param {Array}  order.items      cart lines
 * @param {object} order.customer   validated checkout fields
 * @param {string} order.payment    one of PAYMENT_METHODS
 * @param {number} order.total
 * @param {string} order.reference  short order reference
 */
export function buildOrderMessage({ items = [], customer = {}, payment, total = 0, reference }) {
  const L = []

  L.push(`*${BUSINESS.name.toUpperCase()} — NEW ORDER*`)
  if (reference) L.push(`Order Ref: ${reference}`)
  L.push('')

  L.push('*CUSTOMER*')
  L.push(`Name: ${tidy(customer.name)}`)
  L.push(`Mobile: +91 ${prettyPhone(customer.phone)}`)
  L.push('')

  L.push('*DELIVERY ADDRESS*')
  L.push(tidy(customer.address))
  L.push(`${tidy(customer.area)}, ${tidy(customer.city)} – ${tidy(customer.pincode)}`)
  L.push('')

  L.push(`*ITEMS (${items.length})*`)
  items.forEach((item, i) => {
    const variant = item.optionLabel ? ` — ${item.optionLabel}` : ''
    L.push(`${i + 1}. ${item.name}${variant}`)
    L.push(`   Qty: ${item.quantity} × ${formatINR(item.unitPrice)} = ${formatINR(item.lineTotal)}`)
  })
  L.push('')

  L.push(`Subtotal: ${formatINR(total)}`)
  L.push(`*TOTAL: ${formatINR(total)}*`)
  L.push('')

  L.push('*PAYMENT*')
  L.push(PAYMENT_LABELS[payment] ?? 'To be confirmed')
  if (payment === PAYMENT_METHODS.UPI) {
    L.push(`UPI ID: ${UPI.id}`)
    L.push('(Customer to confirm payment — please verify in your UPI app.)')
  }
  L.push('')

  const note = tidy(customer.note)
  if (note) {
    L.push('*ORDER NOTE*')
    L.push(note)
    L.push('')
  }

  L.push(`Shop: ${ADDRESS.oneLine}`)

  return L.join('\n')
}

/** wa.me link with the message pre-filled. */
export function buildWhatsAppUrl(message, phone = CONTACT.whatsappNumber) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/** One-tap enquiry link used by "Price on request" products and general CTAs. */
export function enquiryUrl(subject) {
  const message = subject
    ? `Hello ${BUSINESS.name}, I would like to know today's price for: ${subject}.`
    : `Hello ${BUSINESS.name}, I would like to place an order.`
  return buildWhatsAppUrl(message)
}

/** Convenience: full order message + link in one call. */
export function buildOrderLink(order) {
  const message = buildOrderMessage(order)
  return { message, url: buildWhatsAppUrl(message) }
}
