import type { IPublicationsResp } from '../utils/types';

/** БАЗОВАЯ ЧАСТЬ URL */
const URL = import.meta.env.VITE_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then(err => Promise.reject(err));

//! НЕАВТОРИЗОВАННЫЕ ЗАПРОСЫ ========================================

/** ЗАПРОС ПУБЛИКАЦИЙ */
export const getPublicationsApi = async (): Promise<IPublicationsResp> => {
  try {
    const response = await fetch(`${URL}/publications`);
    const data = await checkResponse<IPublicationsResp>(response);

    if (data?.success) {
      return data;
    }
    return Promise.reject(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
