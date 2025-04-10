import { ChartField, CheckBoxField } from '@/components/ui/table-column/types';
import { percentage } from '@/services/renderers';
import { ChartOptions } from 'chart.js';

export const availableRanges = ['10Y', '5Y', '1Y', '6M', '1M', '5D', '1D'];

export const availableTypes = ['rebased', 'absolut'];

export const companyChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: false,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      titleFont: {
        size: 12,
        family: 'Gilroy',
      },
      bodyFont: {
        size: 12,
        family: 'Gilroy',
        style: 'normal',
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  scales: {
    'y-right': {
      type: 'linear',
      position: 'right',
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        display: true,
        padding: 10,
        color: '#808080',
        font: {
          size: 10,
          family: 'Gilroy',
          style: 'normal',
          lineHeight: 2,
        },
      },
    },
    'y-left': {
      type: 'linear',
      position: 'left',
      grid: {
        display: true,
        drawOnChartArea: true,
        drawTicks: false,
      },
      border: {
        display: false,
      },
      ticks: {
        display: false,
        padding: 10,
        color: '#808080',
        font: {
          size: 10,
          family: 'Gilroy',
          style: 'normal',
          lineHeight: 2,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        display: true,
        color: '#808080',
        padding: 20,
        font: {
          size: 10,
          family: 'Gilroy',
          style: 'normal',
          lineHeight: 2,
        },
      },
    },
  },
};

export const chartFields: ChartField[] = [
  {
    name: 'Stock price',
    key: 'stockPrice',
    color: '#9650fb',
    axis: 'y-right',
    handler: 'pershare',
  },
  {
    name: 'Free cash flow per share',
    key: 'freeCashFlowPerShare',
    color: '#3348fb',
    axis: 'y-right',
    handler: 'pershare',
  },
  {
    name: 'Earnings per share',
    key: 'earningsPerShare',
    color: '#37d27f',
    axis: 'y-right',
    handler: 'pershare',
  },
  {
    name: 'Dividends per share',
    key: 'dividendsPerShare',
    color: '#724329',
    axis: 'y-right',
    handler: 'pershare',
  },
  {
    name: 'Revenue',
    key: 'revenue',
    color: '#3348fb',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Gross profit',
    key: 'grossProfit',
    color: '#cd00cd',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Net income',
    key: 'netIncome',
    color: '#37d27f',
    axis: 'y-left',
    handler: 'millions',
  },

  {
    name: 'Cash flows from operating activities',
    key: 'cashFlowFromOperatingActivities',
    color: '#008080',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Capital Expenditures',
    key: 'capitalExpenditures',
    color: '#8c4743',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Cash flows from investing activities',
    key: 'cashFlowsFromInvestingActivities',
    color: '#ea899a',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Cash flows from financing activities',
    key: 'cashFlowFromFinancingActivities',
    color: '#c1dc60',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Free cash flow to the Firm',
    key: 'freeCashFlowToTheFirm',
    color: '#01796f',
    axis: 'y-left',
    handler: 'millions',
  },

  {
    name: 'Total assets',
    key: 'totalAssets',
    color: '#e6a8d7',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Current assets',
    key: 'currentAssets',
    color: '#ff771b',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Total liabilities',
    key: 'totalLiabilities',
    color: '#90845b',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Current liabilities',
    key: 'currentLiabilities',
    color: '#00a86b',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Total debt',
    key: 'totalDebt',
    color: '#37D27F',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Net debt',
    key: 'netDebt',
    color: '#71bc78',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Shareholder\'s Equity',
    key: 'shareholdersEquity',
    color: '#8e7962',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'Shares outstanding',
    key: 'sharesOutstanding',
    color: '#03c03c',
    axis: 'y-left',
    handler: 'millions',
  },

  {
    name: 'P/E Ratio LTM',
    key: 'peRatioLtm',
    color: '#ff9e6e',
    axis: 'y-right',
    handler: 'number',
  },
  {
    name: 'Average Market Cap',
    key: 'averageMarketCap',
    color: '#9400d3',
    axis: 'y-left',
    handler: 'millions',
  },
  {
    name: 'FCF Yield',
    key: 'fcfYield',
    color: '#f4a80e',
    axis: 'y-right',
    handler: 'percentage',
  },
  {
    name: 'Average stock price',
    key: 'averageStockPrice',
    color: '#4b9eaa',
    axis: 'y-right',
    handler: 'pershare',
  },
  {
    name: 'Dividend Yield',
    key: 'dividendYield',
    color: '#bbeab5',
    axis: 'y-right',
    handler: 'percentage',
  },
  {
    name: 'Gross margin',
    key: 'grossMargin',
    color: '#e6a8d7',
    axis: 'y-right',
    handler: 'percentage',
  },
  {
    name: 'Net income margin',
    key: 'netIncomeMargin',
    color: '#BDDA57',
    axis: 'y-right',
    handler: 'percentage',
  },
  {
    name: 'ROA',
    key: 'roa',
    color: '#ea899a',
    axis: 'y-right',
    handler: 'percentage',
  },
  {
    name: 'ROE',
    key: 'roe',
    color: '#37D27F',
    axis: 'y-right',
    handler: 'percentage',
  },
  {
    name: 'Interest coverage',
    key: 'interestCoverage',
    color: '#8e4585',
    axis: 'y-right',
    handler: 'number',
  },
];

export const perShareFields : CheckBoxField[] = [
  {
    name: 'Earnings per share',
    key: 'earningsPerShare',
    value: true,
  },
  {
    name: 'Free cash flow per share',
    key: 'freeCashFlowPerShare',
    value: true,
  },
  {
    name: 'Stock price',
    key: 'stockPrice',
    value: true,
  },
  {
    name: 'Dividends per share',
    key: 'dividendsPerShare',
    value: false,
  },
];

export const plFields : CheckBoxField[] = [
  {
    name: 'Revenue',
    key: 'revenue',
    value: false,
  },
  {
    name: 'Gross profit',
    key: 'grossProfit',
    value: false,
  },
  {
    name: 'Net income',
    key: 'netIncome',
    value: false,
  },
];

export const cfFields :CheckBoxField[] = [
  {
    name: 'Cash flows from operating activities',
    key: 'cashFlowFromOperatingActivities',
    value: false,
  },
  {
    name: 'Capital Expenditures',
    key: 'capitalExpenditures',
    value: false,
  },
  {
    name: 'Cash flows from investing activities',
    key: 'cashFlowsFromInvestingActivities',
    value: false,
  },
  {
    name: 'Cash flows from financing activities',
    key: 'cashFlowFromFinancingActivities',
    value: false,
  },
  {
    name: 'Free cash flow to the Firm',
    key: 'freeCashFlowToTheFirm',
    value: false,
  },
];

export const bsFields : CheckBoxField[] = [
  {
    name: 'Total assets',
    key: 'totalAssets',
    value: false,
  },
  {
    name: 'Current assets',
    key: 'currentAssets',
    value: false,
  },
  {
    name: 'Total liabilities',
    key: 'totalLiabilities',
    value: false,
  },
  {
    name: 'Current liabilities',
    key: 'currentLiabilities',
    value: false,
  },
  {
    name: 'Total debt',
    key: 'totalDebt',
    value: false,
  },
  {
    name: 'Net debt',
    key: 'netDebt',
    value: false,
  },
  {
    name: 'Shareholder\'s Equity',
    key: 'shareholdersEquity',
    value: false,
  },
  {
    name: 'Shares outstanding',
    key: 'sharesOutstanding',
    value: false,
  },
];

export const valuationFields : CheckBoxField[] = [
  {
    name: 'P/E Ratio LTM',
    key: 'peRatioLtm',
    value: false,
  },
  {
    name: 'Average Market Cap',
    key: 'averageMarketCap',
    value: false,
  },
  {
    name: 'FCF Yield',
    key: 'fcfYield',
    value: false,
  },
  {
    name: 'Average stock price',
    key: 'averageStockPrice',
    value: false,
  },
  {
    name: 'Dividend Yield',
    key: 'dividendYield',
    value: false,
  },
];

export const otherFields : CheckBoxField[] = [
  {
    name: 'Gross margin',
    key: 'grossMargin',
    value: false,
  },
  {
    name: 'Net income margin',
    key: 'netIncomeMargin',
    value: false,
  },
  {
    name: 'ROA',
    key: 'roa',
    value: false,
  },
  {
    name: 'ROE',
    key: 'roe',
    value: false,
  },
  {
    name: 'Interest coverage',
    key: 'interestCoverage',
    value: false,
  },
];

export const initialChartParams: string[] = [
  perShareFields[0].key,
  perShareFields[1].key,
  perShareFields[2].key,
];
