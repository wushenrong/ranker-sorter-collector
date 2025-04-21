/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT-0
 */
/// <reference types="vite/client" />
/// <reference types="@total-typescript/ts-reset" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_DATABASE_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
