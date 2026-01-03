# Dotnet Test Reporter

<b>A GitHub action to parse test & coverage results and post them as a PR comment.</b>

- The action can process dotnet test results (a single or multiple `.trx` files), if there are any failing
  tests the action will fail. This allows integrating the action into your CI pipeline to short circuit and
  prevent further build/deploy operations as well as merging the code that caused tests to fail.
- Optionally, test coverage can also be provided (a single opencover or cobertura `.xml` file) as well as a
  minimum coverage percentage threshold. If the threshold is provided and the coverage is not sufficient the
  action will also fail.
- The action generates a
  [workflow summary](https://github.com/bibipkins/dotnet-test-reporter#summary-example) - a more detailed
  overview of processed tests and test coverage. For your convenience you can see the summary by following the
  link in the [comment](https://github.com/bibipkins/dotnet-test-reporter?tab=readme-ov-file#comment-example).
- The action allows many configurations to suit your needs, please visit the
  [Inputs](https://github.com/bibipkins/dotnet-test-reporter#Inputs) and
  [Examples](https://github.com/bibipkins/dotnet-test-reporter#Examples) sections.

#### Comment example

![image](https://user-images.githubusercontent.com/16402446/209407863-2c0d0b3a-99e6-4489-8e1d-a2308102634f.png)

#### Summary - test results example

<img width="1498" height="641" alt="image" src="https://github.com/user-attachments/assets/22ad3b4e-8a4d-4c85-a7ec-b38b58d3b07e" />

#### Summary - coverage results example

<img width="1308" height="612" alt="image" src="https://github.com/user-attachments/assets/2e3f671e-0dc2-4f5e-98d7-6ead001a861b" />

<b>Note:</b> despite this action was created specifically for dotnet you can use it with other languages and
frameworks as long as you can generate `.trx` files. For example, your project can be a C#/dotnet backend with
a TS/react frontend, in that case you would use the action twice. For react app you would need to:

- install `jest-trx-results-processor` package to generate `.trx` test result files
- add `cobertura` to `coverageReporters` array in case you would like to include a coverage

## Inputs

**required:**

**`github-token`**<br/> GitHub repository token.

**`results-path`**<br/> Path to the `.trx` file(s) containing test results. Supports glob patterns.
<br/>Examples: `./TestResults/result.trx`, `./**/*.trx`

**optional:**

**`coverage-path`**<br/> **Optional** - Path to the file containing test coverage. Supports glob patterns.
<br/>Examples: `./TestResults/coverage.xml`, `./**/coverage.xml`

**`coverage-type`**<br/> Coverage file type. Supported types are `opencover` and `cobertura`. <br/>Default:
`opencover`

**`coverage-threshold`**<br/> Minimum allowed coverage. You can provide a coverage percentage ranging from
`0.00` to `100.00`. <br/>Example: `80.42`

**`comment-title`**<br/> Pull Request comment title. <br/>Example: `My Custom Title` <br/>Default:
`Test Results`

**`post-new-comment`**<br/> Boolean flag. Set to `true` to post a new comment after each run. Set to `false`
or leave blank to only update an existing comment. <br/>Default: `false`

**`allow-failed-tests`**<br/> Boolean flag. Set to `true` to prevent failed tests from failing the job. Set to
`false` or leave blank to fail the job if there are any failed tests (recommended). <br/>Default: `false`

**`show-failed-tests-only`**<br/> Boolean flag. Set to `true` to show only the failed tests. This is useful if
you have many tests and the results exceed the markdown comment limit in github Set to `false` or leave blank
to show all the test results (recommended). <br/>Default: `false`

**`show-test-output`**<br/> Boolean flag. Set to `true` or leave blank to show the output of the tests.
(recommended). Set to `false` if there is too much output leading to truncation on the summary <br/>Default:
`true`

**`changed-files-and-line-numbers`**<br/> Array of changed files and lines numbers. <br/>Examples:
`[{"name":"Specifications\\BaseSpecification.cs","lineNumbers":[17,18,19]}]` <br/>Default: `[]`

**`pull-request-check`**<br/> Boolean flag. Set to `true` to create GitHub status checks on the commit/PR for
test results. These checks appear in the PR's "Checks" tab and can be used in branch protection rules. Set to
`false` or leave blank to skip creating status checks. <br/>Default: `false`

**`pull-request-check-name`**<br/> Name of the GitHub status check for test results. Only used when
`pull-request-check` is set to `true`. <br/>Example: `My Custom Test Check` <br/>Default: `Test Results`

## Outputs

**`tests-total`** Total number of tests

**`tests-passed`** Number of tests passed

**`tests-failed`** Number of tests failed

**`tests-skipped`** Number of tests skipped

**`coverage-line`** Line code coverage

**`coverage-lines-total`** Total lines of code

**`coverage-lines-covered`** Lines of code covered

**`coverage-branch`** Branch code coverage

**`coverage-branches-total`** Total branches

**`coverage-branches-covered`** Branches covered

## Examples

<b>Note:</b> please, always use the latest version

```yaml
uses: bibipkins/dotnet-test-reporter@v1.6.1
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  comment-title: 'Unit Test Results'
  results-path: ./TestResults/*.trx
  coverage-path: ./TestResults/coverage.xml
  coverage-threshold: 80
```
