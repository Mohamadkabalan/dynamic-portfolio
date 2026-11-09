import {SearchIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {imageField} from '../shared/fields'

export const seo = defineType({
  name: 'seo',
  title: 'Search & social sharing',
  type: 'object',
  icon: SearchIcon,
  description:
    'Optional. Controls how this page looks in Google results and when the link is shared. Leave empty to use the defaults from Site settings.',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Search title',
      description:
        'The headline shown in Google and in the browser tab. Aim for under 60 characters.',
      type: 'string',
      validation: (rule) =>
        rule.max(70).warning('Longer titles get cut off in Google results.'),
    }),
    defineField({
      name: 'description',
      title: 'Search description',
      description:
        'One or two sentences shown under the title in Google. Aim for 120–160 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(180).warning('Longer descriptions get cut off in Google results.'),
    }),
    imageField({
      name: 'image',
      title: 'Sharing image',
      description:
        'Shown when the link is shared on WhatsApp, LinkedIn, etc. Best size: 1200 × 630 pixels. Leave empty and one is generated automatically.',
    }),
  ],
})
