import { useRouter } from 'next/router'
import type { GetServerSideProps, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import type { LocationLineUpResponse } from '../../types/real-time-trains'
import type { AvailabilityResponse, TrainServices } from '../../types/southeastern'
import { mockAvailability, mockLocationLineUp } from '../../fixtures'
import * as fs from 'fs'

const Destination: NextPage<Props> = ({ availability }) => {
  const router = useRouter()
  const { origin, destination } = router.query
  const originStation = availability[0].seatingAvailabilityAtLocations[0].stationName

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <table className="table-auto border-collapse w-full text-sm">
        <thead>
          <tr>
            <th className="border-b font-medium p-4 text-slate-800 text-left">Departure time</th>
            <th className="border-b font-medium p-4 text-slate-800 text-left">
              Loading level at {originStation}
            </th>
            <th className="border-b font-medium p-4 text-slate-800 text-left">
              Maximum loading level
            </th>
          </tr>
        </thead>
        <tbody>
          {availability.map((serviceAvailability) => {
            return (
              <tr key={serviceAvailability.tsid}>
                <td className="border-b border-slate-100 p-4 text-slate-700">{'departuretime'}</td>
                <td>{serviceAvailability.seatingAvailabilityAtLocations[0].averageLoading}</td>
                <td>{'maxLoading'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p>Origin: {origin}</p>
      <p>Destination: {destination}</p>
      <p>trains: {JSON.stringify(availability)}</p>
    </div>
  )
}

export default Destination

type Props = {
  availability: AvailabilityResponse
}

const mapAvailability = (
  availability: AvailabilityResponse,
  mockLocationLineUp: LocationLineUpResponse
) => {
  // TODO
  // add departure time (of each station)?
  // add max loading level_`
  // change location of mocks and strip from git and make public
  // fixtures probably needs to move
}

export const getServerSidePropsActual: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { origin, destination } = context.query
  const trains = await getRealtimeTrains(origin, destination)

  const serviceCodes = trains.services.map((service) =>
    formatServiceCode(service.serviceUid, service.runDate)
  )
  const availability = await getAvailability(serviceCodes)

  return {
    props: { availability: trimAvailability(availability, origin as string) }, // will be passed to the page component as props
  }
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { origin, destination } = context.query

  const availability = trimAvailability(mockAvailability, origin as string)

  // const mappedAvailability = mapAvailability(availability, mockLocationLineUp)

  return {
    props: {
      availability,
    },
  }
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

async function getAvailability(serviceCodes: string[]) {
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

const formatServiceCode = (serviceUid: string, runDate: string) => {
  const numericalDate = runDate.replace(/-/g, '')

  const numericalUid = `${serviceUid.slice(0, 1).charCodeAt(0)}${serviceUid.slice(1)}`

  return `${numericalDate}${numericalUid}`
}
