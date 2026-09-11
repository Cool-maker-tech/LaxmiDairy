/**
 * UPI deep-link construction.
 *
 * IMPORTANT — what this can and cannot do:
 *   • It CAN hand the customer's UPI app a correctly pre-filled payment intent.
 *   • It CANNOT confirm that a payment actually happened. Verification requires
 *     a server talking to a payment gateway / PSP webhook. Nothing in this
 *     front-end claims otherwise, and the checkout flow is written so that a
 *     real gateway can be dropped in later without reworking the UI.
 */

import { UPI } from '../config/site.js'

/**
 * Build a `upi://pay` intent URI following the NPCI deep-linking spec.
 * @param {{ amount?: number, note?: string, txnRef?: string }} options
 */
export function buildUpiUri({ amount, note, txnRef } = {}) {
  const params = new URLSearchParams()
  params.set('pa', UPI.id)
  params.set('pn', UPI.payeeName)
  params.set('cu', UPI.currency)

  if (amount != null && Number.isFinite(amount) && amount > 0) {
    params.set('am', Number(amount).toFixed(2))
  }
  if (note) {
    // UPI transaction notes are short; keep to a safe length and charset.
    params.set('tn', String(note).replace(/[^\w\s.,#-]/g, ' ').slice(0, 50).trim())
  }
  if (txnRef) params.set('tr', txnRef)

  // URLSearchParams encodes spaces as "+"; UPI apps expect %20.
  return `upi://pay?${params.toString().replace(/\+/g, '%20')}`
}

/** A short, human-readable order reference. Not a payment guarantee. */
export function makeOrderReference(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  const stamp = `${pad(date.getDate())}${pad(date.getMonth() + 1)}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `LD${stamp}${rand}`
}

/** Copy a string to the clipboard, with a fallback for older browsers. */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the legacy path */
  }

  try {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

export const UPI_ID = UPI.id
