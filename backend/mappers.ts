import type { AvailabilityForService, AvailabilityResponse } from '../types/southeastern'
import type { ServiceLoading } from '../types/trains'
import { caseInsensitiveEquals } from '../shared/formatting'
import type {
  HuxleyCallingPointInfo,
  HuxleyFormation,
  HuxleyLocation,
  HuxleyService,
} from '../types/huxley'
import type { DeparturesApiResponse } from '../types/departures'

export const getLoadingLevels = (service: AvailabilityForService): ServiceLoading => {
  const loadingLevels = service.seatingAvailabilityAtLocations.flatMap((location) =>
    location.averageLoading ? location.averageLoading : []
  )

  const maxLoadingLevel = loadingLevels?.length ? Math.max(...loadingLevels) : null

  return {
    seating: service.seatingAvailabilityAtLocations.map((seatingAvailability) => ({
      ...seatingAvailability,
      isMaxLoading: maxLoadingLevel === seatingAvailability.averageLoading,
    })),
    maxLoadingLevel,
  }
}
export const trimAvailability = (
  availability: AvailabilityResponse,
  origin: string,
  destination: string
) =>
  availability.map((serviceAvailability) => {
    const { seatingAvailabilityAtLocations: locations } = serviceAvailability

    const trimmedLocations = locations.slice(
      locations.findIndex((location) => caseInsensitiveEquals(location.stationCRS, origin)),
      locations.findIndex((location) => caseInsensitiveEquals(location.stationCRS, destination)) + 1
    )

    return {
      ...serviceAvailability,
      seatingAvailabilityAtLocations: trimmedLocations,
    }
  })

export const mapDepartures = (
  data: HuxleyService[],
  destinationCrs: string
): DeparturesApiResponse =>
  data.map(({ destination, etd, origin, platform, std, subsequentCallingPoints, formation }) => {
    const { st, et } = getDestination(subsequentCallingPoints, destinationCrs) || {
      st: null,
      et: null,
    }

    const destinationSta = st
    const destinationEta = et === 'On time' ? st : et

    return {
      platform,
      std,
      etd,
      destinationEta,
      destinationSta,
      origin: mapDeparturesLocation(origin[0]),
      destination: mapDeparturesLocation(destination[0]),
      formation: mapDeparturesFormation(formation),
    }
  })

const mapDeparturesLocation = ({ locationName }: HuxleyLocation) => ({ locationName })

const mapDeparturesFormation = ({ avgLoading, avgLoadingSpecified }: HuxleyFormation) => ({
  avgLoading: avgLoadingSpecified ? avgLoading : null,
})

const getDestination = (
  callingPointInfo: HuxleyCallingPointInfo[] | null,
  destinationCrs: string | null
) =>
  callingPointInfo &&
  callingPointInfo[0].callingPoint.find(
    ({ crs }) => crs?.toLowerCase() === destinationCrs?.toLowerCase()
  )
