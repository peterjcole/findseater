import type { Time } from '../types/trains'
import type { FunctionComponent } from 'react'

export const ServiceInfo: FunctionComponent<Props> = ({
  time: { booked, realTime },
  platform,
  uid,
  runDate,
}) => {
  const isOnTime = !realTime || !booked || booked === realTime

  const rttUrl =
    uid && runDate ? `https://www.realtimetrains.co.uk/service/gb-nr:${uid}/${runDate}` : null

  const children = (
    <>
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
      {!booked && <p>Unknown</p>}
      {platform && <p className="text-xs font-light mt-1">Platform {platform}</p>}
    </>
  )
  return rttUrl ? (
    <a
      className="whitespace-nowrap underline underline-offset-2 decoration-dotted text-blue-900 block"
      href={rttUrl}
    >
      {children}
    </a>
  ) : (
    <>{children}</>
  )
}

interface Props {
  time: Time
  platform?: string
  uid?: string
  runDate?: string
}
