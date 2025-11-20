import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          {
            'bg-primary text-primary-foreground shadow-neumorphic hover:bg-primary/90 px-6 py-3': variant === 'default',
            'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-6 py-3': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground px-4 py-2': variant === 'ghost',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
