import React from 'react';
import Content from '../../../_components/content';

const Logs = () => {


  return (
    <Content title="Logs">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b dark:text-gray-200">
        <span>Logs</span>
      </h1>
      <div>Logs Content</div>
    </Content>
  );
};

export default Logs;