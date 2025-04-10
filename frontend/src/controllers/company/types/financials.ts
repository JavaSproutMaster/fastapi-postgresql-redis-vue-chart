import { Financial } from '@/rest-api/companies/assets';

interface Financials {
  actual: Financial[];
  quarterly: Financial[];
  average: Financial[];
  estimated: Financial[];
  projected: Financial[];
}

export {
  Financials, // eslint-disable-line
};
