import type { LocationLineUpResponse } from '../types/real-time-trains'
import type { AvailabilityResponse } from '../types/southeastern'
import { uidToTsid } from './formatting'
// import * as fs from 'fs'

export async function getRealtimeTrains({
  origin,
  destination,
  year,
  month,
  day,
}: GetRealtimeTrainsProps) {
  const hasFullDate = year && month && day

  const realtimeTrainsRes = await fetch(
    `http://api.rtt.io/api/v1/json/search/${origin}/to/${destination}${
      hasFullDate ? `/${year}/${month}/${day}` : ''
    }`,
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

interface GetRealtimeTrainsProps {
  origin?: string
  destination?: string
  year?: string
  month?: string
  day?: string
}

export async function getAvailability(locationLineUp: LocationLineUpResponse) {
  const serviceCodes =
    locationLineUp.services?.map((service) => uidToTsid(service.serviceUid, service.runDate)) || []

  console.log(serviceCodes)

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

export const getData = async ({ origin, destination, year, month, day }: getDataProps) => {
  const locationLineUp = await getRealtimeTrains({
    origin: origin,
    destination: destination,
    year: year,
    month: month,
    day: day,
  })
  const availability = await getAvailability(locationLineUp)
  return { locationLineUp, availability }
}

interface getDataProps {
  origin?: string
  destination?: string
  year?: string
  month?: string
  day?: string
}
