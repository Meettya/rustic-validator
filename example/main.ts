import { validate } from '../'

const isNonEmpty = (val: string): boolean => val.length > 0
const isName = (val: string): boolean => /^\w+$/.test(val)
const isAlice = (val: string): boolean => val === "Alice"
const onlyHumanRule = [isName, "You are not human"] as const
const onlyAliceRule = [isAlice, (val: string) => `You are ${val}, not Alice!`] as const

const res = ["", "R2-D2", "Bob", "Alice"].map((name) =>
  validate(
    name,
    isNonEmpty, // // - rule without message
    onlyHumanRule, // - rule with message
    onlyAliceRule, // - rule with message fn
  ),
)

console.log(res)

/*
=> [
  [ false ],
  [ false, 'You are not human' ],
  [ false, 'You are Bob, not Alice!' ],
  [ true ]
]
*/
