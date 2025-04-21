/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from 'react'
import { useSubmit } from 'react-router'

import exampleRanker from '~/example-ranker.json'

export function Creator() {
  const submit = useSubmit()

  const [isStarting, setIsStarting] = useState(false)

  const startRanker = () => {
    if (isStarting) {
      return
    }

    setIsStarting(true)

    submit(JSON.stringify(exampleRanker), {
      action: '/ranker',
      encType: 'application/json',
      method: 'POST',
      replace: true,
    })
  }

  return (
    <>
      <p>
        Once you begin, you have to finish the ranker to see and submit the
        results. This site <strong>does not</strong> save any data on your
        computer. Do not reload the browser while completing the ranker. Do not
        forget to save your results after completing the ranker!
      </p>
      <button disabled={isStarting} onClick={startRanker} type="button">
        Start Ranker
      </button>
    </>
  )
}
