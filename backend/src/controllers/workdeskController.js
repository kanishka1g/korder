import fs from "fs";
import cron from "node-cron";

const CACHE_FILE = process.env.CACHE_FILE;
const N8N_WEBHOOK = process.env.N8N_WEBHOOK;
const N8N_JWT = process.env.N8N_JWT;

export const fetchSchedules = async (req, res) => {
  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${N8N_JWT}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`n8n request failed: ${response.status}`);
    }

    res.json(await response.json());
  } catch (err) {
    console.error("Error fetching schedules from n8n:", err);
  }
};
