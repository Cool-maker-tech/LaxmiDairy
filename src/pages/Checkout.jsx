import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  CheckCircle2,
  MessageCircle,
  QrCode,
} from 'lucide-react'
import Field from '../components/Field.jsx'
import Button from '../components/Button.jsx'
import PageHeader from '../components/PageHeader.jsx'
import UpiPayment from '../components/UpiPayment.jsx'
import SmartImage from '../components/SmartImage.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { useCart } from '../context/CartContext.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { FIELD_VALIDATORS, normalisePhone, validateCheckout } from '../utils/validation.js'
import { PAYMENT_METHODS, PAYMENT_LABELS, buildOrderLink } from '../utils/whatsapp.js'
import { makeOrderReference } from '../utils/upi.js'
import { formatINR, cx, tidy } from '../utils/format.js'
import { ORDERING, ADDRESS } from '../config/site.js'

const STORAGE_KEY = 'laxmi-dairy-customer-v1'

const EMPTY = {
  name: '',
  phone: '',
  address: '',
  area: '',
  city: 'Surat',
  pincode: '',
  note: '',
}

const STEPS = [
  { id: 1, label: 'Your details' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Review & send' },
]

/** Remember the customer's details so a repeat order is two taps, not twelve. */
function readSavedCustomer() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    return EMPTY
  }
}

export default function Checkout() {
  usePageMeta({
    title: 'Checkout | Laxmi Dairy, Surat',
    description: 'Confirm your details, choose UPI or cash, and send your Laxmi Dairy order.',
    path: '/checkout',
  })

  const navigate = useNavigate()
  const { items, subtotal, count, isEmpty, clearCart } = useCart()

  const [step, setStep] = useState(1)
  const [values, setValues] = useState(readSavedCustomer)
  const [touched, setTouched] = useState({})
  const [payment, setPayment] = useState(PAYMENT_METHODS.UPI)
  const [sent, setSent] = useState(false)

  // One reference per visit, so the UPI note and the WhatsApp message agree.
  const reference = useMemo(() => makeOrderReference(), [])
  const stepHeadingRef = useRef(null)

  const errors = useMemo(() => validateCheckout(values), [values])
  const detailsValid = Object.keys(errors).length === 0

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  /* Move focus to the new step heading so keyboard users are not stranded. */
  useEffect(() => {
    stepHeadingRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const goToPayment = (event) => {
    event.preventDefault()
    if (!detailsValid) {
      // Reveal every message at once rather than one field at a time.
      setTouched(Object.fromEntries(Object.keys(FIELD_VALIDATORS).map((k) => [k, true])))
      const firstInvalid = Object.keys(FIELD_VALIDATORS).find((k) => errors[k])
      document.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...values, note: '' }))
    } catch {
      /* storage unavailable — not worth blocking the order over */
    }
    setStep(2)
  }

  const order = useMemo(
    () => ({
      items,
      customer: { ...values, phone: normalisePhone(values.phone) },
      payment,
      total: subtotal,
      reference,
    }),
    [items, values, payment, subtotal, reference],
  )

  const { message, url: whatsappUrl } = useMemo(() => buildOrderLink(order), [order])

  const handleSend = () => {
    // Opened directly from the click so mobile Safari does not block it.
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  /* An empty cart has nothing to check out — unless the order was just sent. */
  if (isEmpty && !sent) return <Navigate to="/cart" replace />

  /* ---------------------------------------------------------------------- */
  if (sent) {
    return (
      <OrderSent
        reference={reference}
        whatsappUrl={whatsappUrl}
        payment={payment}
        onDone={() => {
          clearCart()
          navigate('/menu')
        }}
      />
    )
  }

  return (
    <>
      <PageHeader
        eyebrow={`Step ${step} of 3`}
        titleLines={[STEPS[step - 1].label]}
        intro={
          step === 1
            ? 'We only ask for what we need to find your door and call you if something is unclear.'
            : step === 2
              ? 'Pay now by UPI, or pay cash when you collect or receive the order.'
              : 'Check everything below, then send the order to us on WhatsApp.'
        }
      />

      <div className="bg-ivory-100 pb-20 sm:pb-28">
        <div className="container-x">
          {/* ------------------------------------------------------ stepper */}
          <ol className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-y hairline py-4 sm:mb-12">
            {STEPS.map((s, i) => {
              const state = s.id === step ? 'current' : s.id < step ? 'done' : 'todo'
              return (
                <li key={s.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => s.id < step && setStep(s.id)}
                    disabled={s.id >= step}
                    aria-current={state === 'current' ? 'step' : undefined}
                    className={cx(
                      'flex items-center gap-2.5 font-sans text-[0.74rem] font-semibold tracking-[0.1em] uppercase transition-colors',
                      state === 'current' && 'text-emerald-900',
                      state === 'done' && 'text-emerald-700 hover:text-emerald-900',
                      state === 'todo' && 'text-ink-muted/55',
                    )}
                  >
                    <span
                      className={cx(
                        'flex h-6 w-6 items-center justify-center rounded-full border text-[0.66rem] tabular-nums',
                        state === 'current' && 'border-emerald-800 bg-emerald-800 text-ivory-100',
                        state === 'done' && 'border-emerald-700 text-emerald-700',
                        state === 'todo' && 'border-emerald-800/20',
                      )}
                    >
                      {state === 'done' ? '✓' : s.id}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <span aria-hidden="true" className="h-px w-6 bg-emerald-800/15 sm:w-10" />
                  )}
                </li>
              )
            })}
          </ol>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* ==================================================== main === */}
            <div className="lg:col-span-7 xl:col-span-8">
              <h2
                ref={stepHeadingRef}
                tabIndex={-1}
                className="sr-only"
              >
                {STEPS[step - 1].label}
              </h2>

              {/* ------------------------------------------ step 1: details */}
              {step === 1 && (
                <form onSubmit={goToPayment} noValidate>
                  <Reveal className="grid gap-5 sm:grid-cols-2" y={18} stagger={0.04}>
                    <Field
                      label="Customer name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.name}
                      touched={touched.name}
                      placeholder="Girishbhai Patel"
                      autoComplete="name"
                      maxLength={60}
                      className="sm:col-span-1"
                    />

                    <Field
                      label="Mobile number"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.phone}
                      touched={touched.phone}
                      placeholder="88663 30092"
                      autoComplete="tel-national"
                      inputMode="numeric"
                      type="tel"
                      prefix="+91"
                      maxLength={15}
                      hint="We call this number to confirm your order."
                    />

                    <Field
                      label="Delivery address"
                      name="address"
                      as="textarea"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.address}
                      touched={touched.address}
                      placeholder="Flat / house no., building name, street"
                      autoComplete="street-address"
                      maxLength={300}
                      className="sm:col-span-2"
                    />

                    <Field
                      label="Area / locality"
                      name="area"
                      value={values.area}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.area}
                      touched={touched.area}
                      placeholder="Bhesan Gam"
                      autoComplete="address-level3"
                      maxLength={80}
                    />

                    <Field
                      label="City"
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.city}
                      touched={touched.city}
                      placeholder="Surat"
                      autoComplete="address-level2"
                      maxLength={60}
                    />

                    <Field
                      label="Pincode"
                      name="pincode"
                      value={values.pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.pincode}
                      touched={touched.pincode}
                      placeholder="395005"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      maxLength={6}
                    />

                    <Field
                      label="Order note"
                      name="note"
                      as="textarea"
                      required={false}
                      value={values.note}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.note}
                      touched={touched.note}
                      placeholder="Less sweet, deliver after 6pm, call before arriving…"
                      maxLength={300}
                      rows={3}
                      className="sm:col-span-2"
                      hint="Anything we should know before we pack your order."
                    />
                  </Reveal>

                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <Button type="submit" variant="primary" size="lg" icon={ArrowRight}>
                      Continue to payment
                    </Button>
                    <Button to="/cart" variant="ghost" size="md" magnetic={false}>
                      Back to cart
                    </Button>
                  </div>
                </form>
              )}

              {/* ------------------------------------------ step 2: payment */}
              {step === 2 && (
                <Reveal y={18} stagger={0.06}>
                  <fieldset data-reveal className="border-0 p-0">
                    <legend className="eyebrow mb-4 text-ink-muted">Choose how you will pay</legend>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <PaymentOption
                        icon={QrCode}
                        title="UPI"
                        blurb="Pay now by scanning the QR or opening your UPI app."
                        selected={payment === PAYMENT_METHODS.UPI}
                        onSelect={() => setPayment(PAYMENT_METHODS.UPI)}
                      />
                      <PaymentOption
                        icon={Banknote}
                        title="Cash"
                        blurb="Cash on delivery, or pay at the counter when you collect."
                        selected={payment === PAYMENT_METHODS.CASH}
                        onSelect={() => setPayment(PAYMENT_METHODS.CASH)}
                      />
                    </div>
                  </fieldset>

                  <div data-reveal className="mt-8 border hairline bg-ivory-50 p-6 sm:p-8">
                    {payment === PAYMENT_METHODS.UPI ? (
                      <UpiPayment amount={subtotal} reference={reference} />
                    ) : (
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border hairline text-emerald-800">
                          <BadgeIndianRupee size={20} strokeWidth={1.5} aria-hidden="true" />
                        </span>
                        <div>
                          <h3 className="font-display text-[1.6rem] leading-tight font-semibold text-emerald-950">
                            Pay cash on delivery or at the counter
                          </h3>
                          <p className="mt-3 max-w-lg font-sans text-[0.9rem] leading-relaxed text-ink-soft">
                            Nothing to pay now. Send us the order on WhatsApp and we will confirm
                            the timing with you. Please keep {formatINR(subtotal)} ready — exact
                            change is always appreciated.
                          </p>
                          <p className="mt-3 font-sans text-[0.78rem] text-ink-muted">
                            {ORDERING.deliveryNote}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <Button onClick={() => setStep(3)} variant="primary" size="lg" icon={ArrowRight}>
                      Review order
                    </Button>
                    <Button
                      onClick={() => setStep(1)}
                      variant="ghost"
                      size="md"
                      icon={ArrowLeft}
                      iconPosition="left"
                      magnetic={false}
                    >
                      Edit details
                    </Button>
                  </div>
                </Reveal>
              )}

              {/* ------------------------------------------- step 3: review */}
              {step === 3 && (
                <Reveal y={18} stagger={0.06}>
                  <section data-reveal aria-labelledby="review-customer">
                    <div className="flex items-baseline justify-between gap-4 border-b hairline pb-3">
                      <h3 id="review-customer" className="eyebrow text-ink-muted">
                        Delivering to
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="font-sans text-[0.7rem] tracking-[0.12em] text-emerald-800 uppercase underline-offset-4 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="mt-4 font-sans text-[0.92rem] leading-relaxed text-ink-soft">
                      <p className="font-display text-[1.4rem] leading-tight font-semibold text-emerald-950">
                        {tidy(values.name)}
                      </p>
                      <p className="mt-1">+91 {normalisePhone(values.phone)}</p>
                      <p className="mt-2">{tidy(values.address)}</p>
                      <p>
                        {tidy(values.area)}, {tidy(values.city)} – {tidy(values.pincode)}
                      </p>
                      {tidy(values.note) && (
                        <p className="mt-3 border-l-2 border-gold-400 pl-3 text-[0.86rem] text-ink-muted italic">
                          “{tidy(values.note)}”
                        </p>
                      )}
                    </div>
                  </section>

                  <section data-reveal className="mt-9" aria-labelledby="review-payment">
                    <div className="flex items-baseline justify-between gap-4 border-b hairline pb-3">
                      <h3 id="review-payment" className="eyebrow text-ink-muted">
                        Payment method
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="font-sans text-[0.7rem] tracking-[0.12em] text-emerald-800 uppercase underline-offset-4 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <p className="mt-4 font-display text-[1.4rem] font-semibold text-emerald-950">
                      {PAYMENT_LABELS[payment]}
                    </p>
                    {payment === PAYMENT_METHODS.UPI && (
                      <p className="mt-2 max-w-lg font-sans text-[0.82rem] leading-relaxed text-ink-muted">
                        If you have already paid, mention it in the WhatsApp chat — we will match it
                        against our account. The website itself cannot see UPI payments.
                      </p>
                    )}
                  </section>

                  <section data-reveal className="mt-9" aria-labelledby="review-items">
                    <h3 id="review-items" className="eyebrow border-b hairline pb-3 text-ink-muted">
                      {count} {count === 1 ? 'item' : 'items'}
                    </h3>
                    <ul className="divide-y divide-emerald-800/[0.08]">
                      {items.map((item) => (
                        <li key={item.key} className="flex items-center gap-4 py-4">
                          <div className="w-14 shrink-0">
                            <SmartImage
                              src={item.image}
                              alt=""
                              label={item.name}
                              category={item.category}
                              ratio="aspect-square"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-sans text-[0.92rem] font-semibold text-emerald-950">
                              {item.name}
                            </p>
                            <p className="mt-0.5 font-sans text-[0.76rem] text-ink-muted">
                              {item.type === 'weight' ? `${item.optionLabel} · ` : ''}
                              {item.quantity} × {formatINR(item.unitPrice)}
                            </p>
                          </div>
                          <span className="shrink-0 font-sans text-[0.92rem] font-semibold text-emerald-900 tabular-nums">
                            {formatINR(item.lineTotal)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* --------------------------------------------- send --- */}
                  <div data-reveal className="mt-10 border hairline bg-emerald-950 p-6 text-ivory-100 sm:p-8">
                    <h3 className="font-display text-[1.8rem] leading-tight font-semibold sm:text-[2.1rem]">
                      Send the order to us
                    </h3>
                    <p className="mt-3 max-w-xl font-sans text-[0.9rem] leading-relaxed text-ivory-200/65">
                      This opens WhatsApp with your full order already written out. Press send in
                      WhatsApp and we will reply to confirm timing and any delivery charge.
                    </p>

                    <Button
                      onClick={handleSend}
                      variant="gold"
                      size="lg"
                      icon={MessageCircle}
                      iconPosition="left"
                      className="mt-6"
                    >
                      Send order on WhatsApp
                    </Button>

                    <details className="mt-6 border-t border-ivory-100/12 pt-5">
                      <summary className="cursor-pointer font-sans text-[0.74rem] tracking-[0.12em] text-ivory-200/55 uppercase transition-colors hover:text-gold-300">
                        Preview the message
                      </summary>
                      <pre className="mt-4 max-h-72 overflow-auto rounded-md bg-emerald-900/60 p-4 font-sans text-[0.76rem] leading-relaxed whitespace-pre-wrap text-ivory-200/75">
                        {message}
                      </pre>
                    </details>
                  </div>

                  <div className="mt-7">
                    <Button
                      onClick={() => setStep(2)}
                      variant="ghost"
                      size="md"
                      icon={ArrowLeft}
                      iconPosition="left"
                      magnetic={false}
                    >
                      Back to payment
                    </Button>
                  </div>
                </Reveal>
              )}
            </div>

            {/* ================================================== summary === */}
            <aside className="lg:col-span-5 xl:col-span-4" aria-label="Order summary">
              <div className="border hairline bg-ivory-50 p-6 sm:p-7 lg:sticky lg:top-28">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-[1.6rem] font-semibold text-emerald-950">
                    Summary
                  </h2>
                  <Link
                    to="/cart"
                    className="font-sans text-[0.7rem] tracking-[0.12em] text-emerald-800 uppercase underline-offset-4 hover:underline"
                  >
                    Edit
                  </Link>
                </div>

                <ul className="mt-5 max-h-64 space-y-3 overflow-y-auto border-b hairline pb-5">
                  {items.map((item) => (
                    <li key={item.key} className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 font-sans text-[0.84rem] text-ink-soft">
                        <span className="block truncate">{item.name}</span>
                        <span className="text-[0.72rem] text-ink-muted">
                          {item.type === 'weight' ? `${item.optionLabel} × ` : '× '}
                          {item.quantity}
                        </span>
                      </span>
                      <span className="shrink-0 font-sans text-[0.84rem] font-semibold text-emerald-900 tabular-nums">
                        {formatINR(item.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <span className="eyebrow text-ink-muted">Total</span>
                  <span className="font-display text-[2.2rem] leading-none font-semibold text-emerald-950 tabular-nums">
                    {formatINR(subtotal)}
                  </span>
                </div>

                <p className="mt-3 font-sans text-[0.72rem] leading-relaxed text-ink-muted">
                  {ORDERING.deliveryNote} Order reference{' '}
                  <span className="font-semibold text-ink-soft">{reference}</span>.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------------ */

function PaymentOption({ icon: Icon, title, blurb, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      data-cursor="button"
      className={cx(
        'flex flex-col items-start gap-3 rounded-md border p-5 text-left transition-ui duration-400',
        selected
          ? 'border-emerald-800 bg-emerald-800 text-ivory-100 shadow-[var(--shadow-lift)]'
          : 'border-emerald-800/15 bg-ivory-50 text-emerald-950 hover:border-emerald-800/45',
      )}
    >
      <span
        className={cx(
          'flex h-10 w-10 items-center justify-center rounded-full border',
          selected ? 'border-ivory-100/25 text-gold-300' : 'border-emerald-800/15 text-emerald-800',
        )}
      >
        <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span>
        <span className="block font-display text-[1.35rem] leading-none font-semibold">{title}</span>
        <span
          className={cx(
            'mt-2 block font-sans text-[0.8rem] leading-relaxed',
            selected ? 'text-ivory-200/70' : 'text-ink-muted',
          )}
        >
          {blurb}
        </span>
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------------ */

function OrderSent({ reference, whatsappUrl, payment, onDone }) {
  return (
    <div className="flex min-h-[100svh] items-center bg-ivory-100 pt-28 pb-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-800 text-ivory-100">
            <CheckCircle2 size={28} strokeWidth={1.5} aria-hidden="true" />
          </span>

          <h1 className="fluid-h2 mt-8 font-display font-medium text-emerald-950">
            Order ready to send.
          </h1>

          <p className="mx-auto mt-5 max-w-lg font-sans text-[0.95rem] leading-relaxed text-ink-soft">
            WhatsApp should have opened with your order written out. Press{' '}
            <strong className="font-semibold text-emerald-900">Send</strong> there so it reaches us
            — until you do, we have not received anything.
          </p>

          <p className="mt-4 font-sans text-[0.82rem] text-ink-muted">
            Your reference is{' '}
            <span className="font-semibold text-emerald-900">{reference}</span>. Payment method:{' '}
            {PAYMENT_LABELS[payment]}.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href={whatsappUrl} variant="primary" size="lg" icon={MessageCircle} iconPosition="left">
              Open WhatsApp again
            </Button>
            <Button onClick={onDone} variant="outline" size="lg">
              Done — clear my cart
            </Button>
          </div>

          <p className="mx-auto mt-10 max-w-md border-t hairline pt-6 font-sans text-[0.78rem] leading-relaxed text-ink-muted">
            Prefer to collect? We are at {ADDRESS.lines[0]}, {ADDRESS.lines[2]}, {ADDRESS.city} –{' '}
            {ADDRESS.pincode}.
          </p>
        </div>
      </div>
    </div>
  )
}
