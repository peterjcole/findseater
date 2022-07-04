export const uidToTsid = (serviceUid: string, runDate: string) => {
  const numericalDate = runDate.replace(/-/g, '')

  const numericalUid = `${serviceUid.slice(0, 1).charCodeAt(0)}${serviceUid.slice(1)}`

  return `${numericalDate}${numericalUid}`
}

export const tsidToUid = (tsid: string) => {
  const numericalUid = tsid.slice(8)
  const charCode = parseInt(numericalUid.slice(0, -5))
  const digits = numericalUid.slice(-5)

  console.log(charCode)
  console.log(digits)

  return `${String.fromCharCode(charCode)}${digits}`
}
