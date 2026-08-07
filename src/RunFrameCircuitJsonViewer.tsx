export const RUNFRAME_STANDALONE_PREVIEW_URL =
  "https://unpkg.com/@tscircuit/runframe@latest/dist/standalone-preview.min.js"

const serializeCircuitJsonForInlineScript = (circuitJson: unknown) =>
  // Circuit JSON is user-provided, so prevent it from closing the script tag.
  JSON.stringify(circuitJson).replaceAll("<", "\\u003c")

export const createRunFrameSrcDoc = (circuitJson: unknown) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Circuit JSON viewer</title>
    <style>
      html, body, #root { width: 100%; height: 100%; margin: 0; }
      * { box-sizing: border-box; }
      .loading {
        align-items: center;
        color: #64748b;
        display: flex;
        font: 14px system-ui, sans-serif;
        height: 100%;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <div id="root"><div class="loading">Loading latest viewers…</div></div>
    <script>
      window.CIRCUIT_JSON = ${serializeCircuitJsonForInlineScript(circuitJson)};
      window.CIRCUIT_JSON_PREVIEW_PROPS = {
        defaultActiveTab: "pcb",
        showRightHeaderContent: true
      };
    </script>
    <script
      src="${RUNFRAME_STANDALONE_PREVIEW_URL}"
      crossorigin="anonymous"
      onerror="document.getElementById('root').textContent='Unable to load the latest viewers.'"
    ></script>
  </body>
</html>`

export const RunFrameCircuitJsonViewer = ({
  circuitJson,
}: {
  circuitJson: unknown
}) => (
  <iframe
    srcDoc={createRunFrameSrcDoc(circuitJson)}
    title="Circuit JSON viewer"
    className="w-full h-full border-0"
    allowFullScreen
    sandbox="allow-downloads allow-same-origin allow-scripts"
    referrerPolicy="strict-origin-when-cross-origin"
  />
)
