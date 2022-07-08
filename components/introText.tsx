import { ArrowRight, Repeat } from 'react-feather'
import { useRouter } from 'next/router'

export const IntroText = ({
  origin,
  destination,
  date,
  swappedUrl,
}: {
  origin: string
  destination: string
  date: string
  swappedUrl: string
}) => {
  const router = useRouter()
  return (
    <div className="mb-4 flex gap-x-4">
      <span className="sr-only">
        Upcoming trains from {origin} to {destination}, on {date}, sorted by arrival time:
      </span>
      <span
        aria-hidden
        className="inline-block px-2 py-1 rounded-md  outline outline-slate-200 outline-1"
      >
        {origin}
      </span>
      <div aria-hidden className="flex items-center">
        <ArrowRight className="inline" size="18" />
      </div>
      <span
        aria-hidden
        className="inline-block px-2 py-1 rounded-md  outline outline-slate-200 outline-1"
      >
        {destination}
      </span>
      <span
        aria-hidden
        className="inline-block px-2 py-1 rounded-md outline outline-slate-200 outline-1"
      >
        {date}
      </span>
      <button
        aria-label="Swap origin and destination"
        className="inline-block px-2 py-1 rounded-md shadow bg-slate-100"
        onClick={() => router.push(swappedUrl)}
      >
        <Repeat size="18" />
      </button>
    </div>
  )
}
