// The route the trucker confirmed in "Find loads", and how far along the trip is. Kept above every trucker screen
// so Home can show it under "Coming up" and the trip guide resumes where the trucker left it.
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { LoadRoute } from './data/sample'

export type Trip = {
  route: LoadRoute
  status: 'booked' | 'driving' | 'done'
  /** Which stop the truck is heading to: 0 .. stops.length - 1 are farms, stops.length is the drop-off */
  stop: number
  /** toStop: not there yet; near: drove there, waiting for "Arrived"; arrived: at the stop, confirming */
  phase: 'toStop' | 'near' | 'arrived'
  /** Kilos actually picked up at each farm */
  pickedKg: number[]
}

type Ctx = {
  chosen?: LoadRoute
  setChosen: (route?: LoadRoute) => void
  trip?: Trip
  updateTrip: (patch: Partial<Trip>) => void
}
const ChosenContext = createContext<Ctx>({ setChosen: () => {}, updateTrip: () => {} })

export function ChosenProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<Trip>()
  const setChosen = (route?: LoadRoute) =>
    setTrip(route ? { route, status: 'booked', stop: 0, phase: 'toStop', pickedKg: [] } : undefined)
  const updateTrip = (patch: Partial<Trip>) => setTrip((now) => (now ? { ...now, ...patch } : now))
  return (
    <ChosenContext.Provider value={{ chosen: trip?.route, setChosen, trip, updateTrip }}>{children}</ChosenContext.Provider>
  )
}

export const useChosen = () => useContext(ChosenContext)
