import type { GetServerSideProps, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import type { LocationLineUpResponse } from '../../types/real-time-trains'
import type { AvailabilityResponse, SeatingAvailability } from '../../types/southeastern'
import { mockAvailability, mockLocationLineUp } from '../../fixtures'
import { formatTime, tsidToUid, uidToTsid } from '../../utils'
import type { Availability, Seating, Trains } from '../../types/trains'
import { ServiceInfo } from '../../components/ServiceInfo'
import { Loading } from '../../components/Loading'

const Destination: NextPage<Props> = ({ trains: { availability, origin, destination } }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 pt-10">
      <div className="py-4">
        <h1 className="text-3xl font-bold mb-2">Findseater</h1>
        <p className="mb-4">
          Upcoming trains from {origin.name} to {destination.name}:
        </p>
      </div>
      <table className="table-fixed border-collapse text-sm rounded-md shadow-lg">
        <thead>
          <tr>
            <th className="border-b font-medium p-4 text-slate-800 text-left w-24">Departure</th>
            <th className="border-b font-medium p-4 text-slate-800 text-left">Loading level</th>
            <th className="border-b font-medium p-4 text-slate-800 text-left w-24">
              Planned arrival
            </th>
          </tr>
        </thead>
        <tbody>
          {availability.map((service, index) => {
            const { departureTime, arrivalTime, tsid, departurePlatform } = service

            const className = `p-4 text-slate-700${
              index < availability.length - 1 ? ' border-b border-slate-100' : ''
            }`

            return (
              <tr key={tsid}>
                <td {...{ className }}>
                  <ServiceInfo time={departureTime} platform={departurePlatform} />
                </td>
                <td className={`${className} overflow-x-auto`}>
                  <Loading service={service} />
                </td>
                <td {...{ className }}>
                  <ServiceInfo time={arrivalTime} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Destination

type Props = {
  trains: Trains
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { origin, destination } = context.query
  const locationLineUp = await getRealtimeTrains(origin, destination)

  const availability = await getAvailability(locationLineUp)

  return {
    props: {
      trains: {
        availability: mapAvailability(
          trimAvailability(availability, origin as string, destination as string),
          locationLineUp
        ),
        origin: locationLineUp.location,
        destination: locationLineUp.filter.destination,
      },
    },
  }
}

export const getServerSidePropsMocked: GetServerSideProps = async (): Promise<{
  props: { trains: Trains }
}> => {
  const availability = trimAvailability(mockAvailability, 'STP', 'AFK')

  const mappedAvailability = mapAvailability(availability, mockLocationLineUp)

  return {
    props: {
      trains: {
        availability: mappedAvailability,
        origin: mockLocationLineUp.location,
        destination: mockLocationLineUp.filter.destination,
      },
    },
  }
}

const mapSeatingAvailability = (seatingAvailability: SeatingAvailability[]): Seating[] => {
  const loadingLevels = seatingAvailability.flatMap((location) =>
    location.averageLoading ? location.averageLoading : []
  )

  const maxLoadingLevel = loadingLevels?.length ? Math.max(...loadingLevels) : null

  return seatingAvailability.map((availability, index) => ({
    ...availability,
    isMaxLoading:
      availability.averageLoading === maxLoadingLevel &&
      loadingLevels.findIndex((level) => level === availability.averageLoading) === index,
  }))
}

const mapAvailability = (
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

    return {
      tsid: service.tsid,
      seating: mapSeatingAvailability(service.seatingAvailabilityAtLocations),
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

async function getRealtimeTrains(
  origin: string | string[] | undefined,
  destination: string | string[] | undefined
) {
  const realtimeTrainsRes = await fetch(
    `http://api.rtt.io/api/v1/json/search/${origin}/to/${destination}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${process.env.RTT_AUTH_KEY}`,
      },
    }
  )

  const trains: LocationLineUpResponse = await realtimeTrainsRes.json()

  // fs.writeFileSync('trains.json', JSON.stringify(trains))

  return trains
}

async function getAvailability(locationLineUp: LocationLineUpResponse) {
  const serviceCodes = locationLineUp.services.map((service) =>
    uidToTsid(service.serviceUid, service.runDate)
  )

  const southeasternRes = await fetch(
    'https://api.southeasternrailway.co.uk/departure-boards/service-seating-availability',
    {
      method: 'POST',
      headers: {},
      body: JSON.stringify({
        trainServices: serviceCodes,
      }),
    }
  )

  const availability: AvailabilityResponse = await southeasternRes.json()

  // fs.writeFileSync('availability.json', JSON.stringify(availability))

  return availability
}

const trimAvailability = (
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

    trimmedLocations[trimmedLocations.length - 1].averageLoading =
      trimmedLocations[trimmedLocations.length - 2].averageLoading

    return {
      ...serviceAvailability,
      seatingAvailabilityAtLocations: trimmedLocations,
    }
  })
}
