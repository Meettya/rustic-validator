type IsValid = boolean
type Message = unknown
type MessageString = string
type MessageCode = number
type TemplateStr = string
type TemplateFn<T> = (value: T) => Message

export type Keys = string | number
export type Value = unknown
export type Template<T> = TemplateStr | MessageCode | TemplateFn<T>
export type TestFn<T> = (value: T) => IsValid
export type ShortRule<T> = [TestFn<T>] | readonly [TestFn<T>]
export type LongStringRule<T> = [TestFn<T>, TemplateStr] | readonly [TestFn<T>, TemplateStr]
export type LongCodeRule<T> = [TestFn<T>, MessageCode] | readonly [TestFn<T>, MessageCode]
export type LongRule<T> = [TestFn<T>, Template<T>] | readonly [TestFn<T>, Template<T>]
export type AnyRule<T> = ShortRule<T> | LongStringRule<T> | LongCodeRule<T> | LongRule<T>
export type ShortResult = [IsValid]
export type LongStringResult = [IsValid, MessageString]
export type LongCodeResult = [IsValid, MessageCode]
export type LongResult = [IsValid, Message]
export type AnyResult = ShortResult | LongStringResult | LongCodeResult | LongResult
export type BaseResult<U> = U extends TemplateStr ?
  LongStringResult : U extends MessageCode ?
  LongCodeResult : LongResult
