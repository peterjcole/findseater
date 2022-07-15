import type { Availability } from '../types/trains'
import { ServiceInfo } from './ServiceInfo'
import { Loading } from './Loading'

export const TrainTable = ({ availability }: { availability: Availability }) => {
  if (!availability.length) {
    return <h1>No trains found :(</h1>
  }
  return (
    <table className="table-fixed w-full sm:w-auto border-collapse text-sm rounded-md shadow-lg">
      <thead>
        <tr>
          <th className="border-b font-medium p-4 text-left w-24">Departure</th>
          <th className="border-b font-medium p-4 text-left">Loading level</th>
          <th className="border-b font-medium p-4 text-left w-24">Arrival</th>
        </tr>
      </thead>
      <tbody>
        {availability.map((service, index) => {
          const {
            departureTime,
            arrivalTime,
            tsid,
            uid,
            runDate,
            departurePlatform,
            maxLoadingLevel,
          } = service

          const className = `text-slate-700${
            index < availability.length - 1 ? ' border-b border-slate-100' : ''
          }`

          return (
            <tr key={tsid}>
              <td className={`${className} p-4`}>
                <ServiceInfo
                  time={departureTime}
                  platform={departurePlatform}
                  uid={uid}
                  runDate={runDate}
                />
              </td>
              <td
                className={`${className} relative after:content-[''] after:absolute after:inset-0 after:left-[90%] after:bg-gradient-to-r after:from-transparent after:via-transparent after:to-white`}
              >
                <div className="py-4 px-1 overflow-x-auto">
                  <Loading service={service} maxLoadingLevel={maxLoadingLevel} />
                </div>
              </td>
              <td className={`${className} p-4`}>
                <ServiceInfo time={arrivalTime} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
