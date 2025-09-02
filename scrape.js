// scrape.js
import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto("https://www.set.or.th/en/home", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  const data = await page.evaluate(() => {
    const pickNumber = (el) => {
      if (!el) return null;
      const m = el.textContent.replace(/\s+/g, " ")
        .match(/[\d,]+\.\d+|\d{1,3}(?:,\d{3})+/);
      return m ? m[0].replace(/,/g, "") : null;
    };

    // SET index
    const setLabel = [...document.querySelectorAll("*")]
      .find(e => e.textContent.trim() === "SET");
    let setIndex = null;
    if (setLabel) {
      const block = setLabel.closest("section,div,article") || setLabel.parentElement;
      setIndex = pickNumber(block);
    }

    // Trading Value
    const valueHdr = [...document.querySelectorAll("*")]
      .find(e => /Total Trading Value/i.test(e.textContent));
    let value = null;
    if (valueHdr) {
      const blk = valueHdr.closest("section,div,article") || valueHdr.parentElement;
      const m = blk.textContent.match(/([\d,]+\.\d+)\s*M\.?Baht/i);
      value = m ? m[1].replace(/,/g, "") : pickNumber(blk);
    }

    const lastUpdateNode = [...document.querySelectorAll("*")]
      .find(e => /Last Update/i.test(e.textContent));
    const lastUpdate = lastUpdateNode ? lastUpdateNode.textContent.trim() : null;

    return {
      setIndex: setIndex ? Number(setIndex) : null,
      totalTradingValue_MBaht: value ? Number(value) : null,
      lastUpdate,
      scrapedAt: new Date().toISOString(),
    };
  });

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  await browser.close();
})();
