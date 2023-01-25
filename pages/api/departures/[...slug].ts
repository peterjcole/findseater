import type { NextApiRequest, NextApiResponse } from 'next'
import type { HuxleyDepartureResponse } from '../../../types/huxley'
import { getHuxleyDepartures } from '../../../backend/data'
import { mapDepartures } from '../../../backend/mappers'

const huxleyDepartures = async (req: NextApiRequest, res: NextApiResponse) => {
  const [origin, destination] = req.query.slug || []

  if (!origin || !destination) {
    return res.status(404)
  }

  const result: HuxleyDepartureResponse = await getHuxleyDepartures({ origin, destination })

  const mappedDepartures = mapDepartures(result.trainServices, destination)

  res.status(200).json(mappedDepartures)
}

export default huxleyDepartures
