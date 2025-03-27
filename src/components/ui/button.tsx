
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-600 shadow-sm",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        leegality: "bg-primary-500 text-white hover:bg-primary-600 shadow-sm",
        "leegality-outline": "border border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50",
        "leegality-ghost": "text-primary-500 hover:bg-primary-50",
        "leegality-subtle": "bg-primary-50 text-primary-600 hover:bg-primary-100",
        "leegality-success": "bg-success-500 text-white hover:bg-success-600 shadow-sm",
        "leegality-warning": "bg-warning-500 text-white hover:bg-warning-600 shadow-sm",
        "leegality-error": "bg-error-500 text-white hover:bg-error-600 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
        "leegality-xs": "h-7 text-xs px-2.5 py-1 rounded",
        "leegality-sm": "h-9 text-sm px-3 py-1.5 rounded",
        "leegality-md": "h-10 text-sm px-4 py-2 rounded-md",
        "leegality-lg": "h-11 text-base px-5 py-2.5 rounded-md",
        "leegality-xl": "h-12 text-base px-6 py-3 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
