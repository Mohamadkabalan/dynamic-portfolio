import {EyeClosedIcon, EyeOpenIcon, HomeIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {HOME_SECTIONS, HOME_SECTION_TITLES} from '../../lib/constants'
import {imageField} from '../shared/fields'

export const homeSection = defineType({
  name: 'homeSection',
  title: 'Homepage section',
  type: 'object',
  fields: [
    defineField({
      name: 'section',
      title: 'Section',
      description: 'Which part of the homepage this row controls.',
      type: 'string',
      options: {list: [...HOME_SECTIONS], layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'enabled',
      title: 'Show this section',
      description: 'Switch off to hide the section without deleting anything.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'eyebrow',
      title: 'Small label',
      description: 'Optional tiny label above the heading. Example: "Selected work".',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'The big title of the section. Leave empty to use the built-in heading.',
      type: 'string',
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      description: 'Optional sentence under the heading.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(240),
    }),
  ],
  preview: {
    select: {section: 'section', enabled: 'enabled', heading: 'heading'},
    prepare({section, enabled, heading}) {
      const isOn = enabled !== false
      return {
        title: HOME_SECTION_TITLES[section as string] ?? 'Choose a section',
        subtitle: `${isOn ? 'Visible' : 'Hidden'}${heading ? ` · ${heading}` : ''}`,
        media: isOn ? EyeOpenIcon : EyeClosedIcon,
      }
    },
  },
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero (top of page)', default: true},
    {name: 'sections', title: 'Sections'},
    {name: 'seo', title: 'Search & sharing'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      description: 'The first thing visitors see. Make it count.',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Small label',
          description: 'Tiny line above the headline. Example: "Social Media & Community Manager".',
          type: 'string',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'headline',
          title: 'Headline',
          description:
            'Your big statement. Keep it to one sentence — it is shown very large.',
          type: 'string',
          validation: (rule) => rule.required().max(90),
        }),
        defineField({
          name: 'highlight',
          title: 'Word(s) to highlight',
          description:
            'Type a word or short phrase from the headline exactly as written. It will be shown in your accent colour, in italics. Leave empty for no highlight.',
          type: 'string',
          validation: (rule) =>
            rule.custom((highlight, context) => {
              const parent = context.parent as {headline?: string} | undefined
              if (!highlight || !parent?.headline) return true
              return parent.headline.toLowerCase().includes(highlight.toLowerCase())
                ? true
                : 'This text does not appear in the headline. Copy it exactly from the headline.'
            }),
        }),
        defineField({
          name: 'subheadline',
          title: 'Supporting text',
          description: 'One or two sentences under the headline explaining what you do and for whom.',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(260),
        }),
        defineField({
          name: 'primaryCta',
          title: 'Main button',
          description: 'The filled button. Usually links to your work.',
          type: 'cta',
        }),
        defineField({
          name: 'secondaryCta',
          title: 'Second button',
          description: 'The outlined button. Usually links to the contact page.',
          type: 'cta',
        }),
        defineField({
          name: 'mediaType',
          title: 'Hero media',
          description: 'Show a photo, or a short looping video, inside the phone frame.',
          type: 'string',
          options: {
            list: [
              {title: 'Image', value: 'image'},
              {title: 'Looping video', value: 'video'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          initialValue: 'image',
        }),
        imageField({
          name: 'image',
          title: 'Hero image',
          description:
            'A tall (portrait) photo works best — it sits inside a phone frame. With "Looping video" selected this is used as the cover while the video loads.',
        }),
        defineField({
          name: 'video',
          title: 'Hero video',
          description:
            'A short, silent, vertical clip (5–15 seconds, under 8 MB). It loops automatically without sound.',
          type: 'file',
          options: {accept: 'video/mp4,video/webm'},
          hidden: ({parent}) => (parent as {mediaType?: string} | undefined)?.mediaType !== 'video',
        }),
        defineField({
          name: 'statChips',
          title: 'Floating stat chips',
          description:
            'Up to three small badges that float around the hero image. Example: value "4.2M", label "views generated".',
          type: 'array',
          validation: (rule) => rule.max(3),
          of: [
            defineArrayMember({
              name: 'statChip',
              title: 'Stat chip',
              type: 'object',
              fields: [
                defineField({
                  name: 'value',
                  title: 'Number',
                  description: 'The eye-catching figure, e.g. 4.2M or +312%.',
                  type: 'string',
                  validation: (rule) => rule.required().max(10),
                }),
                defineField({
                  name: 'label',
                  title: 'Label',
                  description: 'What the number means, e.g. "views generated".',
                  type: 'string',
                  validation: (rule) => rule.required().max(28),
                }),
              ],
              preview: {select: {title: 'value', subtitle: 'label'}},
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Homepage sections',
      description:
        'Drag rows to change the order sections appear in. Open a row to hide the section or change its heading. A section also hides itself automatically when it has no content.',
      type: 'array',
      group: 'sections',
      of: [defineArrayMember({type: 'homeSection'})],
      validation: (rule) =>
        rule.custom((sections) => {
          const values = ((sections ?? []) as {section?: string}[])
            .map((item) => item.section)
            .filter(Boolean)
          const duplicate = values.find((value, index) => values.indexOf(value) !== index)
          return duplicate
            ? `"${HOME_SECTION_TITLES[duplicate as string] ?? duplicate}" is listed twice. Each section can only appear once.`
            : true
        }),
    }),
    defineField({
      name: 'seo',
      title: 'Search & social sharing',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {subtitle: 'hero.headline', media: 'hero.image'},
    prepare({subtitle, media}) {
      return {title: 'Home page', subtitle, media}
    },
  },
})
