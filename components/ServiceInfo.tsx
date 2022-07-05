import type { Time } from '../types/trains'
import type { FunctionComponent } from 'react'

export const ServiceInfo: FunctionComponent<Props> = ({ time: { booked, realTime }, platform }) => {
  const isOnTime = !realTime || !booked || booked === realTime

  return (
    <>
      <p className="whitespace-nowrap">
        {booked && (
          <span className={!isOnTime ? 'line-through font-light text-xs' : ''}>
            <time dateTime={booked}>{booked}</time>
          </span>
        )}{' '}
        {!(booked === realTime) && realTime && (
          <span className="font-bold">
            <time dateTime={realTime}>{realTime}</time>
          </span>
        )}
      </p>

      {!booked && <p>Unknown</p>}
      {platform && <p className="text-xs font-light mt-1">Platform {platform}</p>}
    </>
  )
}

interface Props {
  time: Time
  platform?: string
}
