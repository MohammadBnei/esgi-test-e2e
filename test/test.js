/**
 * Dependency Modules
 * @ts-check
 */
var assert = require("assert").strict;
var webdriver = require("selenium-webdriver");
require("chromedriver");

const should = require('should');

const chorme = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

// Application Server
const serverUri = "http://172.26.0.2:3000"
const appTitle = "Client shopper"

const options = new chorme.Options()

/**
 * Config for Chrome browser
 * @type {webdriver}
 */
var chromeBrowser = new webdriver.Builder()
	.usingServer('http://hub:4444/wd/hub')
    .withCapabilities(options)
	.build();



/**
 * Config for Firefox browser (Comment Chrome config when you intent to test in Firefox)
 * @type {webdriver}
 */

var firefoxBrowser = new webdriver.Builder()
	.usingServer('http://hub:4444/wd/hub')
	.withCapabilities(new firefox.Options())
	.build();


const cssLocator = webdriver.By.css

for (const browser of [chromeBrowser, firefoxBrowser]) {
	browser.manage().window().maximize();
	describe("Home Page", function() {

		before(function () {
			return browser.get(serverUri)
				.then(() => browser.wait(webdriver.until.elementLocated(webdriver.By.css('main'), 5000)))
		});

		after(function() {
			return browser.quit();
		});

		/**
		 * Test case to load our application and check the title.
		 */
		it("Should load the home page and get title", async function() {
				const title = await browser.getTitle()
				assert.strictEqual(title, appTitle);
		});
		
		it("Should load the articles", async function() {
				const articlesCount = await browser.findElements(cssLocator('li'))
				assert.strictEqual(articlesCount.length, 6)
		});

		it("Should add an article to the cart", async function() {
			const firstArticle = await browser.findElement(cssLocator('.product-price'))
			let articlePrice = await firstArticle.findElement(cssLocator('div'))		
			const articleBtn = await firstArticle.findElement(cssLocator('button'))
			await articleBtn.click()

			await browser.wait(webdriver.until.elementLocated(cssLocator('div.total>div'), 2000))

			const total = await browser.findElement(cssLocator('div.total>div'))

			
			let text = await total.getText()
			articlePrice = await articlePrice.getText()
			
			
			text = text.replace('Total: ', '')
			
			should.exist(total)
			text.should.equal(articlePrice)
		});

		it("Should proceed to checkout", async function() {
			const total = await browser.findElement(cssLocator('div.total'))
			const proceedBtn = await total.findElement(cssLocator('button'))

			await proceedBtn.click()
		});

		it("Should checkout", async function() {
			
			const email = await browser.findElement(webdriver.By.name('email'))
			const name = await browser.findElement(webdriver.By.name('name'))
			const address = await browser.findElement(webdriver.By.name('address'))

			await browser.wait(webdriver.until.elementLocated(webdriver.By.id('checkoutBtn'), 1500))

			const checkoutBtn = await browser.findElement(webdriver.By.id('checkoutBtn'))

			await Promise.all([email.sendKeys('test@test.com'),
			name.sendKeys('Hello testing'),
			address.sendKeys('12 rue de l\'école')])

			await checkoutBtn.click()

			await browser.wait(webdriver.until.elementLocated(cssLocator('div.main'), 2000))

			let success = await browser.findElement(cssLocator('div.main'))
			success = await success.getText()

			assert.equal(success, "Payment Validated !")
		});
	});
}
