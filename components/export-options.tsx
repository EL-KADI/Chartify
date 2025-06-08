"use client"

import type React from "react"
import saveAs from "file-saver"

interface ExportOptionsProps {
  data: any
  filename: string
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ data, filename }) => {
  const handleExportJson = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    saveAs(blob, `${filename}.json`)
  }

  return (
    <div>
      <button onClick={handleExportJson}>Export as JSON</button>
    </div>
  )
}

export default ExportOptions
