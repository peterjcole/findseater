import type { GetServerSideProps, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import type { Trains } from '../../../../../types/trains'
import { getData } from '../../../../../shared/data'
import { TrainTable } from '../../../../../components/TrainTable'
import { mapTrains } from '../../../../../shared/mappers'
import { IntroText } from '../../../../../components/introText'

const Day: NextPage<Props> = ({ trains: { availability, origin, destination, formattedDate } }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 pt-10">
      <div className="py-4">
        <h1 className="text-3xl font-bold mb-2">Findseater</h1>
        <IntroText origin={origin.name} destination={destination.name} date={formattedDate} />
      </div>
      <TrainTable availability={availability} />
    </div>
  )
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
