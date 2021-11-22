[![Test status](https://github.com/Meettya/rustic-validator/actions/workflows/tests.yml/badge.svg)](https://github.com/Meettya/rustic-validator/actions/workflows/tests.yml) &emsp; [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Meettya/rustic-validator.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Meettya/rustic-validator/context:javascript) &emsp; ![Dependenies](https://img.shields.io/badge/dependencies-ZERO-green) &emsp; ![Size](https://badgen.net/bundlephobia/minzip/rustic-validator)

# Rustic validator

## Overview

It`s like LEGO© for data validation. Just write some simple rules, add any messages and join them together.

## Example

```typescript
import { validate } from "rustic-validator"

const isNonEmpty = (val: string): boolean => val.length > 0
const isName = (val: string): boolean => /^\w+$/.test(val)
const isAlice = (val: string): boolean => val === "Alice"
const onlyHumanRule = [isName, "You are not human"] as const
const onlyAliceRule = [
  isAlice,
  (val: string) => `You are ${val}, not Alice!`,
] as const

validate("Bob", isNonEmpty, onlyHumanRule, onlyAliceRule)
// => [ false, 'You are Bob, not Alice!' ]
validate("Alice", isNonEmpty, onlyHumanRule, onlyAliceRule)
// => [ true ]
```

## Description

This library gets a test suit like the list of rules, and the rule is ordinary function `(value: unknown) => boolean`, singe or paired with the message. Use native JS, without wired chaining with fancy probe names.

Test suit passes from first to last rule, stoping on the first fail case. Full scan version included too. Any value type is allowed.

Moreover, with the main validation library come some helpful utils to process check results. For example - get a resume for the complex result. See below.

Full TS support and full test cover included.

## Install

```sh
# using yarn
yarn add rustic-validator
```

```sh
# using npm
npm install rustic-validator
```

## Important about rules notations

Due to the lack of JS native type Tuple, it is a little bit tricky to have simplicity at rules and type-safe checking at one time.

while this in place notation works well, as TS correctly get type as Tuple `[(unknown) => boolean, string]`

```typescript
validate("foo", [checkFn, "message"])
```

this example will not work, because TS cast `rule` as Array `(string | (unknown) => boolean)[]`, not Tuple.

```typescript
const rule = [checkFn, "message"]
validate("foo", rule) // TS complain (string | (unknown) => boolean)[] IS NOT [(unknown) => boolean, string]
```

As a workaround its exists some ways:

- use `(string | (unknown) => boolean)[]` instead `[(unknown) => boolean, string]`, but its pointless by non-type safe at all

- export all rules types and use them, but they are using generic notation like `ShortRule<T>` plus it needed to correct set to every rule

- use tricky notation `[checkFn, "message"] as const` to ensure TS use Tuple type

So, here used last solutions as the simplest and brief

```typescript
const rule = [checkFn, "message"] as const
validate("foo", rule) // all works well

/* type safe  */
const wrongRule = ["message", checkFn] as const
validate("foo", wrongRule) // will rase type error
```

Also, its may be used helper from `utils` (see below)

```typescript
import { makeRule } from "rustic-validator/utils"

const isName = (val: string): boolean => /^\w+$/.test(val)
const onlyHumanRule = makeRule(isName, "You are not human")

// => onlyHumanRule type is Tuple [(val: string) => boolean, string]
```

## Usage

Library export next functions:

### validate()

```typescript
import { validate } from "rustic-validator"

// (unknown, (unknown) => boolean) => [boolean]
validate("foo", checkFn)
// (unknown, [(unknown) => boolean]) => [boolean]
validate("foo", [checkFn])
// (unknown, [(unknown) => boolean, string]) => [boolean, string?]
validate("foo", [checkFn, "message"])
// (unknown, [(unknown) => boolean, number]) => [boolean, number?]
validate("foo", [checkFn, 42])
// (unknown, [(unknown) => boolean, (unknown) => string]) => [boolean, string?]
validate("foo", [checkFn, messageFn])
// any number and any kind of rules allowed
validate(
  "foo",
  [checkFn, messageFn], /// - execute success
  checkFn2, //           // - execute success
  [checkFn3, "message"], // - fail here
  [checkFn4, 401] //    // - not executed
)
// => [false, 'message']

validate("Bob", [(val) => val === "Alice", (val) => `${val} not Alice`])
// => [false, 'Bob not Alice']
```

Process test suite for value, on **full success** return one element list `[ true ]`, on **first fail** one or two element list `[isValid: boolean, message?: unknown]` (depend on fail rule).

### checkAll()

```typescript
import { checkAll } from "rustic-validator"

// (unknown, (unknown) => boolean) => [[boolean]]
checkAll("foo", checkFn)
// (unknown, (unknown) => boolean, (unknown) => boolean) => [[boolean], [boolean]]
checkAll("foo", checkFn, checkFn2)
// (unknown, [(unknown) => boolean]) => [[boolean]]
checkAll("foo", [checkFn])
// (unknown, [(unknown) => boolean, string]) => [[boolean, string?]]
checkAll("foo", [checkFn, "message"])
// (unknown, [(unknown) => boolean, number]) => [[boolean, number?]]
checkAll("foo", [checkFn, 42])
// (unknown, [(unknown) => boolean, (unknown) => string]) => [[boolean, string?]]
checkAll("foo", [checkFn, messageFn])
// any number and any kind of rules allowed
checkAll(
  "foo",
  [checkFn, messageFn], /// - execute success
  checkFn2, //           // - execute success
  [checkFn3, "message"], // - fail here
  [checkFn4, 42] //      // - will execute
)
// => [[true], [true], [false, 'message'], [false, 42]]

checkAll("Bob", [(val) => val === "Alice", (val) => `${val} not Alice`])
// => [[false, 'Bob not Alice']]
```

Process **full** test suite for value, return **full resultset** list `[[true], [isValid: boolean, message?: unknown]...]`.

### getStatus()

```typescript
import { getStatus } from "rustic-validator/utils"

// ([boolean]) => boolean
getStatus([false])
// ([[boolean]]) => boolean
getStatus([[false]])
// ([[boolean], [boolean]]) => boolean
getStatus([[true], [false]])
// ([[boolean, string]]) => boolean
getStatus([[false, "message"]])
// ([[boolean, number]]) => boolean
getStatus([[false, 42]])
// ([[boolean], [boolean, string]]) => boolean
getStatus([[true], [false, "message"]])
// and some bonus structure (see "idea to use")
getStatus({
  a: [[true], [true]], //          // - if execute - pass and yield to any other
  b: [false], //                   // - if execute - fail and prevent others
  c: [[true], [false, "message"]], // - if execute - fail and prevent others
})
// => false

getStatus([[true], [true], [false, "message"], [false, 42]])
// => false
```

Scan some variants of results for resume, return **single** result - on **all success** `true`, or at **first fail** `false`. In the case of using an object with check result, **any** fail element will case `false` result, object keys iteration are not determined.

### getFirstError()

```typescript
import { getFirstError } from "rustic-validator/utils"

// ([boolean]) => []
getFirstError([true])
// ([boolean]) => [boolean]
getFirstError([false])
// ([[boolean]]) => [boolean]
getFirstError([[false]])
// ([[boolean], [boolean]]) => [boolean]
getFirstError([[true], [false]])
// ([[boolean, string]]) => [boolean, string]
getFirstError([[false, "message"]])
// ([[boolean, number]]) => [boolean, number]
getFirstError([[false, 42]])
// ([[boolean], [boolean, string]]) => [boolean, string]
getFirstError([[true], [false, "message"]])
// and some bonus structure (just in case)
getFirstError({
  a: [[true], [true]], //            // - if execute - pass and yield to any other
  b: [[false], [false, "message2"]], // - if execute - fail at first and prevent others
  c: [[true], [false, "message"]], //// - if execute - fail and prevent others
})
// => [false] OR [false, "message"]

getFirstError([[true], [true], [false, 42], [false, "message"]])
// => [false, 42]
```

Scan some variants of results for first fail element, will return empty list `[]` if all tests succeed (no errors), or one or two-element list `[false, message?: unknown]` (depend on fail rule). In case of using an object with check, result **any** fail element (but **first in list**) may be returned, object keys iteration are not determined.

### makeRule()

```typescript
import { makeRule } from "rustic-validator/utils"

const isName = (val: string): boolean => /^\w+$/.test(val)
const onlyHumanRule = makeRule(isName, "You are not human")

// => onlyHumanRule type is [(val: string) => boolean, string]
```

Helper for building correct type rule, as Tuple.

## QA

> Is some validation rule included? Like _isEmail_, _isPhone_ etc.

No, this rule is tightly bound to business values, it's simple to use your own rules.

> Is only string supported?

No, any types supported, just ensure to handle it properly at test rule function.

> Why does it exist?

At first - because I don't need _form_ at modern web application with the state

> Is it for webform only?

No, its works well with any data from any source.

> Its for browser only?

No, use it in any environment, it's the zero-dependency library.

> What about a size?

All library size less **1 kB** Minified (**384 B** Minified + Gzipped)

## Idea to use

It may be interesting to try this validation with the latest [Vue](https://vuejs.org/) with composition API and [Pinia](https://pinia.esm.dev/). As concept

```typescript
// pinia store user.ts
import { defineStore } from 'pinia'
import { validate } from 'rustic-validator'

export const useUserStore = defineStore('model/user', () => {
  const userName = ref('')
  const userPassword = ref('')
  const userNameValidations = [/* some validation here */]
  const passwordValidations = [/* some validation here */]

  const modelValidation = computed(() => {
    userName: validate(userName.value, ...userNameValidations),
    userPassword: validate(userPassword.value, ...passwordValidations),
  })

  return {
    userName,
    userPassword,
    modelValidation,
  }
})

// vue component userLogin.ts
<template>
  <input v-model.trim="userName" :class="{'error': !modelValidation.userName[0]}">
  <p v-if="!modelValidation.userName[0]" class="error">
    {{ modelValidation.userName[1] }}
  </p>

  <input v-model.trim="userPassword" :class="{'error': !modelValidation.userPassword[0]}">
  <p v-if="!modelValidation.userPassword[0]" class="error">
    {{ modelValidation.userPassword[1] }}
  </p>

  <button :disabled="!isFormValid">Login</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getStatus } from 'rustic-validator/utils'
import { useUserAuthStore } from '~/stores/model/user'

const userAuth = useUserAuthStore()
const { userName, userPassword, modelValidation } = storeToRefs(userAuth)
const isFormValid = computed(() => getStatus(modelValidation.value))
</script>
```

## See also

- [v8n](https://github.com/imbrn/v8n) JavaScript fluent validation library
- [tsfv](https://github.com/trevorr/tsfv) Typescript Fluent Validation Library
- [v9s](https://github.com/vueent/v9s) Simple TypeScript-based validations

## Contributing

Want to help? Contributions are welcome, but please be sure before submitting a pull request that you have first opened an issue to discuss the work with the maintainers first. This will ensure we're all on the same page before any work is done.

## Send your feedback

Have some ideas, problems, or questions about the project? [Post an issue](https://github.com/Meettya/rustic-validator/issues/new) in this repo.

## License

The [MIT License](LICENSE.md) 2021 - Dmitrii Karpich.
