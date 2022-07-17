import type { FunctionComponent } from 'react'
import type { TrainService } from '../types/trains'
import { getBgColourClass, getTextColourClass } from '../shared/formatting'

export const Loading: FunctionComponent<Props> = ({ service: { seating }, maxLoadingLevel }) => {
  const originLoadingLevel = seating?.[0]?.averageLoading

  const ariaLabel =
    maxLoadingLevel && originLoadingLevel
      ? `Origin station loading level: ${originLoadingLevel}%. Maximum loading level: ${maxLoadingLevel}%`
      : 'Loading levels unknown'

  return seating?.length ? (
    <figure aria-label={ariaLabel}>
      <ol className="inline-flex gap-2 rounded-md h-16 after:content-[''] after:w-8">
        {seating.map(({ averageLoading, stationCRS, isMaxLoading }, index) => {
          return averageLoading && (isMaxLoading || index === 0) ? (
            <li
              className={`${getBgColourClass(
                averageLoading
              )} p-2 flex items-center justify-center flex-wrap gap-1 shadow rounded-sm`}
              key={stationCRS}
            >
              <p
                className={`font-semibold ${
                  isMaxLoading ? getTextColourClass(averageLoading) : ''
                }`}
              >
                {averageLoading}%
              </p>
              <p>{stationCRS}</p>
            </li>
          ) : (
            <li
              className={`${getBgColourClass(
                averageLoading
              )} flex items-center justify-center shadow rounded-sm`}
              key={stationCRS}
            >
              <p className="-rotate-90 text-xs">{stationCRS}</p>
            </li>
          )
        })}
      </ol>
    </figure>
  ) : (
    <p>Unknown</p>
  )
}

interface Props {
  service: TrainService
  maxLoadingLevel?: number | null
}
