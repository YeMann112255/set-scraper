const fs = require("fs");
const fetch = require("node-fetch");

async function scrapeSET() {
  try {
    const url = "https://www.set.or.th/api/set/index/quotes";
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        "Referer": "https://www.set.or.th/"
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();

    const output = {
      indexName: data?.indexName,
      last: data?.last,
      change: data?.change,
      percentChange: data?.percentChange,
      marketValue: data?.marketValue,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync("data.json", JSON.stringify(output, null, 2));
    console.log("✅ Data saved:", output);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

scrapeSET();
