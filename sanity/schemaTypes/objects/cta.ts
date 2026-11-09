import {LinkIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Button text',
      description: 'Keep it short and action-led, e.g. "See my work".',
      type: 'string',
      validation: (rule) => rule.max(32),
    }),
    defineField({
      name: 'href',
      title: 'Where does it go?',
      description:
        'For a page on this site, type the path, e.g. /work or /contact. For another website, paste the full link starting with https://',
      type: 'string',
      validation: (rule) =>
        rule.custom((href, context) => {
          const parent = context.parent as {label?: string} | undefined
          if (!href) return parent?.label ? 'Add a link so the button goes somewhere.' : true
          if (/^(\/|#|https?:\/\/|mailto:|tel:)/.test(href)) return true
          return 'Start with / for a page on this site, or https:// for another website.'
        }),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
