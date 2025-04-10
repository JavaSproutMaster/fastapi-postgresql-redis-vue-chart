export interface NoteHistory {
  title: string;
  description?: string;
  updatedAt?: string;
}

export interface NoteData {
  id?: number;
  title: string;
  description: string;
  notePrice?: number;
  fairValueEstimate?: number;
  belowPrice?: number;
  symbols: string[];
  currency: string;
  createdAt?: string;
  updatedAt?: string;
  updated?: boolean;
  histories?: NoteHistory[];
}

export interface CompanyNote {
  notes: NoteData[];
}

export const emptyNote: NoteData = {
  id: undefined,
  title: '',
  description: '',
  notePrice: undefined,
  fairValueEstimate: undefined,
  belowPrice: undefined,
  symbols: [],
  currency: 'USD',
};

export interface Notes {
  notes: NoteData[],
  totalCount: number,
  totalPages: number,
}
