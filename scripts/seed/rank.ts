import {LexoRank} from 'lexorank'

import {RANKED_TYPES, type SeedDocument} from './content'

const RANKED: ReadonlySet<string> = new Set(RANKED_TYPES)

/**
 * Gives each collection document an `orderRank` (in the order they are listed
 * in content.ts). This is the field the Studio's drag-and-drop ordering uses.
 */
export function withRanks(documents: SeedDocument[]): SeedDocument[] {
  const lastRank = new Map<string, LexoRank>()

  return documents.map((document) => {
    if (!RANKED.has(document._type)) return document
    const rank = (lastRank.get(document._type) ?? LexoRank.min()).genNext().genNext()
    lastRank.set(document._type, rank)
    return {...document, orderRank: rank.toString()}
  })
}
