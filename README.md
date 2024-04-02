# example-cli

[![version](https://img.shields.io/github/v/release/flowscripter/example-cli?sort=semver)](https://github.com/flowscripter/example-cli/releases)
[![build](https://img.shields.io/github/actions/workflow/status/flowscripter/example-cli/release-deno-executable.yml)](https://github.com/flowscripter/example-cli/actions/workflows/release-deno-executable.yml)
[![coverage](https://codecov.io/gh/flowscripter/example-cli/branch/main/graph/badge.svg?token=EMFT2938ZF)](https://codecov.io/gh/flowscripter/example-cli)
[![dependencies](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fupdates%2Fhttps%2Fraw.githubusercontent.com%2Fflowscripter%2Fexample-cli%2Fmain%2Fmod.ts)](https://github.com/flowscripter/example-cli/blob/main/deps.ts)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/raw.githubusercontent.com/flowscripter/example-cli/main/mod.ts)
[![license: MIT](https://img.shields.io/github/license/flowscripter/example-cli)](https://github.com/flowscripter/example-cli/blob/main/LICENSE)

> Simple example CLI using [dynamic-cli-framework](https://github.com/flowscripter/dynamic-cli-framework).

<img src="./demo.svg" alt="example-cli demo screen recording">

## Binary Executable Usage

Download and extract zip from: https://github.com/flowscripter/example-cli/releases

Run the executable: `./example-cli`

**NOTE**: Due to this issue https://github.com/denoland/deno/issues/11154 the MacOS executable
is neither signed nor notarised. This means a "Developer cannot be verified" error will be displayed when the CLI
it is executed. This requires explicitly allowing the CLI to be executed via:

_"System Settings" > "Privacy & Security" > "Security" > "Allow Anyway"_

## Development

Run: `deno run --allow-env mod.ts`

> During development this can be used to validate command definitions:
> 
> `CLI_VALIDATE_ALL=1 deno run --allow-env mod.ts`

> During development this can be used to enable framework logging:
> 
> `CLI_DEBUG=1 deno run --allow-env mod.ts`

Test: `deno test -A`

Lint: `deno fmt mod.ts deps.ts src/ tests/`

Compile: `deno compile --allow-env mod.ts`

## Functional Tests

Refer to [functional_tests/README.md](functional_tests/README.md)

## Documentation

Refer to the [dynamic-cli-framework](https://github.com/flowscripter/dynamic-cli-framework) documentation.

## License

MIT © Flowscripter
