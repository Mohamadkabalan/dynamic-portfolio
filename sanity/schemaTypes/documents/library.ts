import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {BarChartIcon, CheckmarkCircleIcon, WrenchIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {TOOL_CATEGORIES, TOOL_CATEGORY_TITLES} from '../../lib/constants'
import {imageField} from '../shared/fields'

export const stat = defineType({
  name: 'stat',
  title: 'Stat',
  type: 'document',
  icon: BarChartIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'stat'}),
    defineField({
      name: 'label',
      title: 'Label',
      description: 'What the number means. Example: "Followers gained for clients".',
      type: 'string',
      validation: (rule) => rule.required().max(48),
    }),
    defineField({
      name: 'value',
      title: 'Number',
      description:
        'Digits only — it animates counting up on the site. Example: 4.2 or 120. Put symbols like M, K, % or + in the next field.',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'suffix',
      title: 'After the number',
      description: 'Optional. Example: M, K, %, + or x',
      type: 'string',
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      description: 'Optional extra line under the label. Example: "across 40+ brand accounts".',
      type: 'string',
      validation: (rule) => rule.max(90),
    }),
  ],
  preview: {
    select: {label: 'label', value: 'value', suffix: 'suffix', description: 'description'},
    prepare({label, value, suffix, description}) {
      return {
        title: `${value ?? ''}${suffix ?? ''} — ${label ?? ''}`,
        subtitle: description,
        media: BarChartIcon,
      }
    },
  },
})

export const tool = defineType({
  name: 'tool',
  title: 'Tool',
  type: 'document',
  icon: WrenchIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'tool'}),
    defineField({
      name: 'name',
      title: 'Tool name',
      description: 'Example: "Later" or "CapCut".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    imageField({
      name: 'logo',
      title: 'Logo',
      description: 'Optional. A small square logo. If empty, the first letter of the name is shown.',
      altHint: 'Usually the tool name followed by "logo". Example: "CapCut logo".',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Tools are grouped by category on the site.',
      type: 'string',
      options: {list: [...TOOL_CATEGORIES], layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name', category: 'category', media: 'logo'},
    prepare({title, category, media}) {
      return {title, subtitle: TOOL_CATEGORY_TITLES[category as string], media}
    },
  },
})

export const certification = defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  icon: CheckmarkCircleIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'certification'}),
    defineField({
      name: 'title',
      title: 'Certification name',
      description: 'Example: "Meta Certified Community Manager".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issued by',
      description: 'The organisation that awarded it. Example: "Meta Blueprint".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      description: 'The year you earned it, e.g. 2024.',
      type: 'number',
      validation: (rule) =>
        rule.integer().min(1990).max(2100).error('Enter a 4-digit year, e.g. 2024.'),
    }),
    defineField({
      name: 'credentialUrl',
      title: 'Credential link',
      description: 'Optional. A link where people can verify the certificate.',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    imageField({
      name: 'badge',
      title: 'Badge image',
      description: 'Optional. The official badge or seal, ideally square.',
      altHint: 'Example: "Meta Certified Community Manager badge".',
    }),
  ],
  preview: {
    select: {title: 'title', issuer: 'issuer', year: 'year', media: 'badge'},
    prepare({title, issuer, year, media}) {
      return {title, subtitle: [issuer, year].filter(Boolean).join(' · '), media}
    },
  },
})
