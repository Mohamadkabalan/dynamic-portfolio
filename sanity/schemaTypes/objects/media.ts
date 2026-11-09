import {DocumentVideoIcon, LinkIcon, PlayIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {imageField} from '../shared/fields'

/** An uploaded video with a poster image, used in feeds and case studies. */
export const videoFile = defineType({
  name: 'videoFile',
  title: 'Video',
  type: 'object',
  icon: DocumentVideoIcon,
  fields: [
    defineField({
      name: 'file',
      title: 'Video file',
      description:
        'Upload an MP4 (best) or WebM. Keep it short and under about 20 MB so it loads fast on phones.',
      type: 'file',
      options: {accept: 'video/mp4,video/webm,video/quicktime'},
      validation: (rule) => rule.required().assetRequired(),
    }),
    imageField({
      name: 'poster',
      title: 'Cover image',
      description:
        'The still image shown before the video plays. Use a strong frame from the video.',
      required: true,
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      description: 'Optional short line shown under the video.',
      type: 'string',
    }),
  ],
  preview: {
    select: {caption: 'caption', media: 'poster', filename: 'file.asset.originalFilename'},
    prepare({caption, media, filename}) {
      return {title: caption || filename || 'Video', subtitle: 'Video', media: media ?? PlayIcon}
    },
  },
})

/** A link to a post on another platform that is shown as an embedded player. */
export const embed = defineType({
  name: 'embed',
  title: 'Embedded post or video',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'Link to embed',
      description:
        'Paste the link to a YouTube video, Instagram post or reel, TikTok video or Vimeo video. It will show as a player on the page.',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['https']}),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      description: 'Optional short line shown under the embed.',
      type: 'string',
    }),
  ],
  preview: {
    select: {url: 'url', caption: 'caption'},
    prepare({url, caption}) {
      return {title: caption || 'Embedded post', subtitle: url, media: LinkIcon}
    },
  },
})
