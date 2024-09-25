import { ComponentProps } from "react"
import { Badge } from "@/components/ui/badge"
import { Mail } from "../../../../lib/data"

interface MailListProps {
  items: Mail[]
}

export function MailList({ items }: MailListProps) {
  return (
    <></>
  )
}

// MARK: 高亮EmailLabel
export function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}
