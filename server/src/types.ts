/** СТАТЬИ */
export interface IArticle {
  id: string;
  publType: TPublicationType; // тип публикации
  authors: string;
  name: string;
  journal: string;
  year: number;
  volAndNo: string;
  pages: string;
}

export type IArticleWithoutId = Omit<IArticle, "id">;

/** ПАТЕНТ, СВИДЕТЕЛЬСТВО */
export interface IPatent {
  id: string;
  publType: TPublicationType; // тип публикации
  name: string; // название
  authors: string; // авторы
  type: string; // тип
  number: string; // номер
  date: string; // дата получения
  applicationNumber: string; // номер заявки
  applicationDate: string; // дата заявки
}

/** СВИДЕТАЛЬСТВО */
export interface ICertificate {
  id: string;
  publType: TPublicationType; // тип публикации
  name: string; // название
  authors: string; // авторы
  type: string; // тип
  number: string; // номер
  date: string; // дата получения
  applicationNumber: string; // номер заявки
  applicationDate: string; // дата заявки
}

/** ПУБЛИКАЦИЯ ЛЮБОГО ТИПА */
export type IPublication = IArticle | IPatent | ICertificate;

/** ПУБЛИКАЦИЯ */
export interface IPublications {
  articles: IArticle[]; // статьи
  patents: IPatent[]; // патенты
  certificates: ICertificate[]; // сертификаты
}

/** DB */
export interface Lab {
  publications: IPublications; // публикации
}

/** ОТВЕТ СЕРВЕРА */
export type TServerResponse<T> = {
  success: boolean;
} & T;

/** ОТВЕТ СЕРВЕРА ПРИ УСПЕШНОМ ДОБАВЛЕНИИ И УДАЛЕНИИ ПУБЛИКАЦИИ */
// export type TPublicationResponse<T extends keyof IPublications> =
//   TServerResponse<{
//     [K in T]: IPublications[T];
//   }> | null;

/** ТИП ПУБЛИКАЦИИ */
export type TPublicationKey = keyof IPublications;

/** МАССИВ ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ СТАТЬИ */
export const articleFields: (keyof IArticle)[] = ['authors', 'name', 'journal', 'year', 'volAndNo', 'pages'];

/** МАССИВ ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ ПАТЕНТА */
export const patentFields: (keyof IPatent)[] = ['authors', 'name', 'type', 'number', 'date', 'applicationNumber', 'applicationDate'];

/** МАССИВ ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ СВИДЕТЕЛЬСТВА */
export const certificateFields: (keyof ICertificate)[] = ['authors', 'name', 'type', 'number', 'date', 'applicationNumber', 'applicationDate'];

/** ТИП ПУБЛИКАЦИИ (A - СТАТЬЯ, P - ПАТЕНТ, C - СВИДЕТЕЛЬСТВО) */
export type TPublicationType = 'A' | 'P' | 'C';

/** PAYLOAD ОТВЕТА ПРИ УДАЛЕНИИ ПУБЛИКАЦИИ */
export interface IPublDeletePayload {
  id: string;
  publType: TPublicationType;
}

export interface IPublUpdateParams {
  id: string; // PARAMS
}

export interface IPublUpdateQuery {
  data: Partial<IPublication>;
}