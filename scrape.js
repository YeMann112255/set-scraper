const fs = require("fs");
const fetch = require("node-fetch");

async function scrapeSET() {
  try {
    const url = "https://marketplace.set.or.th/api/public/oaq-data/index-stat";
    const params = "?tradeDate=2025-09-02";  // Example date

    const res = await fetch(`${url}${params}`, {
      headers: {
        "api-key": process.env.SET_API_KEY
      }
    });

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const json = await res.json();
    const indexData = json.indexStat.find(i => i.indexName === "SET");

    const output = {
      indexName: indexData.indexName,
      indexValue: indexData.indexValue,
      change: indexData.change,
      previousClose: indexData.previousClose,
      value: indexData.value,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync("data.json", JSON.stringify(output, null, 2));
    console.log("Saved:", output);

  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

scrapeSET();
