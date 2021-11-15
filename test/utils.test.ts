/*
 * Test suite for rustic-validator
 */

import { getFirstError, getStatus } from '../dist/utils'

describe("getStatus()", () => {
  describe("should return succes for positive case", () => {
    describe("returned by checkAll()", () => {
      test("as one value", () => {
        const res = getStatus([[true]])

        expect(res).toBe(true)
      })
      test("on number values", () => {
        const res = getStatus([[true], [true]])

        expect(res).toBe(true)
      })
    })
    describe("returned by validate()", () => {
      test("as one value", () => {
        const res = getStatus([true])

        expect(res).toBe(true)
      })
    })
    describe("for result object", () => {
      test("as one value by checkAll()", () => {
        const res = getStatus({ a: [[true]] })

        expect(res).toBe(true)
      })
      test("on number values by checkAll()", () => {
        const res = getStatus({ a: [[true], [true]] })

        expect(res).toBe(true)
      })
      test("as one value by validate()", () => {
        const res = getStatus({ a: [true] })

        expect(res).toBe(true)
      })
      test("on number values with some keys)", () => {
        const res = getStatus({ a: [[true], [true]], b: [[true], [true]] })

        expect(res).toBe(true)
      })
    })
  })
  describe("should return fail for negative case", () => {
    describe("returned by checkAll()", () => {
      test("as one value", () => {
        const res = getStatus([[false]])

        expect(res).toBe(false)
      })
      test("on number values", () => {
        const res = getStatus([[false], [false]])

        expect(res).toBe(false)
      })
      test("as one value with message", () => {
        const res = getStatus([[false, 'invalid']])

        expect(res).toBe(false)
      })
      test("on number values with message", () => {
        const res = getStatus([[false, 'invalid'], [false, 'invalid']])

        expect(res).toBe(false)
      })
      test("on number values (first invalid, second valid)", () => {
        const res = getStatus([[true], [false, 'invalid']])

        expect(res).toBe(false)
      })
      test("on number values  (first valid, second invalid)", () => {
        const res = getStatus([[false, 'invalid'], [true]])

        expect(res).toBe(false)
      })
    })
    describe("returned by validate()", () => {
      test("as one value", () => {
        const res = getStatus([false])

        expect(res).toBe(false)
      })
      test("as one value with message", () => {
        const res = getStatus([false, 'invalid'])

        expect(res).toBe(false)
      })
    })
    describe("for result object", () => {
      test("as one value by checkAll()", () => {
        const res = getStatus({ a: [[false]] })

        expect(res).toBe(false)
      })
      test("on number values by checkAll()", () => {
        const res = getStatus({ a: [[false], [false]] })

        expect(res).toBe(false)
      })
      test("as one value by validate()", () => {
        const res = getStatus({ a: [false] })

        expect(res).toBe(false)
      })
      test("on number values with some keys)", () => {
        const res = getStatus({ a: [[true], [true]], b: [[true], [false]] })

        expect(res).toBe(false)
      })
    })
  })
})

describe("getFirstError()", () => {
  describe("should return empty array on positive case", () => {
    describe("returned by checkAll()", () => {
      test("as one value", () => {
        const res = getFirstError([[true]])

        expect(res).toStrictEqual([])
      })
      test("on number values", () => {
        const res = getFirstError([[true], [true]])

        expect(res).toStrictEqual([])
      })
    })
    describe("returned by validate()", () => {
      test("as one value", () => {
        const res = getFirstError([true])

        expect(res).toStrictEqual([])
      })
    })
    describe("for result object", () => {
      test("as one value by checkAll()", () => {
        const res = getFirstError({ a: [[true]] })

        expect(res).toStrictEqual([])
      })
      test("on number values by checkAll()", () => {
        const res = getFirstError({ a: [[true], [true]] })

        expect(res).toStrictEqual([])
      })
      test("as one value by validate()", () => {
        const res = getFirstError({ a: [true] })

        expect(res).toStrictEqual([])
      })
      test("on number values with some keys)", () => {
        const res = getFirstError({ a: [[true], [true]], b: [[true], [true]] })

        expect(res).toStrictEqual([])
      })
    })
  })
  describe("should return first error for negative case", () => {
    describe("returned by checkAll()", () => {
      test("as one value", () => {
        const res = getFirstError([[false]])

        expect(res).toStrictEqual([false])
      })
      test("on number values", () => {
        const res = getFirstError([[false], [false]])

        expect(res).toStrictEqual([false])
      })
      test("as one value with message", () => {
        const res = getFirstError([[false, 'invalid']])

        expect(res).toStrictEqual([false, 'invalid'])
      })
      test("on number values with message", () => {
        const res = getFirstError([[false, 'invalid2'], [false, 'invalid']])

        expect(res).toStrictEqual([false, 'invalid2'])
      })
      test("on number values (first invalid, second valid)", () => {
        const res = getFirstError([[true], [false, 'invalid']])

        expect(res).toStrictEqual([false, 'invalid'])
      })
      test("on number values  (first valid, second invalid)", () => {
        const res = getFirstError([[false, 'invalid'], [true]])

        expect(res).toStrictEqual([false, 'invalid'])
      })
    })
    describe("returned by validate()", () => {
      test("as one value", () => {
        const res = getFirstError([false])

        expect(res).toStrictEqual([false])
      })
      test("as one value with message", () => {
        const res = getFirstError([false, 'invalid'])

        expect(res).toStrictEqual([false, 'invalid'])
      })
    })
    describe("for result object", () => {
      test("as one value by checkAll()", () => {
        const res = getFirstError({ a: [[false]] })

        expect(res).toStrictEqual([false])
      })
      test("on number values by checkAll()", () => {
        const res = getFirstError({ a: [[true, 'a'], [false, 'b']] })

        expect(res).toStrictEqual([false, 'b'])
      })
      test("as one value by validate()", () => {
        const res = getFirstError({ a: [false] })

        expect(res).toStrictEqual([false])
      })
      test("on number values with numbers of keys", () => {
        const res = getFirstError({ a: [[true], [true]], b: [[false, 'a'], [false, 'b']] })

        expect(res).toStrictEqual([false, 'a'])
      })
      // eslint-disable-next-line jest/no-commented-out-tests
      /** can`t use this test case - keys order not garanted by RFC ¯\_(ツ)_/¯
      test("on number values with numbers of false keys", () => {
        const res = getFirstError({ a: [[false, 'a']], b: [[false, 'b']] })

        expect(res).toStrictEqual([false, 'a'])
      })
      */
    })
  })
})
