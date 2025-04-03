// 'use client'

// /*
// TODO: 作为SIdeBar的外层抽象，存放所有的 edges 和 nodes
// MARK: - SIdeBar的外壳
// */

// import { useNodeConnections } from '@/app/provider/connections-provider'
// import { usePathname } from 'next/navigation'
// import React, { useCallback, useState } from 'react'
// import { useToast } from '@/components/ui/use-toast'
// import { onCreateNodesEdges, onFlowPublish } from '../_actions/workflow-connections'


// type Props = {
//   children:React.ReactNode
//   edges:any[]
//   nodes:any[]
// }

// const FlowInstance = ({ children,edges,nodes }: Props) => {
//   const { toast } = useToast()
//   const pathname = usePathname()
//   const [isFlow,setIsFlow] = useState([])
//   const { nodeConnection } = useNodeConnections();

//   const onFlowAutomation = useCallback(async () => {
//     const flow = await onCreateNodesEdges(
//       pathname.split('/').pop()!,
//       JSON.stringify(nodes),
//       JSON.stringify(edges),
//       JSON.stringify(isFlow)
//     )

//     if (flow) toast({title:flow.message})
//   }, [nodeConnection])

//   const onPublishWorkflow = useCallback(async () => {
//     const response = await onFlowPublish(pathname.split('/').pop()!, true)
//     if (response) toast({ title:response })
//   }, [])

//   return <>{children}</>
// }

// export default FlowInstance