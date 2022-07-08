import type {
  AvailabilityForService,
  AvailabilityResponse,
  SeatingAvailability,
} from '../types/southeastern'
import type { LocationLineUpResponse, ServiceInfoResponse } from '../types/real-time-trains'
import type { Availability, Seating, Trains } from '../types/trains'
import { caseInsensitiveEquals, formatRequestedDate, formatTime, tsidToUid } from './formatting'
import parse from 'date-fns/parse'
import compareAsc from 'date-fns/compareAsc'
import type { DateObj } from '../types/internal'

const mapSeatingAvailability = (
  seatingAvailability: SeatingAvailability[],
  loadingLevels: number[],
  maxLoadingLevel?: number | null
): Seating[] => {
  return seatingAvailability.map((availability, index) => ({
    ...availability,
    isMaxLoading:
      availability.averageLoading === maxLoadingLevel &&
      loadingLevels.findIndex((level) => level === availability.averageLoading) === index,
  }))
}

const getLoadingLevels = (service: AvailabilityForService) => {
  const loadingLevels = service.seatingAvailabilityAtLocations.flatMap((location) =>
    location.averageLoading ? location.averageLoading : []
  )

  const maxLoadingLevel = loadingLevels?.length ? Math.max(...loadingLevels) : null
  return { loadingLevels, maxLoadingLevel }
}

export const mapAvailability = (
  availability: AvailabilityResponse,
  serviceInfo: ServiceInfoResponse[],
  origin: string,
  destination: string
): Availability => {
  return availability
    .map((service) => {
      const matchedRttService = serviceInfo.find(
        (rttService) => rttService.serviceUid === tsidToUid(service.tsid)
      )

      const userOrigin = matchedRttService?.locations.find((location) =>
        caseInsensitiveEquals(location.crs, origin)
      )

      const userDestination = matchedRttService?.locations.find((location) =>
        caseInsensitiveEquals(location.crs, destination)
      )

      const { loadingLevels, maxLoadingLevel } = getLoadingLevels(service)

      return {
        tsid: service.tsid,
        uid: matchedRttService?.serviceUid,
        runDate: matchedRttService?.runDate,
        maxLoadingLevel,
        seating: mapSeatingAvailability(
          service.seatingAvailabilityAtLocations,
          loadingLevels,
          maxLoadingLevel
        ),
        departureTime: {
          booked: formatTime(userOrigin?.gbttBookedDeparture) || null,
          realTime: formatTime(userOrigin?.realtimeDeparture) || null,
        },
        arrivalTime: {
          booked: formatTime(userDestination?.gbttBookedArrival) || null,
          realTime: formatTime(userDestination?.realtimeArrival) || null,
        },
        departurePlatform: userOrigin?.platform || null,
      }
    })
    .sort((first, second) => {
      const firstArrival = first.arrivalTime.realTime || first.arrivalTime.booked
      const secondArrival = second.arrivalTime.realTime || second.arrivalTime.booked

      if (!firstArrival || !secondArrival) {
        return 0
      }

      return compareAsc(
        parse(firstArrival, 'HH:mm', new Date()),
        parse(secondArrival, 'HH:mm', new Date())
      )
    })
}

export const trimAvailability = (
  availability: AvailabilityResponse,
  origin: string,
  destination: string
) => {
  return availability.map((serviceAvailability) => {
    const { seatingAvailabilityAtLocations: locations } = serviceAvailability

    const trimmedLocations = locations.slice(
      locations.findIndex((location) => caseInsensitiveEquals(location.stationCRS, origin)),
      locations.findIndex((location) => caseInsensitiveEquals(location.stationCRS, destination)) + 1
    )

    const numStationsVisited = trimmedLocations?.length

    if (numStationsVisited >= 2) {
      trimmedLocations[numStationsVisited - 1].averageLoading =
        trimmedLocations[numStationsVisited - 2].averageLoading
    }

    return {
      ...serviceAvailability,
      seatingAvailabilityAtLocations: trimmedLocations,
    }
  })
}

export const mapTrains = ({
  availability,
  origin,
  destination,
  locationLineUp,
  serviceInfo,
  date,
}: MapTrainsParams): Trains => ({
  availability: mapAvailability(
    trimAvailability(availability, origin as string, destination as string),
    serviceInfo,
    origin,
    destination
  ),
  origin: locationLineUp.location,
  destination: locationLineUp.filter.destination,
  formattedDate: formatRequestedDate(date),
})

interface MapTrainsParams {
  availability: AvailabilityForService[]
  origin: string
  destination: string
  locationLineUp: LocationLineUpResponse
  serviceInfo: ServiceInfoResponse[]
  date?: DateObj
}
