import { Receipt } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { cardClass } from "@/components/ui/card"
import { getAdminTransactions, type Transaction } from "@/lib/api/admin"
import { cn } from "@/lib/utils"

const formatDate = (value?: string) => {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default async function AdminTransactionsPage() {
  let transactions: Transaction[] | null = null
  try {
    transactions = await getAdminTransactions()
  } catch {
    transactions = null
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transactions"
        description="Read-only history of vendor subscription payments."
      />

      {transactions === null ? (
        <ErrorState
          title="Couldn't load transactions"
          description="We couldn't fetch the transaction history. Please refresh and try again."
        />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Premium subscription payments will appear here once vendors upgrade."
        />
      ) : (
        <div className={cn(cardClass, "overflow-x-auto")}>
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Vendor</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-4 py-3">
                    <span className="block font-medium text-foreground">
                      {transaction.vendorName ?? "Vendor"}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {transaction.vendorEmail ?? transaction.vendorId ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {transaction.plan ?? "premium"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {typeof transaction.amount === "number"
                      ? `${(transaction.currency ?? "usd").toUpperCase()} ${(
                          transaction.amount / 100
                        ).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{transaction.status ?? "—"}</td>
                  <td className="px-4 py-3">{formatDate(transaction.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Payment records are read-only — admins cannot edit them.
      </p>
    </div>
  )
}
