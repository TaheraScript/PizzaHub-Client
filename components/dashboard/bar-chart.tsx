import { cn } from "@/lib/utils"

export type BarChartDatum = {
  label: string
  value: number
}

const SERIES_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

type BarChartProps = {
  data: BarChartDatum[]
  /** Plot height in px. */
  height?: number
  className?: string
}

/**
 * Lightweight, dependency-free bar chart for dashboard data visualisation.
 * Colours come from the `--chart-*` design tokens.
 */
export function BarChart({ data, height = 140, className }: BarChartProps) {
  const max = Math.max(1, ...data.map((datum) => datum.value))
  const summary = data.map((datum) => `${datum.label}: ${datum.value}`).join(", ")

  return (
    <div
      role="img"
      aria-label={summary}
      className={cn("flex items-end gap-3", className)}
    >
      {data.map((datum, index) => (
        <div
          key={datum.label}
          className="flex min-w-0 flex-1 flex-col items-center gap-2"
        >
          <span className="text-xs font-semibold text-foreground">
            {datum.value}
          </span>
          <div
            className="flex w-full items-end justify-center"
            style={{ height }}
          >
            <div
              className="w-full max-w-14 rounded-t-md"
              style={{
                height: `${Math.max(6, Math.round((datum.value / max) * height))}px`,
                backgroundColor: SERIES_COLORS[index % SERIES_COLORS.length],
              }}
            />
          </div>
          <span
            title={datum.label}
            className="w-full truncate text-center text-[11px] text-muted-foreground"
          >
            {datum.label}
          </span>
        </div>
      ))}
    </div>
  )
}
