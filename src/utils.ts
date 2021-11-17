/**
 * Utilites set for validator
 */

type AnyResult = import('@/index').AnyResult
type LongStringResult = import('@/index').LongStringResult
type LongCodeResult = import('@/index').LongCodeResult
type LongResult = import('@/index').LongResult
type ShortResult = import('@/index').ShortResult
type Keys = string | number

const getErrorIdx = (report: AnyResult[]): number => report.findIndex(val => !val[0])

const getObjectStatus = (report: Record<Keys, AnyResult | AnyResult[]>): boolean => {
  const keys = Object.keys(report)

  for (let i = 0, lng = keys.length; i < lng; i++) {
    const res = getStatus(report[keys[i]])

    if (!res)
      return false
  }

  return true
}

const getObjectAnyFirstError = (report: Record<Keys, AnyResult | AnyResult[]>): [] | AnyResult => {
  const keys = Object.keys(report)

  for (let i = 0, lng = keys.length; i < lng; i++) {
    const res = getFirstError(report[keys[i]])

    if (typeof res[0] === 'boolean' && !res[0])
      return res
  }

  return []
}

const getStatus = (report: AnyResult | AnyResult[] | Record<Keys, AnyResult | AnyResult[]>): boolean => {
  if (typeof report[0] === 'boolean')
    return report[0]

  if (Array.isArray(report))
    return getErrorIdx(report as AnyResult[]) === -1

  return getObjectStatus(report)
}

function getFirstError(report: ShortResult | ShortResult[] | Record<Keys, ShortResult | ShortResult[]>): [] | ShortResult
function getFirstError(report: LongStringResult | LongStringResult[] | Record<Keys, LongStringResult | LongStringResult[]>): [] | LongStringResult
function getFirstError(report: LongCodeResult | LongCodeResult[] | Record<Keys, LongCodeResult | LongCodeResult[]>): [] | LongCodeResult
function getFirstError(report: LongResult | LongResult[] | Record<Keys, LongResult | LongResult[]>): [] | LongResult
function getFirstError(report: AnyResult | AnyResult[] | Record<Keys, AnyResult | AnyResult[]>): [] | AnyResult
function getFirstError(report: AnyResult | AnyResult[] | Record<Keys, AnyResult | AnyResult[]>): [] | AnyResult {
  if (typeof report[0] === 'boolean')
    return report[0] ? [] : report as AnyResult

  if (Array.isArray(report)) {
    const idx = getErrorIdx(report as AnyResult[])

    return idx === -1 ? [] : report[idx] as AnyResult
  }

  return getObjectAnyFirstError(report)
}

export { getFirstError, getStatus }
