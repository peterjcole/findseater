import type { FunctionComponent } from 'react'
import type { TrainService } from '../types/trains'
import { getBgColourClass, getTextColourClass } from '../utils'

export const Loading: FunctionComponent<Props> = ({ service: { seating } }) => {
  return (
    <figure>
      <ol className="inline-flex gap-1 rounded-md min-h-[2.25rem]">
        {seating.map(({ averageLoading, stationCRS, isMaxLoading }, index) => {
          return averageLoading && (isMaxLoading || index === 0) ? (
            <li
              className={`${getBgColourClass(
                averageLoading
              )} p-2 flex items-center justify-center flex-wrap gap-1 shadow`}
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
              )} flex items-center justify-center shadow`}
            >
              <p className="rotate-90 text-xs">{stationCRS}</p>
            </li>
          )
        })}
      </ol>
    </figure>
  )
}

interface Props {
  service: TrainService
}
