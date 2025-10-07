import fs from "fs";
import cron from "node-cron";

const CACHE_FILE = process.env.CACHE_FILE;
const N8N_WEBHOOK = process.env.N8N_WEBHOOK;
const N8N_JWT = process.env.N8N_JWT;

const cacheDir = CACHE_FILE.substring(0, CACHE_FILE.lastIndexOf("/"));
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

export const getDayPlan = async (req, res) => {
  if (fs.existsSync(CACHE_FILE)) {
    const data = fs.readFileSync(CACHE_FILE, "utf-8");
    res.json(JSON.parse(data));
  } else {
    await fetchDayPlan();
    const data = fs.readFileSync(CACHE_FILE, "utf-8");
    res.json(JSON.parse(data));
  }
};

async function fetchDayPlan() {
  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${N8N_JWT}`,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON from n8n:", err);
      console.log("Raw response:", text);
      throw new Error("Invalid JSON from n8n");
    }

    const plan = parsed.result || parsed;
    fs.writeFileSync(CACHE_FILE, JSON.stringify(plan, null, 2));
    return plan;
  } catch (err) {
    console.error("Error fetching plan from n8n:", err);
  }
}

export const refreshDayPlan = async (req, res) => {
  try {
    const plan = await fetchDayPlan();
    res.json({ message: "Plan refreshed successfully", plan });
  } catch (err) {
    res.status(500).json({ error: "Failed to refresh plan" });
  }
};

cron.schedule("0 0,12 * * *", async () => {
  try {
    await fetchDayPlan();
  } catch (err) {
    console.error("Scheduled refresh failed:", err);
  }
});
