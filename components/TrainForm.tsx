import { useRouter } from 'next/router'
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import type { FilterStation } from '../types/internal'
import { stations } from '../fixtures/stations'
import { StationCombobox } from './StationCombobox'
import { ArrowRight } from 'react-feather'
import { buildUrl } from '../shared/formatting'

function getStation(origin: string | null) {
  return stations.find((station) => station.crs.toLowerCase() === origin?.toLowerCase())
}

export const TrainForm: FunctionComponent<Props> = ({ origin, destination, year, month, day }) => {
  const router = useRouter()

  useEffect(() => {
    if (!origin || !destination) {
      router.push(buildUrl('CHX', 'HGS', undefined))
    }
  }, [origin, destination, router])

  const urlDate = year && month && day ? `${year}-${month}-${day}` : undefined

  const [selectedOrigin, setSelectedOrigin] = useState<FilterStation>(
    getStation(origin) || getStation('CHX') || stations[0]
  )

  const [selectedDestination, setSelectedDestination] = useState<FilterStation>(
    getStation(destination) || getStation('HGS') || stations[0]
  )

  const [isToday, setIsToday] = useState<boolean>(!urlDate || false)

  const [selectedDate, setSelectedDate] = useState<string>(
    urlDate || new Date().toISOString().split('T')[0]
  )

  const originOnChange = useCallback(
    (station: FilterStation) => {
      setSelectedOrigin(station)
      localStorage.setItem('origin', station.crs)
      return router.push(buildUrl(station.crs, destination, urlDate))
    },
    [destination, router, urlDate]
  )

  const destinationOnChange = useCallback(
    (station: FilterStation) => {
      setSelectedDestination(station)
      localStorage.setItem('destination', station.crs)
      return router.push(buildUrl(origin, station.crs, urlDate))
    },
    [origin, router, urlDate]
  )

  if (!origin || !destination) {
    return null
  }

  return (
    <form className="mb-4 flex gap-4 flex-col py-4">
      <span className="sr-only">
        Upcoming trains from {origin} to {destination}, on {urlDate}, sorted by arrival time:
      </span>
      <fieldset className="inline-flex w-fit items-center gap-x-4 gap-y-2 p-2 rounded-lg border border-slate-200 shadow-sm flex-wrap">
        <label htmlFor="origin-station" className="sr-only">
          Origin station:
        </label>
        <StationCombobox name="origin-station" value={selectedOrigin} onChange={originOnChange} />
        <button
          aria-label="Swap origin and destination"
          className="inline-block px-2 py-1 rounded-md shadow bg-slate-100 h-8 hover:bg-slate-200"
          onClick={(e) => {
            e.preventDefault()
            const oldOrigin = selectedOrigin
            setSelectedOrigin(selectedDestination)
            setSelectedDestination(oldOrigin)
            router.push(buildUrl(destination, origin, !isToday ? selectedDate : undefined))
          }}
        >
          <ArrowRight size="18" />
        </button>

        <label htmlFor="destination-station" className="sr-only">
          Destination station:
        </label>
        <StationCombobox
          name="destination-station"
          value={selectedDestination}
          onChange={destinationOnChange}
        />
      </fieldset>
      <fieldset className="flex items-center flex-wrap gap-x-4 gap-y-2 p-2 rounded-lg border border-slate-200 shadow-sm w-fit">
        <label
          htmlFor="today-checkbox"
          className="w-max flex items-center flex-nowrap gap-x-2 p-2 rounded-md border border-slate-200 h-8"
        >
          Upcoming trains{' '}
          <input
            type="checkbox"
            id="today-checkbox"
            className="w-5 h-5 rounded-md"
            checked={isToday}
            onChange={({ target: { checked } }) => {
              setIsToday(checked)
              if (!checked) {
                if (selectedDate) {
                  router.push(buildUrl(origin, destination, selectedDate))
                }
              } else {
                router.push(buildUrl(origin, destination, undefined))
              }
            }}
          />
        </label>
        <input
          disabled={isToday}
          name="date-input"
          type="date"
          style={{ verticalAlign: 'bottom' }}
          className={`inline-block px-2 py-1 rounded-md h-8 ring-1 ring-slate-200 leading-8 ${
            isToday ? 'text-slate-300' : ''
          }`}
          value={selectedDate}
          onChange={({ target: { value } }) => {
            setSelectedDate(value)
          }}
          onBlur={({ target: { value } }) => {
            if (value !== urlDate) {
              router.push(buildUrl(origin, destination, value))
            }
          }}
        />
      </fieldset>
    </form>
  )
}

interface Props {
  origin: string
  destination: string
  year: string
  month: string
  day: string
}
