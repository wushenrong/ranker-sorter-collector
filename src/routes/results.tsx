/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react'
import { Link, useActionData } from 'react-router'

import { resultsAction } from '~/actions'
import { endpointResponse } from '~/schemas'

type SendState = 'unsent' | 'error' | 'sent'

const APPS_SCRIPT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwmOAgr96l3z7_mQOdCor048W8Ets9JtHQGDixBXR_PdXnqlaVkarx-L3GpGtCPGJFc/exec'

const TABLE_HEADINGS = [
  'Player',
  'Rank',
  'Elo',
  'Wins',
  'Losses',
  'Draws',
] as const

export function Results() {
  const actionData = useActionData<typeof resultsAction>()
  const [sendState, setSendState] = useState<SendState>('unsent')

  const actionResponse = actionData?.ok ? actionData.data : actionData?.error

  if (!actionResponse || typeof actionResponse === 'string') {
    return (
      <>
        {actionResponse ? (
          <div className="load-error">
            <p>Error: Unable to load ranker results</p>
            <p>{actionResponse}</p>
          </div>
        ) : (
          <p>
            Error: Unable to create ranker results. Did you accidentally
            refreshed the browser?
          </p>
        )}
        <Link replace to="/">
          Go back home
        </Link>
      </>
    )
  }

  const sendResults = async () => {
    const fetchOptions = {
      body: JSON.stringify(actionResponse),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }

    const response = await fetch(APPS_SCRIPT_ENDPOINT, fetchOptions)

    if (!response.ok) {
      setSendState('error')
      return
    }

    const result = endpointResponse.safeParse(await response.json())

    if (!result.success || result.data.result === 'error') {
      setSendState('error')
      return
    }

    setSendState('sent')
  }

  const saveResults = () => {
    const data = JSON.stringify(actionResponse)
    const blob = new Blob([data], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = href
    a.download = 'ranker-results.json'

    document.body.appendChild(a)

    a.click()
    a.remove()

    URL.revokeObjectURL(href)
  }

  return (
    <>
      <div>
        <button
          disabled={sendState === 'sent'}
          onClick={sendResults}
          type="button"
        >
          {sendState !== 'error'
            ? 'Send Results'
            : 'Error sending results, try again'}
        </button>
        <button onClick={saveResults} type="button">
          Save Results
        </button>
      </div>

      <table>
        <caption>Result of ranking: {actionResponse.title}</caption>
        <thead>
          <tr>
            {TABLE_HEADINGS.map((heading) => (
              <th key={heading} scope="col">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {actionResponse.players.map((player, index) => (
            <tr key={player.name}>
              <th scope="row">
                {player.image ? (
                  <img
                    alt={player.name}
                    height={64}
                    src={player.image}
                    width={64}
                  />
                ) : (
                  player.name
                )}
              </th>
              <td>{index + 1}</td>
              <td>{player.elo}</td>
              <td>{player.wins}</td>
              <td>{player.losses}</td>
              <td>{player.draws}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link replace to="/">
        Go back home
      </Link>
    </>
  )
}
