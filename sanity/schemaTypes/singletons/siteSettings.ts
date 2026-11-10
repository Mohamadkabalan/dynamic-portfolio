import {CogIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {ColorInput} from '../../components/ColorInput'
import {imageField} from '../shared/fields'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'look', title: 'Look & feel'},
    {name: 'social', title: 'Social profiles'},
    {name: 'contact', title: 'Contact & availability'},
    {name: 'pages', title: 'Contact form'},
    {name: 'seo', title: 'Search & sharing'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Your name',
      description: 'Shown in the top-left of every page, in the footer and in Google results.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Job title',
      description: 'What you do, in a few words. Example: Social Media & Community Manager.',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    imageField({
      name: 'logo',
      title: 'Logo',
      description:
        'Optional. If you upload a logo it replaces your name in the top-left of the site. A wide, transparent PNG or SVG works best. In dark mode it is shown in white automatically.',
      group: 'identity',
    }),
    imageField({
      name: 'favicon',
      title: 'Browser tab icon (favicon)',
      description:
        'The tiny icon shown in the browser tab. Upload a square image, at least 512 × 512 pixels.',
      group: 'identity',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent colour',
      description:
        'The highlight colour used for buttons, links and key words across the whole site. Pick a swatch, use the colour wheel, or type a hex code. The site automatically chooses readable text to go on top of it.',
      type: 'string',
      group: 'look',
      components: {input: ColorInput},
      validation: (rule) =>
        rule
          .regex(/^#[0-9a-fA-F]{6}$/, {name: 'hex colour'})
          .error('Use a 6-digit hex code such as #F0502D.'),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social profiles',
      description:
        'Your own profiles. They appear in the footer, on the contact page and on the about page. Drag to reorder.',
      type: 'array',
      group: 'social',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      description: 'The small status badge shown in the header and on the contact page.',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'isAvailable',
          title: 'Open to new clients?',
          description:
            'Switch on to show a green "available" dot. Switch off to show that you are fully booked.',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'text',
          title: 'Status text',
          description:
            'Short line next to the dot. Example: "Booking projects from March" or "Fully booked until June".',
          type: 'string',
          validation: (rule) => rule.max(60),
        }),
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      description: 'The address visitors can email you at. Shown on the contact page and footer.',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: 'Where you are based. Example: Beirut, Lebanon · Working worldwide.',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'resume',
      title: 'Résumé / CV (PDF)',
      description:
        'Optional. Upload a PDF and a "Download CV" button appears in the About section.',
      type: 'file',
      group: 'contact',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'contactPage',
      title: 'Contact form',
      description:
        'Settings for the enquiry form in the Contact section. Its heading and intro are set under Home page → Page sections → Contact.',
      type: 'object',
      group: 'pages',
      fields: [
        defineField({
          name: 'budgetOptions',
          title: 'Budget choices',
          description:
            'The options in the "Budget" dropdown of the form. Example: "Under $1,000 / month". Leave empty to use the built-in choices.',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          validation: (rule) => rule.max(8),
        }),
        defineField({
          name: 'successMessage',
          title: 'Thank-you message',
          description: 'Shown after someone sends the form. Example: "Thank you! I reply within two working days."',
          type: 'string',
          validation: (rule) => rule.max(160),
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Search & sharing defaults',
      description:
        'Used for every page that does not have its own search settings.',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'titleTemplate',
          title: 'Page title pattern',
          description:
            'How page titles appear in the browser tab. Keep %s — it is replaced by the page name. Example: "%s · Sukaina Charaf Eddine".',
          type: 'string',
          validation: (rule) =>
            rule.custom((value) =>
              !value || value.includes('%s') ? true : 'The pattern must contain %s.',
            ),
        }),
        defineField({
          name: 'description',
          title: 'Site description',
          description:
            'One or two sentences describing you and what you do. Shown in Google results. Aim for 120–160 characters.',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(180).warning('Google cuts off longer descriptions.'),
        }),
        imageField({
          name: 'ogImage',
          title: 'Default sharing image',
          description:
            'Shown when your site link is shared. Best size: 1200 × 630 pixels. Leave empty and one is generated automatically from your name and title.',
        }),
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer text',
      description:
        'A short closing line shown at the bottom of every page. Example: "Let\'s make your brand impossible to scroll past."',
      type: 'string',
      group: 'footer',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'title', media: 'logo'},
    prepare({title, subtitle, media}) {
      return {title: title || 'Site settings', subtitle, media}
    },
  },
})
