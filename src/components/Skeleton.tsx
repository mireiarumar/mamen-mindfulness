export function CardSkeleton() {
  return (
    <div className="card p-5">
      <div className="skeleton h-3 w-20 mb-3" />
      <div className="skeleton h-5 w-3/4 mb-2" />
      <div className="skeleton h-4 w-full mb-1" />
      <div className="skeleton h-4 w-5/6 mb-4" />
      <div className="skeleton h-9 w-24" />
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function LineSkeleton({ width = '100%' }: { width?: string }) {
  return <div className="skeleton h-4" style={{ width }} />
}
