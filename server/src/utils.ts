import { promises as fs } from "fs"; // Лучше использовать import вместо require
import { lock } from "proper-lockfile"; // Добавьте этот импорт
import writeFileAtomic from "write-file-atomic"; // Исправленный импорт
import { dbFile } from "./server";
import {
  articleFields,
  certificateFields,
  IArticle,
  ICertificate,
  IPatent,
  IPublDeletePayload,
  IPublication,
  IPublications,
  patentFields,
  TPublicationKey,
} from "./types";

//! === TYPE GUARD ПУБЛИКАЦИЙ ===

/** TYPE GUARD ДЛЯ ПУБЛИКАЦИИ ТИПА "СТАТЬЯ" */
export const isArticle = (
  publ: IPublication,
): publ is IArticle & { publType: "A" } => {
  // Проверка по типу публикации
  if (publ.publType !== "A") return false;

  // Проверка наличия обязательных полей
  const missingFields = articleFields.filter((field) => !(field in publ));
  if (missingFields.length > 0) return false;

  return true;
};

/** TYPE GUARD ДЛЯ ПУБЛИКАЦИИ ТИПА "ПАТЕНТ" */
export const isPatent = (
  publ: IPublication,
): publ is IPatent & { publType: "P" } => {
  // Проверка по типу публикации
  if (publ.publType !== "P") return false;

  // Проверка наличия обязательных полей
  const missingFields = patentFields.filter((field) => !(field in publ));
  if (missingFields.length > 0) return false;

  return true;
};

/** TYPE GUARD ДЛЯ ПУБЛИКАЦИИ ТИПА "СЕРТИФИКАТ" */
export const isCertificate = (
  publ: IPublication,
): publ is ICertificate & { publType: "C" } => {
  // Проверка по типу публикации
  if (publ.publType !== "C") return false;

  // Проверка наличия обязательных полей
  const missingFields = certificateFields.filter((field) => !(field in publ));
  if (missingFields.length > 0) return false;

  return true;
};

//! === BASE CRUD ПУБЛИКАЦИЙ ===

/** ПОЛУЧЕНИЕ ПУБЛИКАЦИЙ */
export const getPublications = async (): Promise<IPublications | null> => {
  try {
    // Пустой шаблон публикаций
    const emptyPubls: IPublications = {
      articles: [],
      patents: [],
      certificates: [],
    };

    // Проверка существования файла
    try {
      await fs.access(dbFile);
    } catch {
      console.log(`❌ ${dbFile} не найден`);
      // Запись в DB-файл пустого шаблона публикаций
      await fs.writeFile(dbFile, JSON.stringify(emptyPubls, null, 2));
      return emptyPubls;
    }

    const data = await fs.readFile(dbFile, "utf8");

    // Проверка, не пустой ли файл
    if (!data.trim()) {
      console.log(`❌ ${dbFile} пустой`);
      // Запись в DB-файл пустого шаблона публикаций
      await fs.writeFile(dbFile, JSON.stringify(emptyPubls, null, 2));
      return emptyPubls;
    }

    const json = JSON.parse(data);

    const publs = readPublications(json);

    // Валидация структуры
    if (!publs) {
      console.error(`❌ Неверная структура ${dbFile} публикаций`);
      return null;
    }

    return publs;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`❌ Ошибка парсинга файла ${dbFile}:`, error.message);
    } else if (error instanceof Error) {
      console.error(`❌ Ошибка чтения файла ${dbFile}:`, error.message);
    } else {
      console.error(`❌ Неизвестная ошибка при чтении ${dbFile}:`, error);
    }
    return null;
  }
};

/** ПОЛУЧЕНИЕ ПУБЛИКАЦИЙ ИЗ JSON */
const readPublications = (data: unknown): IPublications | null => {
  if (!data || typeof data !== "object") return null;

  const obj = data as Record<string, unknown>;
  const publications = obj.publications;

  if (!publications || typeof publications !== "object") return null;

  const pubs = publications as IPublications;

  // Проверка структуры
  const isValid =
    Array.isArray(pubs.articles) &&
    Array.isArray(pubs.patents) &&
    Array.isArray(pubs.certificates);

  return isValid ? pubs : null;
};

/** ДОБАВЛЕНИЕ ПУБЛИКАЦИИ */
export async function addPublication<K extends TPublicationKey>(
  publType: K,
  publ: Omit<IPublications[K][number], "id">,
): Promise<IPublications[K][number] | null> {
  try {
    // Новая публикация с добавленным id
    const newPubl = {
      ...publ,
      id: crypto.randomUUID(),
    } as IPublications[K][number];

    // Получение всех публикаций из DB-файла
    const publications = await getPublications();

    if (!publications) {
      console.error(`❌ Не удалось загрузить публикации из ${dbFile}`);
      return null;
    }

    // Добавление новой публикации в соответствующий массив
    (publications[publType] as IPublications[K][number][]).push(newPubl);

    // Чтение всего файла для сохранения структуры
    const data = await fs.readFile(dbFile, "utf8");
    const jsonData = JSON.parse(data);

    // Обновление только поля publications
    jsonData.publications = publications;

    // Запись обновленных данных обратно в файл
    await fs.writeFile(dbFile, JSON.stringify(jsonData, null, 2), "utf8");
    return newPubl;
  } catch (error) {
    console.error(
      `❌ Ошибка добавления публикации в раздел ${publType}:`,
      error,
    );
    return null;
  }
}

/** УДАЛЕНИЕ ПУБЛИКАЦИИ ПО id И ТИПУ publType */
export async function delPublication<K extends TPublicationKey>(
  publType: K,
  publId: string,
): Promise<IPublDeletePayload | null> {
  let releaseLock;

  try {
    let deletedPubl: IPublDeletePayload | null = null; // удаленная публикация

    // 1. Блокировка для предотвращения одновременного доступа
    releaseLock = await lock(dbFile, {
      retries: 5,
      stale: 3000,
    }).catch(() => null); // Если блокировка не поддерживается, продолжаем без неё

    // 2. Чтение данных
    const publications = await getPublications();
    if (!publications) return null;

    // 3. Удаление публикации фильтрацией
    const filteredPubls = (
      publications[publType] as IPublications[K][number][]
    ).filter((publ) => {
      if (publ.id === publId)
        deletedPubl = { id: publ.id, publType: publ.publType };
      return publ.id !== publId;
    });

    // Если публикация удалена, то перезаписываем публикации DB
    if (deletedPubl) {
      // 4. Чтение полного файла для сохранения структуры
      const data = await fs.readFile(dbFile, "utf8");
      const jsonData = JSON.parse(data);
      jsonData.publications[publType] = filteredPubls;

      // 5. Атомарная запись (write-file-atomic сам создает временный файл)
      await writeFileAtomic(dbFile, JSON.stringify(jsonData, null, 2));
    }
    return deletedPubl;
  } catch (error) {
    console.error(`❌ Ошибка удаления публикации:`, error);
    return null;
  } finally {
    // 6. Освобождение блокировки
    if (releaseLock) {
      await releaseLock().catch(() => {});
    }
  }
}

/** ОБНОВЛЕНИЕ ПУБЛИКАЦИИ ПО id И ТИПУ publType */
export async function updPublication<K extends TPublicationKey>(
  publType: K,
  publId: string,
  publ: Partial<IPublication>,
): Promise<IPublication | null> {
  let releaseLock;

  try {
    let updatedPubl = null; // обновленная публикация

    // 1. Блокировка для предотвращения одновременного доступа
    releaseLock = await lock(dbFile, {
      retries: 5,
      stale: 3000,
    }).catch(() => null); // Если блокировка не поддерживается, продолжаем без неё

    // 2. Чтение публикаций
    const publications = await getPublications();
    if (!publications) return null;

    // 3. Поиск и модификация публикации
    const publIndex = (
      publications[publType] as IPublications[K][number][]
    ).findIndex((publ) => publ.id === publId);

    if (publIndex !== -1) {
      publications[publType][publIndex] = {
        ...publications[publType][publIndex],
        ...publ,
      };
      updatedPubl = publications[publType][publIndex];

      // 4. Чтение полного файла для сохранения структуры
      const data = await fs.readFile(dbFile, "utf8");
      const jsonData = JSON.parse(data);
      jsonData.publications[publType] = publications[publType];

      // 5. Атомарная запись (write-file-atomic сам создает временный файл)
      await writeFileAtomic(dbFile, JSON.stringify(jsonData, null, 2));
    }
    return updatedPubl;
  } catch (error) {
    console.error(`❌ Ошибка удаления публикации:`, error);
    return null;
  } finally {
    // 6. Освобождение блокировки
    if (releaseLock) {
      await releaseLock().catch(() => {});
    }
  }
}

//! === CRUD ПО ТИПАМ ПУБЛИКАЦИЙ ===

//* ADD ПУБЛИКАЦИИ

/** ДОБАВЛЕНИЕ СТАТЬИ */
export async function addArticle(
  newPubl: Omit<IArticle, "id">,
): Promise<IArticle | null> {
  return addPublication("articles", newPubl);
}

/** ДОБАВЛЕНИЕ ПАТЕНТА */
export async function addPatent(
  newPubl: Omit<IPatent, "id">,
): Promise<IPatent | null> {
  return addPublication("patents", newPubl);
}

/** ДОБАВЛЕНИЕ СВИДЕТЕЛЬСТВА */
export async function addCertificate(
  newPubl: Omit<ICertificate, "id">,
): Promise<ICertificate | null> {
  return addPublication("certificates", newPubl);
}

//* DELETE ПУБЛИКАЦИИ

/** УДАЛЕНИЕ СТАТЬИ */
export async function delArticle(
  publId: string,
): Promise<IPublDeletePayload | null> {
  return delPublication("articles", publId);
}

/** УДАЛЕНИЕ ПАТЕНТА */
export async function delPatent(
  publId: string,
): Promise<IPublDeletePayload | null> {
  return delPublication("patents", publId);
}

/** УДАЛЕНИЕ СВИДЕТЕЛЬСТВА */
export async function delCertificate(
  publId: string,
): Promise<IPublDeletePayload | null> {
  return delPublication("certificates", publId);
}

//* UPDATE ПУБЛИКАЦИИ

/** ОБНОВЛЕНИЕ СТАТЬИ */
export async function updArticle(
  publId: string,
  publ: Partial<IPublication>,
): Promise<IPublDeletePayload | null> {
  return updPublication("articles", publId, publ);
}

/** ОБНОВЛЕНИЕ ПАТЕНТА */
export async function updPatent(
  publId: string,
  publ: Partial<IPublication>,
): Promise<IPublDeletePayload | null> {
  return updPublication("patents", publId, publ);
}

/** ОБНОВЛЕНИЕ СВИДЕТЕЛЬСТВА */
export async function updCertificate(
  publId: string,
  publ: Partial<IPublication>,
): Promise<IPublDeletePayload | null> {
  return updPublication("certificates", publId, publ);
}

//! === SHUTDOWN ===

// Обработка завершения процесса (инициатор - пользователь с клавиатуры)
process.on("SIGINT", async () => {
  console.log("\n🛑 SIGINT, завершаем работу...");
  process.exit(0);
});

// Обработка завершения процесса (инициатор - система или другой процесс)
process.on("SIGTERM", async () => {
  console.log("\n🛑 SIGTERM, завершаем работу...");
  process.exit(0);
});
