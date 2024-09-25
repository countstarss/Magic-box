import * as React from "react"
import { cookies } from "next/headers"
import { mails } from "@/lib/data"
import MailScroll from "./components/MailScroll"

export default function MailPage() {
  const layout = cookies().get("react-resizable-panels:layout:mail")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined

  // INFO: 这里放的中间子路由的 Mail中间部分
  return (
    <>
      <MailScroll mails={mails} defaultLayout={defaultLayout}/>
    </>
  )
}
