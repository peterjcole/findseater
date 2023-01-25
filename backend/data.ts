import type { AvailabilityResponse } from '../types/southeastern'

export async function getHuxleyDepartures({ origin, destination }: GetHuxleyDeparturesProps) {
  const huxleyRes = await fetch(
    `${process.env.HUXLEY_URL}/departures/${origin}/to/${destination}?expand=true`
  )

  return huxleyRes.json()
}

interface GetHuxleyDeparturesProps {
  origin: string
  destination: string
}

export async function getAvailability(trainServices: string[]) {
  const southeasternRes = await fetch(
    'https://api.southeasternrailway.co.uk/departure-boards/service-seating-availability',
    {
      method: 'POST',
      headers: {},
      body: JSON.stringify({
        trainServices,
      }),
    }
  )

  const availability: AvailabilityResponse = await southeasternRes.json().catch(() => {
    return []
  })

  // return mockAvailability
  // fs.writeFileSync('availability.json', JSON.stringify(availability))

  return availability
}
