"use client"

import { useState } from "react"
import { X, Palette } from "lucide-react"

interface CustomizationPanelProps {
  colors: string[]
  onColorsChange: (colors: string[]) => void
  onClose: () => void
}

export default function CustomizationPanel({ colors, onColorsChange, onClose }: CustomizationPanelProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)

  const colorThemes = [
    { name: "Default", colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"] },
    { name: "Ocean", colors: ["#0EA5E9", "#06B6D4", "#14B8A6", "#10B981"] },
    { name: "Sunset", colors: ["#F97316", "#EF4444", "#EC4899", "#8B5CF6"] },
    { name: "Forest", colors: ["#22C55E", "#16A34A", "#15803D", "#166534"] },
    { name: "Purple", colors: ["#8B5CF6", "#A855F7", "#C084FC", "#DDD6FE"] },
    { name: "Warm", colors: ["#F59E0B", "#F97316", "#EF4444", "#EC4899"] },
  ]

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors]
    newColors[index] = color
    onColorsChange(newColors)
  }

  const applyTheme = (themeColors: string[]) => {
    onColorsChange(themeColors)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Palette className="h-5 w-5 mr-2 text-purple-600" />
          Customize Appearance
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-3">Color Themes</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {colorThemes.map((theme, index) => (
              <button
                key={index}
                onClick={() => applyTheme(theme.colors)}
                className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="text-sm font-medium mb-2">{theme.name}</div>
                <div className="flex space-x-1">
                  {theme.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3">Custom Colors</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.map((color, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Color {index + 1}</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
