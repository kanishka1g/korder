import dotenv from "dotenv";

dotenv.config();

export function getDbNameFromUri(uri) {
  try {
    const dbName = uri.split("/").pop().split("?")[0]; // grabs db after last "/"
    return dbName;
  } catch {
    return null;
  }
}

export const mongoDbName = getDbNameFromUri(process.env.MONGO_URI);
