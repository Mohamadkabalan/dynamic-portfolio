import {ImageIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const linkAnnotation = defineArrayMember({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'href',
      title: 'Link',
      description: 'Paste a full link (https://…), or type a path on this site such as /contact.',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((href) => {
          if (!href) return true
          return /^(\/|#|https?:\/\/|mailto:|tel:)/.test(href)
            ? true
            : 'Start with / for a page on this site, or https:// for another website.'
        }),
    }),
  ],
})

/** Simple formatted text: paragraphs, bold, italics, links and lists. */
export const simpleText = defineType({
  name: 'simpleText',
  title: 'Formatted text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Paragraph', value: 'normal'}],
      lists: [
        {title: 'Bulleted list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [linkAnnotation],
      },
    }),
  ],
})

/** Rich text for case study write-ups: adds headings, quotes, images, video and embeds. */
export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading', value: 'h3'},
        {title: 'Small heading', value: 'h4'},
        {title: 'Pull quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bulleted list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({
      name: 'figure',
      title: 'Image',
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Image description (alt text)',
          description:
            'Describe what is in the image in one short sentence. Screen readers read this aloud to visitors who cannot see the image.',
          type: 'string',
          validation: (rule) =>
            rule.required().error('Please describe this image. It is required for accessibility.'),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          description: 'Optional short line shown under the image.',
          type: 'string',
        }),
      ],
    }),
    defineArrayMember({type: 'videoFile'}),
    defineArrayMember({type: 'embed'}),
  ],
})
