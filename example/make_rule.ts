import { validate } from '../'
import { makeRule } from '../dist/utils'

const isNonEmpty = (val: string): boolean => val.length > 0
const isName = (val: string): boolean => /^\w+$/.test(val)
const isAlice = (val: string): boolean => val === "Alice"
const onlyHumanRule = makeRule(isName, "You are not human")
const onlyAliceRule = makeRule(isAlice, (val: string) => `You are ${val}, not Alice!`)

const res = ["", "R2-D2", "Bob", "Alice"].map((name) =>
  validate(
    name,
    isNonEmpty, // // - rule without message
    onlyHumanRule, // - rule with message
    onlyAliceRule, // - rule with message fn
  ),
)

console.log(res)
