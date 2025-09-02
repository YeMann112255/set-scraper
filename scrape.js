const fs = require("fs");
const fetch = require("node-fetch");

async function scrapeSET() {
  try {
    const url = "https://www.set.or.th/api/set/index/quotes";
    const res = await fetch(url);
    const data = await res.json();

    // Example: SET Index + Market Value
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
