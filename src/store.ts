import { create } from 'zustand'

interface Store {
  circuitJson: any | null
  setCircuitJson: (json: any) => void
  reset: () => void
}

export const useStore = create<Store>((set) => ({
  circuitJson: null,
  setCircuitJson: (json) => set({ circuitJson: json }),
  reset: () => set({ circuitJson: null })
}))
