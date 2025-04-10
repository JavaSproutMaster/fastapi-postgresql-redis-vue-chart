import { TableRow } from '@/components/ui/table/types';

import {
  ratio,
  singleRatio,
  money,
  dollars,
  percentage,
  percentageAverage,
  rounded,
} from '@/services/renderers';

export const tableRows: TableRow[] = [
  {
    name: 'Earnings per share',
    key: 'earningsPerShare',
    // help: 'Basic (non-diluted) EPS = Net Income (07) / Shares Outstanding (20)',
    help: 'Diluted EPS',
    showCounter: true,
    separate: false,
    handler: ratio,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Free cash flow per share',
    key: 'freeCashFlowPerShare',
    help: 'FCF per share = Free Cash Flow to the Firm (13) / Shares Outstanding (20)',
    showCounter: true,
    separate: false,
    handler: ratio,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Dividends per share',
    key: 'dividendsPerShare',
    help: 'Adjusted for splits',
    showCounter: true,
    separate: false,
    handler: ratio,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Dividends payout, %',
    key: 'dividendsPayout',
    showCounter: true,
    separate: true,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Revenue',
    key: 'revenue',
    showCounter: true,
    separate: false,
    handler: dollars,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ㅤ% Change',
    key: 'revenueChange',
    showCounter: true,
    separate: false,
    editable: true,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Net Income',
    key: 'netIncome',
    showCounter: true,
    separate: false,
    handler: money,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ㅤ% Margin',
    key: 'margin',
    showCounter: true,
    separate: true,
    editable: true,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentageAverage,
      },
    },
  },
  {
    name: 'CFO',
    key: 'cashFlowFromOperatingActivities',
    showCounter: true,
    separate: false,
    handler: money,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ㅤ% Of revenue',
    key: 'percentageCfoOfRevenue',
    showCounter: true,
    separate: false,
    editable: true,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentageAverage,
      },
    },
  },
  {
    name: 'CAPEX',
    key: 'capex',
    showCounter: true,
    separate: false,
    handler: money,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ㅤ% Change',
    key: 'capexChange',
    showCounter: true,
    separate: false,
    editable: true,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentageAverage,
      },
    },
  },
  {
    name: 'FCFF',
    key: 'freeCashFlow',
    help: 'Free Cash Flow to the Firm = Cash Flows from Operating Activities (09) – Capital Expenditures (11)',
    showCounter: true,
    separate: true,
    handler: money,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Total assets',
    key: 'totalAssets',
    showCounter: true,
    separate: false,
    handler: money,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ㅤ% Change',
    key: 'totalAssetsChange',
    showCounter: true,
    separate: false,
    editable: true,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Total liabilities',
    key: 'totalLiabilities',
    showCounter: true,
    separate: false,
    handler: money,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ㅤ% Of assets',
    key: 'percentageLiabilitiesOfAssets',
    showCounter: true,
    separate: false,
    editable: true,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentageAverage,
      },
    },
  },
  {
    name: 'Shareholders Equity',
    key: 'shareholdersEquity',
    showCounter: true,
    separate: false,
    handler: money,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Net Debt',
    key: 'netDebt',
    showCounter: true,
    separate: false,
    handler: money,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Shares Outstanding',
    key: 'sharesOutstanding',
    help: 'Diluted Weighted-average Shares Outstanding',
    showCounter: true,
    separate: false,
    handler: rounded,
    size: 'var(--font-size-8)',
    weight: 600,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ㅤ% Change',
    key: 'sharesOutstandingChange',
    showCounter: true,
    separate: true,
    editable: true,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ROA',
    key: 'roa',
    showCounter: true,
    separate: false,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ROE',
    key: 'roe',
    showCounter: true,
    separate: false,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Interest coverage',
    key: 'interestCoverage',
    showCounter: true,
    separate: false,
    handler: ratio,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Dividend Yield',
    key: 'dividendYield',
    showCounter: true,
    separate: false,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'P/E Ratio',
    key: 'priceEarningsRatioLtm',
    showCounter: true,
    separate: false,
    handler: singleRatio,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Stock price range',
    key: 'stockPriceRange',
    showCounter: true,
    separate: false,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Market Cap',
    key: 'averageMarketCap',
    help: 'End of Period Market Cap',
    showCounter: true,
    separate: false,
    handler: money,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'FCF Yield',
    key: 'freeCashFlowYield',
    showCounter: true,
    separate: false,
    handler: percentage,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'Average stock price',
    key: 'averageStockPrice',
    showCounter: true,
    separate: true,
    handler: singleRatio,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'EnterPrise Value',
    key: 'enterpriseValue',
    showCounter: false,
    separate: false,
    handler: money,
    hidden: true,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'netDebt Estimate',
    key: 'netDebtEstimate',
    showCounter: false,
    separate: false,
    handler: money,
    hidden: true,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'required Return',
    key: 'requiredReturn',
    showCounter: false,
    separate: false,
    handler: percentage,
    hidden: true,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'terminal Value',
    key: 'terminalValue',
    showCounter: false,
    separate: false,
    handler: money,
    hidden: true,
    override: {
      '10 year gagr': {
        handler: percentage,
      },
    },
  },
  {
    name: 'ㅤLess: preferred stock',
    key: 'preferredStock',
    showCounter: false,
    separate: false,
    handler: rounded,
    hidden: true,
  },
  {
    name: 'ㅤLess: minority interest',
    key: 'minorityInterest',
    showCounter: false,
    separate: false,
    handler: money,
    hidden: true,
  },
  {
    name: 'FCFF terminal growth rate',
    key: 'freeCashFlowGrowthRate',
    showCounter: false,
    separate: false,
    editable: true,
    handler: percentage,
    hidden: true,
  },
];

export const chartRows = {
  earningsPerShare: {
    axis: 'y-right',
    color: '#9650FB',
    type: 'perShare',
  },
  freeCashFlowPerShare: {
    axis: 'y-right',
    color: '#E6D690',
    type: 'perShare',
  },
  dividendsPerShare: {
    axis: 'y-right',
    color: '#EFDECD',
    type: 'perShare',
  },
  dividendsPayout: {
    axis: 'y-right',
    color: '#A8E4A0',
    type: 'percent',
  },
  revenue: {
    axis: 'y-left',
    color: '#3348FB',
    type: 'millions',
  },
  revenueChange: {
    axis: 'y-right',
    color: '#CD00CD',
    type: 'percent',
  },
  netIncome: {
    axis: 'y-left',
    color: '#37D27F',
    type: 'millions',
  },
  margin: {
    axis: 'y-right',
    color: '#BDDA57',
    type: 'percent',
  },
  cashFlowFromOperatingActivities: {
    axis: 'y-left',
    color: '#4E5754',
    type: 'millions',
  },
  percentageCfoOfRevenue: {
    axis: 'y-right',
    color: '#008080',
    type: 'percent',
  },
  capex: {
    axis: 'y-left',
    color: '#8C4743',
    type: 'millions',
  },
  capexChange: {
    axis: 'y-right',
    color: '#EA899A',
    type: 'percent',
  },
  freeCashFlow: {
    axis: 'y-left',
    color: '#01796F',
    type: 'millions',
  },
  totalAssets: {
    axis: 'y-left',
    color: '#E6A8D7',
    type: 'millions',
  },
  totalAssetsChange: {
    axis: 'y-right',
    color: '#FF7518',
    type: 'percent',
  },
  totalLiabilities: {
    axis: 'y-left',
    color: '#90845B',
    type: 'millions',
  },
  percentageLiabilitiesOfAssets: {
    axis: 'y-right',
    color: '#00A86B',
    type: 'percent',
  },
  shareholdersEquity: {
    axis: 'y-left',
    color: '#8E7962',
    type: 'millions',
  },
  netDebt: {
    axis: 'y-left',
    color: '#71BC78',
    type: 'millions',
  },
  sharesOutstanding: {
    axis: 'y-left',
    color: '#03C03C',
    type: 'millions',
  },
  sharesOutstandingChange: {
    axis: 'y-right',
    color: '#1A153F',
    type: 'percent',
  },
  roa: {
    axis: 'y-right',
    color: '#E97451',
    type: 'percent',
  },
  roe: {
    axis: 'y-right',
    color: '#FFBD88',
    type: 'percent',
  },
  interestCoverage: {
    axis: 'y-right',
    color: '#8E4585',
    type: 'perShare',
  },
  dividendYield: {
    axis: 'y-right',
    color: '#D2B48C',
    type: 'percent',
  },
  priceEarningsRatioLtm: {
    axis: 'y-right',
    color: '#FF9966',
    type: 'perShare',
  },
  averageMarketCap: {
    axis: 'y-left',
    color: '#9400D3',
    type: 'millions',
  },
  freeCashFlowYield: {
    axis: 'y-right',
    color: '#F3A505',
    type: 'percent',
  },
  averageStockPrice: {
    axis: 'y-right',
    color: '#2A8D9C',
    type: 'perShare',
  },
};
