import type { GetServerSideProps, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import type { LocationLineUpResponse } from '../../types/real-time-trains'
import type { AvailabilityResponse } from '../../types/southeastern'
import { mockAvailability, mockLocationLineUp } from '../../fixtures'
import { tsidToUid, uidToTsid } from '../../utils'
import type { Availability, Trains } from '../../types/trains'

const Destination: NextPage<Props> = ({ trains: { availability, origin, destination } }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Findseater</h1>
      <p>
        Upcoming trains from {origin.name} to {destination.name}:
      </p>
      <table className="table-auto border-collapse w-full text-sm">
        <thead>
          <tr>
            <th className="border-b font-medium p-4 text-slate-800 text-left">Departure time</th>
            <th className="border-b font-medium p-4 text-slate-800 text-left">
              Loading level at {origin.name}
            </th>
            <th className="border-b font-medium p-4 text-slate-800 text-left">
              Maximum loading level on journey
            </th>
          </tr>
        </thead>
        <tbody>
          {availability.map(
            ({ departureTime, maxLoadingLevel, seatingAvailabilityAtLocations, tsid }) => {
              return (
                <tr key={tsid}>
                  <td className="border-b border-slate-100 p-4 text-slate-700">
                    {departureTime || 'Unknown'}
                  </td>
                  <td>{seatingAvailabilityAtLocations[0].averageLoading || 'Unknown'}</td>
                  <td>{maxLoadingLevel || 'Unknown'}</td>
                </tr>
              )
            }
          )}
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
          trimAvailability(availability, origin as string),
          locationLineUp
        ),
        origin: locationLineUp.location,
        destination: locationLineUp.filter.destination,
      },
    }, // will be passed to the page component as props
  }
}

export const getServerSidePropsMocked: GetServerSideProps = async (): Promise<{
  props: { trains: Trains }
}> => {
  const availability = trimAvailability(mockAvailability, 'AFK')

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

const mapAvailability = (
  availability: AvailabilityResponse,
  locationLineUp: LocationLineUpResponse
): Availability => {
  return availability.map((service) => {
    const matchedRttService = locationLineUp.services.find(
      (rttService) => rttService.serviceUid === tsidToUid(service.tsid)
    )

    const loadingLevels = service.seatingAvailabilityAtLocations.flatMap((location) =>
      location.averageLoading ? location.averageLoading : []
    )

    return {
      ...service,
      maxLoadingLevel: loadingLevels?.length ? Math.max(...loadingLevels) : null,
      departureTime: matchedRttService?.locationDetail?.gbttBookedDeparture,
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
  return availability
}

const trimAvailability = (
  availability: AvailabilityResponse,
  origin: string | null | undefined
) => {
  return availability.map((serviceAvailability) => {
    const { seatingAvailabilityAtLocations: locations } = serviceAvailability

    const trimmedLocations = locations.slice(
      locations.findIndex((location) => location.stationCRS === origin)
    )

    return {
      ...serviceAvailability,
      seatingAvailabilityAtLocations: trimmedLocations,
    }
  })
}
