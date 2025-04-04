import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./button"

const Pagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex w-full justify-end", className)} {...props} />
))
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-wrap items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & React.ComponentProps<typeof Button>

const PaginationLink = ({
  className,
  isActive,
  disabled,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    disabled={disabled}
    variant={isActive ? "outline" : "ghost"}
    size={size}
    className={cn(
      "min-w-8 h-8",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only sm:not-sr-only sm:hidden">Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1", className)}
    {...props}
  >
    <span className="sr-only sm:not-sr-only sm:hidden">Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    ...
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
