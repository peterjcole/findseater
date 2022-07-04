import type { AvailabilityForService } from './southeastern'
import type { LocationDetail, Service, Location } from './real-time-trains'

export interface Trains {
  availability: Availability
  origin: Location
  destination: Location
}

export type Availability = TrainService[]

export interface TrainService extends AvailabilityForService {
  maxLoadingLevel: number | null
  departureTime?: LocationDetail['gbttBookedDeparture']
  fullServiceDetails?: Service
}
