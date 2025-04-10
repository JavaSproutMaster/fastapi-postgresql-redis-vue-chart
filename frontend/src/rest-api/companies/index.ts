import { apiClient } from '../api';

import {
  Company,
  CompanySimple,
  ValuationAndEarnings,
  FinancialResponse,
  Chart,
  StockPrice,
  Forecast,
  ForecastField,
  NoteData,
  Notes,
} from './assets';

export const list = async (): Promise<CompanySimple[]> => apiClient.get('company');

export const get = async (symbol: string): Promise<Company> => apiClient.get(`company/${symbol}`);

export const valuation = async (symbol: string): Promise<ValuationAndEarnings> => apiClient.get(`company/${symbol}/valuation_and_earnings`);

export const financials = async (symbol: string): Promise<FinancialResponse> => apiClient.get(`company/${symbol}/financials`);

export const chart = async (symbol: string, period: string): Promise<Chart> => apiClient.get(`company/${symbol}/chart/${period}`);

export const stockPriceInPeriod = async (symbol: string, period: string): Promise<StockPrice> => apiClient.get(`company/${symbol}/stock/${period}`);

export const createForecast = async (symbol: string, name: string): Promise<Forecast> => apiClient.post(`company/${symbol}/forecast/create`, { name });

export const forecasts = async (symbol: string): Promise<Forecast[]> => apiClient.get(`company/${symbol}/forecast`);

export const saveForecast = async (symbol: string, forecastId: number, payload: ForecastField) => apiClient.post(`company/${symbol}/forecast/${forecastId}/save`, payload);

export const search = async (symbol: string): Promise<CompanySimple[]> => apiClient.get(`company/${symbol}/search`);

export const getRecentNotes = async (symbol: string): Promise<NoteData[]> => apiClient.get(`company/${symbol}/recent_notes`);

export const getNotes = async (symbol: string, pageNum: number, sort: number): Promise<Notes> => apiClient.get(`company/${symbol}/notes/${pageNum}/${sort}`);

export const addNote = async (symbol: string, note: NoteData): Promise<NoteData> => apiClient.post(`company/${symbol}/notes/create`, note);

export const updateNote = async (symbol: string, noteId: number, updated: NoteData): Promise<NoteData> => apiClient.post(`company/${symbol}/note/${noteId}/update`, updated);

export const saveNote = async (symbol: string, noteId: number, updated: NoteData): Promise<NoteData> => apiClient.post(`company/${symbol}/note/${noteId}/save`, updated);

export const deleteNote = async (symbol: string, noteId: number): Promise<boolean> => apiClient.post(`company/${symbol}/note/${noteId}/delete`);
