import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from '../api'

export const loadBrands = createAsyncThunk(
  'parts/loadBrands',
  (number) => api.fetchBrands(number),
)

export const loadOffers = createAsyncThunk(
  'parts/loadOffers',
  ({ number, brand }) => api.fetchOffers(number, brand),
)

const initialState = {
  brands: { status: 'idle', items: [], error: null, requestId: null },
  selected: null, // { brand, number }
  offers: { status: 'idle', items: [], error: null, requestId: null },
}

// Применяем результат только если это ответ на самый последний запрос
const isLatest = (section, action) => section.requestId === action.meta.requestId

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBrands.pending, (state, action) => {
        state.brands = { status: 'loading', items: [], error: null, requestId: action.meta.requestId }
        state.selected = null
        state.offers = initialState.offers
      })
      .addCase(loadBrands.fulfilled, (state, action) => {
        if (!isLatest(state.brands, action)) return
        state.brands.status = 'succeeded'
        state.brands.items = action.payload
      })
      .addCase(loadBrands.rejected, (state, action) => {
        if (!isLatest(state.brands, action)) return
        state.brands.status = 'failed'
        state.brands.error = action.error.message
      })
      .addCase(loadOffers.pending, (state, action) => {
        state.selected = action.meta.arg
        state.offers = { status: 'loading', items: [], error: null, requestId: action.meta.requestId }
      })
      .addCase(loadOffers.fulfilled, (state, action) => {
        if (!isLatest(state.offers, action)) return
        state.offers.status = 'succeeded'
        state.offers.items = action.payload
      })
      .addCase(loadOffers.rejected, (state, action) => {
        if (!isLatest(state.offers, action)) return
        state.offers.status = 'failed'
        state.offers.error = action.error.message
      })
  },
})

export default partsSlice.reducer
