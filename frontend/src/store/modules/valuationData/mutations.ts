import { MutationTree } from 'vuex';

import {
  ENTERPRISE_VALUE,
  MARKET_CAP,
} from '@/store/actions/valuationData';

import { State } from './state';

export type Mutations<S = State> = {
  [MARKET_CAP](state: S, status: number): void,
  [ENTERPRISE_VALUE](state: S, status: number): void,
}

export const mutations: MutationTree<State> & Mutations = {
  [ENTERPRISE_VALUE]: (state, status: number) => {
    state.enterpriseValue = status;
  },
  [MARKET_CAP]: (state, status: number) => {
    state.marketCap = status;
  },
};
