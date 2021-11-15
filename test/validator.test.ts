/*
 * Test suite for rustic-validator
 */

import { checkAll, validate } from '../'

const validValue = 'valid'
const invalidValue = 'invalid'
const invalidValueTwo = 'invalid2'
const testFn = (val: string): boolean => val === validValue
const testInvalidFn = (val: string): boolean => val === invalidValue

describe("validate()", () => {
  describe("should return succes for positive case", () => {
    test("as one function", () => {
      const res = validate(validValue, testFn)

      expect(res).toStrictEqual([true])
    })
    test("as number function", () => {
      const res = validate(validValue, testFn, testFn)

      expect(res).toStrictEqual([true])
    })
    test("as one function into array", () => {
      const res = validate(validValue, [testFn])

      expect(res).toStrictEqual([true])
    })
    test("as number function into arrays`", () => {
      const res = validate(validValue, [testFn], [testFn])

      expect(res).toStrictEqual([true])
    })
    test("as one test case with string message", () => {
      const res = validate(validValue, [testFn, 'invalid'])

      expect(res).toStrictEqual([true])
    })
    test("as number test cases with string message`", () => {
      const res = validate(validValue, [testFn, 'invalid'], [testFn, 'invalid'])

      expect(res).toStrictEqual([true])
    })
    test("as number test cases with first string message`", () => {
      const res = validate(validValue, [testFn, 'invalid'], [testFn])

      expect(res).toStrictEqual([true])
    })
    test("as number test cases with last string message`", () => {
      const res = validate(validValue, [testFn], [testFn, 'invalid'])

      expect(res).toStrictEqual([true])
    })
    test("as one test case with function template", () => {
      const res = validate(validValue, [testFn, (val) => val])

      expect(res).toStrictEqual([true])
    })
    test("as number test cases with function template", () => {
      const res = validate(validValue, [testFn, (val) => val], [testFn, (val) => val])

      expect(res).toStrictEqual([true])
    })
  })

  describe("should return succes for positive case with any value type", () => {
    test("as number", () => {
      const res = validate(22, (val: number) => val === 22)

      expect(res).toStrictEqual([true])
    })
    test("as string", () => {
      const res = validate(validValue, testFn)

      expect(res).toStrictEqual([true])
    })
    test("as boolean", () => {
      const res = validate(false, (val: boolean) => !val)

      expect(res).toStrictEqual([true])
    })
    test("as object", () => {
      const res = validate({ a: 1 }, (val: Record<string, number>) => val.a === 1)

      expect(res).toStrictEqual([true])
    })
    test("as array", () => {
      const res = validate([1, 2], (val: number[]) => val[0] === 1)

      expect(res).toStrictEqual([true])
    })
    test("as Map", () => {
      const testValue = new Map([['a', 1]])
      const res = validate(testValue, (val: Map<string, number>) => val.get('a') === 1)

      expect(res).toStrictEqual([true])
    })
    test("as Set", () => {
      const testValue = new Set(['a', 1])
      const res = validate(testValue, (val: Set<string | number>) => val.has('a'))

      expect(res).toStrictEqual([true])
    })
    test("as Date", () => {
      const testValue = new Date('1985-10-26T01:22:00')
      const res = validate(testValue, (val: Date) => val.getFullYear() === 1985)

      expect(res).toStrictEqual([true])
    })
  })

  describe("should return fail for negative case", () => {
    test("as one function", () => {
      const res = validate(invalidValue, testFn)

      expect(res).toStrictEqual([false])
    })
    test("as number function", () => {
      const res = validate(invalidValue, testFn, testFn)

      expect(res).toStrictEqual([false])
    })
    test("as one function into array", () => {
      const res = validate(invalidValue, [testFn])

      expect(res).toStrictEqual([false])
    })
    test("as number function into arrays", () => {
      const res = validate(invalidValue, [testFn], [testFn])

      expect(res).toStrictEqual([false])
    })
    test("as one test case with string message", () => {
      const res = validate(invalidValue, [testFn, invalidValue])

      expect(res).toStrictEqual([false, invalidValue])
    })
    test("as number test cases with string message (stop on first)", () => {
      const res = validate(invalidValue, [testFn, invalidValue], [testFn, invalidValueTwo])

      expect(res).toStrictEqual([false, invalidValue])
    })
    test("as number test cases with first string message (stop on first)", () => {
      const res = validate(invalidValue, [testFn, invalidValue], [testFn])

      expect(res).toStrictEqual([false, invalidValue])
    })
    test("as number test cases with last string message (stop on first)", () => {
      const res = validate(invalidValue, [testFn], [testFn, invalidValue])

      expect(res).toStrictEqual([false])
    })
    test("as number test different cases with string message (stop on second)", () => {
      const res = validate(invalidValue, [testInvalidFn, invalidValue], [testFn, invalidValueTwo])

      expect(res).toStrictEqual([false, invalidValueTwo])
    })
    test("as one test case with function template", () => {
      const res = validate(invalidValue, [testFn, (val) => val])

      expect(res).toStrictEqual([false, invalidValue])
    })
    test("as number test cases with function template", () => {
      const res = validate(invalidValue, [testFn, (val) => val], [testFn, (val) => `${val}2`])

      expect(res).toStrictEqual([false, invalidValue])
    })
  })
  describe("should return fail for negative case and use message with any value type", () => {
    test("as number", () => {
      const res = validate(22, [(val: number) => val === 50, (val: number) => val + 19])

      expect(res).toStrictEqual([false, 41])
    })
    test("as string", () => {
      const res = validate(invalidValue, [testFn, (val) => val])

      expect(res).toStrictEqual([false, invalidValue])
    })
  })
})

describe("checkAll()", () => {
  describe("should return succes for positive case", () => {
    test("as one function", () => {
      const res = checkAll(validValue, testFn)

      expect(res).toStrictEqual([[true]])
    })
    test("as number function", () => {
      const res = checkAll(validValue, testFn, testFn)

      expect(res).toStrictEqual([[true], [true]])
    })
    test("as one function into array", () => {
      const res = checkAll(validValue, [testFn])

      expect(res).toStrictEqual([[true]])
    })
    test("as number function into arrays`", () => {
      const res = checkAll(validValue, [testFn], [testFn])

      expect(res).toStrictEqual([[true], [true]])
    })
    test("as one test case with string message", () => {
      const res = checkAll(validValue, [testFn, 'invalid'])

      expect(res).toStrictEqual([[true]])
    })
    test("as number test cases with string message`", () => {
      const res = checkAll(validValue, [testFn, 'invalid'], [testFn, 'invalid'])

      expect(res).toStrictEqual([[true], [true]])
    })
  })

  describe("should return fail for negative case", () => {
    test("as one function", () => {
      const res = checkAll(invalidValue, testFn)

      expect(res).toStrictEqual([[false]])
    })
    test("as number function", () => {
      const res = checkAll(invalidValue, testFn, testFn)

      expect(res).toStrictEqual([[false], [false]])
    })
    test("as one function into array", () => {
      const res = checkAll(invalidValue, [testFn])

      expect(res).toStrictEqual([[false]])
    })
    test("as number function into arrays", () => {
      const res = checkAll(invalidValue, [testFn], [testFn])

      expect(res).toStrictEqual([[false], [false]])
    })
    test("as one test case with string message", () => {
      const res = checkAll(invalidValue, [testFn, invalidValue])

      expect(res).toStrictEqual([[false, invalidValue]])
    })
    test("as number test cases with string message", () => {
      const res = checkAll(invalidValue, [testFn, invalidValue], [testFn, invalidValueTwo])

      expect(res).toStrictEqual([[false, invalidValue], [false, invalidValueTwo]])
    })
    test("as number test cases with first string message", () => {
      const res = checkAll(invalidValue, [testFn, invalidValue], [testFn])

      expect(res).toStrictEqual([[false, invalidValue], [false]])
    })
    test("as number test cases with last string message", () => {
      const res = checkAll(invalidValue, [testFn], [testFn, invalidValue])

      expect(res).toStrictEqual([[false], [false, invalidValue]])
    })
    test("as number test different cases with string message (first valid, second invalid)", () => {
      const res = checkAll(invalidValue, [testInvalidFn, invalidValue], [testFn, invalidValueTwo])

      expect(res).toStrictEqual([[true], [false, invalidValueTwo]])
    })
    test("as number test different cases with function template (first invalid, second valid)", () => {
      const res = checkAll(invalidValue, [testFn, (val) => `${val}2`], [testInvalidFn, invalidValue])

      expect(res).toStrictEqual([[false, invalidValueTwo], [true]])
    })
  })
})
