# [![js-test-gen](media/jsTestGen.png)](https://js-test-gen.github.io)

js-test-gen is an opinionated unit test template generator using babel and prettier.

It uses babel to identify what modules are being exported. It then generates a test template and formats the template using prettier.

## Installation

`npm install js-tes-gen`

or

`yarn add js-test-gen`

## Input

```javascript
//name of this file is myfuncs.js

export const someModule1 = () => {};
export const someModule2 = () => {};

const someModule = () => {};

export default someModule;
```

## Output

```javascript
import someModule, { someModule1, someModule2 } from "./myfuncs";

describe("someModule", () => {
  it("should fail auto generated test", () => {
    expect(someModule()).toBe(false);
  });
});
describe("someModule1", () => {
  it("should fail auto generated test", () => {
    expect(someModule1()).toBe(false);
  });
});
describe("someModule2", () => {
  it("should fail auto generated test", () => {
    expect(someModule2()).toBe(false);
  });
});
```

## API

### `generateTestTemplate({contents, srcfileName, importFromPath, typeSystem})`

`generateTestTemplate` is used to generate a complete js unit test template.

| property         | type                 | description                                                                                     |
| ---------------- | -------------------- | ----------------------------------------------------------------------------------------------- |
| `contents`       | `string`             | The JS contents to generate a test from.                                                        |
| `srcFileName`    | `string`             | The name of the JS module the test is being created for.                                        |
| `importFromPath` | `string`             | The path of where the module is located in relation to the generated test file E.G `.` or `../` |
| `typeSystem`     | `FLOW or TYPESCRIPT` | If the js module is using a type system this needs to be specified.                             |

### `generateTest(contents, typeSystem)`

`generateTest` is used to generate test cases from given js contents.

| arguments    | type                 | description                                                           |
| ------------ | -------------------- | --------------------------------------------------------------------- |
| `contents`   | `string`             | The JS contents to generate a test from.                              |
| `typeSystem` | `FLOW or TYPESCRIPT` | If the js contents is using a type system this needs to be specified. |

## Usage

```javascript
import { generateTestTemplate } from "js-test-gen";

const contentToParse = `export const addOne = (x) => x +1`;

const testTemplate = generateTestTemplate({
  contents: contentsToParse, // contents of the mod
  srcFileName: "addOne", // the name of the mod we want to test
  importFromPath: ".." // where the test should import the mod from
});
```

### result

```javascript
import { addOne } from "../addOne";

describe("addOne", () => {
  it("should fail auto generated test", () => {
    expect(addOne()).toBe(false);
  });
});
```
