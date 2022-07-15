import type { SeatingAvailability } from './southeastern'
import type { LocationDetail, LocationLineUpLocation } from './real-time-trains'

export interface Trains {
  availability: Availability
  origin: LocationLineUpLocation
  destination: LocationLineUpLocation
}

export type Availability = TrainService[]

export interface Time {
  booked?: string | null
  realTime?: string | null
}

export interface Seating extends SeatingAvailability {
  isMaxLoading: boolean
}

export interface TrainService {
  tsid: string
  uid?: string | null
  runDate?: string | null
  maxLoadingLevel?: number | null
  seating: Seating[]
  departureTime: Time
  arrivalTime: Time
  departurePlatform?: LocationDetail['platform'] | null
}
