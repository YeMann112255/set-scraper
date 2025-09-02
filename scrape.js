const fs = require("fs");
const puppeteer = require("puppeteer");

async function scrapeSET() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.set.or.th/en/home", {
      waitUntil: "networkidle2",
      timeout: 0
    });

    // SET Index value
    await page.waitForSelector(".set-index__number"); 
    const setIndex = await page.$eval(".set-index__number", el => el.textContent.trim());

    // Market Value
    const marketValue = await page.$eval(".set-index__value", el => el.textContent.trim());

    const output = {
      index: setIndex,
      marketValue: marketValue,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync("data.json", JSON.stringify(output, null, 2));
    console.log("✅ Scraped:", output);

  } catch (err) {
    console.error("❌ Scraping error:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

scrapeSET();
