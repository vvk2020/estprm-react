import { createSlice } from '@reduxjs/toolkit';
import type { IPublications, IState } from '../../utils/types';
import { fetchPublications } from './actions';

const initialState: IState<IPublications> = {
  loading: false,
  articles: [],
  patents: [],
  certificates: [],
  error: null,
};

/** SLICE РАБОТЫ С ПУБЛИКАЦИЯМИ */
export const publicationsSlice = createSlice({
  name: 'publications',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //* ПОЛУЧЕНИЕ ПУБЛИКАЦИЙ
      .addCase(fetchPublications.pending, state => {
        state.loading = true;
        state.articles = [];
        state.certificates = [];
        state.patents = [];
        state.error = null;
        console.log('state', state);
      })
      .addCase(fetchPublications.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = [...action.payload.articles];
        state.certificates = [...action.payload.certificates];
        state.patents = [...action.payload.patents];        
        console.log('STATE', state);
      })
      .addCase(fetchPublications.rejected, (state, action) => {
        state.loading = false;
        state.articles = [];
        state.certificates = [];
        state.patents = [];
        state.error = action.error.message || 'Ошибка запроса публикаций';
        console.error(state.error);
      });
  },
  selectors: {
    // /** Селектор всех ингредиентов */
    // selectIngredients: (state: TIngredientsState) => state.data,
    // /** Селектор статуса загрузки ингредиентов */
    // selectIngredientsRequestState: (state: TIngredientsState) =>
    //   state.isRequested,
    // /** Селектор ингредиента по его id */
    // selectIngredientById:
    //   (state: TIngredientsState) => (ingredientId: string | undefined) => {
    //     if (!ingredientId) return;
    //     return (
    //       state.data.find((ingredient) => ingredient._id === ingredientId) ||
    //       null
    //     );
    //   }
  },
});
