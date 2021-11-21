/* eslint-disable @typescript-eslint/no-unused-vars */

import { validate } from '../'

/**
 * on place
 */

const res01 = validate('string', (val: string) => val === 'foo')
const res02 = validate('string', [(val: string) => val === 'foo'])
const res03 = validate('string', [(val: string) => val === 'foo', 'boo'])
const res04 = validate('string', [(val: string) => val === 'foo', (val: string) => `res ${val}`])
const res05 = validate(
  'string',
  [(val: string) => val === 'foo', 'boo'],
  [(val: string) => val === 'foo', (val: string) => `res ${val}`])

/**
 * all vars
 */

const stringValue = 'string'
const testFn = (val: string): boolean => val === 'foo'
const testFnArr = [testFn] as const
const ruleWithString = [(val: string) => val === 'foo', 'boo'] as const
const ruleWithFnTemplate = [(val: string) => val === 'foo', (val: string) => `res ${val}`] as const
const rulesPack = [ruleWithString, ruleWithFnTemplate]
const rulesPack2 = [
  [(val: string) => val === 'foo', 'boo'] as const,
  [(val: string) => val === 'foo', (val: string) => `res ${val}`] as const,
]

const res011 = validate(stringValue, testFn)
const res012 = validate(stringValue, testFnArr)
const res013 = validate(stringValue, ruleWithString)
const res014 = validate(stringValue, ruleWithFnTemplate)
const res015 = validate(stringValue, ruleWithString, ruleWithFnTemplate)
const res016 = validate(stringValue, ...rulesPack)
const res017 = validate(stringValue, ...rulesPack2)

/*
 * will return types error

const wrongRuleWithString = ['boo', (val: string) => val === 'foo'] as const
const res018 = validate(stringValue, wrongRuleWithString)
*/
