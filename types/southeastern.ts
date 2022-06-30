export type TrainServices = {
  trainServices: String[]
}

export type AvailabilityResponse = AvailabilityForService[]

export interface AvailabilityForService {
  tsid: string
  seatingAvailabilityAtLocations: SeatingAvailability[]
}

export interface SeatingAvailability {
  stationName: string
  stationCRS: string
  averageLoading?: number | null
}
