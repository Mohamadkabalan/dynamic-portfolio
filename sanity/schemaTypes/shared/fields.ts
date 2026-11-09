import {defineField, type FieldDefinition} from 'sanity'

import {PLATFORMS} from '../../lib/constants'

interface ImageFieldOptions {
  name: string
  title: string
  description?: string
  required?: boolean
  group?: string
  fieldset?: string
  /** Extra help for the alt text field, e.g. what a good description looks like here. */
  altHint?: string
}

/**
 * An image with focus-point (hotspot) support and a required description for
 * screen readers. Every image on the site is created with this helper so alt
 * text can never be skipped.
 */
export function imageField({
  name,
  title,
  description,
  required = false,
  group,
  fieldset,
  altHint,
}: ImageFieldOptions): FieldDefinition {
  return defineField({
    name,
    title,
    description,
    type: 'image',
    group,
    fieldset,
    options: {hotspot: true},
    validation: (rule) => (required ? rule.required().assetRequired() : rule),
    fields: [
      defineField({
        name: 'alt',
        title: 'Image description (alt text)',
        description:
          altHint ??
          'Describe what is in the image in one short sentence. Screen readers read this aloud to visitors who cannot see the image, and Google uses it too.',
        type: 'string',
        validation: (rule) =>
          rule.custom((alt, context) => {
            const parent = context.parent as {asset?: unknown} | undefined
            if (parent?.asset && !alt?.trim()) {
              return 'Please describe this image. It is required for accessibility.'
            }
            return true
          }),
      }),
    ],
  })
}

/** A single-choice platform picker. */
export function platformField(options: {
  name?: string
  title?: string
  description?: string
  required?: boolean
  group?: string
}): FieldDefinition {
  const {name = 'platform', title = 'Platform', description, required = false, group} = options
  return defineField({
    name,
    title,
    description,
    type: 'string',
    group,
    options: {list: [...PLATFORMS], layout: 'dropdown'},
    validation: (rule) => (required ? rule.required() : rule),
  })
}
