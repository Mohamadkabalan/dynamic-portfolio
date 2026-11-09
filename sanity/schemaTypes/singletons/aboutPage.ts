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
