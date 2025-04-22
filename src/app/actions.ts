import * as zod from '@zod/mini'
import { ActionFunctionArgs } from 'react-router'

import { shuffleArray } from './elosystem'
import { customRanker, results } from './schemas'

export async function rankerAction({ request }: ActionFunctionArgs) {
  const rankerData = await request.json()
  const result = customRanker.safeParse(rankerData)

  if (!result.success) {
    return { error: zod.prettifyError(result.error), ok: false as const }
  }

  const data = {
    players: shuffleArray(result.data.players),
    title: result.data.title,
  }

  return { data, ok: true as const }
}

export async function resultsAction({ request }: ActionFunctionArgs) {
  const rankerResultsData = await request.json()
  const result = results.safeParse(rankerResultsData)

  if (!result.success) {
    return { error: zod.prettifyError(result.error), ok: false as const }
  }

  return { data: result.data, ok: true as const }
}
