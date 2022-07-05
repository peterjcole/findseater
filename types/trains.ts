import type { SeatingAvailability } from './southeastern'
import type { Location, LocationDetail, Service } from './real-time-trains'

export interface Trains {
  availability: Availability
  origin: Location
  destination: Location
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
  seating: Seating[]
  departureTime: Time
  arrivalTime: Time
  departurePlatform?: LocationDetail['platform']
  fullServiceDetails?: Service
}
