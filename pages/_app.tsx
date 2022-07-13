import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Loader } from 'react-feather'
import { TrainForm } from '../components/TrainForm'
import { MainHeading } from '../components/MainHeading'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  useEffect(() => {
    const handleStart = () => {
      setPageLoading(true)
    }
    const handleComplete = () => {
      setPageLoading(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
  }, [router])

  const { origin, destination, year, month, day } = router.query as {
    origin: string
    destination: string
    year: string
    month: string
    day: string
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pt-10 text-slate-800">
      <MainHeading />
      <TrainForm origin={origin} destination={destination} year={year} month={month} day={day} />
      {pageLoading ? (
        <div className="flex items-center justify-center absolute top-0 bottom-0 left-0 right-0">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </div>
  )
}

export default MyApp
