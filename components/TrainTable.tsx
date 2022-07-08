import type { Availability } from '../types/trains'
import { ServiceInfo } from './ServiceInfo'
import { Loading } from './Loading'

export const TrainTable = ({ availability }: { availability: Availability }) => (
  <table className="table-fixed w-full sm:w-auto border-collapse text-sm rounded-md shadow-lg">
    <thead>
      <tr>
        <th className="border-b font-medium p-4 text-slate-800 text-left w-24">Departure</th>
        <th className="border-b font-medium p-4 text-slate-800 text-left">Loading level</th>
        <th className="border-b font-medium p-4 text-slate-800 text-left w-24">Planned arrival</th>
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

        const className = `p-4 text-slate-700${
          index < availability.length - 1 ? ' border-b border-slate-100' : ''
        }`

        return (
          <tr key={tsid}>
            <td {...{ className }}>
              <ServiceInfo
                time={departureTime}
                platform={departurePlatform}
                uid={uid}
                runDate={runDate}
              />
            </td>
            <td className={`${className} overflow-x-auto`}>
              <Loading service={service} maxLoadingLevel={maxLoadingLevel} />
            </td>
            <td {...{ className }}>
              <ServiceInfo time={arrivalTime} />
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
)
