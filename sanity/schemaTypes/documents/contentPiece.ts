import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {ImagesIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {CONTENT_TYPES, PLATFORM_TITLES} from '../../lib/constants'
import {imageField, platformField} from '../shared/fields'

const TYPE_TITLES: Record<string, string> = {
  post: 'Post',
  carousel: 'Carousel',
  reel: 'Reel',
  story: 'Story',
}

interface ContentPieceValue {
  type?: string
  images?: unknown[]
  video?: {asset?: unknown}
  embedUrl?: string
}

export const contentPiece = defineType({
  name: 'contentPiece',
  title: 'Feed item',
  type: 'document',
  icon: ImagesIcon,
  orderings: [orderRankOrdering],
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'metrics', title: 'Metrics'},
  ],
  fields: [
    orderRankField({type: 'contentPiece'}),
    defineField({
      name: 'title',
      title: 'Internal name',
      description:
        'Only you see this — it helps you find the item in the list. Example: "Lumen — launch reel".',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Format',
      description:
        'How the piece was published. This decides how it is displayed: posts and carousels show in a 4:5 frame, reels and stories show inside a phone frame.',
      type: 'string',
      group: 'content',
      options: {list: [...CONTENT_TYPES], layout: 'radio'},
      initialValue: 'post',
      validation: (rule) => rule.required(),
    }),
    platformField({
      description: 'Where it was published. Visitors can filter the feed by platform.',
      required: true,
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the homepage',
      description: 'Switch on to include this in the homepage feed.',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'images',
      title: 'Image(s)',
      description:
        'For a post: one image. For a carousel: add every slide in order. For a reel or story: add one image to use as the cover.',
      type: 'array',
      group: 'content',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          name: 'slide',
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
          ],
        }),
      ],
      validation: (rule) =>
        rule.custom((images, context) => {
          const doc = context.document as ContentPieceValue | undefined
          const count = images?.length ?? 0
          if (doc?.type === 'carousel' && count < 2) {
            return 'A carousel needs at least two images.'
          }
          if (count === 0 && !doc?.embedUrl) {
            return 'Add at least one image. It is used as the cover in the feed grid.'
          }
          return true
        }),
    }),
    defineField({
      name: 'video',
      title: 'Video file',
      description:
        'For reels and stories. Upload a vertical MP4, ideally under 20 MB. It plays when a visitor hovers or taps the item.',
      type: 'file',
      group: 'content',
      options: {accept: 'video/mp4,video/webm,video/quicktime'},
      hidden: ({document}) => {
        const type = (document as ContentPieceValue | undefined)?.type
        return type !== 'reel' && type !== 'story'
      },
    }),
    defineField({
      name: 'embedUrl',
      title: 'Or: link to embed',
      description:
        'Optional alternative to uploading a video. Paste the link to the YouTube, Instagram, TikTok or Vimeo post and it plays in the pop-up.',
      type: 'url',
      group: 'content',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      description: 'The caption as it was posted. Shown in the pop-up when a visitor opens the item.',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'originalUrl',
      title: 'Link to the original post',
      description: 'Optional. Adds a "View original" button so visitors can see it live.',
      type: 'url',
      group: 'content',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'caseStudy',
      title: 'Related case study',
      description: 'Optional. Links this piece to the project it belongs to.',
      type: 'reference',
      group: 'content',
      to: [{type: 'caseStudy'}],
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      description:
        'How the piece performed. Fill in only the numbers you want to show — empty ones are hidden.',
      type: 'object',
      group: 'metrics',
      options: {columns: 2},
      fields: [
        defineField({name: 'views', title: 'Views', type: 'number', validation: (rule) => rule.min(0)}),
        defineField({name: 'likes', title: 'Likes', type: 'number', validation: (rule) => rule.min(0)}),
        defineField({name: 'comments', title: 'Comments', type: 'number', validation: (rule) => rule.min(0)}),
        defineField({name: 'shares', title: 'Shares', type: 'number', validation: (rule) => rule.min(0)}),
        defineField({name: 'saves', title: 'Saves', type: 'number', validation: (rule) => rule.min(0)}),
      ],
    }),
    // Kept for editors who want a dedicated cover that differs from the first image.
    imageField({
      name: 'poster',
      title: 'Custom cover (optional)',
      description:
        'Optional. Use a different cover in the feed grid than the first image above.',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      platform: 'platform',
      featured: 'featured',
      poster: 'poster',
      firstImage: 'images.0',
    },
    prepare({title, type, platform, featured, poster, firstImage}) {
      return {
        title: `${featured ? '★ ' : ''}${title ?? 'Untitled'}`,
        subtitle: [TYPE_TITLES[type as string], PLATFORM_TITLES[platform as string]]
          .filter(Boolean)
          .join(' · '),
        media: poster?.asset ? poster : firstImage,
      }
    },
  },
})
