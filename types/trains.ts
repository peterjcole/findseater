import type { SeatingAvailability } from './southeastern'
import type { LocationDetail, LocationLineUpLocation } from './real-time-trains'

export interface Trains {
  services: Services
  origin: LocationLineUpLocation
  destination: LocationLineUpLocation
}

export type Services = TrainService[]

export interface Time {
  booked?: string | null
  realTime?: string | null
}

export type TrainLoading = {
  [index: string]: ServiceLoading
}

export interface ServiceLoading {
  maxLoadingLevel?: number | null
  seating?: Seating[]
}

export interface Seating extends SeatingAvailability {
  isMaxLoading: boolean
}

export interface TrainService {
  tsid?: string | null
  uid?: string | null
  runDate?: string | null
  departureTime: Time
  arrivalTime: Time
  departurePlatform?: LocationDetail['platform'] | null
}
