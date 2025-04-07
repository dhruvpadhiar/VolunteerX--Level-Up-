"use client"

import * as React from "react"

const ToastContext_v2 = React.createContext({})

function ToastProvider_v2({ children }) {
  const [toasts, setToasts] = React.useState([])

  return <ToastContext_v2.Provider value={{ toasts, setToasts }}>{children}</ToastContext_v2.Provider>
}

function useToast_v2() {
  const context = React.useContext(ToastContext_v2)

  if (!context) {
    throw new Error("useToast_v2 must be used within a ToastProvider_v2")
  }

  const { toasts, setToasts } = context

  const toast = React.useCallback(
    ({ title, description, variant = "default" }) => {
      const id = Math.random().toString(36).substring(2, 9)

      setToasts((prev) => [...prev, { id, title, description, variant }])

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 5000)
    },
    [setToasts],
  )

  return { toast }
}

function Toaster_v2() {
  const { toasts } = React.useContext(ToastContext_v2)

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-4 shadow-md transition-all animate-in slide-in-from-right-full ${
            toast.variant === "destructive" ? "bg-destructive text-white" : "bg-white"
          }`}
        >
          {toast.title && <div className="font-medium">{toast.title}</div>}
          {toast.description && <div className="text-sm">{toast.description}</div>}
        </div>
      ))}
    </div>
  )
}

export { useToast_v2, ToastProvider_v2, Toaster_v2 }

