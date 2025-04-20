/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import {
  createBrowserRouter,
  isRouteErrorResponse,
  Link,
  RouterProvider,
  useRouteError,
} from 'react-router'

const router = createBrowserRouter(
  [
    {
      ErrorBoundary,
      HydrateFallback,
      index: true,
      lazy: () => import('./routes/creator'),
    },
    {
      ErrorBoundary,
      HydrateFallback,
      lazy: () => import('./routes/ranker'),
      path: '/ranker',
    },
    {
      ErrorBoundary,
      HydrateFallback,
      lazy: () => import('./routes/results'),
      path: '/results',
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)

export default function App() {
  return <RouterProvider router={router} />
}

function HydrateFallback() {
  return <p>Loading, please wait...</p>
}

function ErrorBoundary() {
  const error = useRouteError()
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested content could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <>
      <h2>{message}</h2>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
      <Link replace to="/">
        Go back home
      </Link>
    </>
  )
}
