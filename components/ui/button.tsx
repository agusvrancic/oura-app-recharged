import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "px-[16px] py-[14px] rounded-[14px] inline-flex items-center gap-1.5 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-black hover:bg-neutral-700 text-white text-[13px] font-normal font-['DM_Sans'] leading-none",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-600 text-[13px] font-normal font-['DM_Sans'] leading-none",
      },
      size: {
        default: "px-[16px] py-[14px]",
        sm: "px-3 py-2 text-[12px]",
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
