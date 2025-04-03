import React from 'react'
import Workflow from './workflow'


const Workfloes = () => {
  return (
    // md:flex flex-col
    <div className='relative grid gap-2'>
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-4'>
        <Workflow description='Createing a test workflow' name='Google' id="aswefwajyfh7834y4" publish={false}/>
        <Workflow description='Createing a test workflow2' name='Discord' id="aswefwajyfh783asd" publish={false}/>
        <Workflow description='Createing a test workflow3' name='Notion' id="aswefwajyfh7834bt" publish={true}/>
        <Workflow description='Createing a test workflow4' name='Clerk' id="aswefwacfe67834y4" publish={false}/>
      </section>
    </div>
  )
}

export default Workfloes;