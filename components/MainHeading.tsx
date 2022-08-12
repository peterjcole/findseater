import Image from 'next/image'
import Link from 'next/link'
import { RefreshCw } from 'react-feather'
import { useRouter } from 'next/router'
import { Button } from './Button'

export const MainHeading = () => {
  const router = useRouter()
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-slate-600">
        <Link href="/" className="relative">
          <a>
            <span className="sr-only">Findseater</span>
            <Image alt="" src="/logo.svg" layout="fixed" height="132" width="132" />
          </a>
        </Link>
      </h1>
      <Button
        className="md:hidden m-4"
        aria-label="Refresh trains"
        type="button"
        onClick={() => router.replace(router.asPath)}
      >
        <RefreshCw size="14" />
        Refresh
      </Button>
    </div>
  )
}
