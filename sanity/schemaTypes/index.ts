import type {SchemaTypeDefinition} from 'sanity'

import {caseStudy, resultMetric} from './documents/caseStudy'
import {client} from './documents/client'
import {contentPiece} from './documents/contentPiece'
import {certification, stat, tool, toolCategory} from './documents/library'
import {service} from './documents/service'
import {testimonial} from './documents/testimonial'
import {cta} from './objects/cta'
import {embed, videoFile} from './objects/media'
import {richText, simpleText} from './objects/portableText'
import {seo} from './objects/seo'
import {socialLink} from './objects/socialLink'
import {aboutPage} from './singletons/aboutPage'
import {homePage, homeSection} from './singletons/homePage'
import {siteSettings} from './singletons/siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  // Collections
  caseStudy,
  contentPiece,
  service,
  testimonial,
  client,
  stat,
  toolCategory,
  tool,
  certification,
  // Objects
  seo,
  cta,
  socialLink,
  homeSection,
  resultMetric,
  videoFile,
  embed,
  simpleText,
  richText,
]
