export interface LocationLineUpResponse {
  location: Location
  filter: Filter
  services: Service[]
}

export type Tiploc = string[] | string

export interface Location {
  name: string
  crs: string
  tiploc: Tiploc
  country: string
  system: string
}

export interface Filter {
  destination: Location
}

export interface Service {
  locationDetail: LocationDetail
  serviceUid: string
  runDate: string
  trainIdentity: string
  runningIdentity: string
  atocCode: string
  atocName: string
  serviceType: string
  isPassenger: boolean
}

export interface LocationDetail {
  realtimeActivated: boolean
  tiploc: Tiploc
  crs: string
  description: string
  gbttBookedArrival?: string
  gbttBookedDeparture: string
  origin: Origin[]
  destination: LocationDetailDestination[]
  isCall: boolean
  isPublicCall: boolean
  realtimeArrival?: string
  realtimeArrivalActual?: boolean
  realtimeDeparture: string
  realtimeDepartureActual: boolean
  platform: string
  platformConfirmed: boolean
  platformChanged: boolean
  serviceLocation?: string
  displayAs: string
  associations?: Association[]
}

export interface Origin {
  tiploc: Tiploc
  description: string
  workingTime: string
  publicTime: string
}

export interface LocationDetailDestination {
  tiploc: Tiploc
  description: string
  workingTime: string
  publicTime: string
}

export interface Association {
  type: string
  associatedUid: string
  associatedRunDate: string
}
