'use client'

import {CircleAlert, CircleCheck, LoaderCircle, Send} from 'lucide-react'
import {useId, useRef, useState, type FormEvent} from 'react'

import {Button} from '@/components/ui/Button'
import {cn} from '@/lib/utils'

/** Must match the form name declared in `public/__forms.html`. */
export const CONTACT_FORM_NAME = 'contact'
/** Netlify only detects forms in static HTML, so submissions are posted to that file. */
const FORM_ENDPOINT = '/__forms.html'
const HONEYPOT_FIELD = 'bot-field'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface ContactFormProps {
  services: string[]
  budgetOptions: string[]
  successMessage: string
  /** Shown in the error state as a fallback way to get in touch. */
  contactEmail?: string | null
}

const fieldClass =
  'min-h-12 w-full rounded-sm border border-line-strong bg-card px-4 py-3 text-base text-ink placeholder:text-ink-3 transition-colors duration-200 hover:border-ink focus:border-ink'

function Field({
  label,
  htmlFor,
  optional = false,
  className,
  children,
}: {
  label: string
  htmlFor: string
  optional?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-ink-3">Optional</span>}
      </label>
      {children}
    </div>
  )
}

/**
 * The enquiry form. It submits to Netlify Forms with `fetch`, so the page
 * never reloads, and shows a clear success or error message afterwards.
 * A hidden "honeypot" field catches spam bots.
 */
export function ContactForm({services, budgetOptions, successMessage, contactEmail}: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const statusRef = useRef<HTMLDivElement>(null)
  const id = useId()

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Bots fill every field, including the hidden one. Pretend it worked.
    if (data.get(HONEYPOT_FIELD)) {
      setStatus('success')
      return
    }

    setStatus('submitting')
    try {
      const body = new URLSearchParams()
      data.forEach((value, key) => {
        if (typeof value === 'string') body.append(key, value)
      })
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body.toString(),
      })
      if (!response.ok) throw new Error(`Form submission failed with status ${response.status}`)
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      // Move focus to the result so screen reader and keyboard users notice it.
      requestAnimationFrame(() => statusRef.current?.focus())
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-line bg-card p-8 outline-none sm:p-10"
      >
        <CircleCheck aria-hidden className="size-10 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-display-md mt-5">Message sent.</h2>
        <p className="text-lead mt-3 text-ink-2">{successMessage}</p>
        <Button variant="secondary" className="mt-8" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form
      name={CONTACT_FORM_NAME}
      method="POST"
      action={FORM_ENDPOINT}
      onSubmit={onSubmit}
      className="rounded-xl border border-line bg-card p-6 sm:p-9"
    >
      <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <p hidden>
        <label>
          Leave this field empty: <input name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor={`${id}-name`}>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            className={fieldClass}
          />
        </Field>
        <Field label="Email" htmlFor={`${id}-email`}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={200}
            className={fieldClass}
          />
        </Field>
        <Field label="Company or brand" htmlFor={`${id}-company`} optional>
          <input
            id={`${id}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={160}
            className={fieldClass}
          />
        </Field>
        <Field label="Budget" htmlFor={`${id}-budget`} optional>
          <select id={`${id}-budget`} name="budget" defaultValue="" className={fieldClass}>
            <option value="">Select a range</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="What do you need help with?"
          htmlFor={`${id}-service`}
          optional
          className="sm:col-span-2"
        >
          <select id={`${id}-service`} name="service" defaultValue="" className={fieldClass}>
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
        </Field>
        <Field label="Tell me about your project" htmlFor={`${id}-message`} className="sm:col-span-2">
          <textarea
            id={`${id}-message`}
            name="message"
            required
            rows={6}
            maxLength={5000}
            className={cn(fieldClass, 'resize-y')}
          />
        </Field>
      </div>

      {status === 'error' && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-md border border-red-600/40 bg-red-600/8 p-4 text-sm outline-none"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-red-700 dark:text-red-400" />
          <p>
            Sorry — your message could not be sent. Please try again
            {contactEmail ? (
              <>
                , or email me directly at{' '}
                <a href={`mailto:${contactEmail}`} className="font-medium underline underline-offset-4">
                  {contactEmail}
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-3">Your details are only used to reply to you.</p>
        <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting}>
          {submitting ? (
            <>
              <LoaderCircle aria-hidden className="size-[1.125rem] animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <Send aria-hidden className="size-[1.125rem]" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
