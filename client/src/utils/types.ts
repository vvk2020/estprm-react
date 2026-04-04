//! БАЗОВЫЕ ТИПЫ ====================================================

/** СВИДЕТЕЛЬСТВО */
export interface ICertificate {
  id: string;
  publType: PublType; // тип публикации
  name: string; // название
  authors: string; // авторы
  type: string; // тип
  number: string; // номер
  date: Date; // дата получения
  applicationNumber: string; // номер заявки
  applicationDate: Date; // дата заявки
}

/** ПАТЕНТ */
export interface IPatent {
  id: string;
  publType: PublType; // тип публикации
  name: string; // название
  authors: string; // авторы
  type: string; // тип
  number: string; // номер
  date: Date; // дата получения
  applicationNumber: string; // номер заявки
  applicationDate: Date; // дата заявки
}

/** ТИП ПУБЛИКАЦИИ
 * - A - статья
 * - P - патент
 * - C - свидетельство
 */
export enum PublType {
  article = 'A', // статьи
  patent = 'P', // патенты
  certificate = 'C', // свидетельства
}

export interface IArticle {
  id: string;
  publType: PublType;
  authors: string;
  name: string;
  journal: string;
  year: number;
  volAndNo: string;
  pages: string;
}

/** ВСЕ ПУбЛИКАЦИИ */
export interface IPublications {
  articles: IArticle[]; // статьи
  patents: IPatent[]; // патенты
  certificates: ICertificate[]; // сертификаты
}

//! API =============================================================

/** ШАБЛОН ОТВЕТА СЕРВЕРА */
export type TServerResponse<T> = {
  success: boolean;
} & T;

/** ОТВЕТ СЕРВЕРА НА ЗАПРОС ПУБЛИКАЦИЙ */
export type IPublicationsResp = TServerResponse<IPublications>;

//! STORE ===========================================================

/** ШАБЛОН STATE */
export type IState<T> = {
  loading: boolean;
  error: string | null;
} & T;
