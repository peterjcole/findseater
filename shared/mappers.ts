import type { AvailabilityForService, AvailabilityResponse } from '../types/southeastern'
import type { LocationLineUpResponse, ServiceInfoResponse } from '../types/real-time-trains'
import type { ServiceLoading, Services, Trains, TrainService } from '../types/trains'
import { caseInsensitiveEquals, formatTime, uidToTsid } from './formatting'
import parse from 'date-fns/parse'
import compareAsc from 'date-fns/compareAsc'
import { add } from 'date-fns'

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

export const mapSSRServices = (
  serviceInfo: ServiceInfoResponse[],
  origin: string,
  destination: string
): Services => {
  return serviceInfo
    .map((service) => {
      const userOrigin = service?.locations.find((location) =>
        caseInsensitiveEquals(location.crs, origin)
      )

      const userDestination = service?.locations.find((location) =>
        caseInsensitiveEquals(location.crs, destination)
      )

      return {
        tsid: uidToTsid(service?.serviceUid, service?.runDate),
        uid: service?.serviceUid || null,
        runDate: service?.runDate || null,
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
      if (!first || !second) {
        return 0
      }
      const firstDate = getAdjustedArrivalDate(first)
      const secondDate = getAdjustedArrivalDate(second)

      if (!firstDate || !secondDate) {
        return 0
      }

      return compareAsc(firstDate, secondDate)
    })
}

const parseDate = (date: string | null | undefined, runDate: string | null | undefined) => {
  if (!date || !runDate) {
    return null
  }

  return parse(`${date} ${runDate}`, 'HH:mm yyyy-MM-dd', new Date())
}

const getAdjustedArrivalDate = (service: TrainService) => {
  const departure = parseDate(
    service.departureTime?.realTime || service.departureTime?.booked,
    service.runDate
  )
  const arrival = parseDate(
    service.arrivalTime?.realTime || service.arrivalTime?.booked,
    service.runDate
  )

  if (!departure || !arrival) {
    return null
  }

  const arrivesNextDay = compareAsc(departure, arrival) === 1

  return arrivesNextDay ? add(arrival, { days: 1 }) : arrival
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

    return {
      ...serviceAvailability,
      seatingAvailabilityAtLocations: trimmedLocations,
    }
  })
}

export const mapSSRTrains = ({
  origin,
  destination,
  locationLineUp,
  serviceInfo,
}: MapSSRTrainsParams): Trains => ({
  services: mapSSRServices(serviceInfo, origin, destination),
  origin: locationLineUp?.location || null,
  destination: locationLineUp?.filter?.destination || null,
})

interface MapSSRTrainsParams {
  origin: string
  destination: string
  locationLineUp: LocationLineUpResponse
  serviceInfo: ServiceInfoResponse[]
}
