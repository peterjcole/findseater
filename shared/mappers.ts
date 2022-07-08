import type {
  AvailabilityForService,
  AvailabilityResponse,
  SeatingAvailability,
} from '../types/southeastern'
import type { LocationLineUpResponse } from '../types/real-time-trains'
import type { Availability, Seating } from '../types/trains'
import { formatTime, tsidToUid } from './formatting'

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

function getLoadingLevels(service: AvailabilityForService) {
  const loadingLevels = service.seatingAvailabilityAtLocations.flatMap((location) =>
    location.averageLoading ? location.averageLoading : []
  )

  const maxLoadingLevel = loadingLevels?.length ? Math.max(...loadingLevels) : null
  return { loadingLevels, maxLoadingLevel }
}

export const mapAvailability = (
  availability: AvailabilityResponse,
  locationLineUp: LocationLineUpResponse
): Availability => {
  return availability.map((service) => {
    const matchedRttService = locationLineUp.services.find(
      (rttService) => rttService.serviceUid === tsidToUid(service.tsid)
    )

    const endsAtDestination =
      matchedRttService?.locationDetail.destination[0].tiploc ===
      locationLineUp.filter.destination.tiploc

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
        booked: formatTime(matchedRttService?.locationDetail?.gbttBookedDeparture) || null,
        realTime: formatTime(matchedRttService?.locationDetail?.realtimeDeparture) || null,
      },
      arrivalTime: {
        booked:
          (endsAtDestination &&
            formatTime(matchedRttService?.locationDetail?.destination[0].publicTime)) ||
          null,
      },
      departurePlatform: matchedRttService?.locationDetail?.platform,
      fullServiceDetails: matchedRttService,
    }
  })
}
export const trimAvailability = (
  availability: AvailabilityResponse,
  origin: string | null | undefined,
  destination: string | null | undefined
) => {
  return availability.map((serviceAvailability) => {
    const { seatingAvailabilityAtLocations: locations } = serviceAvailability

    const trimmedLocations = locations.slice(
      locations.findIndex((location) => location.stationCRS === origin),
      locations.findIndex((location) => location.stationCRS === destination) + 1
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
export const mapTrains = (
  availability: AvailabilityForService[],
  origin: string | string[] | undefined,
  destination: string | string[] | undefined,
  locationLineUp: LocationLineUpResponse
) => ({
  availability: mapAvailability(
    trimAvailability(availability, origin as string, destination as string),
    locationLineUp
  ),
  origin: locationLineUp.location,
  destination: locationLineUp.filter.destination,
})
