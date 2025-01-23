import * as React from "react"
import { cva } from "class-variance-authority"
import { PanelLeft } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SIDEBAR_WIDTH = "16rem"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

const SidebarProvider = React.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, children, ...props }, ref) => {
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback((value) => {
    const openState = typeof value === "function" ? value(open) : value
    if (setOpenProp) {
      setOpenProp(openState)
    } else {
      _setOpen(openState)
    }
  }, [setOpenProp, open])

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev)
  }, [setOpen])

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    toggleSidebar,
  }), [open, setOpen, toggleSidebar])

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cn("group/sidebar flex min-h-screen w-full", className)}
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
        }}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open } = useSidebar()

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center border-b px-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarTrigger = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
}

