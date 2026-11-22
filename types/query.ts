export type SearchParamValue = string | string[] | undefined

/** Next.js App Router `searchParams` prop — a promise of raw query values. */
export type SearchParams = Promise<Record<string, SearchParamValue>>
