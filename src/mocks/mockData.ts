import type {
  CollabProposal,
  CraftTargetOption,
  MarketProduct,
  MaterialListing,
  ProjectSummary,
  ScanResult,
  ToolOption,
  UserProfile,
} from '@/types';
import type { Studio3DPayload } from '@/types/studio';

export const DEFAULT_STUDIO_PROJECT_ID = 'P1';
export const DEFAULT_PRODUCT_ID = 'PROD_001';

export const mockAnalysisSteps: readonly string[] = [
  'Menganalisis kekuatan bahan...',
  'Merancang arsitektur potongan...',
  'Membangun model 3D...',
];

export const mockScanResults: ScanResult[] = [
  {
    id: 'SCAN_001',
    materialType: 'Kardus Kraft Gelombang Ganda',
    dimensions: { panjang: 45, lebar: 30, tinggi: 25 },
    confidence: 0.96,
    photoUrl: 'https://images.unsplash.com/photo-1626512316698-3a1c09ce29a0?w=600',
    timestampIso: '2026-11-25T07:00:00.000Z',
    detectedMaterials: ['Kardus Kraft 5mm', 'Serat Daur Ulang'],
  },
  {
    id: 'SCAN_002',
    materialType: 'Botol Plastik PET 1.5L',
    dimensions: { panjang: 20, lebar: 10, tinggi: 32 },
    confidence: 0.91,
    photoUrl: 'https://images.unsplash.com/photo-1614707267537-b85faf00021e?w=600',
    timestampIso: '2026-11-25T06:30:00.000Z',
    detectedMaterials: ['Plastik PET Bening', 'Tutup HDPE'],
  },
];

export const mockTools: ToolOption[] = [
  { id: 'T1', name: 'Cutter', available: true, iconName: 'pen-tool' },
  { id: 'T2', name: 'Penggaris Besi', available: true, iconName: 'ruler' },
  { id: 'T3', name: 'Gunting', available: true, iconName: 'scissors' },
  { id: 'T4', name: 'Lem Tembak', available: false, iconName: 'droplets' },
  { id: 'T5', name: 'Tali Rami', available: false, iconName: 'spline' },
  { id: 'T6', name: 'Selotip Kertas', available: true, iconName: 'layers' },
];

export const mockCraftTargets: CraftTargetOption[] = [
  {
    id: 'TARGET_01',
    studioProjectId: 'P1',
    name: 'Rak Modular Mini',
    subtitle: 'Sambungan selip kunci tanpa lem panas',
    primaryMaterial: 'Kardus Kraft',
    estimatedValueRangeIdr: [55000, 85000],
    componentCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  },
  {
    id: 'TARGET_02',
    studioProjectId: 'P2',
    name: 'Lampu Meja Geometris',
    subtitle: 'Kap lipat poligonal hemat cahaya',
    primaryMaterial: 'Kardus + PET',
    estimatedValueRangeIdr: [75000, 110000],
    componentCount: 4,
    thumbnail: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400',
  },
  {
    id: 'TARGET_03',
    studioProjectId: 'P3',
    name: 'Pot Hidroponik Vertikal',
    subtitle: 'Sistem sumbu kapiler hemat air',
    primaryMaterial: 'Botol PET',
    estimatedValueRangeIdr: [45000, 70000],
    componentCount: 4,
    thumbnail: 'https://images.unsplash.com/photo-1517919272601-b04fb111ce4d?w=400',
  },
];

const RAK_MODULAR_CUTTING_MAP_SVG = `
<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="8" width="304" height="184" rx="6" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
  <g data-code="C01">
    <rect x="18" y="18" width="130" height="76" fill="#E0F2FE" stroke="#DC2626" stroke-width="2" />
    <line x1="18" y1="36" x2="148" y2="36" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="5,4" />
    <circle cx="44" cy="56" r="4" fill="#15803D" />
    <circle cx="122" cy="56" r="4" fill="#15803D" />
    <text x="83" y="60" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#0F3A7D">C01</text>
  </g>
  <g data-code="C02">
    <rect x="158" y="18" width="144" height="76" fill="#FFFFFF" stroke="#DC2626" stroke-width="2" />
    <circle cx="176" cy="56" r="4" fill="#15803D" />
    <circle cx="284" cy="56" r="4" fill="#15803D" />
    <text x="230" y="60" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#0F3A7D">C02</text>
  </g>
  <g data-code="C03">
    <rect x="18" y="104" width="90" height="78" fill="#FFFFFF" stroke="#DC2626" stroke-width="2" />
    <line x1="36" y1="104" x2="36" y2="182" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="5,4" />
    <text x="63" y="147" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#0F3A7D">C03</text>
  </g>
  <g data-code="C04">
    <rect x="116" y="104" width="90" height="78" fill="#FFFFFF" stroke="#DC2626" stroke-width="2" />
    <line x1="188" y1="104" x2="188" y2="182" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="5,4" />
    <text x="161" y="147" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#0F3A7D">C04</text>
  </g>
  <g data-code="C05">
    <rect x="214" y="104" width="88" height="78" fill="#FFFFFF" stroke="#DC2626" stroke-width="2" />
    <circle cx="258" cy="122" r="4" fill="#15803D" />
    <circle cx="258" cy="164" r="4" fill="#15803D" />
    <text x="258" y="147" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700" fill="#0F3A7D">C05</text>
  </g>
</svg>
`.trim();

export const mockStudioPayloads: Record<string, Studio3DPayload> = {
  P1: {
    projectId: 'P1',
    title: 'Rak Modular Mini',
    architectureSummary:
      'Struktur kotak berlapis ganda dengan sistem sambungan selip kunci (slot-and-tab) yang menopang beban meja hingga 4,5 kg tanpa lem panas.',
    primaryScrapMaterial: 'Kardus Kraft Gelombang Ganda (5mm)',
    strengthCategory: 'MEDIUM',
    estimatedValueRangeIdr: [55000, 85000],
    cuttingMapSvg: RAK_MODULAR_CUTTING_MAP_SVG,
    components: [
      {
        code: 'C01',
        name: 'Alas Utama',
        qty: 1,
        dimensionsMm: [420, 260, 10],
        explodeVector: [0, -0.75, 0],
        meshPosition: [0, -0.55, 0],
        meshSize: [1.6, 0.1, 1.0],
        colorHex: '#C89F72',
        materialNote:
          'Memanfaatkan panel terluas kardus kraft dengan arah serat melintang untuk menahan lentur vertikal.',
        cuttingNote:
          'Potong lurus mengikuti garis merah 42,0 × 26,0 cm. Sisakan dua lubang celah (slot) ukuran 20 × 6 mm di sisi kiri-kanan.',
        foldingNote:
          'Buat garis lipatan ringan (scoring) 1,5 cm di bibir depan untuk penguat tepi ganda tanpa memutus lapisan kraft luar.',
        assemblyNote:
          'Menjadi fondasi utama yang mengunci panel samping C03 dan C04 dari bawah serta menopang sekat tengah C05.',
        connectedCodes: ['C02', 'C03', 'C04', 'C05'],
        svgRect: { x: 18, y: 18, w: 130, h: 76 },
      },
      {
        code: 'C02',
        name: 'Dinding Belakang',
        qty: 1,
        dimensionsMm: [420, 280, 5],
        explodeVector: [0, 0.15, -0.85],
        meshPosition: [0, 0, -0.48],
        meshSize: [1.6, 1.05, 0.08],
        colorHex: '#B6895B',
        materialNote:
          'Panel belakang berdensitas rapat berfungsi sebagai penahan gaya geser lateral agar rak tidak goyang.',
        cuttingNote:
          'Potong persegi 42,0 × 28,0 cm dengan sudut 90° presisi memakai penggaris besi.',
        foldingNote:
          'Tidak memerlukan lipatan utama; cukup ratakan tepi potongan agar rapat ke alur belakang.',
        assemblyNote:
          'Diselipkan ke alur belakang C03 dan C04, lalu dikunci tab tengah ke C05 untuk kekakuan diagonal.',
        connectedCodes: ['C01', 'C03', 'C04', 'C05'],
        svgRect: { x: 158, y: 18, w: 144, h: 76 },
      },
      {
        code: 'C03',
        name: 'Samping Kiri',
        qty: 1,
        dimensionsMm: [260, 280, 5],
        explodeVector: [-0.95, 0, 0],
        meshPosition: [-0.76, 0, 0],
        meshSize: [0.08, 1.05, 1.0],
        colorHex: '#D6B084',
        materialNote:
          'Dipilih dari sisi kardus tanpa bekas lipatan pabrik agar mampu menahan beban tekan dari atas.',
        cuttingNote:
          'Potong 26,0 × 28,0 cm lengkap dengan lidah kunci bawah (tab) 20 × 12 mm.',
        foldingNote:
          'Skor ringan di sisi tepi dalam 1,8 cm untuk membentuk flens pengunci dinding belakang C02.',
        assemblyNote:
          'Tancapkan tab bawah C03 ke lubang C01, lalu kaitkan flens belakang ke panel C02.',
        connectedCodes: ['C01', 'C02', 'C05'],
        svgRect: { x: 18, y: 104, w: 90, h: 78 },
      },
      {
        code: 'C04',
        name: 'Samping Kanan',
        qty: 1,
        dimensionsMm: [260, 280, 5],
        explodeVector: [0.95, 0, 0],
        meshPosition: [0.76, 0, 0],
        meshSize: [0.08, 1.05, 1.0],
        colorHex: '#D6B084',
        materialNote:
          'Pasangan simetris dari C03; gunakan lapisan kraft terkeras menghadap keluar untuk ketahanan gores.',
        cuttingNote:
          'Potong 26,0 × 28,0 cm dengan dimensi tab pengunci identik terhadap C03.',
        foldingNote:
          'Skor garis biru putus-putus pada sudut 90° searah alur gelombang kardus agar tidak retak.',
        assemblyNote:
          'Diselipkan ke celah kanan C01 dan dikunci bersamaan dengan rak tengah C05 serta dinding C02.',
        connectedCodes: ['C01', 'C02', 'C05'],
        svgRect: { x: 116, y: 104, w: 90, h: 78 },
      },
      {
        code: 'C05',
        name: 'Sekat Tengah',
        qty: 1,
        dimensionsMm: [410, 250, 8],
        explodeVector: [0, 0.85, 0.4],
        meshPosition: [0, 0.05, 0.02],
        meshSize: [1.52, 0.08, 0.94],
        colorHex: '#DFBE95',
        materialNote:
          'Menggunakan sisa lembaran tengah yang diperkuat lipatan rusuk agar tidak melendut saat menaruh buku.',
        cuttingNote:
          'Potong 41,0 × 25,0 cm dengan dua lidah kait kiri-kanan serta satu lidah kunci ke C02.',
        foldingNote:
          'Tekuk bibir depan 1,5 cm ke bawah membentuk tulangan T untuk menambah momen inersia.',
        assemblyNote:
          'Dipasang terakhir setelah C01–C04 berdiri: selipkan kiri-kanan ke alur C03/C04 dan kunci ke belakang C02.',
        connectedCodes: ['C01', 'C02', 'C03', 'C04'],
        svgRect: { x: 214, y: 104, w: 88, h: 78 },
      },
    ],
  },
  P2: {
    projectId: 'P2',
    title: 'Lampu Meja Geometris',
    architectureSummary:
      'Kap lampu faset poligonal berpendingin pasif dengan rangka lipat segienam yang menghasilkan pendaran cahaya hangat.',
    primaryScrapMaterial: 'Kardus Kraft + Diffuser Botol PET',
    strengthCategory: 'LIGHT',
    estimatedValueRangeIdr: [75000, 110000],
    cuttingMapSvg: RAK_MODULAR_CUTTING_MAP_SVG,
    components: [
      {
        code: 'C01',
        name: 'Dudukan Alas Lampu',
        qty: 1,
        dimensionsMm: [180, 180, 10],
        explodeVector: [0, -0.75, 0],
        meshPosition: [0, -0.5, 0],
        meshSize: [1.1, 0.12, 1.1],
        colorHex: '#B6895B',
        materialNote: 'Alas berlapis ganda dengan pemberat pasif agar stabil di meja kerja.',
        cuttingNote: 'Potong segi enam beraturan diameter 18 cm dengan lubang kabel 10 mm.',
        foldingNote: 'Tekuk bibir bawah 1,2 cm ke dalam untuk penyangga soket.',
        assemblyNote: 'Mengunci pilar penyangga C02 dan rangka kap C03 dari bagian dasar.',
        connectedCodes: ['C02', 'C03'],
        svgRect: { x: 18, y: 18, w: 130, h: 76 },
      },
      {
        code: 'C02',
        name: 'Kolom Penyangga',
        qty: 1,
        dimensionsMm: [90, 220, 5],
        explodeVector: [0, 0, -0.75],
        meshPosition: [0, 0, -0.2],
        meshSize: [0.35, 1.0, 0.35],
        colorHex: '#C89F72',
        materialNote: 'Bentuk prisma segitiga dari lipatan kraft agar kaku menahan beban kap.',
        cuttingNote: 'Potong persegi panjang 22,0 × 9,0 cm dengan tiga garis lipat sejajar.',
        foldingNote: 'Lipat 60° di setiap garis biru membentuk prisma tertutup.',
        assemblyNote: 'Berdiri di atas C01 dan menopang cincin leher kap C03.',
        connectedCodes: ['C01', 'C03'],
        svgRect: { x: 158, y: 18, w: 144, h: 76 },
      },
      {
        code: 'C03',
        name: 'Kap Poligonal',
        qty: 1,
        dimensionsMm: [280, 160, 4],
        explodeVector: [0, 0.85, 0],
        meshPosition: [0, 0.45, 0.05],
        meshSize: [1.0, 0.55, 1.0],
        colorHex: '#DFBE95',
        materialNote: 'Kardus tipis berserat halus agar mudah dilipat presisi membentuk faset.',
        cuttingNote: 'Potong pola jaring-jaring heksagonal lengkap dengan celah ventilasi atas.',
        foldingNote: 'Skor selang-seling sudut 45° dan 30° sebelum dirangkai melingkar.',
        assemblyNote: 'Dipasang di ujung atas C02 melingkupi diffuser PET C04.',
        connectedCodes: ['C01', 'C02', 'C04'],
        svgRect: { x: 18, y: 104, w: 188, h: 78 },
      },
      {
        code: 'C04',
        name: 'Diffuser Cahaya PET',
        qty: 1,
        dimensionsMm: [140, 140, 1],
        explodeVector: [0, 0.35, 0.85],
        meshPosition: [0, 0.42, 0.05],
        meshSize: [0.55, 0.48, 0.55],
        colorHex: '#BAE6FD',
        materialNote: 'Silinder botol PET yang diampelas halus agar cahaya LED tersebar lembut.',
        cuttingNote: 'Potong bagian silinder tengah botol 14 cm secara merata.',
        foldingNote: 'Tidak perlu dilipat; pertahankan lengkung silinder alaminya.',
        assemblyNote: 'Diselipkan ke dalam rongga kap C03 memakai tab kait atas.',
        connectedCodes: ['C03'],
        svgRect: { x: 214, y: 104, w: 88, h: 78 },
      },
    ],
  },
};

export const mockProjects: ProjectSummary[] = [
  {
    id: 'P1',
    name: 'Rak Modular Mini',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300',
    materialLabel: 'Kardus Kraft 5mm',
    dimensionsCm: { panjang: 45, lebar: 30, tinggi: 25 },
    componentCount: 5,
    estimatedValueRangeIdr: [55000, 85000],
    offlineAvailable: true,
    inProduction: false,
    lastUpdatedLabel: '2 jam lalu',
  },
  {
    id: 'P2',
    name: 'Lampu Meja Geometris',
    thumbnail: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=300',
    materialLabel: 'Kardus + Botol PET',
    dimensionsCm: { panjang: 20, lebar: 20, tinggi: 30 },
    componentCount: 4,
    estimatedValueRangeIdr: [75000, 110000],
    offlineAvailable: true,
    inProduction: false,
    lastUpdatedLabel: '3 hari lalu',
  },
  {
    id: 'P3',
    name: 'Pot Hidroponik Vertikal',
    thumbnail: 'https://images.unsplash.com/photo-1517919272601-b04fb111ce4d?w=300',
    materialLabel: 'Botol Plastik PET',
    dimensionsCm: { panjang: 30, lebar: 30, tinggi: 20 },
    componentCount: 4,
    estimatedValueRangeIdr: [45000, 70000],
    offlineAvailable: false,
    inProduction: true,
    productionNote: 'Batch 5 unit • Tahap perakitan sumbu (Kolaborasi Bandung)',
    lastUpdatedLabel: 'Kemarin',
  },
];

export const mockMarketProducts: MarketProduct[] = [
  {
    id: 'PROD_001',
    name: 'Lampu Meja Geo Upcycle',
    priceIdr: 85000,
    images: [
      'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
    ],
    originMaterialBadge: 'Dari Kardus Kraft',
    description:
      'Lampu meja minimalis hasil rekayasa RE-CRAFT Studio menggunakan kardus kraft pilihan dengan lapisan pelindung tahan lembap dan diffuser PET daur ulang.',
    dimensionsText: '20,0 × 20,0 × 30,0 cm',
    weightGrams: 420,
    seller: {
      id: 'SELLER_1',
      name: 'Studio Kriya Jabar',
      location: 'Bandung Raya',
      rating: 4.8,
      verified: true,
    },
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 'PROD_002',
    name: 'Pot Hidroponik Mini',
    priceIdr: 65000,
    images: ['https://images.unsplash.com/photo-1517919272601-b04fb111ce4d?w=600'],
    originMaterialBadge: 'Dari Botol PET',
    description:
      'Pot tanaman sistem kapiler otomatis dari botol PET tebal yang dipotong presisi dengan finishing cat matte ramah lingkungan.',
    dimensionsText: '18,0 × 18,0 × 22,0 cm',
    weightGrams: 310,
    seller: {
      id: 'SELLER_2',
      name: 'Kreator RE-CRAFT',
      location: 'Jakarta Selatan',
      rating: 4.9,
      verified: true,
    },
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 'PROD_003',
    name: 'Rak Modular Meja Kerja',
    priceIdr: 125000,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
    originMaterialBadge: 'Dari Kardus Double-Wall',
    description:
      'Rak meja modular sistem selip kunci berkekuatan struktural tinggi, sanggup menopang buku, alat tulis, dan aksesori meja hingga 4,5 kg.',
    dimensionsText: '45,0 × 30,0 × 25,0 cm',
    weightGrams: 780,
    seller: {
      id: 'SELLER_1',
      name: 'Studio Kriya Jabar',
      location: 'Bandung Raya',
      rating: 4.8,
      verified: true,
    },
    rating: 4.7,
    reviews: 32,
  },
  {
    id: 'PROD_004',
    name: 'Desk Organizer Sekat',
    priceIdr: 48000,
    images: ['https://images.unsplash.com/photo-1584914179456-cd8e4a3c3bdf?w=600'],
    originMaterialBadge: 'Dari Kardus Kraft',
    description:
      'Kotak pengatur alat tulis ringkas dengan 4 kompartemen presisi dan permukaan lapis varnish water-based.',
    dimensionsText: '24,0 × 15,0 × 12,0 cm',
    weightGrams: 260,
    seller: {
      id: 'SELLER_3',
      name: 'Craft Studio Surabaya',
      location: 'Surabaya',
      rating: 4.6,
      verified: true,
    },
    rating: 4.6,
    reviews: 15,
  },
  {
    id: 'PROD_005',
    name: 'Tas Kanvas Perca Modular',
    priceIdr: 58000,
    images: ['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600'],
    originMaterialBadge: 'Dari Kain Perca',
    description:
      'Tas belanja lipat bertulang ganda dengan jahitan penguat silang dari limbah konveksi lokal.',
    dimensionsText: '38,0 × 12,0 × 40,0 cm',
    weightGrams: 210,
    seller: {
      id: 'SELLER_4',
      name: 'EcoMaker Bali',
      location: 'Denpasar',
      rating: 4.7,
      verified: true,
    },
    rating: 4.7,
    reviews: 28,
  },
  {
    id: 'PROD_006',
    name: 'Kotak Arsip Lipat Presisi',
    priceIdr: 95000,
    images: ['https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=600'],
    originMaterialBadge: 'Dari Kardus Industri',
    description:
      'Kotak penyimpanan dokumen A4 sistem penguncian slot-and-tab tanpa sekrup logam.',
    dimensionsText: '34,0 × 25,0 × 26,0 cm',
    weightGrams: 640,
    seller: {
      id: 'SELLER_2',
      name: 'Kreator RE-CRAFT',
      location: 'Jakarta Selatan',
      rating: 4.9,
      verified: true,
    },
    rating: 4.8,
    reviews: 41,
  },
];

export const mockMaterialListings: MaterialListing[] = [
  {
    id: 'MAT_001',
    title: 'Kardus Bekas Elektronik Tebal (20 Lembar)',
    materialType: 'Kardus Double-Wall 5mm',
    dimensionsText: '60,0 × 40,0 × 5,0 cm',
    quantityLabel: '20 lembar',
    location: 'Bandung Raya',
    providerName: 'Gudang Elektronik Cimahi',
    schemeLabel: 'Bagi Hasil 30% / Tukar Karya',
    image: 'https://images.unsplash.com/photo-1626512316698-3a1c09ce29a0?w=400',
  },
  {
    id: 'MAT_002',
    title: 'Botol PET Bening Bersih (50 pcs)',
    materialType: 'Plastik PET 1.5L',
    dimensionsText: '10,0 × 10,0 × 32,0 cm',
    quantityLabel: '50 botol',
    location: 'Jakarta Selatan',
    providerName: 'Bank Sampah Kemang',
    schemeLabel: 'Bagi Hasil 25%',
    image: 'https://images.unsplash.com/photo-1614707267537-b85faf00021e?w=400',
  },
];

export const mockCollabProposals: CollabProposal[] = [
  {
    id: 'COL_001',
    materialListingId: 'MAT_001',
    materialTitle: 'Kardus Bekas Elektronik Tebal (20 Lembar)',
    artisanName: 'Studio Kriya Jabar',
    linkedStudioId: 'P1',
    linkedStudioTitle: 'Rak Modular Mini',
    revenueSplitLabel: '70% Perajin : 30% Penyedia',
    status: 'DISETUJUI',
  },
  {
    id: 'COL_002',
    materialListingId: 'MAT_002',
    materialTitle: 'Botol PET Bening Bersih (50 pcs)',
    artisanName: 'Kreator RE-CRAFT',
    linkedStudioId: 'P2',
    linkedStudioTitle: 'Lampu Meja Geometris',
    revenueSplitLabel: '75% Perajin : 25% Penyedia',
    status: 'MENUNGGU',
  },
];

export const mockUserProfile: UserProfile = {
  id: 'USER_001',
  name: 'Raya Mahendra',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raya',
  location: 'Bandung Raya',
  verified: true,
  activeRole: 'PERAJIN',
  roles: ['PEMBELI', 'PENYEDIA', 'PERAJIN'],
  balanceIdr: 425000,
  impactStats: {
    scrapSavedKg: 14.8,
    projectsBuilt: 6,
    estimatedValueCreatedIdr: 540000,
  },
  revenueHistory: [
    {
      id: 'REV_001',
      title: 'Bagi Hasil Rak Modular Mini (3 unit)',
      dateLabel: '22 Nov 2026',
      amountIdr: 195000,
      type: 'BAGI_HASIL',
    },
    {
      id: 'REV_002',
      title: 'Penjualan Lampu Meja Geo Upcycle',
      dateLabel: '18 Nov 2026',
      amountIdr: 230000,
      type: 'PENJUALAN',
    },
  ],
};

export function getMockStudioPayload(projectId: string): Studio3DPayload {
  return mockStudioPayloads[projectId] ?? mockStudioPayloads[DEFAULT_STUDIO_PROJECT_ID];
}

export function getMockMarketProduct(productId: string): MarketProduct | undefined {
  return mockMarketProducts.find((item) => item.id === productId);
}
