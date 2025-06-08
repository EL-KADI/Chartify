"use client"

import { useEffect } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error"
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`flex items-center p-4 rounded-lg shadow-lg max-w-sm ${
          type === "success"
            ? "bg-green-100 border border-green-200 text-green-800"
            : "bg-red-100 border border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 mr-3 flex-shrink-0" />
        )}

        <p className="text-sm font-medium flex-1">{message}</p>

        <button onClick={onClose} className="ml-3 p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
