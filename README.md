# Dotnet Test Reporter
A GitHub action to parse test results and post the summary as a PR comment.
<br/>The action can process dotnet test results (multiple `.trx` files), if there are any failing tests the action will fail.
<br/>Optionally, test coverage can be provided (a single opencover or cobertura `.xml` file) as well as a minimum coverage percentage.
If a minimum coverage is provided and the coverage is not sufficient the action will fail.
<br/>The action also generates a test summary - a more detailed overview of processed tests. You can review the summary by following the link in the PR comment.
#### Comment example
![image](https://user-images.githubusercontent.com/16402446/209407574-97feb149-6def-4e80-bd9e-c8b1af722262.png)

## Inputs

#### `github-token`
**Required** - GitHub repository token.

#### `results-path`
**Required** - Path to the directory containing trx files.
<br/>Example: `./TestResults/`

#### `coverage-path`
**Optional** - Path to the file containing test coverage.
<br/>Example: `./TestResults/coverage.xml`

#### `coverage-type`
**Optional** - Coverage file type. Supported types are `opencover` and `cobertura`.
<br/>Default: `opencover`

#### `coverage-threshold`
**Optional** - Minimum allowed coverage. You can provide a coverage percentage ranging from `0.00` to `100.00`.
<br/>Example: `80.42`

#### `comment-title`
**Optional** - Pull Request comment title.
<br/>Example: `My Custom Title`
<br/>Default: `Test Results`

#### `post-new-comment`
**Optional** - Boolean flag. 
Set to `true` to post a new comment after each run. 
Set to `false` or leave blank to only update an existing comment.
<br/>Default: `false`

#### `allow-failed-tests`
**Optional** - Boolean flag. 
Set to `true` to prevent failed tests from failing the job.
Set to `false` or leave blank to fail the job if there are any failed tests (recommended).
<br/>Default: `false`

## Outputs

#### `tests-total`
Total number of tests

#### `tests-passed`
Number of tests passed

#### `tests-failed`
Number of tests failed

#### `tests-skipped`
Number of tests skipped

#### `coverage-line`
Line code coverage

#### `coverage-lines-total`
Total lines of code

#### `coverage-lines-covered`
Lines of code covered

#### `coverage-branch`
Branch code coverage

#### `coverage-branches-total`
Total branches

#### `coverage-branches-covered`
Branches covered

## Example usage

```yaml
uses: bibipkins/dotnet-test-reporter@v1
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  test-results: ./TestResults/
  test-coverage: ./TestResults/coverage.xml
  min-coverage: 80
  comment-title: 'Unit Test Results'
```
