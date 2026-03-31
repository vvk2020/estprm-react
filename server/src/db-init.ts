import fs from "fs";
import { Lab } from "./types";

export function initDataDirectories(dataDir: string, uploadDir: string, dbFile: string): void {
  // Создание папок, если их нет
  [dataDir, uploadDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Создана директория: ${dir}`);
    }
  });
}

export function ensureDbExists(dbFile: string): void {
  // Создание DB-файла, если его нет
  if (!fs.existsSync(dbFile)) {
    const initialData: Lab = {
      publications: {
        articles: [],
        patents: [],
        certificates: [],
      },
    };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
    console.log(`Создан DB-файла: ${dbFile}`);
  }
}