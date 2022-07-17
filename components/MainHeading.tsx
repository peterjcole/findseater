import Image from 'next/image'
import Link from 'next/link'

export const MainHeading = () => (
  <h1 className="text-3xl font-bold text-slate-600">
    <Link href="/" className="relative">
      <a>
        <span className="sr-only">Findseater</span>
        <Image alt="" src="/logo.svg" layout="fixed" height="132" width="132" />
      </a>
    </Link>
  </h1>
)
