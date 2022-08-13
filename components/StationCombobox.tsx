import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import type { FilterStation } from '../types/internal'
import { stations } from '../fixtures/stations'
import { Combobox } from '@headlessui/react'

export const StationCombobox: FunctionComponent<Props> = ({ name, onChange, value, ariaLabel }) => {
  const [query, setQuery] = useState<string>('')
  const [recentStations, setRecentStations] = useState<FilterStation[]>([])

  useEffect(() => {
    setRecentStations(
      JSON.parse(localStorage.getItem('recentStations') || '[]').map((recentCrs: string) =>
        stations.find(({ crs }) => crs === recentCrs)
      )
    )
  }, [])

  const changeHandler = useCallback(
    (station: FilterStation) => {
      setRecentStations([station, ...recentStations.filter(({ crs }) => crs !== station.crs)])
      onChange(station)
    },
    [onChange, recentStations]
  )

  const filteredRecentStations = recentStations.filter(({ crs, name }) =>
    (crs.toLowerCase() + name.toLowerCase()).includes(query.toLowerCase())
  )

  const filteredStations =
    query === ''
      ? stations
      : stations.filter(
          (station) =>
            !recentStations.includes(station) &&
            (station.crs.toLowerCase() + station.name.toLowerCase()).includes(query.toLowerCase())
        )

  return (
    <Combobox name={name} value={value} onChange={changeHandler}>
      <div className="relative inline-block">
        <div className="relative">
          <Combobox.Button as="div">
            <Combobox.Label className="sr-only">{ariaLabel}</Combobox.Label>
            <Combobox.Input
              className="inline-block px-2 py-1 rounded-md h-8 border border-slate-200 w-56 bg-background-10"
              displayValue={(station: FilterStation) => station.name}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={(event: any) => {
                requestAnimationFrame(() => {
                  event.target.setSelectionRange(0, event.target.value.length)
                })
              }}
            />
          </Combobox.Button>
        </div>
        <Combobox.Options className="z-10 absolute mt-2 py-2 rounded-md max-w-max text-base shadow-lg ring-1 ring-black ring-opacity-5  sm:text-sm bg-background-10 overflow-x-auto max-h-96">
          {filteredRecentStations.map((station) => (
            <ComboOption station={station} key={station.crs} />
          ))}
          {filteredStations.slice(0, 200).map((station) => (
            <ComboOption station={station} key={station.crs} />
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}

const ComboOption = ({ station }: { station: FilterStation }) => (
  <Combobox.Option
    className={({ active }) =>
      `p-2 mb-1 last:mb-0 hover:bg-primary-2 ${active ? 'bg-primary-2' : 'bg-background-100'}`
    }
    value={station}
    key={station.crs}
  >
    <span>
      {station.name} ({station.crs})
    </span>{' '}
    {station.southeastern ? <span className="text-xs font-light">Seating info available</span> : ''}
  </Combobox.Option>
)

interface Props {
  name: string
  onChange: (station: FilterStation) => any
  value: FilterStation
  ariaLabel: string
}
