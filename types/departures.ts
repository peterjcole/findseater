import type { HuxleyFormation, HuxleyService } from './huxley'

export type DeparturesApiResponse = DeparturesService[]

export interface DeparturesService extends Pick<HuxleyService, 'std' | 'etd' | 'platform'> {
  id: string | null
  origin: DeparturesLocation
  destination: DeparturesLocation
  destinationSta: string | null
  destinationEta: string | null
  formation: DeparturesFormation
}

export type DeparturesLocation = {
  name: string | null
}

export type DeparturesFormation = {
  numCoaches: number | null
  avgLoading: HuxleyFormation['avgLoading'] | null
}
