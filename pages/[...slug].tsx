import type { GetServerSideProps, NextPage } from 'next'
import type { GetServerSidePropsContext } from 'next/types'
import { TrainTable } from '../components/TrainTable'
import type { TrainLoading, Trains } from '../types/trains'
import { useEffect, useState } from 'react'
import { getTrains } from '../shared/data'

const TrainPage: NextPage<Props> = ({ trains: { services, origin, destination } }) => {
  const [trainLoading, setTrainLoading] = useState<TrainLoading | null>(null)

  useEffect(() => {
    fetch('/api/trainLoading', {
      method: 'POST',
      body: JSON.stringify({
        trainServices: services.map((service) => service.tsid),
        origin: origin.crs,
        destination: destination.crs,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTrainLoading(data)
      })

    localStorage.setItem(
      'recentStations',
      JSON.stringify([
        origin.crs,
        destination.crs,
        ...JSON.parse(localStorage.getItem('recentStations') || '[]').filter(
          (crs: string) => crs !== origin.crs && crs !== destination.crs
        ),
      ])
    )
  }, [services, origin.crs, destination.crs])

  return <TrainTable services={services} trainLoading={trainLoading} />
}

export default TrainPage

type Props = {
  trains: Trains
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const [origin, destination, year, month, day] = context.query.slug || []

  const trains = await getTrains({
    origin,
    destination,
    date: { year, month, day },
  })

  return {
    props: {
      trains,
    },
  }
}
