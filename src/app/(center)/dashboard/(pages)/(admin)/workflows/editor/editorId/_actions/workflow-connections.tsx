// 'use server'
// /*
// TODO: Actions
// MARK: - Actions
// */

// import { db } from '@/lib/db'

// // MARK: - onCreateNodesEdges
// export const onCreateNodesEdges = async (
//   flowId: string,
//   nodes: string,
//   edges: string,
//   flowPath: string
// ) => {
//   const flow = await db.workflows.update({
//     where: {
//       id: flowId,
//     },
//     data: {
//       nodes,
//       edges,
//       flowPath: flowPath,
//     },
//   })

//   if (flow) return { message: 'flow saved' }
// }

// // MARK: - onFlowPublish
// export const onFlowPublish = async (workflowId: string, state: boolean) => {
//   console.log(state)
//   const published = await db.workflows.update({
//     where: {
//       id: workflowId,
//     },
//     data: {
//       publish: state,
//     },
//   })

//   if (published.publish) return 'Workflow published'
//   return 'Workflow unpublished'
// }





// // MARK:onGetNodesEdges
// export const onGetNodesEdges = async (flowId: string) => {
//   const nodesEdges = await db.workflows.findUnique({
//     where: {
//       id: flowId,
//     },
//     select: {
//       nodes: true,
//       edges: true,
//     },
//   })
//   if (nodesEdges?.nodes && nodesEdges?.edges) return nodesEdges
// }