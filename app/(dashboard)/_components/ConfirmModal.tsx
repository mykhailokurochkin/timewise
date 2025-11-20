'use client'

import { FiAlertTriangle } from 'react-icons/fi'

type ConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isDanger?: boolean
  isLoading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{description}</p>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDanger ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} disabled:opacity-50`}
            >
              {isLoading ? 'Deleting...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
