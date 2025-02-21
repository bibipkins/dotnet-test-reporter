# Dotnet Test Reporter
#### A GitHub action to parse test & coverage results and post them as a PR comment.
- The action can process dotnet test results (a single or multiple `.trx` files), if there are any failing tests the action will fail. This allows integrating the action into your CI pipeline to short circuit and prevent further build/deploy operations as well as merging the code that caused tests to fail.
- Optionally, test coverage can also be provided (a single opencover or cobertura `.xml` file) as well as a minimum coverage percentage threshold.
If the threshold is provided and the coverage is not sufficient the action will fail.
- The action also generates a [workflow summary](https://github.com/bibipkins/dotnet-test-reporter#summary-example) - a more detailed overview of processed tests and test coverage. For your convenience you can see the summary by following the link in the [comment](https://github.com/bibipkins/dotnet-test-reporter?tab=readme-ov-file#comment-example).
- The action allows many configurations to suit your needs, please visit the [Inputs](https://github.com/bibipkins/dotnet-test-reporter#Inputs) and [Examples](https://github.com/bibipkins/dotnet-test-reporter#Examples) sections.
#### Comment example
![image](https://user-images.githubusercontent.com/16402446/209407863-2c0d0b3a-99e6-4489-8e1d-a2308102634f.png)
#### Summary example
<h3>Tests</h3><table role="table"><tbody><tr><th>✔️ Passed</th><th>❌ Failed</th><th>⚠️ Skipped</th><th>⏱️ Time</th></tr><tr><td>29</td><td>3</td><td>3</td><td>8.2s</td></tr></tbody></table><details><summary>✔️ eShopWeb.UnitTests.ApplicationCore.Entities.BasketTests.BasketAddItem - 6/6</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>AddsBasketItemIfNotPresent</td></tr><tr><td align="center">✔️</td><td>CantAddItemWithNegativeQuantity</td></tr><tr><td align="center">✔️</td><td>CantModifyQuantityToNegativeNumber</td></tr><tr><td align="center">✔️</td><td>DefaultsToQuantityOfOne</td></tr><tr><td align="center">✔️</td><td>IncrementsQuantityOfItemIfPresent</td></tr><tr><td align="center">✔️</td><td>KeepsOriginalUnitPriceIfMoreItemsAdded</td></tr></tbody></table></details><details><summary>✔️ eShopWeb.UnitTests.ApplicationCore.Entities.BasketTests.BasketRemoveEmptyItems - 1/1</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>RemovesEmptyBasketItems</td></tr></tbody></table></details><details><summary>✔️ eShopWeb.UnitTests.ApplicationCore.Entities.BasketTests.BasketTotalItems - 2/2</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>ReturnsTotalQuantityWithMultipleItems</td></tr><tr><td align="center">✔️</td><td>ReturnsTotalQuantityWithOneItem</td></tr></tbody></table></details><details><summary>✔️ eShopWeb.UnitTests.ApplicationCore.Entities.OrderTests.OrderTotal - 1/3</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th><th>Output</th></tr><tr><td align="center">⚠️</td><td>IsCorrectGiven1Item</td><td>Skipped test 1</td></tr><tr><td align="center">⚠️</td><td>IsCorrectGiven3Items</td><td>Skipped test 2</td></tr><tr><td align="center">✔️</td><td>IsZeroForNewOrder</td><td></td></tr></tbody></table></details><details><summary>✔️ eShopWeb.UnitTests.ApplicationCore.Extensions.JsonExtensions - 3/3</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>CorrectlyDeserializesJson(json: "{ \"id\": 3124, \"name\": \"Test Value 1\" }", expectedId: 3124, expectedName: "Test Value 1")</td></tr><tr><td align="center">✔️</td><td>CorrectlyDeserializesJson(json: "{ \"id\": 9, \"name\": \"Another test\" }", expectedId: 9, expectedName: "Another test")</td></tr><tr><td align="center">✔️</td><td>CorrectlySerializesAndDeserializesObject</td></tr></tbody></table></details><details><summary>❌ eShopWeb.UnitTests.ApplicationCore.Services.BasketServiceTests.AddItemToBasket - 1/2</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th><th>Output</th></tr><tr><td align="center">❌</td><td>InvokesBasketRepositoryGetBySpecAsyncOnce</td><td><b>Error Message</b><br/>Assert.Fail(): Failed test 1<br/><br/><b>Stack Trace</b><br/>   at eShopWeb.UnitTests.ApplicationCore.Services.BasketServiceTests.AddItemToBasket.InvokesBasketRepositoryGetBySpecAsyncOnce() in C:\Users\testuser\Files\Projects\eShopOnWeb\tests\UnitTests\ApplicationCore\Services\BasketServiceTests\AddItemToBasket.cs:line 20
--- End of stack trace from previous location ---</td></tr><tr><td align="center">✔️</td><td>InvokesBasketRepositoryUpdateAsyncOnce</td><td></td></tr></tbody></table></details><details><summary>✔️ eShopWeb.UnitTests.ApplicationCore.Services.BasketServiceTests.DeleteBasket - 1/1</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>ShouldInvokeBasketRepositoryDeleteAsyncOnce</td></tr></tbody></table></details><details><summary>✔️ eShopWeb.UnitTests.ApplicationCore.Services.BasketServiceTests.TransferBasket - 4/4</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>CreatesNewUserBasketIfNotExists</td></tr><tr><td align="center">✔️</td><td>InvokesBasketRepositoryFirstOrDefaultAsyncOnceIfAnonymousBasketNotExists</td></tr><tr><td align="center">✔️</td><td>RemovesAnonymousBasketAfterUpdatingUserBasket</td></tr><tr><td align="center">✔️</td><td>TransferAnonymousBasketItemsWhilePreservingExistingUserBasketItems</td></tr></tbody></table></details><details><summary>❌ eShopWeb.UnitTests.ApplicationCore.Specifications.BasketWithItems - 3/4</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th><th>Output</th></tr><tr><td align="center">❌</td><td>MatchesBasketWithGivenBasketId</td><td><b>Error Message</b><br/>System.Exception : Test exception<br/><br/><b>Stack Trace</b><br/>   at eShopWeb.UnitTests.ApplicationCore.Specifications.BasketWithItems.MatchesBasketWithGivenBasketId() in C:\Users\testuser\Files\Projects\eShopOnWeb\tests\UnitTests\ApplicationCore\Specifications\BasketWithItemsSpecification.cs:line 24</td></tr><tr><td align="center">✔️</td><td>MatchesBasketWithGivenBuyerId</td><td></td></tr><tr><td align="center">✔️</td><td>MatchesNoBasketsIfBasketIdNotPresent</td><td></td></tr><tr><td align="center">✔️</td><td>MatchesNoBasketsIfBuyerIdNotPresent</td><td></td></tr></tbody></table></details><details><summary>❌ eShopWeb.UnitTests.ApplicationCore.Specifications.CatalogFilterPaginatedSpecification - 0/2</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th><th>Output</th></tr><tr><td align="center">⚠️</td><td>Returns2CatalogItemsWithSameBrandAndTypeId</td><td>Skipped test 3</td></tr><tr><td align="center">❌</td><td>ReturnsAllCatalogItems</td><td><b>Error Message</b><br/>Assert.Fail(): Failed test 2<br/><br/><b>Stack Trace</b><br/>   at eShopWeb.UnitTests.ApplicationCore.Specifications.CatalogFilterPaginatedSpecification.ReturnsAllCatalogItems() in C:\Users\testuser\Files\Projects\eShopOnWeb\tests\UnitTests\ApplicationCore\Specifications\CatalogFilterPaginatedSpecification.cs:line 11</td></tr></tbody></table></details><details><summary>✔️ eShopWeb.UnitTests.ApplicationCore.Specifications.CatalogFilterSpecification - 7/7</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: 1, typeId: 3, expectedCount: 1)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: 1, typeId: null, expectedCount: 3)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: 2, typeId: 3, expectedCount: 0)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: 2, typeId: null, expectedCount: 2)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: null, typeId: 1, expectedCount: 2)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: null, typeId: 3, expectedCount: 1)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: null, typeId: null, expectedCount: 5)</td></tr></tbody></table></details><h3>Coverage</h3><table role="table"><tbody><tr><th>📏 Line</th><th>🌿 Branch</th></tr><tr><td>121 / 263 (46.01%)</td><td>5 / 18 (27.78%)</td></tr></tbody></table><details><summary>✔️ ApplicationCore - 46.01%</summary><br/><table role="table"><tbody><tr><th>File</th><th>Total</th><th>Line</th><th>Branch</th><th>Lines to Cover</th></tr><tr><td>CatalogSettings.cs</td><td align="center">0 / 1</td><td align="center">0%</td><td align="center">100%</td><td>5</td></tr><tr><td>Entities\BaseEntity.cs</td><td align="center">1 / 1</td><td align="center">100%</td><td align="center">100%</td><td></td></tr><tr><td>Entities\BasketAggregate\Basket.cs</td><td align="center">18 / 19</td><td align="center">94.74%</td><td align="center">100%</td><td>9</td></tr><tr><td>Entities\BasketAggregate\BasketItem.cs</td><td align="center">3 / 4</td><td align="center">75%</td><td align="center">100%</td><td>8</td></tr><tr><td>Entities\BuyerAggregate\Buyer.cs</td><td align="center">0 / 11</td><td align="center">0%</td><td align="center">100%</td><td>9, 11, 13, 15, 16, 18, 20-24</td></tr><tr><td>Entities\BuyerAggregate\PaymentMethod.cs</td><td align="center">0 / 3</td><td align="center">0%</td><td align="center">100%</td><td>5-7</td></tr><tr><td>Entities\CatalogBrand.cs</td><td align="center">0 / 1</td><td align="center">0%</td><td align="center">100%</td><td>7</td></tr><tr><td>Entities\CatalogItem.cs</td><td align="center">2 / 8</td><td align="center">25%</td><td align="center">100%</td><td>7-10, 12, 14</td></tr><tr><td>Entities\CatalogType.cs</td><td align="center">0 / 1</td><td align="center">0%</td><td align="center">100%</td><td>7</td></tr><tr><td>Entities\OrderAggregate\Address.cs</td><td align="center">13 / 14</td><td align="center">92.86%</td><td align="center">100%</td><td>17</td></tr><tr><td>Entities\OrderAggregate\CatalogItemOrdered.cs</td><td align="center">12 / 15</td><td align="center">80%</td><td align="center">100%</td><td>22, 23, 25</td></tr><tr><td>Entities\OrderAggregate\Order.cs</td><td align="center">21 / 25</td><td align="center">84%</td><td align="center">100%</td><td>10, 11, 13, 40</td></tr><tr><td>Entities\OrderAggregate\OrderItem.cs</td><td align="center">9 / 12</td><td align="center">75%</td><td align="center">100%</td><td>10, 11, 13</td></tr><tr><td>Exceptions\BasketNotFoundException.cs</td><td align="center">3 / 12</td><td align="center">25%</td><td align="center">100%</td><td>11-13, 15-17, 19-21</td></tr><tr><td>Exceptions\GuardExtensions.cs</td><td align="center">3 / 4</td><td align="center">75%</td><td align="center">50%</td><td>12</td></tr><tr><td>Services\BasketService.cs</td><td align="center">17 / 51</td><td align="center">33.33%</td><td align="center">0%</td><td>24, 25, 27, 29, 30, 39-46, 48-51, 58-68, 74-79</td></tr><tr><td>Services\OrderService.cs</td><td align="center">0 / 22</td><td align="center">0%</td><td align="center">0%</td><td>17-24, 27-38, 40, 41</td></tr><tr><td>Services\UriComposer.cs</td><td align="center">0 / 4</td><td align="center">0%</td><td align="center">100%</td><td>9, 12-14</td></tr><tr><td>Specifications\BaseSpecification.cs</td><td align="center">11 / 33</td><td align="center">33.33%</td><td align="center">100%</td><td>17-19, 21, 22, 30-32, 34-38, 40-42, 44-46, 50-52</td></tr><tr><td>Specifications\BasketWithItemsSpecification.cs</td><td align="center">4 / 8</td><td align="center">50%</td><td align="center">100%</td><td>13-16</td></tr><tr><td>Specifications\CatalogFilterPaginatedSpecification.cs</td><td align="center">0 / 5</td><td align="center">0%</td><td align="center">100%</td><td>8-12</td></tr><tr><td>Specifications\CatalogFilterSpecification.cs</td><td align="center">4 / 4</td><td align="center">100%</td><td align="center">100%</td><td></td></tr><tr><td>Specifications\CustomerOrdersWithItemsSpecification.cs</td><td align="center">0 / 5</td><td align="center">0%</td><td align="center">100%</td><td>8-12</td></tr></tbody></table></details>

<b>Note:</b> despite this action was created specifically for dotnet you can use it with other languages and frameworks as long as you can generate `.trx` files. For example, your project can be a C#/dotnet backend with a TS/react frontend, in that case you would use the action twice. For react app you would need to:
- install `jest-trx-results-processor` package to generate `.trx` test result files 
- add `cobertura` to `coverageReporters` array in case you would like to include a coverage

## Inputs

#### `github-token`
**Required** - GitHub repository token.

#### `results-path`
**Required** - Path to the `.trx` file(s) containing test results. Supports glob patterns.
<br/>Examples: `./TestResults/result.trx`, `./**/*.trx`

#### `coverage-path`
**Optional** - Path to the file containing test coverage. Supports glob patterns.
<br/>Examples: `./TestResults/coverage.xml`, `./**/coverage.xml`

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

#### `show-failed-tests-only`
**Optional** - Boolean flag. 
Set to `true` to show only the failed tests. This is useful if you have many tests and the results exceed the markdown comment limit in github
Set to `false` or leave blank to show all the test results (recommended).
<br/>Default: `false`

#### `show-test-output`
**Optional** - Boolean flag. 
Set to `true` or leave blank to show the output of the tests. (recommended).
Set to `false` if there is too much output leading to truncation on the summary
<br/>Default: `true`

#### `change-files-and-line-numbers`
**Optional** - Array of changed files and lines numbers. 
<br/>Examples: `[{"name":"Specifications\\BaseSpecification.cs","lineNumbers":[17,18,19]}]`
<br/>Default: `[]`

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

## Examples
<b>Note:</b> please, always use the latest version

```yaml
uses: bibipkins/dotnet-test-reporter@v1.4.0
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  comment-title: 'Unit Test Results'
  results-path: ./TestResults/*.trx
  coverage-path: ./TestResults/coverage.xml
  coverage-threshold: 80
```
