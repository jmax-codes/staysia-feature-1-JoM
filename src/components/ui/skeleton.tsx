import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200",
        className
      )}
      style={{
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite linear"
      }}
      {...props}
    />
  )
}

export { Skeleton }