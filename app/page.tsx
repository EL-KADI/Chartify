"use client"

import { useState, useEffect } from "react"
import { BarChart3, Upload, Download, Palette } from "lucide-react"
import ChartBuilder from "@/components/chart-builder"
import Favorites from "@/components/favorites"
import Navigation from "@/components/navigation"

export default function Home() {
  const [activeTab, setActiveTab] = useState("create")
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("chartify-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const addToFavorites = (chart: any) => {
    const newFavorites = [...favorites, { ...chart, id: Date.now() }]
    setFavorites(newFavorites)
    localStorage.setItem("chartify-favorites", JSON.stringify(newFavorites))
  }

  const removeFromFavorites = (id: number) => {
    const newFavorites = favorites.filter((fav: any) => fav.id !== id)
    setFavorites(newFavorites)
    localStorage.setItem("chartify-favorites", JSON.stringify(newFavorites))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        {activeTab === "create" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Interactive Charts</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Transform your data into beautiful, interactive visualizations with our powerful chart builder
              </p>
            </div>
            <ChartBuilder onAddToFavorites={addToFavorites} />
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Favorite Charts</h1>
              <p className="text-lg text-gray-600">Access and manage your saved visualizations</p>
            </div>
            <Favorites
              favorites={favorites}
              onRemove={removeFromFavorites}
              onEdit={(chart) => {
                setActiveTab("create")
              }}
            />
          </div>
        )}

        {activeTab === "help" && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Help & Tutorial</h1>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <BarChart3 className="mr-2 text-blue-600" />
                  Getting Started
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Enter your data in the input form</li>
                  <li>• Choose from various chart types</li>
                  <li>• Customize colors and styles</li>
                  <li>• Export or save to favorites</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Upload className="mr-2 text-green-600" />
                  Import Data
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Upload CSV files for quick data entry</li>
                  <li>• Supported format: Label,Value</li>
                  <li>• Data is validated automatically</li>
                  <li>• Edit imported data before charting</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Palette className="mr-2 text-purple-600" />
                  Customization
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Choose from preset color themes</li>
                  <li>• Adjust chart dimensions</li>
                  <li>• Modify fonts and styles</li>
                  <li>• Real-time preview updates</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Download className="mr-2 text-red-600" />
                  Export Options
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li>• Save as PNG image</li>
                  <li>• Export as JSON for later editing</li>
                  <li>• Add to favorites for quick access</li>
                  <li>• Share with generated URLs</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
