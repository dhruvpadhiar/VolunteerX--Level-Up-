import * as React from "react"

const Card_v2 = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
))
Card_v2.displayName = "Card_v2"

const CardHeader_v2 = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
))
CardHeader_v2.displayName = "CardHeader_v2"

const CardTitle_v2 = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
))
CardTitle_v2.displayName = "CardTitle_v2"

const CardDescription_v2 = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props} />
))
CardDescription_v2.displayName = "CardDescription_v2"

const CardContent_v2 = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
))
CardContent_v2.displayName = "CardContent_v2"

const CardFooter_v2 = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props} />
))
CardFooter_v2.displayName = "CardFooter_v2"

export { Card_v2, CardHeader_v2, CardFooter_v2, CardTitle_v2, CardDescription_v2, CardContent_v2 }

