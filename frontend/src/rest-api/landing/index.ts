import { apiClient } from '../api';

import {
  FinancialResponse,
} from './assets';

export const financials = async (symbol: string): Promise<FinancialResponse> => apiClient.get('/landing');
