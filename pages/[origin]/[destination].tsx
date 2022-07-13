import type { GetServerSideProps, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import { mockAvailability, mockLocationLineUp, mockServiceInfo } from '../../fixtures/mocks'
import type { Trains } from '../../types/trains'
import { getData } from '../../shared/data'
import { TrainTable } from '../../components/TrainTable'
import { mapTrains, trimAvailability } from '../../shared/mappers'

const Destination: NextPage<Props> = ({ trains: { availability } }) => {
  return <TrainTable availability={availability} />
}

export default Destination

type Props = {
  trains: Trains
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { origin, destination } = context.query as { origin: string; destination: string }
  const { locationLineUp, availability, serviceInfo } = await getData({ origin, destination })

  return {
    props: {
      trains: mapTrains({
        availability,
        origin,
        destination,
        locationLineUp,
        serviceInfo,
      }),
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
      trains: mapTrains({
        availability,
        origin,
        destination,
        locationLineUp: mockLocationLineUp,
        serviceInfo: mockServiceInfo,
      }),
    },
  }
}
