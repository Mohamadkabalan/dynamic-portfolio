import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {CommentIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {imageField} from '../shared/fields'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'testimonial'}),
    defineField({
      name: 'quote',
      title: 'Quote',
      description:
        'What they said, without quotation marks (they are added automatically). Two to four sentences reads best.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(480),
    }),
    defineField({
      name: 'name',
      title: 'Person\'s name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Their job title',
      description: 'Example: "Marketing Director".',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      description: 'The company name as it should appear next to their name.',
      type: 'string',
    }),
    imageField({
      name: 'avatar',
      title: 'Photo',
      description:
        'A headshot of the person. It is shown in a circle with a story-style ring, so a square photo with the face centred works best.',
      altHint: 'Example: "Portrait of Maya Haddad". Screen readers read this aloud.',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      description: 'Optional. Link the testimonial to a client in your client list.',
      type: 'reference',
      to: [{type: 'client'}],
    }),
  ],
  preview: {
    select: {name: 'name', role: 'role', company: 'company', quote: 'quote', media: 'avatar'},
    prepare({name, role, company, quote, media}) {
      return {
        title: [name, company].filter(Boolean).join(' · '),
        subtitle: quote ?? role,
        media,
      }
    },
  },
})
