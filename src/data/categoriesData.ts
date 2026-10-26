import { CategorySummary } from '@/types';

export const mockCategoriesData: CategorySummary[] = [
  {
    name: 'Hogar y Cocina',
    totalProductsInTop30: 8,
    totalUnitsSold: 9870,
    estimatedRevenueARS: 216981000,
    topProduct: 'Termo Lumilagro / Acero Térmico 1.2L Engomado Pico Cebador',
    historicalInterval: 'Histórico 2025-2026 mensual consolidado Argentina',
    dataSource: 'Benchmark E-commerce Argentina / MLA público estimado',
    seasonality: [
      { month: 'Ene', salesIndex: 72 },
      { month: 'Feb', salesIndex: 68 },
      { month: 'Mar', salesIndex: 78 },
      { month: 'Abr', salesIndex: 82 },
      { month: 'May', salesIndex: 94 }, // Hot Sale
      { month: 'Jun', salesIndex: 89 }, // Día del Padre
      { month: 'Jul', salesIndex: 86 },
      { month: 'Ago', salesIndex: 80 },
      { month: 'Sep', salesIndex: 79 },
      { month: 'Oct', salesIndex: 91 }, // Día de la Madre
      { month: 'Nov', salesIndex: 98 }, // CyberMonday
      { month: 'Dic', salesIndex: 100 }, // Navidad
    ],
    priceDistribution: [
      { rangeLabel: '$ 0 - $ 15.000', salesVolume: 3250, percentage: 33 },
      { rangeLabel: '$ 15.001 - $ 30.000', salesVolume: 4620, percentage: 47 },
      { rangeLabel: '$ 30.001 - $ 50.000', salesVolume: 1540, percentage: 16 },
      { rangeLabel: 'Más de $ 50.000', salesVolume: 460, percentage: 4 },
    ],
  },
  {
    name: 'Tecnología y Gadgets',
    totalProductsInTop30: 7,
    totalUnitsSold: 9380,
    estimatedRevenueARS: 184950000,
    topProduct: 'Mini Impresora Térmica Portátil Bluetooth para Fotos y Stickers',
    historicalInterval: 'Histórico 2025-2026 mensual consolidado Argentina',
    dataSource: 'Benchmark E-commerce Argentina / MLA público estimado',
    seasonality: [
      { month: 'Ene', salesIndex: 65 },
      { month: 'Feb', salesIndex: 70 },
      { month: 'Mar', salesIndex: 84 }, // Vuelta a clases / Facultad
      { month: 'Abr', salesIndex: 75 },
      { month: 'May', salesIndex: 96 }, // Hot Sale
      { month: 'Jun', salesIndex: 88 },
      { month: 'Jul', salesIndex: 81 },
      { month: 'Ago', salesIndex: 85 }, // Día del Niño
      { month: 'Sep', salesIndex: 76 },
      { month: 'Oct', salesIndex: 89 },
      { month: 'Nov', salesIndex: 100 }, // CyberMonday pico tecnológico
      { month: 'Dic', salesIndex: 98 }, // Navidad
    ],
    priceDistribution: [
      { rangeLabel: '$ 0 - $ 15.000', salesVolume: 2340, percentage: 25 },
      { rangeLabel: '$ 15.001 - $ 25.000', salesVolume: 4460, percentage: 48 },
      { rangeLabel: '$ 25.001 - $ 40.000', salesVolume: 1980, percentage: 21 },
      { rangeLabel: 'Más de $ 40.000', salesVolume: 600, percentage: 6 },
    ],
  },
  {
    name: 'Belleza y Cuidado Personal',
    totalProductsInTop30: 5,
    totalUnitsSold: 6190,
    estimatedRevenueARS: 124822000,
    topProduct: 'Vaporizador Facial Nano Humidificador Ultrasónico Recargable',
    historicalInterval: 'Histórico 2025-2026 mensual consolidado Argentina',
    dataSource: 'Benchmark E-commerce Argentina / Redes Sociales AR',
    seasonality: [
      { month: 'Ene', salesIndex: 70 },
      { month: 'Feb', salesIndex: 74 },
      { month: 'Mar', salesIndex: 76 },
      { month: 'Abr', salesIndex: 79 },
      { month: 'May', salesIndex: 88 },
      { month: 'Jun', salesIndex: 78 },
      { month: 'Jul', salesIndex: 82 },
      { month: 'Ago', salesIndex: 80 },
      { month: 'Sep', salesIndex: 89 }, // Primavera
      { month: 'Oct', salesIndex: 99 }, // Día de la Madre
      { month: 'Nov', salesIndex: 94 },
      { month: 'Dic', salesIndex: 100 }, // Fiestas
    ],
    priceDistribution: [
      { rangeLabel: '$ 0 - $ 12.000', salesVolume: 1890, percentage: 31 },
      { rangeLabel: '$ 12.001 - $ 25.000', salesVolume: 2890, percentage: 47 },
      { rangeLabel: '$ 25.001 - $ 40.000', salesVolume: 1410, percentage: 22 },
    ],
  },
  {
    name: 'Organización y Hogar',
    totalProductsInTop30: 4,
    totalUnitsSold: 4680,
    estimatedRevenueARS: 86110000,
    topProduct: 'Organizador Giratorio 360° Acrílico Transparente para Cosméticos',
    historicalInterval: 'Histórico 2025-2026 mensual consolidado Argentina',
    dataSource: 'Benchmark E-commerce Argentina',
    seasonality: [
      { month: 'Ene', salesIndex: 68 },
      { month: 'Feb', salesIndex: 72 },
      { month: 'Mar', salesIndex: 90 }, // Organización de año lectivo
      { month: 'Abr', salesIndex: 80 },
      { month: 'May', salesIndex: 85 },
      { month: 'Jun', salesIndex: 79 },
      { month: 'Jul', salesIndex: 77 },
      { month: 'Ago', salesIndex: 82 },
      { month: 'Sep', salesIndex: 88 },
      { month: 'Oct', salesIndex: 91 },
      { month: 'Nov', salesIndex: 93 },
      { month: 'Dic', salesIndex: 97 },
    ],
    priceDistribution: [
      { rangeLabel: '$ 0 - $ 15.000', salesVolume: 1710, percentage: 36 },
      { rangeLabel: '$ 15.001 - $ 25.000', salesVolume: 2970, percentage: 64 },
    ],
  },
  {
    name: 'Deportes y Aire Libre',
    totalProductsInTop30: 4,
    totalUnitsSold: 3860,
    estimatedRevenueARS: 76358000,
    topProduct: 'Botella Térmica Deportiva Motivacional 2 Litros con Marcador',
    historicalInterval: 'Histórico 2025-2026 mensual consolidado Argentina',
    dataSource: 'Benchmark E-commerce Argentina',
    seasonality: [
      { month: 'Ene', salesIndex: 98 }, // Verano a pleno
      { month: 'Feb', salesIndex: 92 },
      { month: 'Mar', salesIndex: 84 },
      { month: 'Abr', salesIndex: 74 },
      { month: 'May', salesIndex: 70 },
      { month: 'Jun', salesIndex: 65 },
      { month: 'Jul', salesIndex: 68 },
      { month: 'Ago', salesIndex: 72 },
      { month: 'Sep', salesIndex: 88 }, // Primavera / aire libre
      { month: 'Oct', salesIndex: 94 },
      { month: 'Nov', salesIndex: 96 },
      { month: 'Dic', salesIndex: 100 },
    ],
    priceDistribution: [
      { rangeLabel: '$ 0 - $ 15.000', salesVolume: 2260, percentage: 58 },
      { rangeLabel: '$ 15.001 - $ 35.000', salesVolume: 1600, percentage: 42 },
    ],
  },
  {
    name: 'Moda y Accesorios',
    totalProductsInTop30: 1,
    totalUnitsSold: 860,
    estimatedRevenueARS: 16770000,
    topProduct: 'Gafas de Sol Polarizadas Estilo Aviador UV400',
    historicalInterval: 'Histórico 2025-2026 mensual consolidado Argentina',
    dataSource: 'Benchmark E-commerce Argentina',
    seasonality: [
      { month: 'Ene', salesIndex: 100 },
      { month: 'Feb', salesIndex: 95 },
      { month: 'Mar', salesIndex: 70 },
      { month: 'Abr', salesIndex: 55 },
      { month: 'May', salesIndex: 48 },
      { month: 'Jun', salesIndex: 42 },
      { month: 'Jul', salesIndex: 45 },
      { month: 'Ago', salesIndex: 50 },
      { month: 'Sep', salesIndex: 75 },
      { month: 'Oct', salesIndex: 86 },
      { month: 'Nov', salesIndex: 92 },
      { month: 'Dic', salesIndex: 98 },
    ],
    priceDistribution: [
      { rangeLabel: '$ 15.001 - $ 25.000', salesVolume: 860, percentage: 100 },
    ],
  },
  {
    name: 'Salud y Bienestar',
    totalProductsInTop30: 1,
    totalUnitsSold: 980,
    estimatedRevenueARS: 34202000,
    topProduct: 'Masajeador Cervical Eléctrico de Cuello y Espalda Shiatsu',
    historicalInterval: 'Histórico 2025-2026 mensual consolidado Argentina',
    dataSource: 'Benchmark E-commerce Argentina',
    seasonality: [
      { month: 'Ene', salesIndex: 65 },
      { month: 'Feb', salesIndex: 68 },
      { month: 'Mar', salesIndex: 74 },
      { month: 'Abr', salesIndex: 79 },
      { month: 'May', salesIndex: 85 },
      { month: 'Jun', salesIndex: 90 }, // Día del Padre
      { month: 'Jul', salesIndex: 88 },
      { month: 'Ago', salesIndex: 82 },
      { month: 'Sep', salesIndex: 80 },
      { month: 'Oct', salesIndex: 96 }, // Día de la Madre
      { month: 'Nov', salesIndex: 91 },
      { month: 'Dic', salesIndex: 95 },
    ],
    priceDistribution: [
      { rangeLabel: '$ 30.001 - $ 45.000', salesVolume: 980, percentage: 100 },
    ],
  },
];
