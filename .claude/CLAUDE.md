# example-cli

- CI = shared flowscripter/.github `validate-bun-executable-pr`: `bun ci`, `bunx oxlint index.ts src/ tests/`, `bunx oxfmt --check`, `bunx typedoc index.ts`, `bun test`, then compiled-executable behave tests.
- Local functional tests: `bun build index.ts --compile --outfile functional_tests/executable`, then in `functional_tests/` run `EXECUTABLE=$PWD/executable <main checkout>/functional_tests/.venv/bin/python -m behave`. Without `EXECUTABLE` every step errors with a NoneType TypeError. Delete the built executable before committing.
- `codecov/project` failing on PRs is known and benign.
- Dependency bump PR title style: `fix(deps): bump @flowscripter/dynamic-cli-framework to ^X.Y.Z`.
- Release builds macOS only on Apple Silicon (`*_MacOS_aarch64`), so `upgradeLocationsConfig.supportedPlatforms` in `src/cli.ts` has no macOS x64 entry; Intel Macs get "unsupported".
