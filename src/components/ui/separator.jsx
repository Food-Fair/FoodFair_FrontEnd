import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * @typedef {Object} SeparatorProps
 * @property {"horizontal" | "vertical"} [orientation="horizontal"]
 * @property {boolean} [decorative=true]
 */

/**
 * @type {React.ForwardRefRenderFunction<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & SeparatorProps>}
 */
const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  )
})

Separator.displayName = "Separator"

export { Separator }

