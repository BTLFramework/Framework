"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const AssessmentDialog = DialogPrimitive.Root

const AssessmentDialogTrigger = DialogPrimitive.Trigger

const AssessmentDialogPortal = DialogPrimitive.Portal

const AssessmentDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
AssessmentDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const AssessmentDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AssessmentDialogPortal>
    <AssessmentDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 p-2 rounded-full text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/60">
        <X className="w-6 h-6" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </AssessmentDialogPortal>
))
AssessmentDialogContent.displayName = DialogPrimitive.Content.displayName

const AssessmentDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "bg-gradient-to-r from-btl-600 to-btl-700 text-white p-6 rounded-t-2xl",
      className
    )}
    {...props}
  />
)
AssessmentDialogHeader.displayName = "AssessmentDialogHeader"

const AssessmentDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
AssessmentDialogTitle.displayName = DialogPrimitive.Title.displayName

const AssessmentDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-btl-100 mt-2", className)}
    {...props}
  />
))
AssessmentDialogDescription.displayName = DialogPrimitive.Description.displayName

interface AssessmentDialogProgressProps {
  step: number
  totalSteps: number
}

const AssessmentDialogProgress = ({ step, totalSteps }: AssessmentDialogProgressProps) => (
  <div className="mt-4">
    <div className="flex items-center justify-between text-sm text-btl-100 mb-2">
      <span>Progress</span>
      <span>{step} of {totalSteps} completed</span>
    </div>
    <div className="h-2 bg-btl-500/20 rounded-full overflow-hidden">
      <div
        className="h-full bg-btl-100 transition-all duration-300 ease-in-out"
        style={{ width: `${(step / totalSteps) * 100}%` }}
      />
    </div>
  </div>
)

const AssessmentDialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("p-6 overflow-y-auto max-h-[calc(90vh-200px)]", className)}
    {...props}
  />
)

const AssessmentDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end space-x-2 p-6 border-t border-gray-100", className)}
    {...props}
  />
)

export {
  AssessmentDialog,
  AssessmentDialogTrigger,
  AssessmentDialogContent,
  AssessmentDialogHeader,
  AssessmentDialogTitle,
  AssessmentDialogDescription,
  AssessmentDialogProgress,
  AssessmentDialogBody,
  AssessmentDialogFooter,
} 