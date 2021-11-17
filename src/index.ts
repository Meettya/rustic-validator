type IsValid = boolean
type Message = unknown
type MessageString = string
type MessageCode = number
type TemplateStr = string
type Value = unknown
type TemplateFn<T> = (value: T) => Message
type Template<T> = TemplateStr | MessageCode | TemplateFn<T>
type TestFn<T> = (value: T) => IsValid
type ShortRule<T> = [TestFn<T>]
type LongStringRule<T> = [TestFn<T>, TemplateStr]
type LongCodeRule<T> = [TestFn<T>, MessageCode]
type LongRule<T> = [TestFn<T>, Template<T>]
type AnyRule<T> = [TestFn<T>, Template<T>?]
export type ShortResult = [IsValid]
export type LongStringResult = [IsValid, MessageString]
export type LongCodeResult = [IsValid, MessageCode]
export type LongResult = [IsValid, Message]
export type AnyResult = [IsValid, Message?]

function testCase<T extends Value>(value: T, [testFn]: ShortRule<T>): ShortResult
function testCase<T extends Value>(value: T, [testFn, template]: LongRule<T>): AnyResult
function testCase<T extends Value>(value: T, rule: AnyRule<T>): AnyResult
function testCase<T extends Value>(value: T, rule: AnyRule<T>): AnyResult {
  const res = rule[0](value)

  if (res)
    return [res] as ShortResult

  switch (typeof rule[1]) {
    case 'string': return [res, rule[1]] as LongStringResult
    case 'number': return [res, rule[1]] as LongCodeResult
    case 'function': return [res, rule[1](value)] as LongResult
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
    const rule = typeof rules[i] === 'function' ? [rules[i]] as ShortRule<T> : rules[i]
    const current = testCase(value, rule as AnyRule<T>)

    res.push(current)
    if (!(current[0] || isFull))
      break
  }

  return res
}

/**
 * Return on first fail test
 */
function validate<T extends Value>(value: T, rule: ShortRule<T> | TestFn<T>, ...rules: Array<ShortRule<T> | TestFn<T>>): ShortResult
function validate<T extends Value>(value: T, rule: LongStringRule<T>, ...rules: Array<LongStringRule<T>>): LongStringResult
function validate<T extends Value>(value: T, rule: LongCodeRule<T>, ...rules: Array<LongCodeRule<T>>): LongCodeResult
function validate<T extends Value>(value: T, rule: LongRule<T>, ...rules: Array<LongRule<T>>): LongResult
function validate<T extends Value>(value: T, rule: AnyRule<T> | TestFn<T>, ...rules: Array<AnyRule<T> | TestFn<T>>): AnyResult
function validate<T extends Value>(value: T, rule: AnyRule<T> | TestFn<T>, ...rules: Array<AnyRule<T> | TestFn<T>>): AnyResult {
  return validator(value, [rule, ...rules], false).pop() as unknown as AnyResult
}

/**
 * Process all test
 */
function checkAll<T extends Value>(value: T, rule: ShortRule<T> | TestFn<T>, ...rules: Array<ShortRule<T> | TestFn<T>>): ShortResult[]
function checkAll<T extends Value>(value: T, rule: LongStringRule<T>, ...rules: Array<LongStringRule<T>>): LongStringResult[]
function checkAll<T extends Value>(value: T, rule: LongCodeRule<T>, ...rules: Array<LongCodeRule<T>>): LongCodeResult[]
function checkAll<T extends Value>(value: T, rule: LongRule<T>, ...rules: Array<LongRule<T>>): LongResult[]
function checkAll<T extends Value>(value: T, rule: AnyRule<T> | TestFn<T>, ...rules: Array<AnyRule<T> | TestFn<T>>): AnyResult[]
function checkAll<T extends Value>(value: T, rule: AnyRule<T> | TestFn<T>, ...rules: Array<AnyRule<T> | TestFn<T>>): AnyResult[] {
  return validator(value, [rule, ...rules], true)
}

export { validate, checkAll }
