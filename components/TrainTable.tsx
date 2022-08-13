import type { Services, TrainLoading } from '../types/trains'
import { ServiceInfo } from './ServiceInfo'
import { LoadingTrain } from './LoadingTrain'
import { LoadingLevel } from './LoadingLevel'

export const TrainTable = ({
  services,
  trainLoading,
}: {
  services: Services
  trainLoading: TrainLoading | null
}) => {
  if (!services.length) {
    return <h1 className="px-6">No trains found :(</h1>
  }

  return (
    <div className="px-1 sm:px-4">
      <table className="table-fixed w-full border-collapse text-sm rounded-md shadow-lg">
        <thead>
          <tr className="bg-background-50">
            <th className="border-b font-medium p-5 text-left w-28">Departure</th>
            <th className="border-b font-medium p-1 text-left">Loading level</th>
            <th className="border-b font-medium p-5 text-left w-24">Arrival</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => {
            const serviceLoading = service.tsid ? trainLoading?.[service.tsid] : undefined

            const { departureTime, arrivalTime, tsid, uid, runDate, departurePlatform } = service

            const className = `text-slate-700${
              index < services.length - 1 ? ' border-b border-slate-100' : ''
            }`

            return (
              <tr key={tsid}>
                <td className={`${className} px-5 py-6`}>
                  <ServiceInfo
                    time={departureTime}
                    platform={departurePlatform}
                    uid={uid}
                    runDate={runDate}
                  />
                </td>
                <td
                  className={`${className} relative after:content-[''] after:absolute after:inset-0 after:left-[90%] after:bg-gradient-to-r after:from-transparent after:via-transparent after:to-background-100`}
                >
                  <div className="py-4 px-1 overflow-x-auto">
                    {trainLoading === null ? (
                      <LoadingTrain />
                    ) : (
                      <LoadingLevel serviceLoading={serviceLoading} />
                    )}
                  </div>
                </td>
                <td className={`${className} px-5 py-6`}>
                  <ServiceInfo time={arrivalTime} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
