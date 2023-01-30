export type HuxleyDepartureResponse = {
  trainServices: HuxleyService[]
  busServices: any
  ferryServices: any
  generatedAt: string
  locationName: string
  crs: string
  filterLocationName: string
  filtercrs: string
  filterType: number
  nrccMessages: any
  platformAvailable: boolean
  areServicesAvailable: boolean
}
export interface HuxleyService {
  previousCallingPoints: HuxleyCallingPointInfo[] | null
  subsequentCallingPoints: HuxleyCallingPointInfo[] | null
  formation: HuxleyFormation
  origin: HuxleyLocation[]
  destination: HuxleyLocation[]
  currentOrigins: any
  currentDestinations: any
  rsid: string
  serviceIdPercentEncoded: string
  serviceIdGuid: string
  serviceIdUrlSafe: string
  sta: string | null
  eta: string | null
  std: string | null
  etd: string | null
  platform: string | null
  operator: string | null
  operatorCode: string | null
  isCircularRoute: boolean
  isCancelled: boolean
  filterLocationCancelled: boolean
  serviceType: number
  length: number
  detachFront: boolean
  isReverseFormation: boolean
  cancelReason: string | null
  delayReason: string | null
  serviceID: string
  adhocAlerts: string | null
}

export interface HuxleyCallingPointInfo {
  callingPoint: HuxleyCallingPoint[]
  serviceType: number
  serviceChangeRequired: boolean
  assocIsCancelled: boolean
}

export interface HuxleyCallingPoint {
  locationName: string | null
  crs: string | null
  st: string | null
  et: string | null
  at: string | null
  isCancelled: boolean
  length: number | null
  detachFront: boolean
  formation: HuxleyFormation
  adhocAlerts: string | null
}

export interface HuxleyFormation {
  avgLoading: number
  avgLoadingSpecified: boolean
  coaches: HuxleyCoach[]
}

export interface HuxleyCoach {
  coachClass: string | null
  toilet: HuxleyToilet
  loading: number
  loadingSpecified: boolean
  number: string
}

export interface HuxleyToilet {
  status: number
  value: string | null
}

export interface HuxleyLocation {
  locationName: string | null
  crs: string | null
  via: string | null
  futureChangeTo: string | null
  assocIsCancelled: boolean
}
