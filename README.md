# Dotnet Test Reporter
A GitHub action to parse test results and post the summary as a PR comment.
<br/>The action can process dotnet test results (multiple `.trx` files), if there are any failing tests the action will fail.
<br/>Optionally test coverage can be provided (a single opencover `.xml` file) as well as a minimum coverage percentage.
If a minimum coverage is provided and the coverage is not sufficient the action will fail.

## Inputs

#### `github-token`
**Required** - GitHub repository token.

#### `test-results`
**Required** - Path to the directory containing trx files.
<br/>Example: `./TestResults/`

#### `test-coverage`
**Optional** - Path to the file containing test coverage. Coverage file should be an opencover report in xml format.
<br/>Example: `./TestResults/coverage.xml`

#### `min-coverage`
**Optional** - Minimum allowed coverage. You can provide a coverage percentage ranging from `0.00` to `100.00`.
<br/>Example: `80.42`

#### `comment-title`
**Optional** - Pull Request comment title.
<br/>Example: `My Custom Title`

#### `post-new-comment`
**Optional** - Boolean flag. 
Set to `true` to post a new comment after each run. 
Set to `false` or leave blank to only update an existing comment.
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

#### `coverage-branch`
Branch code coverage

#### `coverage-method`
Method code coverage

## Example usage

```yaml
uses: actions/dotnet-test-reporter@v1
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  test-results: ./TestResults/
  test-coverage: ./TestResults/coverage.xml
  min-coverage: 80
  comment-title: 'Unit Test Results'
```
