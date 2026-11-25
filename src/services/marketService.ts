import { API_BASE_URL, USE_MOCK_DATA } from '@/config/environment';
import { mockMarketService } from '@/mocks';
import type { CollabProposal, MarketProduct, MaterialListing } from '@/types';

export interface MarketService {
  getProducts: () => Promise<MarketProduct[]>;
  getMaterialListings: () => Promise<MaterialListing[]>;
  getCollabProposals: () => Promise<CollabProposal[]>;
  submitCollabProposal: (
    input: Omit<CollabProposal, 'id' | 'status'>
  ) => Promise<CollabProposal>;
}

const apiMarketService: MarketService = {
  async getProducts(): Promise<MarketProduct[]> {
    const res = await fetch(`${API_BASE_URL}/market/products`);
    if (!res.ok) throw new Error('Gagal memuat produk Pasar.');
    return res.json() as Promise<MarketProduct[]>;
  },

  async getMaterialListings(): Promise<MaterialListing[]> {
    const res = await fetch(`${API_BASE_URL}/market/materials`);
    if (!res.ok) throw new Error('Gagal memuat daftar bahan.');
    return res.json() as Promise<MaterialListing[]>;
  },

  async getCollabProposals(): Promise<CollabProposal[]> {
    const res = await fetch(`${API_BASE_URL}/market/proposals`);
    if (!res.ok) throw new Error('Gagal memuat proposal kolaborasi.');
    return res.json() as Promise<CollabProposal[]>;
  },

  async submitCollabProposal(
    input: Omit<CollabProposal, 'id' | 'status'>
  ): Promise<CollabProposal> {
    const res = await fetch(`${API_BASE_URL}/market/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error('Gagal mengirim proposal.');
    return res.json() as Promise<CollabProposal>;
  },
};

export const marketService: MarketService = USE_MOCK_DATA
  ? mockMarketService
  : apiMarketService;
