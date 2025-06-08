"use client"

import { useState } from "react"
import { Star, Trash2, Edit, BarChart3, PieChart, TrendingUp } from "lucide-react"

interface FavoritesProps {
  favorites: any[]
  onRemove: (id: number) => void
  onEdit: (chart: any) => void
}

export default function Favorites({ favorites, onRemove, onEdit }: FavoritesProps) {
  const [showConfirm, setShowConfirm] = useState<number | null>(null)

  const getChartIcon = (type: string) => {
    switch (type) {
      case "pie":
      case "doughnut":
        return PieChart
      case "line":
        return TrendingUp
      default:
        return BarChart3
    }
  }

  const handleRemove = (id: number) => {
    onRemove(id)
    setShowConfirm(null)
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Favorite Charts</h3>
        <p className="text-gray-600">Create and save charts to see them here</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((chart) => {
        const ChartIcon = getChartIcon(chart.type)
        return (
          <div
            key={chart.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ChartIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{chart.title}</h3>
                </div>
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  Type: <span className="capitalize font-medium">{chart.type}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Data Points: <span className="font-medium">{chart.data.length}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Created: <span className="font-medium">{new Date(chart.timestamp).toLocaleDateString()}</span>
                </p>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Preview Data:</div>
                <div className="flex flex-wrap gap-1">
                  {chart.data.slice(0, 3).map((item: any, index: number) => (
                    <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-xs rounded">
                      {item.label}: {item.value}
                    </span>
                  ))}
                  {chart.data.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-xs rounded">
                      +{chart.data.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(chart)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>

                <button
                  onClick={() => setShowConfirm(chart.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {showConfirm === chart.id && (
              <div className="bg-red-50 border-t border-red-200 p-4">
                <p className="text-sm text-red-800 mb-3">Are you sure you want to remove this chart from favorites?</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRemove(chart.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setShowConfirm(null)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
