type Value = import('@/types').Value
type TestFn<T> = import('@/types').TestFn<T>
type Template<T> = import('@/types').Template<T>
type ShortRule<T> = import('@/types').ShortRule<T>
type LongStringRule<T> = import('@/types').LongStringRule<T>
type LongCodeRule<T> = import('@/types').LongCodeRule<T>
type LongRule<T> = import('@/types').LongRule<T>
type AnyRule<T> = import('@/types').AnyRule<T>
type ShortResult = import('@/types').ShortResult
type LongStringResult = import('@/types').LongStringResult
type LongCodeResult = import('@/types').LongCodeResult
type LongResult = import('@/types').LongResult
type AnyResult = import('@/types').AnyResult
type BaseResult<U> = import('@/types').BaseResult<U>

function testCase<T extends Value>(value: T, testFn: TestFn<T>): ShortResult
function testCase<T extends Value, U extends Template<T>>(value: T, testFn: TestFn<T>, template?: U): ShortResult | BaseResult<U>
function testCase<T extends Value, U extends Template<T>>(value: T, testFn: TestFn<T>, template?: U): ShortResult | BaseResult<U> {
  const res = testFn(value)

  if (res)
    return [res] as ShortResult

  switch (typeof template) {
    case 'string':
    case 'number':
      return [res, template] as BaseResult<U>
    case 'function':
      return [res, template(value)] as BaseResult<U>
    default:
      return [res] as ShortResult
  }
}

function validator<T extends Value>(value: T, rules: Array<ShortRule<T> | TestFn<T>>, isFull: boolean): ShortResult[]
function validator<T extends Value>(value: T, rules: Array<LongStringRule<T>>, isFull: boolean): LongStringResult[]
function validator<T extends Value>(value: T, rules: Array<LongCodeRule<T>>, isFull: boolean): LongCodeResult[]
function validator<T extends Value>(value: T, rules: Array<LongRule<T>>, isFull: boolean): LongResult[]
function validator<T extends Value>(value: T, rules: Array<AnyRule<T> | TestFn<T>>, isFull: boolean): AnyResult[]
function validator<T extends Value>(value: T, rules: Array<AnyRule<T> | TestFn<T>>, isFull: boolean): AnyResult[] {
  const res: AnyResult[] = []

  for (let i = 0, lng = rules.length; i < lng; i++) {
    const rule = rules[i]
    let current: AnyResult

    if (typeof rule === 'function') {
      current = testCase(value, rule)
    } else if (typeof rule[1] === 'undefined') {
      current = testCase(value, rule[0])
    } else {
      current = testCase(value, rule[0], rule[1])
    }

    res.push(current)
    if (!(current[0] || isFull))
      break
  }

  return res
}

/**
 * Return on first fail test
 */
function validate<T extends Value>(value: T, ...rules: Array<ShortRule<T> | TestFn<T>>): ShortResult
function validate<T extends Value>(value: T, ...rules: Array<LongStringRule<T>>): LongStringResult | ShortResult
function validate<T extends Value>(value: T, ...rules: Array<LongCodeRule<T>>): LongCodeResult | ShortResult
function validate<T extends Value>(value: T, ...rules: Array<LongRule<T>>): LongResult | ShortResult
function validate<T extends Value>(value: T, ...rules: Array<AnyRule<T> | TestFn<T>>): AnyResult
function validate<T extends Value>(value: T, ...rules: Array<AnyRule<T> | TestFn<T>>): AnyResult {
  return validator(value, rules, false).pop() as unknown as AnyResult
}

/**
 * Process all test
 */
function checkAll<T extends Value>(value: T, ...rules: Array<ShortRule<T> | TestFn<T>>): ShortResult[]
function checkAll<T extends Value>(value: T, ...rules: Array<LongStringRule<T>>): Array<LongStringResult | ShortResult>
function checkAll<T extends Value>(value: T, ...rules: Array<LongCodeRule<T>>): Array<LongCodeResult | ShortResult>
function checkAll<T extends Value>(value: T, ...rules: Array<LongRule<T>>): Array<LongResult | ShortResult>
function checkAll<T extends Value>(value: T, ...rules: Array<AnyRule<T> | TestFn<T>>): AnyResult[]
function checkAll<T extends Value>(value: T, ...rules: Array<AnyRule<T> | TestFn<T>>): AnyResult[] {
  return validator(value, rules, true)
}

export { validate, checkAll }
