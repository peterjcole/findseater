import type { GetServerSideProps, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import type { LocationLineUpResponse } from '../../types/real-time-trains'
import type { AvailabilityResponse } from '../../types/southeastern'
import { mockAvailability, mockLocationLineUp } from '../../fixtures'
import { tsidToUid, uidToTsid } from '../../utils'
import type { Availability, Trains } from '../../types/trains'

const Destination: NextPage<Props> = ({ trains: { availability, origin, destination } }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 pt-10">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-2">Findseater</h1>
        <p className="mb-4">
          Upcoming trains from {origin.name} to {destination.name}:
        </p>
      </div>
      <table className="table-auto border-collapse w-full text-sm rounded-md shadow-lg">
        <thead>
          <tr>
            <th className="border-b font-medium p-4 text-slate-800 text-left">Departure</th>
            <th className="border-b font-medium p-4 text-slate-800 text-left">
              Loading level at {origin.name}
            </th>
            <th className="border-b font-medium p-4 text-slate-800 text-left">
              Worst loading level on journey
            </th>
          </tr>
        </thead>
        <tbody>
          {availability.map(
            (
              {
                bookedDepartureTime,
                realTimeDepartureTime,
                maxLoadingLevel,
                seatingAvailabilityAtLocations,
                tsid,
                platform,
              },
              index
            ) => {
              const className = `p-4 text-slate-700${
                index < availability.length - 1 ? ' border-b border-slate-100' : ''
              }`

              const getColourClass = (loadingLevel: number | null | undefined) => {
                if (!loadingLevel) {
                  return ''
                }

                if (loadingLevel < 40) {
                  return 'bg-green-100'
                }

                if (loadingLevel < 50) {
                  return 'bg-lime-100'
                }

                if (loadingLevel < 60) {
                  return 'bg-amber-100'
                }

                if (loadingLevel < 90) {
                  return 'bg-amber-100'
                }

                return 'bg-red-100'
              }

              const currentStationLoading = seatingAvailabilityAtLocations[0].averageLoading

              const formatDepartureTime = (time: string | any[] | undefined) =>
                `${time?.slice(0, 2)}:${time?.slice(2, 4)}`

              const bookedEqualsReal = bookedDepartureTime === realTimeDepartureTime

              const formattedBookedTime = formatDepartureTime(bookedDepartureTime)
              const formattedRealTime = formatDepartureTime(realTimeDepartureTime)

              return (
                <tr key={tsid}>
                  <td {...{ className }}>
                    <p className="mb-1">
                      {bookedDepartureTime && (
                        <span
                          className={
                            !bookedEqualsReal ? 'line-through font-light text-xs mr-1' : ''
                          }
                        >
                          <time dateTime={formattedBookedTime}>{formattedBookedTime}</time>
                        </span>
                      )}{' '}
                      {!bookedEqualsReal && formattedRealTime && (
                        <span className="font-bold">
                          <time dateTime={formattedRealTime}>{formattedRealTime}</time>
                        </span>
                      )}
                    </p>

                    {!bookedDepartureTime && <p>Unknown</p>}
                    {platform && <p className="text-xs font-light">Platform {platform}</p>}
                  </td>
                  <td className={`${className} ${getColourClass(currentStationLoading)}`}>
                    {currentStationLoading ? `${currentStationLoading}%` : 'Unknown'}
                  </td>
                  <td className={`${className} ${getColourClass(maxLoadingLevel)}`}>
                    {maxLoadingLevel ? `${maxLoadingLevel}%` : 'Unknown'}
                  </td>
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
      bookedDepartureTime: matchedRttService?.locationDetail?.gbttBookedDeparture,
      realTimeDepartureTime: matchedRttService?.locationDetail?.realtimeDeparture,
      platform: matchedRttService?.locationDetail?.platform,
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
