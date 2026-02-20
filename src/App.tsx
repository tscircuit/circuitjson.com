import { useCallback, useRef, useState } from "react"
import { useStore } from "./store"
import { CircuitJsonPreview } from "@tscircuit/runframe"
import type { AnyCircuitElement } from "circuit-json"
import type { SimpleRouteJson } from "tscircuit"
import { ErrorBoundary } from "react-error-boundary"

export const App = () => {
  const circuitJson = useStore((s) => s.circuitJson)
  const setCircuitJson = useStore((s) => s.setCircuitJson)
  const reset = useStore((s) => s.reset)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const convertSimpleRouteJsonToCircuitJson = (
    simpleRouteJson: SimpleRouteJson,
  ): AnyCircuitElement[] => {
    const circuitJson: AnyCircuitElement[] = []

    for (const connection of simpleRouteJson.connections) {
      const trace: AnyCircuitElement = {
        type: "pcb_trace",
        pcb_trace_id: connection.name,
        route: connection.pointsToConnect.map((point) => ({
          route_type: "wire",
          x: point.x,
          y: point.y,
          layer: point.layer as
            | "top"
            | "bottom"
            | "inner1"
            | "inner2"
            | "inner3"
            | "inner4"
            | "inner5"
            | "inner6",
          width: simpleRouteJson.minTraceWidth,
        })),
      }
      circuitJson.push(trace)
    }

    return circuitJson
  }

  const loadJsonString = useCallback(
    (jsonString: string) => {
      try {
        const json = JSON.parse(jsonString)
        if (json.connections && json.minTraceWidth !== undefined) {
          const circuitJson = convertSimpleRouteJsonToCircuitJson(json)
          setCircuitJson(circuitJson)
        } else {
          setCircuitJson(json)
        }
        setErrorMsg(null)
      } catch (err) {
        console.error("Failed to parse JSON:", err)
        setErrorMsg(
          "Invalid JSON format. Please check your syntax and try again.",
        )
      }
    },
    [setCircuitJson],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      // biome-ignore lint/complexity/noForEach: <explanation>
      Array.from(e.dataTransfer.files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (typeof e.target?.result === "string") {
            loadJsonString(e.target.result)
          }
        }
        reader.readAsText(file)
      })
    },
    [loadJsonString],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          loadJsonString(e.target.result)
        }
      }
      reader.readAsText(file)
    },
    [loadJsonString],
  )

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {!circuitJson ? (
        <div className="flex flex-col text-center max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-8">Circuit JSON Viewer</h1>
          <div className="border-2 border-dashed border-gray-500 rounded-lg p-12 mb-8 transition-colors hover:border-gray-400">
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
              <span className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-blue-500 transition-colors">
                Choose File
              </span>
            </label>
          </div>

          <div className="text-left bg-gray-800/80 p-6 rounded-lg border border-gray-700 shadow-xl">
            <label
              htmlFor="raw-json-input"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Or paste raw Circuit JSON
            </label>
            <textarea
              id="raw-json-input"
              ref={textareaRef}
              className="w-full h-40 bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-100 placeholder-gray-500 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-blue-500 font-mono text-sm mb-3 resize-y"
              placeholder='[{"type": "source_port", ...}]'
              spellCheck={false}
            />
            {errorMsg && (
              <p className="text-red-400 text-sm mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errorMsg}
              </p>
            )}
            <button
              onClick={() => {
                const val = textareaRef.current?.value
                if (val) loadJsonString(val)
              }}
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-4 py-2 rounded-md focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-blue-400 transition-colors w-full sm:w-auto font-medium"
              type="button"
            >
              Load JSON
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Circuit JSON Viewer</h1>
            <button
              onClick={reset}
              className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-blue-500 transition-colors font-medium"
              type="button"
            >
              Reset
            </button>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-md flex-1 min-h-0">
            <ErrorBoundary
              fallbackRender={({ error, resetErrorBoundary }) => (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-lg w-full">
                    <h3 className="text-xl font-bold text-red-400 mb-2">
                      Error Rendering Circuit
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      The provided Circuit JSON could not be rendered.
                    </p>
                    <div className="bg-gray-950 p-4 rounded text-left overflow-auto mb-4 border border-red-900/30 text-red-300 font-mono text-xs max-h-40 break-words whitespace-pre-wrap">
                      {error.message}
                    </div>
                    <button
                      onClick={() => {
                        resetErrorBoundary()
                        reset()
                      }}
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 px-4 py-2 rounded-md focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-red-400 transition-colors font-medium w-full sm:w-auto"
                      type="button"
                    >
                      Reset Viewer
                    </button>
                  </div>
                </div>
              )}
            >
              <CircuitJsonPreview circuitJson={circuitJson} />
            </ErrorBoundary>
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
          href="https://github.com/tscircuit/circuitjson.com"
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
