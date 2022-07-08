export interface LocationLineUpResponse {
  location: LocationLineUpLocation
  filter: Filter
  services: Service[]
}

export type Tiploc = string[] | string

export interface LocationLineUpLocation {
  name: string
  crs: string
  tiploc: Tiploc
  country: string
  system: string
}

export interface Filter {
  destination: LocationLineUpLocation
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
  origin: Station[]
  destination: Station[]
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

export interface Station {
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

export interface ServiceInfoResponse {
  serviceUid: string
  runDate: string
  serviceType: string
  isPassenger: boolean
  trainIdentity: string
  powerType: string
  trainClass: string
  atocCode: string
  atocName: string
  performanceMonitored: boolean
  origin: Station[]
  destination: Station[]
  locations: ServiceInfoLocation[]
  realtimeActivated: boolean
  runningIdentity: string
}

export interface ServiceInfoLocation {
  realtimeActivated: boolean
  tiploc: string
  crs: string
  description: string
  gbttBookedDeparture?: string
  origin: Station[]
  destination: Station[]
  isCall: boolean
  isPublicCall: boolean
  realtimeDeparture?: string
  realtimeDepartureActual?: boolean
  platform?: string
  platformConfirmed?: boolean
  platformChanged?: boolean
  line?: string
  lineConfirmed?: boolean
  displayAs: string
  associations?: Association[]
  gbttBookedArrival?: string
  realtimeArrival?: string
  realtimeArrivalActual?: boolean
  serviceLocation?: string
}
