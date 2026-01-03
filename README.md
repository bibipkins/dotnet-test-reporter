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

<img width="1510" height="622" alt="image" src="https://github.com/user-attachments/assets/c3c6b32b-0e4b-4ae0-9beb-18c3c8fb3e7a" />

#### Summary - coverage results example

<img width="1505" height="472" alt="image" src="https://github.com/user-attachments/assets/16460e8d-395d-4841-b876-6ed3d8e06b34" />
<br/><br/>

> [!TIP]
> Despite this action was created specifically for dotnet you can use it with other languages and
frameworks as long as you can generate `.trx` files. For example, your project can be a C#/dotnet backend with
a TS/react frontend, in that case you would use the action twice.
> So if the frontend uses jest to run your tests, you can do this:
> - install `jest-trx-results-processor` package to generate `.trx` test result files
> - add `cobertura` to `coverageReporters` array and set `coverage-type` input to `cobertura`, in case you would like to include a coverage

## Inputs

You can customize how the action works using one of the many inputs provided in the table below

| Input                          | Required | Type    | Default      | Description |
| :----------------------------- | :------: | :-----: | :----------: | :---------- |
| github-token                   | **yes**  | string  |              | GitHub repository token<br/>**Example**: `${{ secrets.GITHUB_TOKEN }}` |
| results-path                   | **yes**  | string  |              | Path to the `.trx` file(s) containing test results. Supports glob patterns<br/>**Examples**:<br/>`./TestResults/result.trx`<br/>`./**/*.trx` |
| coverage-path                  | no       | string  |              | Path to the file containing test coverage. Supports glob patterns<br/>**Examples**:<br/>`./TestResults/coverage.xml`<br/>`./**/coverage.xml` |
| coverage-type                  | no       | string  | opencover    | Coverage file type. Supported types are `opencover` and `cobertura`<br/>**Example**: `cobertura` |
| coverage-threshold             | no       | decimal | 0.00         | Minimum allowed coverage. You can provide a coverage percentage ranging from `0.00` to `100.00`<br/>**Example**: `80.42` |
| comment-title                  | no       | string  | Test Results | Pull Request comment title<br/>**Example**: `My Custom Title` |
| post-new-comment               | no       | boolean | false        | Set to `true` to post a new comment after each run<br/>Set to `false` or leave blank to only update an existing comment |
| allow-failed-tests             | no       | boolean | false        | Set to `true` to prevent failed tests from failing the job<br/>Set to `false` or leave blank to fail the job if there are any failed tests |
| show-failed-tests-only         | no       | boolean | false        | Set to `true` to show only the failed tests. This is useful if you have many tests and the results exceed the markdown comment limit in github<br/>Set to `false` or leave blank to show all the test results |
| show-test-output               | no       | boolean | true         | Set to `true` or leave blank to show the output of the tests<br/>Set to `false` if there is too much output leading to truncation of the summary |
| pull-request-check             | no       | boolean | false        | Set to `true` to create GitHub status checks on the commit/PR for test results. These checks appear in the PR's "Checks" tab and can be used in branch protection rules<br/>Set to `false` or leave blank to skip creating status checks |
| pull-request-check-name        | no       | string  | Test Results | Name of the GitHub status check for test results. Only used when `pull-request-check` is set to `true`<br/>**Example**: `My Custom Test Check` |
| changed-files-and-line-numbers | no       | json    | []           | JSON array of changed files and lines numbers<br/>**Example**:<br/>`'[{"name":"MyProject\\MyClass.cs","lineNumbers":[17,18,19]}]'` |

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

> [!IMPORTANT]
> Always use the latest version.

> [!IMPORTANT]
> Make sure to provide all required inputs.

```yaml
uses: bibipkins/dotnet-test-reporter@v1.6.1
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  comment-title: 'Unit Test Results'
  results-path: ./TestResults/*.trx
  coverage-path: ./TestResults/coverage.xml
  coverage-threshold: 80
```
