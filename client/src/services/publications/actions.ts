import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPublicationsApi } from "../../api/api";

/** ASYNC ACTION ПОЛУЧЕНИЯ ПУБЛИКАЦИЙ */
export const fetchPublications = createAsyncThunk(
  'publications',
  async () => getPublicationsApi()
);