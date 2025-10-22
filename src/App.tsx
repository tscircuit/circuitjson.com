import { useCallback } from "react"
import { useStore } from "./store"
import { CircuitJsonPreview } from "@tscircuit/runframe"
import type { AnyCircuitElement } from "circuit-json"
import type { SimpleRouteJson } from "tscircuit"

export const App = () => {
  const circuitJson = useStore((s) => s.circuitJson)
  const setCircuitJson = useStore((s) => s.setCircuitJson)
  const reset = useStore((s) => s.reset)

  const convertSimpleRouteJsonToCircuitJson = (simpleRouteJson: SimpleRouteJson): AnyCircuitElement[] => {
    const circuitJson: AnyCircuitElement[] = []

    for (const connection of simpleRouteJson.connections) {
      const trace: AnyCircuitElement = {
        type: "pcb_trace",
        pcb_trace_id: connection.name,
        route: connection.pointsToConnect.map(point => ({
          route_type: "wire",
          x: point.x,
          y: point.y,
          layer: point.layer as "top" | "bottom" | "inner1" | "inner2" | "inner3" | "inner4" | "inner5" | "inner6",
          width: simpleRouteJson.minTraceWidth,
        })),
      }
      circuitJson.push(trace)
    }

    return circuitJson
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      // biome-ignore lint/complexity/noForEach: <explanation>
      Array.from(e.dataTransfer.files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string)
            if (json.connections && json.minTraceWidth !== undefined) {
              const circuitJson = convertSimpleRouteJsonToCircuitJson(json)
              setCircuitJson(circuitJson)
            } else {
              setCircuitJson(json)
            }
          } catch (err) {
            console.error("Failed to parse JSON:", err)
          }
        }
        reader.readAsText(file)
      })
    },
    [setCircuitJson],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          if (json.connections && json.minTraceWidth !== undefined) {
            const circuitJson = convertSimpleRouteJsonToCircuitJson(json)
            setCircuitJson(circuitJson)
          } else {
            setCircuitJson(json)
          }
        } catch (err) {
          console.error("Failed to parse JSON:", err)
        }
      }
      reader.readAsText(file)
    },
    [setCircuitJson],
  )

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {!circuitJson ? (
        <div className="flex flex-col text-center">
          <h1 className="text-3xl font-bold mb-8">Circuit JSON Viewer</h1>
          <div className="border-2 border-dashed border-gray-500 rounded-lg p-12">
            <p className="text-gray-400 mb-4">
              Drag and drop a circuit JSON file here
            </p>
            <p className="text-gray-400">or</p>
            <label className="mt-4 cursor-pointer inline-block">
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                Choose File
              </span>
            </label>
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
      <p className="text-gray-400 mt-4">
        View{" "}
        <a
          href="https://github.com/tscircuit/circuitjson.com/blob/main/assets/usb-c-flashlight.json"
          className="text-blue-400 hover:text-blue-300"
        >
          example circuit json file
        </a>
      </p>
      <div className="fixed bottom-4 left-0 right-0 text-center text-gray-400 text-sm">
        <p>
          Circuit JSON Viewer by{" "}
          <a
            href="https://github.com/tscircuit/tscircuit"
            className="text-blue-400 hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            tscircuit
          </a>
          , get the{" "}
          <a
            href="https://github.com/tscircuit/circuit-json"
            className="text-blue-400 hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            source code here
          </a>
        </p>
        <a
          href="https://github.com/tscircuit/circuit-json"
          className="inline-block mt-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://img.shields.io/github/stars/tscircuit/circuit-json?style=social"
            alt="GitHub stars"
          />
        </a>
      </div>
    </div>
  )
}
