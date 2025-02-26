export type SimplifiedPcbTrace = {
    type: "pcb_trace"
    pcb_trace_id: string
    route: Array<
      | {
          route_type: "wire"
          x: number
          y: number
          width: number
          layer: "top" | "bottom" | "inner1" | "inner2" | "inner3" | "inner4" | "inner5" | "inner6"
        }
      | {
          route_type: "via"
          x: number
          y: number
          to_layer: "top" | "bottom" | "inner1" | "inner2" | "inner3" | "inner4" | "inner5" | "inner6"
          from_layer: "top" | "bottom" | "inner1" | "inner2" | "inner3" | "inner4" | "inner5" | "inner6"
        }
    >
  }
  
  export type Obstacle = {
    type: "rect"
    layers: ("top" | "bottom" | "inner1" | "inner2" | "inner3" | "inner4" | "inner5" | "inner6")[]
    center: { x: number; y: number }
    width: number
    height: number
    connectedTo: string[]
  }
  
  export interface SimpleRouteConnection {
    name: string
    pointsToConnect: Array<{ x: number; y: number; layer: "top" | "bottom" | "inner1" | "inner2" | "inner3" | "inner4" | "inner5" | "inner6" }>
  }
  
  export interface SimpleRouteJson {
    layerCount: number
    minTraceWidth: number
    obstacles: Obstacle[]
    connections: Array<SimpleRouteConnection>
    bounds: { minX: number; maxX: number; minY: number; maxY: number }
    traces?: SimplifiedPcbTrace[]
  }