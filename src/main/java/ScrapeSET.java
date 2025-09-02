import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.FileWriter;
import java.io.IOException;
import java.time.Instant;

public class ScrapeSET {
    public static void main(String[] args) {
        try {
            Document doc = Jsoup.connect("https://www.set.or.th/en/home")
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(15000)
                    .get();

            // Adjust selectors if SET changes their HTML
            String setIndex = doc.selectFirst(".set-index__number").text();
            String marketValue = doc.selectFirst(".set-index__value").text();

            JsonObject output = new JsonObject();
            output.addProperty("index", setIndex);
            output.addProperty("marketValue", marketValue);
            output.addProperty("timestamp", Instant.now().toString());

            try (FileWriter writer = new FileWriter("data.json")) {
                writer.write(new Gson().toJson(output));
            }

            System.out.println("✅ Scraped: " + output);

        } catch (IOException e) {
            System.err.println("❌ Scraping error: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
