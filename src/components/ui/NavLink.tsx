"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps } from "react"

export function NavLink({ className, ...props }: ComponentProps<typeof Link>) {
  const path = usePathname() /* checking current path */
  const isActive = path === props.href /* if path is equal to url passed in, then set as active */

  return (
    <Link
      {...props}
      className={cn(
        "transition-colors", /* animation */
        isActive /* slightly changing styling */
          ? "text-foreground" /* active link */
          : "text-muted-foreground hover:text-foreground", /* inactive link, active with hover */
        className
      )}
    />
  )
}