import { FunctionComponent, useState } from 'react'
import type { FilterStation } from '../types/internal'
import { stations } from '../fixtures/stations'
import { Combobox } from '@headlessui/react'

export const StationCombobox: FunctionComponent<Props> = ({ name, onChange, value }) => {
  const [query, setQuery] = useState<string>('')

  const filteredStations =
    query === ''
      ? stations
      : stations.filter((station) => {
          return (station.crs.toLowerCase() + station.name.toLowerCase()).includes(
            query.toLowerCase()
          )
        })

  return (
    <Combobox name={name} value={value} onChange={onChange}>
      <div className="relative inline-block">
        <div className="relative">
          <Combobox.Button as="div">
            <Combobox.Input
              className="inline-block px-2 py-1 rounded-md h-8 border border-slate-200 w-64 bg-background-10"
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
          {filteredStations.slice(0, 200).map((station) => (
            <Combobox.Option
              className={({ active }) =>
                `p-2 mb-1 last:mb-0 hover:bg-primary-5 ${
                  active ? 'bg-primary-5' : 'bg-background-100'
                }`
              }
              key={station.crs}
              value={station}
            >
              <span>
                {station.name} ({station.crs})
              </span>{' '}
              {station.southeastern ? (
                <span className="text-xs font-light">Seating info available</span>
              ) : (
                ''
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}

interface Props {
  name: string
  onChange: (station: FilterStation) => any
  value: FilterStation
}
