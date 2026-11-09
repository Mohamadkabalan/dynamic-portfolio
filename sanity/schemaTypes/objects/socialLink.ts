import {UsersIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {PLATFORM_TITLES} from '../../lib/constants'
import {platformField} from '../shared/fields'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social profile',
  type: 'object',
  icon: UsersIcon,
  fields: [
    platformField({
      description: 'Which network is this profile on?',
      required: true,
    }),
    defineField({
      name: 'url',
      title: 'Profile link',
      description: 'Paste the full link to the profile, starting with https://',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'handle',
      title: 'Handle',
      description: 'The username shown on the site, e.g. @sukaina.social',
      type: 'string',
    }),
    defineField({
      name: 'followerCount',
      title: 'Follower count',
      description:
        'Optional. Type it exactly as it should appear, e.g. 12.4K. Leave empty to hide it.',
      type: 'string',
    }),
  ],
  preview: {
    select: {platform: 'platform', handle: 'handle', followers: 'followerCount'},
    prepare({platform, handle, followers}) {
      return {
        title: PLATFORM_TITLES[platform as string] ?? 'Social profile',
        subtitle: [handle, followers && `${followers} followers`].filter(Boolean).join(' · '),
      }
    },
  },
})
