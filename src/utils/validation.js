/**
 * Checkout validation.
 *
 * The goal is to stop orders that the shop cannot act on: missing names,
 * unreachable phone numbers, addresses that are keyboard mash. It deliberately
 * stays permissive about real-world Indian addresses (Gujarati/Hindi script,
 * abbreviations, block numbers) rather than enforcing a rigid format.
 */

import { tidy } from './format.js'

/** Obvious keyboard-mash and filler that customers type to skip a field. */
const JUNK_WORDS = new Set([
  'asdf', 'asdfgh', 'asdfghjkl', 'qwerty', 'qwertyuiop', 'zxcvbn', 'zxcvbnm',
  'abcd', 'abcde', 'abcdef', 'aaaa', 'test', 'testing', 'bruh', 'bro', 'xxx',
  'na', 'n/a', 'none', 'nil', 'null', 'undefined', 'asd', 'sdf', 'dfg', 'fgh',
  'hjk', 'jkl', 'lol', 'idk', 'blah', 'dummy', 'sample', 'fake',
])

const VOWELS = /[aeiouAEIOUઅ-ઔअ-औ]/ // Latin + Gujarati/Devanagari vowels

/**
 * Heuristic gibberish detector for human-language fields.
 * Returns true when the text looks like mashing rather than words.
 */
export function looksLikeGibberish(value) {
  const text = tidy(value).toLowerCase()
  if (!text) return true

  const words = text.split(' ').filter(Boolean)

  // Whole value is a known filler word.
  if (JUNK_WORDS.has(text.replace(/[^a-z/]/g, ''))) return true

  // Every single word is junk.
  if (words.length > 0 && words.every((w) => JUNK_WORDS.has(w.replace(/[^a-z/]/g, '')))) return true

  // Non-Latin scripts (Gujarati, Hindi) bypass the Latin-specific checks below.
  const hasNonLatinLetters = /[ऀ-੿઀-૿]/.test(text)
  if (hasNonLatinLetters) return false

  const letters = text.replace(/[^a-z]/g, '')
  if (letters.length === 0) return true

  // Four or more identical characters in a row ("aaaa", "!!!!").
  if (/(.)\1{3,}/.test(text)) return true

  // No vowel at all across a reasonable run of letters.
  if (letters.length >= 4 && !VOWELS.test(letters)) return true

  // Seven or more consecutive consonants is not a word in any Indian language
  // transliteration we need to support.
  if (/[bcdfghjklmnpqrstvwxyz]{7,}/.test(letters)) return true

  // Sequential keyboard runs of 5+ ("qwert", "asdfg").
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', 'abcdefghijklmnopqrstuvwxyz']
  for (const row of rows) {
    for (let i = 0; i + 5 <= row.length; i++) {
      if (letters.includes(row.slice(i, i + 5))) return true
    }
  }

  return false
}

/** Customer name. */
export function validateName(value) {
  const v = tidy(value)
  if (!v) return 'Please enter your name.'
  if (v.length < 3) return 'Please enter your full name (at least 3 characters).'
  if (v.length > 60) return 'That name is too long.'
  if (/\d/.test(v)) return 'A name should not contain numbers.'
  if (!/[\p{L}]/u.test(v)) return 'Please enter your name in letters.'
  if (looksLikeGibberish(v)) return 'Please enter a real name so we can address your order.'
  return null
}

/**
 * Indian mobile number. Accepts +91 / 91 / 0 prefixes and spaces or dashes,
 * then requires a 10-digit number starting 6–9.
 */
export function normalisePhone(value) {
  let d = String(value ?? '').replace(/\D/g, '')
  if (d.length > 10) {
    if (d.startsWith('91')) d = d.slice(2)
    else if (d.startsWith('0')) d = d.replace(/^0+/, '')
  }
  return d.slice(-10)
}

export function validatePhone(value) {
  const raw = tidy(value)
  if (!raw) return 'Please enter your mobile number.'
  if (/[^\d\s+\-()]/.test(raw)) return 'Mobile number should contain digits only.'
  const d = normalisePhone(raw)
  if (d.length !== 10) return 'Enter a 10-digit Indian mobile number.'
  if (!/^[6-9]/.test(d)) return 'Indian mobile numbers start with 6, 7, 8 or 9.'
  if (/^(\d)\1{9}$/.test(d)) return 'Please enter a valid mobile number.'
  if (d === '1234567890' || d === '9876543210') return 'Please enter your real mobile number.'
  return null
}

/** Street address / building / flat. */
export function validateAddress(value) {
  const v = tidy(value)
  if (!v) return 'Please enter your delivery address.'
  if (v.length < 10) return 'Please give a fuller address — house/flat, building and street.'
  if (v.length > 300) return 'That address is too long.'
  if (!/[\p{L}]{3,}/u.test(v)) return 'Please enter a readable address.'
  if (v.split(' ').filter(Boolean).length < 3) {
    return 'Please include house/flat, building and street so we can find you.'
  }
  if (looksLikeGibberish(v)) return 'That address does not look complete. Please check it.'
  return null
}

/** Area / locality. */
export function validateArea(value) {
  const v = tidy(value)
  if (!v) return 'Please enter your area or locality.'
  if (v.length < 3) return 'Please enter a valid area or locality.'
  if (v.length > 80) return 'That is too long for an area name.'
  if (!/[\p{L}]{3,}/u.test(v)) return 'Please enter the area in letters.'
  if (looksLikeGibberish(v)) return 'Please enter a real area or locality.'
  return null
}

/** City. */
export function validateCity(value) {
  const v = tidy(value)
  if (!v) return 'Please enter your city.'
  if (v.length < 3) return 'Please enter a valid city name.'
  if (v.length > 60) return 'That city name is too long.'
  if (/\d/.test(v)) return 'A city name should not contain numbers.'
  if (!/[\p{L}]{3,}/u.test(v)) return 'Please enter the city in letters.'
  if (looksLikeGibberish(v)) return 'Please enter a real city name.'
  return null
}

/** Indian PIN code: six digits, never starting with 0. */
export function validatePincode(value) {
  const v = tidy(value)
  if (!v) return 'Please enter your PIN code.'
  const d = v.replace(/\s/g, '')
  if (!/^\d{6}$/.test(d)) return 'A PIN code is exactly 6 digits.'
  if (d.startsWith('0')) return 'An Indian PIN code does not start with 0.'
  if (/^(\d)\1{5}$/.test(d)) return 'Please enter a valid PIN code.'
  return null
}

/** Optional order note. */
export function validateNote(value) {
  const v = tidy(value)
  if (!v) return null
  if (v.length > 300) return 'Please keep the note under 300 characters.'
  return null
}

export const FIELD_VALIDATORS = {
  name: validateName,
  phone: validatePhone,
  address: validateAddress,
  area: validateArea,
  city: validateCity,
  pincode: validatePincode,
  note: validateNote,
}

/** Validate the whole customer-details form. Returns `{ field: message }`. */
export function validateCheckout(values) {
  const errors = {}
  for (const [field, validator] of Object.entries(FIELD_VALIDATORS)) {
    const message = validator(values[field])
    if (message) errors[field] = message
  }
  return errors
}
