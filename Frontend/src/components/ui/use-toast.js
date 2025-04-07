"use client"

import { useContext } from "react"
import { ToastContext } from "./toast"

function useToast() {
  return useContext(ToastContext)
}

export { useToast }

