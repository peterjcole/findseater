import type { LocationLineUpResponse, ServiceInfoResponse } from '../types/real-time-trains'
import type { DateObj } from '../types/internal'
import { mapSSRTrains } from './mappers'

// import * as fs from 'fs'

export async function getLocationLineUp({ origin, destination, date }: GetLocationLineUpProps) {
  const { year, month, day } = date || {}

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

  const trains: LocationLineUpResponse = await realtimeTrainsRes.json().catch(() => ({}))

  // fs.writeFileSync('trains.json', JSON.stringify(trains))

  return trains
}

interface GetLocationLineUpProps {
  origin?: string
  destination?: string
  date?: {
    year?: string
    month?: string
    day?: string
  }
}

export const getServiceInfo = async ({ serviceUid, year, month, day }: GetServiceInfoProps) => {
  const realtimeTrainsRes = await fetch(
    `http://api.rtt.io/api/v1/json/service/${serviceUid}/${year}/${month}/${day}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${process.env.RTT_AUTH_KEY}`,
      },
    }
  )

  const trains: ServiceInfoResponse = await realtimeTrainsRes.json()

  return trains
}

interface GetServiceInfoProps {
  serviceUid: string
  year: string
  month: string
  day: string
}

export const getAllServiceInfo = async (
  locationLineUp: LocationLineUpResponse
): Promise<ServiceInfoResponse[]> => {
  return Promise.all(
    locationLineUp?.services?.map(async ({ serviceUid, runDate }) => {
      const [year, month, day] = runDate.split('-')

      return getServiceInfo({ serviceUid, year, month, day })
    }) || []
  )
}
export const getTrains = async ({ origin, destination, date }: GetTrainsProps) => {
  const locationLineUp = await getLocationLineUp({
    origin,
    destination,
    date,
  })

  const serviceInfo = await getAllServiceInfo(locationLineUp)

  return mapSSRTrains({
    origin,
    destination,
    locationLineUp,
    serviceInfo,
  })

  // fs.writeFileSync('serviceinfo.json', JSON.stringify(serviceInfo))

  // return { locationLineUp: mockLocationLineUp, serviceInfo: mockServiceInfo }
}

interface GetTrainsProps {
  origin: string
  destination: string
  date?: DateObj
}
