import type { NextApiRequest, NextApiResponse } from 'next'
import type { AvailabilityResponse } from '../../types/southeastern'
import type { TrainLoading } from '../../types/trains'
import { getLoadingLevels, trimAvailability } from '../../backend/mappers'
import { getAvailability } from '../../backend/data'

const trainLoading = async (req: NextApiRequest, res: NextApiResponse) => {
  const { trainServices, origin, destination } = JSON.parse(req.body)

  const result: AvailabilityResponse = await getAvailability(trainServices)

  const trimmedAvailability = trimAvailability(result, origin, destination)

  const trainLoading: TrainLoading = Object.fromEntries(
    trimmedAvailability.map((service) => [service.tsid, getLoadingLevels(service)])
  )

  res.status(200).json(trainLoading)
}

export default trainLoading
