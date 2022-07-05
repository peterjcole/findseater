export const uidToTsid = (serviceUid: string, runDate: string) => {
  const numericalDate = runDate.replace(/-/g, '')

  const numericalUid = `${serviceUid.slice(0, 1).charCodeAt(0)}${serviceUid.slice(1)}`

  return `${numericalDate}${numericalUid}`
}

export const tsidToUid = (tsid: string) => {
  const numericalUid = tsid.slice(8)
  const charCode = parseInt(numericalUid.slice(0, -5))
  const digits = numericalUid.slice(-5)

  return `${String.fromCharCode(charCode)}${digits}`
}

export const formatTime = (time: string | any[] | undefined) =>
  time && `${time?.slice(0, 2)}:${time?.slice(2, 4)}`

export const getBgColourClass = (loadingLevel: number | null | undefined) => {
  if (!loadingLevel) {
    return ''
  }

  if (loadingLevel < 40) {
    return `bg-green-100`
  }

  if (loadingLevel < 50) {
    return `bg-lime-100`
  }

  if (loadingLevel < 60) {
    return `bg-amber-100`
  }

  if (loadingLevel < 90) {
    return `bg-amber-100`
  }

  return `bg-red-100`
}

export const getTextColourClass = (loadingLevel: number | null | undefined) => {
  if (!loadingLevel) {
    return ''
  }

  if (loadingLevel < 40) {
    return `text-green-800`
  }

  if (loadingLevel < 50) {
    return `text-lime-800`
  }

  if (loadingLevel < 60) {
    return `text-amber-800`
  }

  if (loadingLevel < 90) {
    return `text-amber-800`
  }

  return `text-red-800`
}
