"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import saveAs from "file-saver"
import { Chart } from "chart.js/auto"

interface ChartRendererProps {
  type: "bar" | "line" | "pie" | "doughnut"
  data: any
  options?: any
  width?: number
  height?: number
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data, options, width = 400, height = 400 }) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    const chartCanvas = chartRef.current

    if (!chartCanvas) {
      return
    }

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    chartInstance.current = new Chart(chartCanvas, {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options,
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [type, data, options])

  const downloadChart = () => {
    const chartCanvas = chartRef.current
    if (!chartCanvas) return

    chartCanvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, "chart.png")
      }
    })
  }

  return (
    <div>
      <canvas ref={chartRef} width={width} height={height} />
      <button onClick={downloadChart}>Download Chart</button>
    </div>
  )
}

export default ChartRenderer
