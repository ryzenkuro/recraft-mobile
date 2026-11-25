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
export const SCAN_CAMERA_BG_URL =
  'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80&w=800&h=1600';

export const mockAnalysisSteps: readonly string[] = [
  'Mengenali bahan...',
  'Menyusun draf struktur...',
  'Menyiapkan daftar alat...',
];

export const mockScanResults: ScanResult[] = [
  {
    id: 'SCAN_001',
    materialType: 'Kardus Bekas',
    dimensions: { panjang: 45, lebar: 30, tinggi: 25 },
    confidence: 0.98,
    photoUrl: 'https://images.unsplash.com/photo-1626512316698-3a1c09ce29a0?w=600',
    timestampIso: '2026-11-25T07:00:00.000Z',
    detectedMaterials: ['Kardus Kraft 5mm', 'Serat Daur Ulang'],
  },
  {
    id: 'SCAN_002',
    materialType: 'Botol Plastik PET',
    dimensions: { panjang: 20, lebar: 10, tinggi: 32 },
    confidence: 0.92,
    photoUrl: 'https://images.unsplash.com/photo-1614707267537-b85faf00021e?w=600',
    timestampIso: '2026-11-25T06:30:00.000Z',
    detectedMaterials: ['Plastik PET Bening', 'Tutup HDPE'],
  },
];

export const mockTools: ToolOption[] = [
  { id: 'T1', name: 'Cutter', available: true, iconName: 'pen-tool' },
  { id: 'T2', name: 'Penggaris Besi', available: true, iconName: 'ruler' },
  { id: 'T3', name: 'Lem Tembak', available: false, iconName: 'droplets' },
  { id: 'T4', name: 'Gunting', available: true, iconName: 'scissors' },
  { id: 'T5', name: 'Tali / Benang', available: false, iconName: 'git-commit' },
  { id: 'T6', name: 'Selotip Kertas', available: true, iconName: 'paperclip' },
];

export const mockCraftTargets: CraftTargetOption[] = [
  {
    id: 'TARGET_01',
    studioProjectId: 'P1',
    name: 'Rak Modular Mini',
    subtitle: 'Sambungan selip kunci presisi',
    durationLabel: '2-3 jam',
    primaryMaterial: 'Kardus Kraft',
    estimatedValueRangeIdr: [55000, 85000],
    componentCount: 5,
    thumbnail:
      'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'TARGET_02',
    studioProjectId: 'P2',
    name: 'Lampu Gantung',
    subtitle: 'Kap lipat poligonal hemat cahaya',
    durationLabel: '3-4 jam',
    primaryMaterial: 'Kardus & PET',
    estimatedValueRangeIdr: [75000, 110000],
    componentCount: 4,
    thumbnail:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'TARGET_03',
    studioProjectId: 'P3',
    name: 'Pot Hidroponik',
    subtitle: 'Sistem sumbu kapiler hemat air',
    durationLabel: '1-2 jam',
    primaryMaterial: 'Botol Plastik',
    estimatedValueRangeIdr: [45000, 70000],
    componentCount: 4,
    thumbnail:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=400',
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
    title: 'Lampu Gantung',
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
        materialNote: 'Alas berlapis ganda dengan pemberat pasif agar stabil.',
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
    thumbnail:
      'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=300',
    iconHint: 'box',
    materialLabel: 'Kardus Kraft 5mm',
    dimensionsCm: { panjang: 45, lebar: 30, tinggi: 25 },
    componentCount: 5,
    estimatedValueRangeIdr: [55000, 85000],
    offlineAvailable: true,
    inProduction: false,
    lastUpdatedLabel: 'Diperbarui 2 jam lalu',
  },
  {
    id: 'P2',
    name: 'Lampu Gantung',
    thumbnail:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=300',
    iconHint: 'lamp',
    materialLabel: 'Kardus + Botol PET',
    dimensionsCm: { panjang: 15, lebar: 15, tinggi: 20 },
    componentCount: 4,
    estimatedValueRangeIdr: [75000, 110000],
    offlineAvailable: true,
    inProduction: false,
    lastUpdatedLabel: 'Diperbarui kemarin',
  },
  {
    id: 'P3',
    name: 'Kotak Penyimpanan',
    thumbnail:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=300',
    iconHint: 'archive',
    materialLabel: 'Kardus & Palet',
    dimensionsCm: { panjang: 30, lebar: 20, tinggi: 15 },
    componentCount: 4,
    estimatedValueRangeIdr: [45000, 70000],
    offlineAvailable: false,
    inProduction: true,
    productionNote: 'Kolaborasi Bandung • Siap dirakit',
    lastUpdatedLabel: 'Baru saja dibuat',
  },
];

export const mockMarketProducts: MarketProduct[] = [
  {
    id: 'PROD_001',
    name: 'Lampu Meja Geo dari Kardus',
    priceIdr: 85000,
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    ],
    originMaterialBadge: 'Kardus',
    description:
      'Lampu meja geometris ini dirancang dengan prinsip upcycling dari limbah kardus tebal berkualitas. Cocok untuk menambah aksen hangat di meja kerja atau kamar tidur Anda.',
    sustainabilityNote:
      'Produk ini menyelamatkan 500gr kardus dari TPA dan mengurangi jejak karbon produksi baru.',
    careInstructions: [
      'Gunakan bohlam LED max 5W (panas rendah)',
      'Bersihkan dengan kemoceng kering',
      'Jauhkan dari area lembab/air',
    ],
    dimensionsText: '20,0 × 20,0 × 30,0 cm',
    weightGrams: 420,
    soldCountLabel: 'Terjual 150+',
    seller: {
      id: 'SELLER_1',
      name: 'Studio Kriya Jabar',
      avatarUrl:
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
      location: 'Bandung Raya',
      rating: 4.8,
      verified: true,
    },
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 'PROD_002',
    name: 'Desk Organizer',
    priceIdr: 120000,
    images: [
      'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=400',
    ],
    originMaterialBadge: 'Kardus & Botol',
    description:
      'Pengatur meja kerja berlaci modular dari kombinasi kardus gelombang ganda dan kompartemen botol PET daur ulang.',
    sustainabilityNote:
      'Mengolah 3 botol plastik PET dan 400gr kardus kemasan menjadi furnitur meja.',
    careInstructions: [
      'Lap perlahan dengan kain mikrofiber kering',
      'Hindari beban berlebih di atas 4 kg',
    ],
    dimensionsText: '30,0 × 20,0 × 18,0 cm',
    weightGrams: 540,
    soldCountLabel: 'Terjual 85+',
    seller: {
      id: 'SELLER_2',
      name: 'Kreator RE-CRAFT',
      avatarUrl:
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
      location: 'Jakarta Selatan',
      rating: 4.9,
      verified: true,
    },
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 'PROD_003',
    name: 'Pot Self-Watering',
    priceIdr: 45000,
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=400',
    ],
    originMaterialBadge: 'Botol Plastik',
    description:
      'Pot tanaman hias sistem kapiler otomatis berbahan botol PET bekas yang dipotong presisi dengan finishing matte.',
    sustainabilityNote:
      'Mendaur ulang 2 botol plastik sekali pakai per unit pot.',
    careInstructions: [
      'Isi ulang reservoir air tiap 5–7 hari',
      'Bilas sumbu kain setiap pergantian media tanam',
    ],
    dimensionsText: '14,0 × 14,0 × 18,0 cm',
    weightGrams: 240,
    soldCountLabel: 'Terjual 210+',
    seller: {
      id: 'SELLER_3',
      name: 'Craft Studio Surabaya',
      avatarUrl:
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
      location: 'Surabaya',
      rating: 4.7,
      verified: true,
    },
    rating: 4.7,
    reviews: 32,
  },
  {
    id: 'PROD_004',
    name: 'Rak Gantung Hexa',
    priceIdr: 150000,
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=400',
    ],
    originMaterialBadge: 'Kayu Palet',
    description:
      'Rak dinding heksagonal dari kayu palet bekas yang diamplas halus dan dilapisi pelindung water-based.',
    sustainabilityNote:
      'Memanfaatkan limbah kayu palet logistik lokal dengan sambungan presisi.',
    careInstructions: [
      'Pasang menggunakan fischer dinding standar',
      'Hindari paparan hujan langsung',
    ],
    dimensionsText: '36,0 × 12,0 × 32,0 cm',
    weightGrams: 920,
    soldCountLabel: 'Terjual 60+',
    seller: {
      id: 'SELLER_4',
      name: 'Kriya Jogja',
      avatarUrl:
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
      location: 'Yogyakarta',
      rating: 4.8,
      verified: true,
    },
    rating: 4.8,
    reviews: 15,
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
    linkedStudioTitle: 'Lampu Gantung',
    revenueSplitLabel: '75% Perajin : 25% Penyedia',
    status: 'MENUNGGU',
  },
];

export const mockUserProfile: UserProfile = {
  id: 'USER_001',
  name: 'Kreator RE-CRAFT',
  initials: 'KR',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kreator',
  location: 'Jakarta Selatan',
  verified: true,
  activeRole: 'PERAJIN',
  roles: ['PEMBELI', 'PENYEDIA', 'PERAJIN'],
  balanceIdr: 450000,
  impactStats: {
    projectsCompleted: 3,
    itemsManaged: 12,
    co2SavedKg: 2.4,
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
      title: 'Penjualan Lampu Meja Geo',
      dateLabel: '18 Nov 2026',
      amountIdr: 255000,
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
