export type PeriodType = 'semanal' | 'mensual';

export type ProductPresentation = 'individual' | 'combo' | 'set';

export interface StoreListing {
  storeName: 'Mercado Libre Argentina' | 'Amazon Argentina' | 'AliExpress' | 'Comercio Local AR';
  storeLogo?: string;
  price: number;
  currency: 'ARS' | 'USD';
  originalCurrency?: 'USD';
  convertedPriceARS?: number;
  url: string;
  consultationDate: string;
  isExactMatch: boolean;
  notes?: string;
  availability: 'En stock' | 'Poco stock' | 'Importación directa';
}

export interface Product {
  id: string;
  rank: number; // Original rank (1-30)
  rankingCriteria: string;
  name: string;
  category: string;
  referencePriceARS: number;
  presentation: ProductPresentation;
  weightGrams: number;
  colorsVariants: string[];
  unitsSold: number;
  estimatedRevenueARS: number;
  trendPercentage: number; // vs comparable previous period
  viralityScore?: number; // 0-100 or undefined if no valid rule
  viralityRuleExplanation?: string;
  relatedEvent?: string;
  imageUrl: string;
  source: string;
  lastUpdated: string;
  isConfirmedData: boolean; // confirmed vs estimated
  isDemoData?: boolean;
  storeComparisons: StoreListing[];
}

export interface CategorySeasonality {
  month: string; // Ene, Feb, Mar, etc.
  salesIndex: number; // Index 0-100
}

export interface PriceRangeDistribution {
  rangeLabel: string;
  salesVolume: number;
  percentage: number;
}

export interface CategorySummary {
  name: string;
  totalProductsInTop30: number;
  totalUnitsSold: number;
  estimatedRevenueARS: number;
  topProduct: string;
  seasonality: CategorySeasonality[];
  priceDistribution: PriceRangeDistribution[];
  historicalInterval: string;
  dataSource: string;
}

export interface CommercialEvent {
  id: string;
  name: string;
  dateStr: string; // ISO date string or formatted
  targetDate: string; // ISO format for countdown
  description: string;
  importance: 'Alta' | 'Media' | 'Crítica';
  recommendedProductIds: string[];
  historicalSalesImpact: string;
}

export interface DolarRate {
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface InflationData {
  fecha: string;
  valorMensual: number; // % mensual
  valorInteranual?: number;
  tipoVariacion: string;
  fuente: string;
}

export interface MeliSalesEstimation {
  estimatedDailyUnits: number;
  estimatedDailyARS: number;
  methodology: string;
  lastUpdated: string;
  source: string;
  isDirectObservation: boolean;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  status: 'EXITOSO' | 'PARCIAL' | 'FALLO';
  schedule: string; // e.g. "Lunes 05:00 ART"
  periodUpdated: string;
  recordsProcessed: number;
  retryCount: number;
  durationMs: number;
  errors: string[];
  isStale: boolean;
}

export interface MonthlyArchiveRecord {
  monthId: string; // "2026-09"
  monthName: string; // "Septiembre 2026"
  closedDate: string;
  archivedAt: string;
  status: 'CERRADO_COMPLETO' | 'EN_CURSO';
  productsCount: number;
  topProducts: Product[];
  topCategories: { name: string; unitsSold: number; revenueARS: number }[];
  dataSource: string;
  methodologyNote: string;
}
