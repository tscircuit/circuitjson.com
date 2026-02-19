declare module "https://cdn.jsdelivr.net/npm/@tscircuit/runframe/+esm" {
  import type { ComponentType } from "react"
  import type { AnyCircuitElement } from "circuit-json"

  export const CircuitJsonPreview: ComponentType<{
    circuitJson: AnyCircuitElement[]
  }>
}
