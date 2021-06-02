<h1 align="center">Tempera</h1>

<p align="center">
  <a href="https://tempera.netlify.app">
    <img alt="tempera" src="https://dam-13749.kxcdn.com/wp-content/uploads/2017/01/simonetta-vespucci.jpg" width="750">
  </a>
</p>

<p align="center">
  A CLI toolkit for aiding design tokens adoption.
</p>

<p align="center">
  <a href="https://tempera.netlify.app">
    View Docs
  </a>
</p>

<p align="center">
  <a href="https://oclif.io"><img alt="Oclif" src="https://img.shields.io/badge/cli-oclif-brightgreen.svg"></a>
  <a href="https://app.netlify.com/sites/tempera/deploys"><img alt="Netlify Status" src="https://api.netlify.com/api/v1/badges/733b8d33-26d3-4182-be30-388b8bc57737/deploy-status"></a>
  <a href="https://npmjs.org/package/tempera"><img alt="Version" src="https://img.shields.io/npm/v/tempera.svg"></a>
  <a href="https://npmjs.org/package/tempera"><img alt="Downloads" src="https://img.shields.io/npm/dw/tempera.svg"></a>
  <a href="https://github.com/michaelmang/tempera/blob/master/package.json"><img alt="Downloads" src="https://img.shields.io/npm/l/tempera.svg"></a>
</p>

<!-- toc -->

- [Usage](#usage)
- [Contributing](#contributing)
- [Packages](#packages)
<!-- tocstop -->

# Usage

<!-- usage -->

## Install

```sh-session
$ npm install -g tempera
$ yarn add global tempera
```

## Run Commands

**Note:** This package is experimental. You may have better success by running the command locally:

```sh-session
USAGE
  $ git clone https://github.com/michaelmang/tempera.git
  $ yarn install
  $ ./bin/run [COMMAND]
```

### Scorecard

Gather metrics around the adoption of a design system.

```sh-session
USAGE
  $ tempera scorecard -s https://www.figma.com/developers -t ./tokens.js

OPTIONS
  -s, --site=site  site url to analyze
  -t, --tokens=tokens  relative path to tokens file
  -j, --json=json  (optional) flag to enable printing output as a JSON blob; requires -o, --output to be set
  -o, --output=output  (optional) relative path for a JSON file to output; requires -j, --json to be enabled

DESCRIPTION
  ...
  Scorecard analyzes a web app or web page,
  collecting design system adoption metrics
  and insights for adoption.
```

#### Tokens

Design tokens are key-value pairs that represent a specification (aka "spec") of a design system.

If you are new to design tokens, [here's a good place to start](https://www.michaelmang.dev/blog/introduction-to-design-tokens).

Tempera's `scorecard` command expects these tokens to be in the [javascript/es6 format which you can generate using Style Dictionary](https://amzn.github.io/style-dictionary/#/formats?id=javascriptes6) except exported as CommonJS modules.

In other words, flat CommonJS modules in PascalCase are expected.

Example:

```js
module.exports.ColorBackgroundBase = "#ffffff";
module.exports.ColorBackgroundAlt = "#fcfcfcfc";
```

Support for tokens in ES6 format is on the roadmap.

The `scorecard` command expects the tokens to match against one of the following matchers after being transformed to kebab case:

```js
module.exports.BORDER_RADIUS = /border-radius/g;
module.exports.BREAKPOINT = /max-width/g;
module.exports.COLOR = /color/g;
module.exports.DELAY = /delay/g;
module.exports.DURATION = /duration/g;
module.exports.FONT_FAMILY = /font-family/g;
module.exports.FONT_SIZE = /font-size/g;
module.exports.FONT_WEIGHT = /font-weight/g;
module.exports.LINE_HEIGHT = /line-height/g;
module.exports.SPACING = /margin|padding/g;
module.exports.TIMING = /timing/g;
```

[You can learn more about the underlying `css-types` package that utilizes these matchers.](/docs/packages#css-types)

#### Output

![design-scorecard](https://user-images.githubusercontent.com/22566333/109745214-88341d80-7ba1-11eb-9df3-89a947b36b1d.png)

#### JSON Report

Useful for creating custom reporters and tooling.

```sh-session
USAGE
  $ tempera scorecard -s https://www.figma.com/developers -t ./tokens.js -j -o report.json
```

##### Output

```javascript
{
  "unofficial": [
    {
      "type": "border-radius",
      "attribute": "border-radius",
      "unofficialValue": "0.500rem",
      "nearestOfficialValue": "0.375rem"
    },
    // ...
  ],
  "summary": [
    { "category": "Font Family", "correct": 0, "incorrect": 79, "percentage": "0.00" },
    { "category": "Color", "correct": 159, "incorrect": 195, "percentage": "44.92" },
    { "category": "Font Size", "correct": 73, "incorrect": 104, "percentage": "41.24" },
    { "category": "Spacing", "correct": 264, "incorrect": 322, "percentage": "45.05" },
    { "category": "Max Width", "correct": 1, "incorrect": 25, "percentage": "3.85" },
    { "category": "Line Height", "correct": 112, "incorrect": 14, "percentage": "88.89" },
    { "category": "Border Radius", "correct": 16, "incorrect": 13, "percentage": "55.17" },
    { "category": "Font Weight", "correct": 78, "incorrect": 2, "percentage": "97.50" }
  ],
  "total": { "correct": 703, "incorrect": 754, "percentage": "48.25", "grade": "F" }
}
```

### Help

```sh-session
$ tempera --help [COMMAND]
USAGE
  $ tempera COMMAND
```

<!-- usagestop -->

# Contributing

🤠 Howdy, developer! Thanks for being willing to contribute!

## Project setup

1.  Fork and clone the repo
2.  Run `yarn install` to install dependencies
3.  Create a branch for your PR with `git checkout -b pr/your-branch-name`
4.  Run `.bin/run/ [COMMAND]` in the root of the repo to run commands locally

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/michaelmang/tempera.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```

## Committing and Pushing changes

There are currently no tests but please document manual testing on PRs with your changes.

## Help needed

Please checkout the [the open issues][issues].

Also, please watch the repo and respond to questions/bug reports/feature
requests! Thanks!

[issues]: https://github.com/michaelmang/tempera/issues

# Packages

## Tools

In addition to a CLI, Tempera offers other tools to improve design tokens adoption.

### stylelint-tokens

A Stylelint plugin that helps avoid the adoption of unofficial design specifications.

#### Installation

```bash
yarn add @tempera/stylelint-tokens
```

#### Usage

Install [Stylelint](https://stylelint.io/user-guide/get-started) and update your configuration file to utilize the plugin.

```js
// stylelint.config.js
const tokens = require("./fixtures/example-tokens");

module.exports = {
  // ...
  plugins: ["@tempera/stylelint-tokens"],
  rules: {
    "@tempera/official-specs": tokens,
  },
};
```

##### Tokens
The plugin expects these tokens to be in the [javascript/es6 format which you can generate using Style Dictionary](https://amzn.github.io/style-dictionary/#/formats?id=javascriptes6) except exported as CommonJS modules.

In other words, flat CommonJS modules in PascalCase are expected.

Example:

```js
module.exports.ColorBackgroundBase = "#ffffff";
module.exports.ColorBackgroundAlt = "#fcfcfcfc";
```

Support for tokens in ES6 format is on the roadmap.

[View the source](https://github.com/michaelmang/tempera/tree/master/packages/stylelint)

## Supporting Packages

The underlying packages that support Tempera are publicly accessible.

You are welcome and encouraged to use these packages directly should you need a custom solution.

🚀 [Contributing](/docs/contributing) to these packages is also welcome.

### css-types

Utilities to categorize your CSS.

#### Installation

```bash
yarn add @tempera/css-types
```

#### Usage

```js
const {
  // Example: matchers.SPACING
  // Contains a list of regex matchers to help match common types in CSS
  matchers,
  // example: getMatcher(postcssProperty)
  // Returns a regex matcher fitting for the provided property
  getMatcher,
  // Example: types.SPACING
  // Contains a list of common types in CSS
  types,
  // Example: getType(postcssProperty)
  // Returns a common type fitting for the provided property
  getType,
} = require("@tempera/css-types");
```

[View the source](https://github.com/michaelmang/tempera/tree/master/packages/css-types)

### postcss-scorecard

A PostCSS plugin that exposes hooks into design token adoption validation.

#### Installation

```bash
yarn add @tempera/postcss-scorecard
```

#### Usage

```js
const pxToRem = require("postcss-pxtorem");
const expandShorthand = require("postcss-shorthand-expand");

await postcss()
  .use(pxToRem())
  .use(expandShorthand)
  .use(
    scorecard({
      onInvalid: (score) => {
        // do something when CSS property is not an official spec
      },
      onValid: (score) => {
        // do something when CSS property is an official spec
      },
      onFinished: () => {
        // do something after validation finishes
      },
      specs, // the official design tokens
    })
  )
  .process(css, { from: undefined });
```

##### Specs
The plugin expects these specs/tokens to be in the [javascript/es6 format which you can generate using Style Dictionary](https://amzn.github.io/style-dictionary/#/formats?id=javascriptes6) except exported as CommonJS modules.

In other words, flat CommonJS modules in PascalCase are expected.

Example:

```js
module.exports.ColorBackgroundBase = "#ffffff";
module.exports.ColorBackgroundAlt = "#fcfcfcfc";
```

Support for tokens in ES6 format is on the roadmap.

[View the source](https://github.com/michaelmang/tempera/tree/master/packages/postcss)

### tailwind-config

An API that generates a Tailwind configuration from a set of design tokens.

#### Installation

```bash
yarn add @tempera/tailwind-config
```

#### Usage

```js
import getTailwindConfig from "@tempera/tailwind-config";

const tailwindConfig = getTailwindConfig(tokens, {
  extend,
  mustMatch,
});

// do something with the tailwind config
```

##### Options

1. `extend`: Extend default tailwind config. Defaults to false.
2. `mustMatch`: Allow unmatched tokens to be skipped, otherwhise throws. Defaults to true.


##### Tokens
The plugin expects these specs/tokens to be in the [javascript/es6 format which you can generate using Style Dictionary](https://amzn.github.io/style-dictionary/#/formats?id=javascriptes6).

In other words, flat modules in PascalCase are expected.

Example:

```js
export const ColorPrimary = blue;
export const ColorSecondary = yellow;
```

[View the source](https://github.com/michaelmang/tempera/tree/master/packages/tailwind)

### twind

An API that generates a Twind instance from a set of design tokens.

#### Installation

```bash
yarn add @tempera/twind
```

#### Usage

```js
import getTwind from "@tempera/twind";

const { tw } = getTwind(tokens);

function Demo() {
  return (
    <div className={tw`text-primary`}>
  );
}
```

##### Tokens
The plugin expects these specs/tokens to be in the [javascript/es6 format which you can generate using Style Dictionary](https://amzn.github.io/style-dictionary/#/formats?id=javascriptes6).

In other words, flat modules in PascalCase are expected.

Example:

```js
export const ColorPrimary = blue;
export const ColorSecondary = yellow;
```

[View the source](https://github.com/michaelmang/tempera/tree/master/packages/twind/base)

### stitches

An API that generates twind/style shapes from a set of design tokens.

#### Demo
[View On CodeSandbox](https://codesandbox.io/s/temperastitches-0ogls?file=/src/tokens.js)

#### Installation

```bash
yarn add @tempera/stitches
```

#### Usage

```js
import getStitches from '@tempera/stitches';
import getTwind from '@tempera/twind';
import { style } from 'twind/style';

import tokens from './tokens';

const stitches = getStitches(tokens);

const { tw } = getTwind(tokens);

function Demo() {
  const button = style(stitches.button);

  return (
    <div>
      <button className={tw(button())}>Base Button</button>
      <button className={tw(button({ variant: 'secondary' }))}>
        Secondary Button
      </button>
    </div>
  );
}
```

##### Tokens
The plugin expects these specs/tokens to be in the [javascript/es6 format which you can generate using Style Dictionary](https://amzn.github.io/style-dictionary/#/formats?id=javascriptes6).

In other words, flat modules in PascalCase are expected.

The tokens should follow the following format:

```js
// base format
export const Component[COMPONENT]Base[LONGHAND_CSS_PROPERTY];

// size format
export const Component[COMPONENT][SIZE][LONGHAND_CSS_PROPERTY];

// variant format
export const Component[COMPONENT][VARIANT][UI_STATE][LONGHAND_CSS_PROPERTY];
```

Examples:

```js
export const ComponentButtonBaseFontSize = '1rem';
export const ComponentButtonBaseColor = 'red';
export const ComponentButtonSmallFontSize = '0.75rem';
export const ComponentButtonSecondaryDefaultBackgroundColor = 'red';
export const ComponentButtonSecondaryDefaultColor = 'white';
export const ComponentButtonSecondaryDefaultFontSize = '0.875rem';
export const ComponentButtonSecondaryHoverFontSize = '0.75rem';
export const ColorPrimary = 'red';
export const ColorWhite = 'white';
export const FontSizeTiny = '0.75rem';
export const FontSizeSmall = '0.875rem';
export const FontSizeMedium = '1rem';
export const LineHeightTiny = '1rem';
export const LineHeightSmall = '1.25rem';
export const LineHeightMedium = '1.5rem';
```

[View the source](https://github.com/michaelmang/tempera/tree/master/packages/twind/stitches)
