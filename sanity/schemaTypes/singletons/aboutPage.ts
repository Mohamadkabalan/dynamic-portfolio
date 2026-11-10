import {LANGUAGE_LEVEL_TITLES, LANGUAGE_LEVELS} from '../../lib/constants'
import {UserIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {imageField} from '../shared/fields'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'intro', title: 'Intro', default: true},
    {name: 'approach', title: 'Approach'},
    {name: 'experience', title: 'Experience'},
    {name: 'languages', title: 'Languages'},
    {name: 'values', title: 'Values'},
    {name: 'seo', title: 'Search & sharing'},
  ],
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      description: 'The big line at the top of the about page. Example: "The person behind the posts."',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.max(90),
    }),
    imageField({
      name: 'portrait',
      title: 'Portrait',
      description: 'A photo of you. Portrait orientation (taller than wide) works best.',
      group: 'intro',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      description: 'Your story, in a few short paragraphs. Write the way you speak.',
      type: 'simpleText',
      group: 'intro',
    }),
    defineField({
      name: 'approachHeading',
      title: 'Approach heading',
      description: 'Title above your process steps. Example: "How I work".',
      type: 'string',
      group: 'approach',
    }),
    defineField({
      name: 'approach',
      title: 'Process steps',
      description:
        'The steps you take with every client, in order. Three to five steps is ideal.',
      type: 'array',
      group: 'approach',
      of: [
        defineArrayMember({
          name: 'step',
          title: 'Step',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Step name',
              description: 'Example: "Listen & audit".',
              type: 'string',
              validation: (rule) => rule.required().max(50),
            }),
            defineField({
              name: 'description',
              title: 'What happens in this step',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.max(320),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'experienceHeading',
      title: 'Experience heading',
      description: 'Title above your timeline. Example: "Experience".',
      type: 'string',
      group: 'experience',
    }),
    defineField({
      name: 'experience',
      title: 'Experience timeline',
      description: 'Your roles, newest first. Drag to reorder.',
      type: 'array',
      group: 'experience',
      of: [
        defineArrayMember({
          name: 'role',
          title: 'Role',
          type: 'object',
          fields: [
            defineField({
              name: 'role',
              title: 'Role',
              description: 'Your job title. Example: "Senior Social Media Manager".',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'company',
              title: 'Company',
              type: 'string',
            }),
            defineField({
              name: 'period',
              title: 'When',
              description: 'Type it as it should appear. Example: "2022 — Present".',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'What you did',
              description: 'One or two sentences on your responsibilities and wins.',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: {role: 'role', company: 'company', period: 'period'},
            prepare({role, company, period}) {
              return {
                title: [role, company].filter(Boolean).join(' · '),
                subtitle: period,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'languagesHeading',
      title: 'Languages heading',
      description: 'Title above your languages. Example: "Languages I work in".',
      type: 'string',
      group: 'languages',
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      description:
        'The languages you work in, strongest first. Drag to reorder. The section only appears once at least one language is added.',
      type: 'array',
      group: 'languages',
      of: [
        defineArrayMember({
          name: 'language',
          title: 'Language',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Language',
              description: 'Example: "Arabic".',
              type: 'string',
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: 'level',
              title: 'Proficiency',
              type: 'string',
              options: {
                list: LANGUAGE_LEVELS.map(({title, value}) => ({title, value})),
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'note',
              title: 'Note',
              description:
                'Optional short line shown under the level. Example: "CEFR C1" or "Client work & copywriting".',
              type: 'string',
              validation: (rule) => rule.max(60),
            }),
          ],
          preview: {
            select: {title: 'name', level: 'level', note: 'note'},
            prepare({title, level, note}) {
              return {
                title,
                subtitle: [LANGUAGE_LEVEL_TITLES[level] ?? level, note].filter(Boolean).join(' · '),
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'valuesHeading',
      title: 'Values heading',
      description: 'Title above your values. Example: "What I believe".',
      type: 'string',
      group: 'values',
    }),
    defineField({
      name: 'values',
      title: 'Values',
      description: 'The principles that guide your work. Three or four is ideal.',
      type: 'array',
      group: 'values',
      of: [
        defineArrayMember({
          name: 'value',
          title: 'Value',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Value',
              description: 'Example: "Community before content".',
              type: 'string',
              validation: (rule) => rule.required().max(50),
            }),
            defineField({
              name: 'description',
              title: 'What it means',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.max(280),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Search & social sharing',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {subtitle: 'headline', media: 'portrait'},
    prepare({subtitle, media}) {
      return {title: 'About page', subtitle, media}
    },
  },
})
