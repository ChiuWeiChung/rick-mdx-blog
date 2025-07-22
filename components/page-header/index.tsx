import React from 'react'

interface PageHeaderProps { 
  children: React.ReactNode;
}

const PageHeader = ({ children }: PageHeaderProps) => {
  return <h1 className="border-b-2 border-neutral-200 pb-2 text-3xl font-bold">{children}</h1>;
}

export default PageHeader