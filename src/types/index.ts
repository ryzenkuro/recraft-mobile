export type UserRole = 'PEMBELI' | 'PENYEDIA' | 'PERAJIN';

export type ScanFlowState = 'IDLE' | 'PROCESSING' | 'CONFIRMATION' | 'ERROR';

export interface ScanDimensionsCm {
  panjang: number;
  lebar: number;
  tinggi: number;
}

export interface ScanResult {
  id: string;
  materialType: string;
  dimensions: ScanDimensionsCm;
  confidence: number;
  photoUrl: string;
  timestampIso: string;
  detectedMaterials: string[];
}

export interface ToolOption {
  id: string;
  name: string;
  available: boolean;
  iconName:
    | 'pen-tool'
    | 'ruler'
    | 'scissors'
    | 'droplets'
    | 'git-commit'
    | 'paperclip';
}

export interface CraftTargetOption {
  id: string;
  studioProjectId: string;
  name: string;
  subtitle: string;
  durationLabel: string;
  primaryMaterial: string;
  estimatedValueRangeIdr: [number, number];
  componentCount: number;
  thumbnail: string;
}

export type ProjectCategory = 'KARYA' | 'OFFLINE' | 'PRODUKSI';

export interface ProjectSummary {
  id: string;
  name: string;
  thumbnail: string;
  iconHint: 'box' | 'lamp' | 'archive';
  materialLabel: string;
  dimensionsCm: ScanDimensionsCm;
  componentCount: number;
  estimatedValueRangeIdr: [number, number];
  offlineAvailable: boolean;
  inProduction: boolean;
  productionNote?: string;
  lastUpdatedLabel: string;
}

export interface MarketProduct {
  id: string;
  name: string;
  priceIdr: number;
  images: string[];
  originMaterialBadge: string;
  description: string;
  sustainabilityNote: string;
  careInstructions: string[];
  dimensionsText: string;
  weightGrams: number;
  soldCountLabel: string;
  seller: {
    id: string;
    name: string;
    avatarUrl: string;
    location: string;
    rating: number;
    verified: boolean;
  };
  rating: number;
  reviews: number;
}

export interface MaterialListing {
  id: string;
  title: string;
  materialType: string;
  dimensionsText: string;
  quantityLabel: string;
  location: string;
  providerName: string;
  schemeLabel: string;
  image: string;
}

export interface CollabProposal {
  id: string;
  materialListingId: string;
  materialTitle: string;
  artisanName: string;
  linkedStudioId: string;
  linkedStudioTitle: string;
  revenueSplitLabel: string;
  status: 'MENUNGGU' | 'DISETUJUI' | 'PRODUKSI';
}

export interface RevenueHistoryItem {
  id: string;
  title: string;
  dateLabel: string;
  amountIdr: number;
  type: 'BAGI_HASIL' | 'PENJUALAN' | 'PENARIKAN';
}

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  location: string;
  verified: boolean;
  activeRole: UserRole;
  roles: UserRole[];
  balanceIdr: number;
  impactStats: {
    projectsCompleted: number;
    itemsManaged: number;
    co2SavedKg: number;
  };
  revenueHistory: RevenueHistoryItem[];
}
