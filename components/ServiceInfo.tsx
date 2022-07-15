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

  const mainTime = booked ? (
    <p className="font-semibold text-lg">
      {!isOnTime ? (
        <time dateTime={realTime}>{realTime}</time>
      ) : (
        <time dateTime={booked}>{booked}</time>
      )}
    </p>
  ) : (
    <p>Unknown</p>
  )

  // const times = (
  //   <>
  //     {booked && (
  //       <span className={!isOnTime ? 'line-through font-light text-xs' : 'font-semibold text-lg'}>
  //         <time dateTime={booked}>{booked}</time>
  //       </span>
  //     )}{' '}
  //     {!(booked === realTime) && realTime && (
  //       <span className="font-semibold text-lg">
  //         <time dateTime={realTime}>{realTime}</time>
  //       </span>
  //     )}
  //     {!booked && }
  //   </>
  // )

  return (
    <div className="w-fit md:w-max">
      {!isOnTime && (
        <p className="line-through font-light text-xs mr-2">
          <time dateTime={booked}>{booked}</time>
        </p>
      )}
      {rttUrl ? (
        <a className="underline underline-offset-2 text-blue-900" href={rttUrl}>
          {mainTime}
        </a>
      ) : (
        mainTime
      )}

      {platform && <p className="text-sm mt-1 w-max">Platform {platform}</p>}
    </div>
  )
}

interface Props {
  time: Time
  platform?: string | null
  uid?: string | null
  runDate?: string | null
}
