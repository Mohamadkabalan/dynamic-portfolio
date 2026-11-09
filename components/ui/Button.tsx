import Link from 'next/link'
import type {ComponentPropsWithoutRef, ReactNode} from 'react'

import {cn, isExternalHref} from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'
type Size = 'md' | 'lg'

const base =
  'group/button inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none transition-[background-color,color,border-color,transform] duration-200 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-ink hover:text-paper',
  secondary: 'border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-paper',
  ghost: 'text-ink underline-offset-4 hover:underline',
  inverse: 'bg-on-accent text-accent hover:opacity-90',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-[0.9375rem]',
  lg: 'min-h-13 px-7 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonLinkProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'> & {
    href: string
    /** Set to false for links that leave the website shell (e.g. /studio). */
    prefetch?: boolean
  }

/** A link styled as a button. Internal paths use client-side navigation. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  prefetch,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (isExternalHref(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
    const external = isExternalHref(href)
    return (
      <a
        href={href}
        className={classes}
        {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        {...rest}
      >
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} prefetch={prefetch} {...rest}>
      {children}
    </Link>
  )
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  )
}
