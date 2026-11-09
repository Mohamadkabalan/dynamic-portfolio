import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {PackageIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {SERVICE_ICONS} from '../../lib/constants'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: PackageIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'service'}),
    defineField({
      name: 'title',
      title: 'Service name',
      description: 'Example: "Social media management".',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'Pick the small icon shown next to this service.',
      type: 'string',
      options: {list: [...SERVICE_ICONS], layout: 'dropdown'},
      initialValue: 'sparkles',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Two or three sentences on what the client gets and why it matters.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'deliverables',
      title: 'What is included',
      description: 'A short checklist. Example: "Monthly content calendar", "12 posts + 8 reels".',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'startingPrice',
      title: '"Starting at" price',
      description:
        'Optional. Type it as it should appear, including the currency. Example: "$1,200 / month". Leave empty to hide pricing.',
      type: 'string',
      validation: (rule) => rule.max(30),
    }),
  ],
  preview: {
    select: {title: 'title', price: 'startingPrice', description: 'description'},
    prepare({title, price, description}) {
      return {
        title,
        subtitle: price ? `From ${price}` : description,
        media: PackageIcon,
      }
    },
  },
})
