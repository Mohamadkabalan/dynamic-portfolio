import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {CaseIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {apiVersion} from '../../env'

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
        'Best: the logo on a transparent background (SVG or PNG) — it is tinted automatically to match light and dark mode. A logo on a white background also works; the white is blended away. A logo on a coloured or black background is shown as a muted tile. If there is no logo, the name is shown as text.',
      altHint: 'Usually just the brand name followed by "logo". Example: "Lumen Skincare logo".',
      // A warning only: the logo still shows, just without the tinted treatment.
      validation: (rule) =>
        rule
          .custom(async (value, context) => {
            const id = value?.asset?._ref
            if (!id) return true
            const opaque = await context
              .getClient({apiVersion})
              .fetch<boolean | null>('*[_id == $id][0].metadata.isOpaque', {id})
            return opaque
              ? 'This file has no transparent background, so it is shown as a muted image rather than tinted. For the cleanest look, upload a PNG or SVG with a transparent background.'
              : true
          })
          .warning(),
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
