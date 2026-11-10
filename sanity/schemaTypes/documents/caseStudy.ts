import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {isValidSlug, SLUG_MAX_LENGTH, slugify} from '../../lib/slug'
import {PresentationIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {PLATFORMS, PLATFORM_TITLES} from '../../lib/constants'
import {imageField} from '../shared/fields'

export const resultMetric = defineType({
  name: 'resultMetric',
  title: 'Result',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'What was measured',
      description: 'Example: "Follower growth" or "Reel views".',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'value',
      title: 'Number',
      description:
        'Digits only — it animates counting up on the site. Example: 312 or 4.2 (use the fields below for symbols like %, K or M).',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'prefix',
      title: 'Before the number',
      description: 'Optional symbol shown before the number. Example: + or $',
      type: 'string',
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'suffix',
      title: 'After the number',
      description: 'Optional symbol shown after the number. Example: %, K, M or x',
      type: 'string',
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'change',
      title: '% change',
      description:
        'Optional. How much this went up or down, as a percentage. Example: 48 shows "↑ 48%", -12 shows "↓ 12%".',
      type: 'number',
    }),
    defineField({
      name: 'timeframe',
      title: 'Over what period',
      description: 'Optional. Example: "in 90 days" or "vs. previous quarter".',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
  ],
  preview: {
    select: {label: 'label', value: 'value', prefix: 'prefix', suffix: 'suffix', timeframe: 'timeframe'},
    prepare({label, value, prefix, suffix, timeframe}) {
      return {
        title: `${prefix ?? ''}${value ?? ''}${suffix ?? ''} ${label ?? ''}`.trim(),
        subtitle: timeframe,
      }
    },
  },
})

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  icon: PresentationIcon,
  orderings: [orderRankOrdering],
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'story', title: 'Story'},
    {name: 'results', title: 'Results'},
    {name: 'media', title: 'Gallery'},
    {name: 'seo', title: 'Search & sharing'},
  ],
  fields: [
    orderRankField({type: 'caseStudy'}),
    defineField({
      name: 'title',
      title: 'Title',
      description:
        'The headline of the project. Lead with the outcome if you can. Example: "Turning a neighbourhood café into a TikTok destination".',
      type: 'string',
      group: 'overview',
      validation: (rule) => rule.required().max(110),
    }),
    defineField({
      name: 'slug',
      title: 'Page address on this site',
      description:
        'The last part of this case study\'s own page link: yoursite.com/work/pure-gym. Click "Generate" to create it from the title — only lowercase letters, numbers and hyphens. This is not the client\'s website or a link to a post (use "Link to the work online" for that). Avoid changing it after publishing — old links would stop working.',
      type: 'slug',
      group: 'overview',
      options: {source: 'title', maxLength: SLUG_MAX_LENGTH, slugify},
      validation: (rule) =>
        rule.required().custom((value) =>
          !value?.current || isValidSlug(value.current)
            ? true
            : 'Only lowercase letters, numbers and hyphens are allowed here, e.g. "pure-gym". Links (https://…) do not belong in this field — click "Generate" to create the address from the title.',
        ),
    }),
    defineField({
      name: 'liveUrl',
      title: 'Link to the work online',
      description:
        'Optional. Where people can see this work live: the client\'s Instagram or TikTok profile, a post, or their website. Shown as a button on the case study. Paste the full link starting with https://',
      type: 'url',
      group: 'overview',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'featured',
      title: 'Pin to the top',
      description: 'Switch on to show this project before the others in the Work section.',
      type: 'boolean',
      group: 'overview',
      initialValue: false,
    }),
    defineField({
      name: 'client',
      title: 'Client',
      description: 'Who the work was for. Pick an existing client or create a new one.',
      type: 'reference',
      group: 'overview',
      to: [{type: 'client'}],
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      description:
        'The client\'s sector, e.g. "Food & Beverage" or "Beauty". Visitors can filter projects by this, so reuse the same wording across projects.',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'platforms',
      title: 'Platforms',
      description: 'Tick every platform this project ran on. Visitors can filter projects by platform.',
      type: 'array',
      group: 'overview',
      of: [defineArrayMember({type: 'string'})],
      options: {list: [...PLATFORMS], layout: 'grid'},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'timeframe',
      title: 'Timeframe',
      description: 'When or how long. Example: "Jan – Jun 2025" or "6 months".',
      type: 'string',
      group: 'overview',
    }),
    imageField({
      name: 'cover',
      title: 'Cover image',
      description:
        'The main image for this project. It is shown full-width at the top of the page and on project cards. Use a wide, high-quality image (at least 2000 pixels wide).',
      required: true,
      group: 'overview',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description:
        'Two or three sentences that sum up the project. Shown on project cards and at the top of the page.',
      type: 'text',
      rows: 3,
      group: 'overview',
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'challenge',
      title: 'The challenge',
      description: 'What problem was the client facing? What did they want to achieve?',
      type: 'simpleText',
      group: 'story',
    }),
    defineField({
      name: 'strategy',
      title: 'The strategy',
      description: 'Your thinking: the idea, the audience insight, the plan.',
      type: 'simpleText',
      group: 'story',
    }),
    defineField({
      name: 'execution',
      title: 'The execution',
      description:
        'What you actually made and did. Use the + button to add images, videos or embedded posts between paragraphs.',
      type: 'richText',
      group: 'story',
    }),
    defineField({
      name: 'results',
      title: 'Results',
      description:
        'The numbers that prove it worked. Each result becomes a large animated metric card. Three to six is ideal.',
      type: 'array',
      group: 'results',
      of: [defineArrayMember({type: 'resultMetric'})],
    }),
    defineField({
      name: 'testimonial',
      title: 'Client testimonial',
      description: 'Optional. A quote from this client, shown near the end of the page.',
      type: 'reference',
      group: 'results',
      to: [{type: 'testimonial'}],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Extra images from the project: posts, behind-the-scenes, screenshots. Drag to reorder.',
      type: 'array',
      group: 'media',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          name: 'galleryImage',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Image description (alt text)',
              description:
                'Describe what is in the image in one short sentence. Screen readers read this aloud to visitors who cannot see the image.',
              type: 'string',
              validation: (rule) =>
                rule
                  .required()
                  .error('Please describe this image. It is required for accessibility.'),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              description: 'Optional short line shown with the image.',
              type: 'string',
            }),
          ],
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
    select: {
      title: 'title',
      client: 'client.name',
      industry: 'industry',
      featured: 'featured',
      platforms: 'platforms',
      media: 'cover',
    },
    prepare({title, client, industry, featured, platforms, media}) {
      const platformNames = ((platforms ?? []) as string[])
        .map((platform) => PLATFORM_TITLES[platform] ?? platform)
        .join(', ')
      return {
        title: `${featured ? '★ ' : ''}${title ?? 'Untitled case study'}`,
        subtitle: [client, industry, platformNames].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
