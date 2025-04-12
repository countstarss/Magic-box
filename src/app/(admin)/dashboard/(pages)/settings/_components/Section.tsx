'use client';

import React, { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  setRef: (id: string) => (el: HTMLDivElement | null) => void;
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  icon, 
  children, 
  setRef 
}) => {
  return (
    <div
      id={id}
      ref={setRef(id)}
      className="mb-16"
    >
      <div className="flex items-center mb-6">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      {children}
    </div>
  );
};

export default Section; 