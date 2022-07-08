import type { GetServerSideProps, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import { mockAvailability, mockLocationLineUp } from '../../fixtures'
import type { Trains } from '../../types/trains'
import { getData } from '../../shared/data'
import { TrainTable } from '../../components/TrainTable'
import { mapTrains, trimAvailability } from '../../shared/mappers'

const Destination: NextPage<Props> = ({ trains: { availability, origin, destination } }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 pt-10">
      <div className="py-4">
        <h1 className="text-3xl font-bold mb-2">Findseater</h1>
        <p className="mb-4">
          Upcoming trains from {origin.name} to {destination.name}:
        </p>
      </div>
      <TrainTable availability={availability} />
    </div>
  )
}

export default Destination

type Props = {
  trains: Trains
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { origin, destination } = context.query as { origin: string; destination: string }
  const { locationLineUp, availability } = await getData({ origin, destination })

  return {
    props: {
      trains: mapTrains(availability, origin, destination, locationLineUp),
    },
  }
}

export const getServerSidePropsMocked: GetServerSideProps = async (): Promise<{
  props: { trains: Trains }
}> => {
  const availability = trimAvailability(mockAvailability, 'STP', 'AFK')

  const origin = mockLocationLineUp.location.crs
  const destination = mockLocationLineUp.filter.destination.crs

  return {
    props: {
      trains: mapTrains(availability, origin, destination, mockLocationLineUp),
    },
  }
}
