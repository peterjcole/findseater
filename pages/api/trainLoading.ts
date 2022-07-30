import type { NextApiRequest, NextApiResponse } from 'next'
import { getAvailability } from '../../shared/data'
import { getLoadingLevels, trimAvailability } from '../../shared/mappers'
import type { AvailabilityResponse } from '../../types/southeastern'
import type { TrainLoading } from '../../types/trains'

const trainLoading = async (req: NextApiRequest, res: NextApiResponse) => {
  const { trainServices, origin, destination } = JSON.parse(req.body)

  const result: AvailabilityResponse = await getAvailability(trainServices)

  const trimmedAvailability = trimAvailability(result, origin, destination)

  // await new Promise((resolve) => setTimeout(resolve, 1000))

  const trainLoading: TrainLoading = Object.fromEntries(
    trimmedAvailability.map((service) => [service.tsid, getLoadingLevels(service)])
  )

  res.status(200).json(trainLoading)
}

export default trainLoading
