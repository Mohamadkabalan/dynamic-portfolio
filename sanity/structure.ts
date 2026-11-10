import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {
  BarChartIcon,
  CaseIcon,
  CheckmarkCircleIcon,
  CogIcon,
  CommentIcon,
  HomeIcon,
  ImagesIcon,
  PackageIcon,
  PresentationIcon,
  TagIcon,
  UserIcon,
  WrenchIcon,
} from './lib/icons'
import type {ComponentType} from 'react'
import type {StructureBuilder, StructureResolver, StructureResolverContext} from 'sanity/structure'

import {SINGLETON_IDS} from './lib/constants'

type SingletonType = keyof typeof SINGLETON_IDS

/** A one-of-a-kind document that opens straight into its editing form. */
function singleton(S: StructureBuilder, type: SingletonType, title: string, icon: ComponentType) {
  return S.listItem()
    .id(type)
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(SINGLETON_IDS[type]).title(title))
}

export const structure: StructureResolver = (S, context: StructureResolverContext) => {
  /** A collection the editor can reorder by dragging. */
  const orderable = (type: string, title: string, icon: ComponentType) =>
    orderableDocumentListDeskItem({type, title, icon, S, context})

  return S.list()
    .id('root')
    .title('Content')
    .items([
      S.listItem()
        .id('settings')
        .title('Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .id('settings')
            .title('Settings')
            .items([singleton(S, 'siteSettings', 'Site settings', CogIcon)]),
        ),
      S.listItem()
        .id('pages')
        .title('Pages')
        .icon(HomeIcon)
        .child(
          S.list()
            .id('pages')
            .title('Pages')
            .items([
              singleton(S, 'homePage', 'Home page', HomeIcon),
              singleton(S, 'aboutPage', 'About section', UserIcon),
            ]),
        ),
      S.divider(),
      S.listItem()
        .id('portfolio')
        .title('Portfolio')
        .icon(PresentationIcon)
        .child(
          S.list()
            .id('portfolio')
            .title('Portfolio')
            .items([
              orderable('caseStudy', 'Case studies', PresentationIcon),
              orderable('service', 'Services', PackageIcon),
            ]),
        ),
      S.listItem()
        .id('feed')
        .title('Feed')
        .icon(ImagesIcon)
        .child(
          S.list()
            .id('feed')
            .title('Feed')
            .items([orderable('contentPiece', 'Feed items', ImagesIcon)]),
        ),
      S.listItem()
        .id('socialProof')
        .title('Social Proof')
        .icon(CommentIcon)
        .child(
          S.list()
            .id('socialProof')
            .title('Social Proof')
            .items([
              orderable('testimonial', 'Testimonials', CommentIcon),
              orderable('client', 'Clients', CaseIcon),
              orderable('stat', 'Stats', BarChartIcon),
            ]),
        ),
      S.listItem()
        .id('library')
        .title('Library')
        .icon(WrenchIcon)
        .child(
          S.list()
            .id('library')
            .title('Library')
            .items([
              orderable('tool', 'Tools', WrenchIcon),
              orderable('toolCategory', 'Tool categories', TagIcon),
              orderable('certification', 'Certifications', CheckmarkCircleIcon),
            ]),
        ),
    ])
}
