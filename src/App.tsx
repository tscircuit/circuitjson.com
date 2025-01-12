import { useCallback } from "react"
import { useStore } from "./store"
import { CircuitJsonPreview } from "@tscircuit/runframe"

export const App = () => {
  const circuitJson = useStore((s) => s.circuitJson)
  const setCircuitJson = useStore((s) => s.setCircuitJson)
  const reset = useStore((s) => s.reset)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      // biome-ignore lint/complexity/noForEach: <explanation>
      Array.from(e.dataTransfer.files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string)
            setCircuitJson(json)
          } catch (err) {
            console.error("Failed to parse JSON:", err)
          }
        }
        reader.readAsText(file)
      })
    },
    [setCircuitJson],
  )

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {!circuitJson ? (
        <div className="flex flex-col text-center">
          <h1 className="text-3xl font-bold mb-8">Circuit JSON Viewer</h1>
          <div className="border-2 border-dashed border-gray-500 rounded-lg p-12">
            <p className="text-gray-400">
              Drag and drop a circuit JSON file here
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Circuit JSON Viewer</h1>
            <button
              onClick={reset}
              className="bg-gray-700 px-4 py-2 rounded-md"
              type="button"
            >
              Reset
            </button>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-md">
            <CircuitJsonPreview circuitJson={circuitJson} />
          </div>
        </div>
      )}
    </div>
  )
}
