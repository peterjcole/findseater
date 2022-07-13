import type { GetServerSideProps, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import type { Trains } from '../../../../../types/trains'
import { getData } from '../../../../../shared/data'
import { TrainTable } from '../../../../../components/TrainTable'
import { mapTrains } from '../../../../../shared/mappers'

const Day: NextPage<Props> = ({ trains: { availability } }) => {
  return <TrainTable availability={availability} />
}

export default Day

type Props = {
  trains: Trains
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { origin, destination, year, month, day } = context.query as {
    origin: string
    destination: string
    year: string
    month: string
    day: string
  }

  const date = { year, month, day }

  const { locationLineUp, availability, serviceInfo } = await getData({
    origin,
    destination,
    date,
  })

  return {
    props: {
      trains: mapTrains({
        availability,
        origin,
        destination,
        locationLineUp,
        serviceInfo,
        date,
      }),
    },
  }
}
