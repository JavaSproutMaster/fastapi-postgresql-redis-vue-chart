import moment from 'moment';

export const formattedDateWithDay = (updatedAt: string | undefined) => {
  if (updatedAt) {
    const date = moment(updatedAt);
    return date.format('ddd MMM DD, YYYY');
  }
  return null;
};

export const formattedDate = (updatedAt: string | undefined) => {
  if (updatedAt) {
    const date = moment(updatedAt);
    // Format the date
    const formattedDate = date.format('MMM DD, YYYY');
    return formattedDate;
  }
  return null;
};

export const splitWords = (word: any, key: any) => {
  if (!key) return [word, '', ''];
  if (!word) return ['', '', ''];
  const wordUpper = word.toUpperCase();
  const keyUpper = key.toUpperCase();
  const index = wordUpper.indexOf(keyUpper);

  if (index === -1) return [word, '', ''];

  const before = word.slice(0, index);
  const match = word.slice(index, index + keyUpper.length);
  const after = word.slice(index + keyUpper.length);
  return [before, match, after];
};

export const parse = (val: any) => {
  if (typeof val === 'string') {
    return parseFloat(val);
  }
  if (typeof val === 'number') {
    return val;
  }
  return undefined;
};
export interface FilterType {
  'name': string;
  'value': number;
  'label'?: string;
}

export const sortTypes: FilterType[] = [
  {
    name: 'Only',
    value: 1,
  },
  {
    name: '+ Other',
    value: 2,
  },
  {
    name: 'All',
    value: 3,
  },
];

export const settingsFonts: FilterType[] = [
  {
    name: 'large',
    value: 1,
    label: 'Large',
  },
  {
    name: 'medium',
    value: 2,
    label: 'Medium',
  },
  {
    name: 'small',
    value: 3,
    label: 'Small',
  },
];

export const additionalSettings: FilterType[] = [
  {
    name: 'showStockPriceAsOfNote',
    value: 1,
    label: 'Show stock price as of note',
  },
  {
    name: 'showIfUpdatedFinancialsavailable',
    value: 2,
    label: 'Show if updated financials available since note date',
  },
  {
    name: 'showFairValue',
    value: 3,
    label: 'Show fair value based on your model (if available)',
  },
  {
    name: 'showBuyBelowPrice',
    value: 4,
    label: 'Show buy below price based on your model',
  },
];
