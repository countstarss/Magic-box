
// 'use client'
// import { useNodeConnections } from '@/app/provider/connections-provider'
// import { useEditor } from '@/app/provider/editor-provider'
// import { EditorCanvasTypes, EditorNodeType } from '@/lib/types'
// import { useConnection } from '@xyflow/react'
// /*
// TODO: SiderBar
// MARK: - SiderBar
// */

// import React from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { EditorCanvasDefaultCardTypes } from '@/lib/data/constant'
// import EditorCanvasIconHelper from './editor-canvas-icon-helper'
// import { onDragStart } from '@/lib/editor-utils'



// type Props = {
//   nodes:EditorNodeType[]
// }

// const EditorCanvasSidebar = ({ nodes }: Props) => {
//   // FIXME: Connect DB stuff


//   const { state } = useEditor();
//   const { nodeConnection } = useNodeConnections();
 
//   return <aside>
//     <Tabs defaultValue="account" className="w-full overflow-scroll">
//       <TabsList className="grid w-full grid-cols-2" defaultValue="actions">
//         <TabsTrigger value="actions" defaultChecked={true}>Actions</TabsTrigger>
//         <TabsTrigger value="settings">Settings</TabsTrigger>
//       </TabsList>
//       <TabsContent value="actions"
//         className='overflow-scroll flex flex-col gap-4 p-4'
//       >
//         {/* 
//         //TODO: 渲染Editor界面的所有可选的"Card"
//         //MARK: LEFT
//          */}
//         {Object.entries(EditorCanvasDefaultCardTypes)
//             .filter(
//               ([_, cardType]) =>
//                 (!nodes.length && cardType.type === 'Trigger') ||
//                 (nodes.length && cardType.type === 'Action')
//             )
//             .map(([cardKey, cardValue]) => (
//               <Card
//                 key={cardKey}
//                 draggable
//                 className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
//                 onDragStart={(event) =>
//                   onDragStart(event, cardKey as EditorCanvasTypes)
//                 }
//               >
//                 <CardHeader className="flex flex-row items-center gap-4 p-4">
//                   <EditorCanvasIconHelper type={cardKey as EditorCanvasTypes} />
//                   <CardTitle className="text-md">
//                     {cardKey}
//                     <CardDescription>{cardValue.description}</CardDescription>
//                   </CardTitle>
//                 </CardHeader>
//               </Card>
//             ))}
//       </TabsContent>
//       <TabsContent value="settings"
//         className='flex flex-col gap-4 p-4'
//       >
//         {/* 
//         //MARK: RIGHT
//          */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Password</CardTitle>
//             <CardDescription>
//               Change your password here. After saving, you'll be logged out.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div className="space-y-1">
//               <Label htmlFor="current">Current password</Label>
//               <Input id="current" type="password" />
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="new">New password</Label>
//               <Input id="new" type="password" />
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button>Save password</Button>
//           </CardFooter>
//         </Card>
//       </TabsContent>
//     </Tabs>
//   </aside>
// }

// export default EditorCanvasSidebar;