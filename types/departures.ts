import type { HuxleyFormation, HuxleyLocation, HuxleyService } from './huxley'

export type DeparturesApiResponse = DeparturesService[]

export interface DeparturesService extends Pick<HuxleyService, 'std' | 'etd' | 'platform'> {
  origin: DeparturesLocation
  destination: DeparturesLocation
  destinationSta: string | null
  destinationEta: string | null
  formation: DeparturesFormation
}

export type DeparturesLocation = Pick<HuxleyLocation, 'locationName'>

export type DeparturesFormation = {
  avgLoading: HuxleyFormation['avgLoading'] | null
}
