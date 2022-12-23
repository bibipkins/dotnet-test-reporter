# Dotnet Test Reporter
A GitHub action to parse test results and post the summary as a PR comment.
<br/>The action can process dotnet test results (a single or multiple `.trx` files), if there are any failing tests the action will fail.
<br/>Optionally, test coverage can be provided (a single opencover or cobertura `.xml` file) as well as a minimum coverage percentage.
If a minimum coverage is provided and the coverage is not sufficient the action will fail.
#### Comment example
![image](https://user-images.githubusercontent.com/16402446/209407863-2c0d0b3a-99e6-4489-8e1d-a2308102634f.png)
<br/>The action also generates a test summary - a more detailed overview of processed tests. You can review the summary by following the link in the PR comment.
#### Summary example
<h3>Tests</h3><table role="table"><tbody><tr><th>✔️ Passed</th><th>❌ Failed</th><th>⚠️ Skipped</th><th>⏱️ Time</th></tr><tr><td>38</td><td>3</td><td>3</td><td>8.2s</td></tr></tbody></table><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Entities.BasketTests.BasketAddItem - 6/6</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>AddsBasketItemIfNotPresent</td></tr><tr><td align="center">✔️</td><td>CantAddItemWithNegativeQuantity</td></tr><tr><td align="center">✔️</td><td>CantModifyQuantityToNegativeNumber</td></tr><tr><td align="center">✔️</td><td>DefaultsToQuantityOfOne</td></tr><tr><td align="center">✔️</td><td>IncrementsQuantityOfItemIfPresent</td></tr><tr><td align="center">✔️</td><td>KeepsOriginalUnitPriceIfMoreItemsAdded</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Entities.BasketTests.BasketRemoveEmptyItems - 1/1</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>RemovesEmptyBasketItems</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Entities.BasketTests.BasketTotalItems - 2/2</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>ReturnsTotalQuantityWithMultipleItems</td></tr><tr><td align="center">✔️</td><td>ReturnsTotalQuantityWithOneItem</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Entities.OrderTests.OrderTotal - 1/3</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th><th>Output</th></tr><tr><td align="center">⚠️</td><td>IsCorrectGiven1Item</td><td>Skipped test 1</td></tr><tr><td align="center">⚠️</td><td>IsCorrectGiven3Items</td><td>Skipped test 2</td></tr><tr><td align="center">✔️</td><td>IsZeroForNewOrder</td><td></td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Extensions.JsonExtensions - 3/3</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>CorrectlyDeserializesJson(json: "{ \"id\": 3124, \"name\": \"Test Value 1\" }", expectedId: 3124, expectedName: "Test Value 1")</td></tr><tr><td align="center">✔️</td><td>CorrectlyDeserializesJson(json: "{ \"id\": 9, \"name\": \"Another test\" }", expectedId: 9, expectedName: "Another test")</td></tr><tr><td align="center">✔️</td><td>CorrectlySerializesAndDeserializesObject</td></tr></tbody></table></details><details><summary>❌ Microsoft.eShopWeb.UnitTests.ApplicationCore.Services.BasketServiceTests.AddItemToBasket - 1/2</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th><th>Output</th></tr><tr><td align="center">❌</td><td>InvokesBasketRepositoryGetBySpecAsyncOnce</td><td><b>Error Message</b><br/>Assert.Fail(): Failed test 1<br/><br/><b>Stack Trace</b><br/>   at Microsoft.eShopWeb.UnitTests.ApplicationCore.Services.BasketServiceTests.AddItemToBasket.InvokesBasketRepositoryGetBySpecAsyncOnce() in C:\Users\testuser\Files\Projects\eShopOnWeb\tests\UnitTests\ApplicationCore\Services\BasketServiceTests\AddItemToBasket.cs:line 20
--- End of stack trace from previous location ---</td></tr><tr><td align="center">✔️</td><td>InvokesBasketRepositoryUpdateAsyncOnce</td><td></td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Services.BasketServiceTests.DeleteBasket - 1/1</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>ShouldInvokeBasketRepositoryDeleteAsyncOnce</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Services.BasketServiceTests.TransferBasket - 4/4</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>CreatesNewUserBasketIfNotExists</td></tr><tr><td align="center">✔️</td><td>InvokesBasketRepositoryFirstOrDefaultAsyncOnceIfAnonymousBasketNotExists</td></tr><tr><td align="center">✔️</td><td>RemovesAnonymousBasketAfterUpdatingUserBasket</td></tr><tr><td align="center">✔️</td><td>TransferAnonymousBasketItemsWhilePreservingExistingUserBasketItems</td></tr></tbody></table></details><details><summary>❌ Microsoft.eShopWeb.UnitTests.ApplicationCore.Specifications.BasketWithItems - 3/4</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th><th>Output</th></tr><tr><td align="center">❌</td><td>MatchesBasketWithGivenBasketId</td><td><b>Error Message</b><br/>System.Exception : Test exception<br/><br/><b>Stack Trace</b><br/>   at Microsoft.eShopWeb.UnitTests.ApplicationCore.Specifications.BasketWithItems.MatchesBasketWithGivenBasketId() in C:\Users\testuser\Files\Projects\eShopOnWeb\tests\UnitTests\ApplicationCore\Specifications\BasketWithItemsSpecification.cs:line 24</td></tr><tr><td align="center">✔️</td><td>MatchesBasketWithGivenBuyerId</td><td></td></tr><tr><td align="center">✔️</td><td>MatchesNoBasketsIfBasketIdNotPresent</td><td></td></tr><tr><td align="center">✔️</td><td>MatchesNoBasketsIfBuyerIdNotPresent</td><td></td></tr></tbody></table></details><details><summary>❌ Microsoft.eShopWeb.UnitTests.ApplicationCore.Specifications.CatalogFilterPaginatedSpecification - 0/2</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th><th>Output</th></tr><tr><td align="center">⚠️</td><td>Returns2CatalogItemsWithSameBrandAndTypeId</td><td>Skipped test 3</td></tr><tr><td align="center">❌</td><td>ReturnsAllCatalogItems</td><td><b>Error Message</b><br/>Assert.Fail(): Failed test 2<br/><br/><b>Stack Trace</b><br/>   at Microsoft.eShopWeb.UnitTests.ApplicationCore.Specifications.CatalogFilterPaginatedSpecification.ReturnsAllCatalogItems() in C:\Users\testuser\Files\Projects\eShopOnWeb\tests\UnitTests\ApplicationCore\Specifications\CatalogFilterPaginatedSpecification.cs:line 11</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Specifications.CatalogFilterSpecification - 7/7</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: 1, typeId: 3, expectedCount: 1)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: 1, typeId: null, expectedCount: 3)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: 2, typeId: 3, expectedCount: 0)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: 2, typeId: null, expectedCount: 2)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: null, typeId: 1, expectedCount: 2)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: null, typeId: 3, expectedCount: 1)</td></tr><tr><td align="center">✔️</td><td>MatchesExpectedNumberOfItems(brandId: null, typeId: null, expectedCount: 5)</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Specifications.CatalogItemsSpecification - 2/2</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>MatchesAllCatalogItems</td></tr><tr><td align="center">✔️</td><td>MatchesSpecificCatalogItem</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.ApplicationCore.Specifications.CustomerOrdersWithItemsSpecification - 2/2</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>ReturnsAllOrderWithAllOrderedItem</td></tr><tr><td align="center">✔️</td><td>ReturnsOrderWithOrderedItem</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.MediatorHandlers.OrdersTests.GetMyOrders - 1/1</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>NotReturnNullIfOrdersArePresIent</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.MediatorHandlers.OrdersTests.GetOrderDetails - 1/1</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>NotBeNullIfOrderExists</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.Web.Extensions.CacheHelpersTests.GenerateBrandsCacheKey - 1/1</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>ReturnsBrandsCacheKey</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.Web.Extensions.CacheHelpersTests.GenerateCatalogItemCacheKey - 1/1</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>ReturnsCatalogItemCacheKey</td></tr></tbody></table></details><details><summary>✔️ Microsoft.eShopWeb.UnitTests.Web.Extensions.CacheHelpersTests.GenerateTypesCacheKey - 1/1</summary><br/><table role="table"><tbody><tr><th>Result</th><th>Test</th></tr><tr><td align="center">✔️</td><td>ReturnsTypesCacheKey</td></tr></tbody></table></details>

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
