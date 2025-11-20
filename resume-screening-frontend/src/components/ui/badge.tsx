import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          'border-transparent bg-primary text-primary-foreground': variant === 'default',
          'border-transparent bg-accent text-accent-foreground': variant === 'success',
          'border-transparent bg-destructive text-destructive-foreground': variant === 'error',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
