import type { FunctionComponent } from 'react'
import { twMerge } from 'tailwind-merge'

export const Button: FunctionComponent<React.ComponentPropsWithoutRef<'button'>> = ({
  children,
  className,
  ...props
}) => {
  const defaultClasses =
    'text-primary-300 bg-primary-2 inline-flex leading-none gap-2 px-2 py-1 justify-center items-center rounded-md shadow h-[30px] min-w-[30px] hover:bg-primary-5 hover:border-background-150 hover:drop-shadow-lg active:bg-primary-5 border border-background-100'
  return (
    <button className={twMerge(defaultClasses, className || '')} {...props}>
      {children}
    </button>
  )
}
