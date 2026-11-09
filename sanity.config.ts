'use client'

/**
 * Configuration for the Sanity Studio embedded at /studio.
 */
import {visionTool} from '@sanity/vision'
import {defineConfig, type DocumentActionComponent} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, safeProjectId, studioBasePath} from './sanity/env'
import {SINGLETON_TYPES} from './sanity/lib/constants'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

/** Singletons can be edited and published, but never duplicated, deleted or unpublished. */
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Portfolio CMS',
  basePath: studioBasePath,
  projectId: safeProjectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Hide singletons from the global "Create new" menu.
    templates: (templates) =>
      templates.filter((template) => !SINGLETON_TYPES.has(template.schemaType)),
  },
  document: {
    actions: (actions, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? actions.filter(
            (action: DocumentActionComponent) =>
              typeof action.action === 'string' && SINGLETON_ACTIONS.has(action.action),
          )
        : actions,
    newDocumentOptions: (options) =>
      options.filter((option) => !SINGLETON_TYPES.has(option.templateId)),
  },
  plugins: [
    structureTool({structure}),
    // Vision lets you test GROQ queries against your content from inside the Studio.
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
