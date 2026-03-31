import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";
import path from "path";
import { ensureDbExists, initDataDirectories } from "./db-init";
import { IPublication, IPublUpdateParams, IPublUpdateQuery } from "./types";
import {
  addArticle,
  addCertificate,
  addPatent,
  delArticle,
  delCertificate,
  delPatent,
  getPublications,
  isArticle,
  isCertificate,
  isPatent,
  updArticle,
  updCertificate,
  updPatent,
} from "./utils";

const app = express();
const PORT = 3001;

//! === НАСТРОЙКА ПУТЕЙ ===

export const dataDir = path.join(process.cwd(), "data");
export const uploadDir = path.join(dataDir, "uploads");
export const dbFile = path.join(dataDir, "lab.json");

//! === ИНИЦИАЛИЗАЦИЯ ===

// Инициализация директорий и файла БД
initDataDirectories(dataDir, uploadDir, dbFile);
ensureDbExists(dbFile);

//! === НАСТРОЙКА MULTER (ПОД UPLOAD ФОТО СОТРУДНИКОВ ЛАБОРАТОРИИ) ===

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, uploadDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filenameSafe = "lab-" + uniqueSuffix + ext;
    console.log("Создание файла:", filenameSafe);
    cb(null, filenameSafe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB лимит
});

//! === MIDDLEWARE ===

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Логирование запросов (только в development режиме)
if (process.env.NODE_ENV !== "production") {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === "POST" || req.method === "PUT") {
      // console.log("Body:", JSON.stringify(req.body, null, 2));
    }
    next();
  });
}

//! === МАРШРУТЫ API ===

/** ПРОВЕРКА СОСТОЯНИЯ СЕРВЕРА */
app.get("/health", async (req: Request, res: Response) => {
  try {
    const pub = await getPublications();
    res.json({
      status: "ok",
      server: "Express",
      port: PORT,
      uploadDir,
      dbFile,
      totalArticles: pub?.articles?.length || 0,
      totalCertificates: pub?.certificates?.length || 0,
      totalPatents: pub?.patents?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Ошибка в health check:", error);
    res.status(500).json({
      status: "error",
      message: "❌ Ошибка при получении данных",
    });
  }
});

/** ПОЛУЧЕНИЕ ВСЕХ ПУБЛИКАЦИЙ */
app.get("/publications", async (req: Request, res: Response) => {
  try {
    const publs = await getPublications();
    console.log(
      `\n✅ Публикации:`,
      `${publs?.articles?.length || 0} статей,`,
      `${publs?.patents?.length || 0} патентов,`,
      `${publs?.certificates?.length || 0} свидетельств`,
    );

    res.json(publs);
  } catch (error) {
    console.error("❌ Ошибка получения публикаций:", error);
    res.status(500).json({
      error: "❌ Ошибка получения данных",
      details: error instanceof Error ? error.message : "❌ Неизвестная ошибка",
    });
  }
});

/** ДОБАВЛЕНИЕ НОВОЙ ПУБЛИКАЦИИ */
app.post(
  "/publications",
  async (req: Request<{}, {}, IPublication>, res: Response) => {
    try {
      const publ = req.body;
      console.log("\n🚀 Добавление публикации:", publ);

      // Валидация публикации
      if (!("publType" in publ)) {
        return res.status(400).json({
          error: `❌ Тип публикации не указан`,
        });
      }

      const createdPubl = isArticle(publ)
        ? await addArticle(publ)
        : isPatent(publ)
          ? await addPatent(publ)
          : isCertificate(publ)
            ? await addCertificate(publ)
            : null;

      if (!createdPubl) {
        return res.status(400).json({
          error: `❌ Тип публикации не определен`,
        });
      }

      if (createdPubl) {
        console.log(`✅ Публикация ${createdPubl.id} добавлена`);
        res.status(201).json({
          success: true,
          publication: createdPubl,
          message: "✅ Публикация добавлена",
        });
      } else {
        throw new Error("❌ Ошибка записи публикации в DB");
      }
    } catch (error) {
      console.error("❌ Ошибка добавления публикации:", error);
      res.status(500).json({
        error: "❌ Ошибка добавления публикации",
        details:
          error instanceof Error ? error.message : "❌ Неизвестная ошибка",
      });
    }
  },
);

/** УДАЛЕНИЕ ПУБЛИКАЦИИ */
app.delete("/publications/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { publType } = req.query;

    if (!id || !publType) {
      return res
        .status(400)
        .json({ error: "Параметры удаляемой публикации не корректны" });
    }

    console.log(`\n🚀 Удаление публикации ${id} типа ${publType}`);

    // Удаление
    let removedPubl = null;
    switch (publType) {
      case "A": // статья
        removedPubl = await delArticle(id);
        break;
      case "P": // патент
        removedPubl = await delPatent(id);
        break;
      case "C": // свидетельство
        removedPubl = await delCertificate(id);
        break;
      default:
    }

    if (removedPubl) {
      console.log(`✅ Публикация ${id} удалена`, removedPubl);
      res.json({
        success: true,
        publication: removedPubl,
        message: "✅ Публикация удалена",
      });
    } else {
      res.status(404).json({
        error: "❌ Статья не найдена",
        details: `❌ Статья с id ${id} не существует`,
      });
    }
  } catch (error) {
    console.error("❌ Ошибка удаления статьи:", error);
    res.status(500).json({
      error: "❌ Ошибка удаления статьи",
      details: error instanceof Error ? error.message : "❌ Неизвестная ошибка",
    });
  }
});

// /** ИЗМЕНЕНИЕ ПУБЛИКАЦИИ */

app.patch(
  "/publications/:id",
  async (
    req: Request<IPublUpdateParams, IPublUpdateQuery, Partial<IPublication>>,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const { publType } = req.query;
      const publ = req.body;
      console.log(`\n🚀 Обновление публикации ${id} типа ${publType}:`, publ);

      // Валидация публикации
      if (!id || !publType) {
        return res.status(400).json({
          error: "❌ Параметры поиска изменяемой публикации не корректны",
        });
      }
      if (!Object.keys(publ).length) {
        return res
          .status(400)
          .json({ error: "❌ Отсутствуют данные публикации для изменения" });
      }

      let updatedPubl = null;
      switch (publType) {
        case "A": // статья
          updatedPubl = await updArticle(id, publ);
          break;
        case "P": // патент
          updatedPubl = await updPatent(id, publ);
          break;
        case "C": // свидетельство
          updatedPubl = await updCertificate(id, publ);
          break;
        default:
      }

      if (!updatedPubl) {
        return res.status(400).json({
          error: `❌ Тип публикации не определен`,
        });
      }

      if (updatedPubl) {
        console.log(`✅ Публикация ${id} изменена`);
        res.status(201).json({
          success: true,
          publication: updatedPubl,
          message: "✅ Публикация обновлена",
        });
      } else {
        throw new Error("❌ Ошибка записи публикации в DB");
      }
    } catch (error) {
      console.error("❌ Ошибка обновления публикации:", error);
      res.status(500).json({
        error: "❌ Ошибка обновления публикации",
        details:
          error instanceof Error ? error.message : "❌ Неизвестная ошибка",
      });
    }
  },
);

/** ОБРАБОТЧИК ОШИБОК MULTER */
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof MulterError) {
    console.error("Ошибка Multer:", error);
    return res.status(400).json({
      error: "❌ Ошибка загрузки файла",
      details: error.message,
    });
  }
  next(error);
});

/** 404 - МАРШРУТ НЕ НАЙДЕН */
app.use((req: Request, res: Response) => {
  console.warn(`Маршрут не найден: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "❌ Маршрут не найден",
    path: req.url,
    method: req.method,
  });
});

/** ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК */
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Необработанная ошибка:", error);

  res.status(500).json({
    error: "❌ Внутренняя ошибка сервера",
    message: error instanceof Error ? error.message : "❌ Неизвестная ошибка",
    timestamp: new Date().toISOString(),
    path: req.url,
  });
});

// ==================== ЗАПУСК СЕРВЕРА ====================

app.listen(PORT, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Express-сервер: http://localhost:${PORT}`);
  console.log(`📁 Данные: ${dataDir}`);
  console.log(`📁 Загрузки: ${uploadDir}`);
  console.log(`💾 База данных: ${dbFile}`);
  console.log(`🏥 Health: /health`);
  console.log(`👥 Публикации: /publications`);
  console.log(`=========================================\n`);
});
