import { getCookie } from 'cookies-next'
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'

const Index: NextPage = () => {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const [origin, destination] = loadStations(context)

  return {
    redirect: {
      permanent: false,
      destination: `/${origin}/${destination}`,
    },
    props: {},
  };
}

function loadStations(context: GetServerSidePropsContext) {
  const stations = getCookie('stations', context)
  if (typeof stations === 'string' && !!stations.match(/^[A-Z]+\/[A-Z]+$/)) {
    return stations.split('/')
  }
  return ['CHX', 'HGS']
}

export default Index
