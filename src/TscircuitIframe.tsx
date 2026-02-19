import { useEffect, useRef, useState } from "react"

export interface TscircuitIframeProps {
  fsMap?: Record<string, string>
  entrypoint?: string
  code?: string
  circuitJson?: unknown
}

export const TscircuitIframe = (runFrameProps: TscircuitIframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  let additionalProps: Record<string, unknown> = { isWebEmbedded: true }

  if (runFrameProps.code) {
    additionalProps = {
      ...additionalProps,
      fsMap: {
        "index.tsx": runFrameProps.code,
      },
    }
  }

  if (runFrameProps.fsMap) {
    additionalProps = {
      ...additionalProps,
      fsMap: runFrameProps.fsMap,
      entrypoint: runFrameProps.entrypoint,
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.runframe_type === "runframe_ready_to_receive") {
        iframeRef.current?.contentWindow?.postMessage(
          {
            runframe_type: "runframe_props_changed",
            runframe_props: { ...runFrameProps, ...additionalProps },
          },
          "*",
        )
        setIsLoading(false)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [runFrameProps, additionalProps])

  return (
    <div className="h-full">
      {isLoading && (
        <div className="h-full animate-pulse rounded-md border border-gray-700 bg-gray-900/70 p-4">
          <div className="mb-3 h-8 rounded bg-gray-700/70" />
          <div className="h-[calc(100%-2.75rem)] rounded bg-gray-700/40" />
        </div>
      )}

      <iframe
        ref={iframeRef}
        src="https://runframe.tscircuit.com/iframe.html"
        title="tscircuit code runner and preview"
        frameBorder="0"
        scrolling="no"
        className="h-full w-full"
        style={{
          opacity: isLoading ? 0 : 1,
        }}
      />
    </div>
  )
}

export default TscircuitIframe
