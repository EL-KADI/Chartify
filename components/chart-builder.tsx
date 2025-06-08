"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2"
import { Upload, Download, Star, Palette, Plus, Trash2 } from "lucide-react"
import Papa from "papaparse"
import html2canvas from "html2canvas"
import saveAs from "file-saver"
import CustomizationPanel from "./customization-panel"
import Toast from "./toast"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

interface ChartBuilderProps {
  onAddToFavorites: (chart: any) => void
}

interface DataPoint {
  label: string
  value: number
}

export default function ChartBuilder({ onAddToFavorites }: ChartBuilderProps) {
  const [data, setData] = useState<DataPoint[]>([
    { label: "Q1", value: 500 },
    { label: "Q2", value: 700 },
    { label: "Q3", value: 600 },
    { label: "Q4", value: 800 },
  ])
  const [chartType, setChartType] = useState("bar")
  const [chartTitle, setChartTitle] = useState("Sales 2023")
  const [colors, setColors] = useState(["#3B82F6", "#10B981", "#F59E0B", "#EF4444"])
  const [showCustomization, setShowCustomization] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [errors, setErrors] = useState<{ [key: number]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const chartTypes = [
    { id: "bar", label: "Bar Chart", component: Bar },
    { id: "line", label: "Line Chart", component: Line },
    { id: "pie", label: "Pie Chart", component: Pie },
    { id: "doughnut", label: "Doughnut Chart", component: Doughnut },
  ]

  const validateValue = (value: string, index: number) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) {
      setErrors((prev) => ({ ...prev, [index]: "Please enter a valid number" }))
      return false
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[index]
        return newErrors
      })
      return true
    }
  }

  const updateDataPoint = (index: number, field: "label" | "value", value: string) => {
    if (field === "value" && !validateValue(value, index)) {
      return
    }

    setData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: field === "value" ? Number.parseFloat(value) || 0 : value } : item,
      ),
    )
  }

  const addDataPoint = () => {
    setData((prev) => [...prev, { label: `Item ${prev.length + 1}`, value: 0 }])
  }

  const removeDataPoint = (index: number) => {
    if (data.length > 1) {
      setData((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    Papa.parse(file, {
      header: false,
      complete: (results) => {
        try {
          const parsedData = results.data
            .filter((row: any) => row.length >= 2 && row[0] && row[1])
            .map((row: any) => ({
              label: row[0].toString(),
              value: Number.parseFloat(row[1]) || 0,
            }))

          if (parsedData.length > 0) {
            setData(parsedData)
            showToast("CSV file imported successfully!", "success")
          } else {
            showToast("No valid data found in CSV file", "error")
          }
        } catch (error) {
          showToast("Error parsing CSV file", "error")
        } finally {
          setIsLoading(false)
        }
      },
      error: () => {
        showToast("Error reading CSV file", "error")
        setIsLoading(false)
      },
    })
  }

  const exportAsPNG = async () => {
    if (!chartRef.current) return

    setIsLoading(true)
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${chartTitle.toLowerCase().replace(/\s+/g, "_")}.png`)
          showToast("Chart exported as PNG!", "success")
        }
        setIsLoading(false)
      })
    } catch (error) {
      showToast("Error exporting chart", "error")
      setIsLoading(false)
    }
  }

  const exportAsJSON = () => {
    const chartData = {
      title: chartTitle,
      type: chartType,
      data: data,
      colors: colors,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(chartData, null, 2)], { type: "application/json" })
    saveAs(blob, `${chartTitle.toLowerCase().replace(/\s+/g, "_")}.json`)
    showToast("Chart data exported as JSON!", "success")
  }

  const addToFavorites = () => {
    const chartData = {
      title: chartTitle,
      type: chartType,
      data: data,
      colors: colors,
      timestamp: new Date().toISOString(),
    }
    onAddToFavorites(chartData)
    showToast("Chart added to favorites!", "success")
  }

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: chartTitle,
        data: data.map((item) => item.value),
        backgroundColor: colors,
        borderColor: colors.map((color) => color),
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 18,
          weight: "bold" as const,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const,
    },
    scales:
      chartType === "bar" || chartType === "line"
        ? {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
          }
        : undefined,
  }

  const ChartComponent = chartTypes.find((type) => type.id === chartType)?.component || Bar

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3  gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Chart Configuration</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter chart title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {chartTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Import CSV Data</label>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? "Processing..." : "Upload CSV File"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Data Points</h2>
            <button
              onClick={addDataPoint}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateDataPoint(index, "label", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Label"
                />
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => updateDataPoint(index, "value", e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors[index] ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Value"
                />
                {data.length > 1 && (
                  <button
                    onClick={() => removeDataPoint(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Palette className="h-4 w-4 mr-2" />
              Customize Appearance
            </button>

            <button
              onClick={addToFavorites}
              className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              <Star className="h-4 w-4 mr-2" />
              Add to Favorites
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportAsPNG}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-1" />
                PNG
              </button>

              <button
                onClick={exportAsJSON}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-1" />
                JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div ref={chartRef} className="h-96">
            <ChartComponent data={chartData} options={chartOptions} />
          </div>
        </div>

        {showCustomization && (
          <div className="mt-6">
            <CustomizationPanel
              colors={colors}
              onColorsChange={setColors}
              onClose={() => setShowCustomization(false)}
            />
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
