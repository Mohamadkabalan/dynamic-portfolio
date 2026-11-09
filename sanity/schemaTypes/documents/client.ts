import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {CaseIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {imageField} from '../shared/fields'

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: CaseIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'client'}),
    defineField({
      name: 'name',
      title: 'Client / brand name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    imageField({
      name: 'logo',
      title: 'Logo',
      description:
        'A single-colour logo on a transparent background (SVG or PNG) looks best — it is tinted automatically to match light and dark mode. If there is no logo, the name is shown as text.',
      altHint: 'Usually just the brand name followed by "logo". Example: "Lumen Skincare logo".',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      description: 'Optional. The full link, starting with https://',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'showInLogoWall',
      title: 'Show in the logo strip',
      description: 'Switch on to include this client in the scrolling logo strip on the homepage.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name', website: 'website', show: 'showInLogoWall', media: 'logo'},
    prepare({title, website, show, media}) {
      return {
        title,
        subtitle: [show === false ? 'Hidden from logo strip' : 'In logo strip', website]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
