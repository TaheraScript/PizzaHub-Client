import type { SearchParamValue } from "@/types/query"

export { cn } from "cn"

/** Collapse a raw query value (which may be repeated) to its first entry. */
export function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value
}
