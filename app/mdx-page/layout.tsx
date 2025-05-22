
export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 prose prose-lg dark:prose-invert">
      {children}
    </div>
  )
} 