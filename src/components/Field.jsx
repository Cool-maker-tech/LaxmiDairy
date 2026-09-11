import { useId } from 'react'
import { AlertCircle } from 'lucide-react'
import { cx } from '../utils/format.js'

/**
 * Labelled form control with inline validation messaging.
 * The error is wired up with `aria-describedby` + `aria-invalid`, and announced
 * politely so a screen reader hears it without losing the caret.
 */
export default function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  type = 'text',
  as = 'input',
  placeholder,
  hint,
  required = true,
  autoComplete,
  inputMode,
  maxLength,
  rows = 3,
  prefix,
  className,
}) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const showError = Boolean(touched && error)

  const control = as === 'textarea' ? 'textarea' : 'input'
  const Control = control

  const controlClasses = cx(
    'w-full border bg-ivory-50 font-sans text-[0.92rem] text-emerald-950 transition-colors duration-300',
    'placeholder:text-ink-muted/55 focus:outline-none',
    prefix ? 'rounded-r-md' : 'rounded-md',
    as === 'textarea' ? 'px-4 py-3 resize-y min-h-[5.5rem]' : 'h-12 px-4',
    showError
      ? 'border-red-700/55 focus:border-red-700'
      : 'border-emerald-800/15 focus:border-emerald-800/60',
  )

  return (
    <div className={cx('flex flex-col', className)}>
      <label
        htmlFor={id}
        className="mb-2 font-sans text-[0.74rem] font-semibold tracking-[0.12em] text-ink-soft uppercase"
      >
        {label}
        {!required && <span className="ml-1.5 normal-case text-ink-muted/70">(optional)</span>}
      </label>

      <div className={cx('flex', prefix && 'items-stretch')}>
        {prefix && (
          <span
            aria-hidden="true"
            className={cx(
              'inline-flex h-12 shrink-0 items-center rounded-l-md border border-r-0 bg-ivory-200 px-3.5 font-sans text-[0.9rem] text-ink-soft',
              showError ? 'border-red-700/55' : 'border-emerald-800/15',
            )}
          >
            {prefix}
          </span>
        )}

        <Control
          id={id}
          name={name}
          type={control === 'input' ? type : undefined}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur?.(name)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          rows={control === 'textarea' ? rows : undefined}
          aria-invalid={showError || undefined}
          aria-describedby={cx(showError ? errorId : null, hint ? hintId : null) || undefined}
          className={controlClasses}
        />
      </div>

      {showError ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-start gap-1.5 font-sans text-[0.78rem] leading-snug text-red-700"
        >
          <AlertCircle size={14} strokeWidth={1.9} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 font-sans text-[0.75rem] leading-snug text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
