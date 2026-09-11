import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Smartphone } from 'lucide-react'
import Button from './Button.jsx'
import { UPI } from '../config/site.js'
import { buildUpiUri, copyToClipboard } from '../utils/upi.js'
import { formatINR } from '../utils/format.js'

/**
 * UPI payment panel: a scannable QR for desktop, an intent button for phones,
 * and the plain VPA to copy.
 *
 * The QR encodes the same `upi://pay` intent as the button, with the order
 * amount already filled in, so the customer never types a figure by hand.
 *
 * This panel does NOT and cannot confirm that a payment succeeded — verifying
 * a UPI collection needs a server and a PSP. The order is confirmed by the
 * shop on WhatsApp.
 */
export default function UpiPayment({ amount, reference }) {
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef(null)

  const uri = buildUpiUri({
    amount,
    note: `Laxmi Dairy ${reference ?? ''}`.trim(),
    txnRef: reference,
  })

  /* The QR encoder is only worth downloading once UPI is actually chosen. */
  useEffect(() => {
    let cancelled = false

    import('qrcode')
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(uri, {
          errorCorrectionLevel: 'M',
          margin: 1,
          scale: 8,
          color: { dark: '#0b3b2eff', light: '#fdfbf6ff' },
        }),
      )
      .then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {
        // A missing QR is not fatal — the intent button and VPA still work.
        if (!cancelled) setQrDataUrl(null)
      })

    return () => {
      cancelled = true
    }
  }, [uri])

  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const handleCopy = async () => {
    const ok = await copyToClipboard(UPI.id)
    if (!ok) return
    setCopied(true)
    clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="grid gap-7 sm:grid-cols-[auto_1fr] sm:gap-8">
      {/* --------------------------------------------------------- QR ----- */}
      <div className="mx-auto w-full max-w-[15rem] sm:mx-0 sm:w-[15rem]">
        <div className="flex aspect-square items-center justify-center border hairline bg-ivory-50 p-3.5">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`UPI QR code to pay ${formatINR(amount)} to ${UPI.payeeName}`}
              className="h-full w-full"
              width={256}
              height={256}
            />
          ) : (
            <span className="font-sans text-[0.72rem] text-ink-muted">Preparing QR…</span>
          )}
        </div>
        <p className="mt-3 text-center font-sans text-[0.7rem] leading-relaxed text-ink-muted">
          Scan with any UPI app
          <span className="mt-0.5 block text-ink-muted/70">
            GPay · PhonePe · Paytm · BHIM
          </span>
        </p>
      </div>

      {/* ------------------------------------------------------ details --- */}
      <div className="flex flex-col">
        <p className="eyebrow text-ink-muted">Pay to</p>
        <p className="mt-2 font-display text-[1.6rem] leading-none font-semibold text-emerald-950">
          {UPI.payeeName}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <code className="rounded-md border hairline bg-ivory-100 px-3.5 py-2 font-sans text-[0.85rem] tracking-wide break-all text-emerald-900">
            {UPI.id}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            data-cursor="button"
            aria-label={`Copy UPI ID ${UPI.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-800/25 px-4 py-2 font-sans text-[0.7rem] font-semibold tracking-[0.12em] text-emerald-800 uppercase transition-colors hover:border-emerald-800 hover:bg-emerald-800 hover:text-ivory-100"
          >
            {copied ? (
              <>
                <Check size={14} strokeWidth={2.2} aria-hidden="true" />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} strokeWidth={1.75} aria-hidden="true" />
                Copy UPI ID
              </>
            )}
          </button>
        </div>

        <div className="mt-5 flex items-baseline justify-between border-y hairline py-4">
          <span className="eyebrow text-ink-muted">Amount</span>
          <span className="font-display text-[1.9rem] leading-none font-semibold text-emerald-950 tabular-nums">
            {formatINR(amount)}
          </span>
        </div>

        <Button
          href={uri}
          variant="primary"
          size="md"
          icon={Smartphone}
          iconPosition="left"
          className="mt-5 w-full sm:w-auto sm:self-start"
        >
          Pay via UPI
        </Button>

        <p className="mt-4 font-sans text-[0.74rem] leading-relaxed text-ink-muted">
          The button opens your UPI app with the amount filled in — it works on a phone. On a
          computer, scan the QR instead.
        </p>
        <p className="mt-2 font-sans text-[0.74rem] leading-relaxed text-ink-muted">
          <strong className="font-semibold text-ink-soft">Please note:</strong> this website cannot
          check whether the payment went through. Send us the order on WhatsApp and we will confirm
          the payment against our account before packing.
        </p>
      </div>
    </div>
  )
}
