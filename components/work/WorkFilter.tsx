'use client'

import {useMemo, useState} from 'react'

import {FilterChips} from '@/components/ui/FilterChips'
import {PlatformIcon} from '@/components/ui/PlatformIcon'
import {CaseStudyCard} from '@/components/work/CaseStudyCard'
import {PLATFORMS} from '@/sanity/lib/constants'
import type {CaseStudyCard as CaseStudyCardData} from '@/sanity/lib/data'

interface WorkFilterProps {
  studies: CaseStudyCardData[]
}

/**
 * The case study grid with platform and industry filters. Filtering happens in
 * the browser, so the page itself stays fully cached.
 */
export function WorkFilter({studies}: WorkFilterProps) {
  const [platform, setPlatform] = useState('all')
  const [industry, setIndustry] = useState('all')

  const platformOptions = useMemo(() => {
    const present = new Set(studies.flatMap((study) => study.platforms ?? []))
    return PLATFORMS.filter((option) => present.has(option.value)).map((option) => ({
      value: option.value as string,
      label: option.title as string,
      icon: <PlatformIcon platform={option.value} className="size-4" />,
    }))
  }, [studies])

  const industryOptions = useMemo(() => {
    const industries = new Set(
      studies.map((study) => study.industry?.trim()).filter((value): value is string => Boolean(value)),
    )
    return [...industries].sort((a, b) => a.localeCompare(b)).map((value) => ({value, label: value}))
  }, [studies])

  const visible = useMemo(
    () =>
      studies.filter(
        (study) =>
          (platform === 'all' || (study.platforms ?? []).some((value) => value === platform)) &&
          (industry === 'all' || study.industry?.trim() === industry),
      ),
    [studies, platform, industry],
  )

  const hasFilters = platformOptions.length > 1 || industryOptions.length > 1

  return (
    <>
      {hasFilters && (
        <div className="mb-12 space-y-5 border-y border-line py-6">
          {platformOptions.length > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-label w-24 shrink-0 text-ink-3">Platform</p>
              <FilterChips
                label="Filter case studies by platform"
                options={platformOptions}
                value={platform}
                onChange={setPlatform}
              />
            </div>
          )}
          {industryOptions.length > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-label w-24 shrink-0 text-ink-3">Industry</p>
              <FilterChips
                label="Filter case studies by industry"
                options={industryOptions}
                value={industry}
                onChange={setIndustry}
              />
            </div>
          )}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {studies.length} case studies
      </p>

      {visible.length > 0 ? (
        <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {visible.map((study, index) => (
            <li
              key={`${platform}-${industry}-${study._id}`}
              className="motion-safe:animate-rise"
              style={{animationDelay: `${Math.min(index, 6) * 60}ms`}}
            >
              <CaseStudyCard study={study} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="text-display-sm">No case studies match those filters.</p>
          <button
            type="button"
            onClick={() => {
              setPlatform('all')
              setIndustry('all')
            }}
            className="mt-5 inline-flex min-h-11 items-center font-medium text-accent-ink underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  )
}
