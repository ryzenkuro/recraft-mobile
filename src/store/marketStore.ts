import { create } from 'zustand';
import { marketService } from '@/services/marketService';
import type { CollabProposal, MarketProduct, MaterialListing } from '@/types';

export type MarketTab = 'PRODUK' | 'BAHAN' | 'KOLAB';

interface MarketStoreState {
  products: MarketProduct[];
  filteredProducts: MarketProduct[];
  materialListings: MaterialListing[];
  collabProposals: CollabProposal[];
  activeTab: MarketTab;
  searchQuery: string;
  locationFilter: string;
  isLoading: boolean;

  fetchMarketData: () => Promise<void>;
  setProducts: (products: MarketProduct[]) => void;
  setActiveTab: (tab: MarketTab) => void;
  setSearchQuery: (query: string) => void;
  setLocationFilter: (location: string) => void;
  applyFilters: () => void;
  submitProposal: (input: Omit<CollabProposal, 'id' | 'status'>) => Promise<void>;
  updateProposalStatus: (
    proposalId: string,
    status: CollabProposal['status']
  ) => void;
}

export const useMarketStore = create<MarketStoreState>((set, get) => ({
  products: [],
  filteredProducts: [],
  materialListings: [],
  collabProposals: [],
  activeTab: 'PRODUK',
  searchQuery: '',
  locationFilter: '',
  isLoading: false,

  fetchMarketData: async () => {
    set({ isLoading: true });
    try {
      const [products, materialListings, collabProposals] = await Promise.all([
        marketService.getProducts(),
        marketService.getMaterialListings(),
        marketService.getCollabProposals(),
      ]);
      set({
        products,
        filteredProducts: products,
        materialListings,
        collabProposals,
        isLoading: false,
      });
      get().applyFilters();
    } catch {
      set({ isLoading: false });
    }
  },

  setProducts: (products) => {
    set({ products, filteredProducts: products });
    get().applyFilters();
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setLocationFilter: (location) => {
    set({ locationFilter: location });
    get().applyFilters();
  },

  applyFilters: () => {
    const { products, searchQuery, locationFilter } = get();
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.originMaterialBadge.toLowerCase().includes(q) ||
        item.seller.name.toLowerCase().includes(q);
      const matchesLocation =
        !locationFilter || item.seller.location.includes(locationFilter);

      return matchesQuery && matchesLocation;
    });

    set({ filteredProducts: filtered });
  },

  submitProposal: async (input) => {
    const created = await marketService.submitCollabProposal(input);
    set((state) => ({
      collabProposals: [created, ...state.collabProposals],
      activeTab: 'KOLAB',
    }));
  },

  updateProposalStatus: (proposalId, status) =>
    set((state) => ({
      collabProposals: state.collabProposals.map((item) =>
        item.id === proposalId ? { ...item, status } : item
      ),
    })),
}));
