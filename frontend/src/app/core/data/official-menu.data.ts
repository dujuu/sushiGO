import { Product } from '../../shared/models/catalog.model';

export interface MenuCategory {
  id: string;
  label: string;
}

export interface CategoryHighlight {
  id: string;
  label: string;
  imageUrl: string;
}

export const OFFICIAL_MENU_CATEGORIES: MenuCategory[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'tradicionales', label: 'Rolls tradicionales' },
  { id: 'especiales', label: 'Especiales' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'gohan', label: 'Gohan' },
  { id: 'acompañamientos', label: 'Acompañamientos' },
  { id: 'extras', label: 'Extras' },
  { id: 'combos', label: 'Combos' },
];

export const OFFICIAL_MENU_HIGHLIGHTS: CategoryHighlight[] = [
  {
    id: 'tradicionales',
    label: 'Rolls tradicionales',
    imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
  },
  {
    id: 'especiales',
    label: 'Especiales',
    imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=900&q=80&fit=crop',
  },
  {
    id: 'gohan',
    label: 'Gohan',
    imageUrl: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=900&q=80&fit=crop',
  },
  {
    id: 'combos',
    label: 'Combos',
    imageUrl: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=900&q=80&fit=crop',
  },
];

export const OFFICIAL_MENU_PRODUCTS: Product[] = [
  {
    id: 12001,
    name: 'Roll Tradicional Pollo',
    description: 'Relleno de pollo, pepino y queso crema. Envoltura a elección (nori, tempura o crispy).',
    ingredients: ['pollo', 'pepino', 'queso crema'],
    price: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&q=80&fit=crop',
    category: 'tradicionales',
    badge: 'popular',
  },
  {
    id: 12002,
    name: 'Roll Tradicional Camarón',
    description: 'Camarón, kanikama y palmito. Opciones de terminación con sésamo o merkén.',
    ingredients: ['camarón', 'kanikama', 'palmito'],
    price: 5500,
    imageUrl: 'https://images.unsplash.com/photo-1562158070-622a7bfe9f6f?w=900&q=80&fit=crop',
    category: 'tradicionales',
    badge: 'popular',
  },
  {
    id: 12003,
    name: 'Roll Tradicional Choclillo',
    description: 'Choclillo, champiñón y queso crema con cobertura de palta.',
    ingredients: ['choclillo', 'champiñón', 'queso crema'],
    price: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&q=80&fit=crop',
    category: 'tradicionales',
    badge: 'new',
  },
  {
    id: 12004,
    name: 'Lomo Saltado Roll',
    description: 'Uno de los especiales de la casa con lomo salteado y notas ahumadas.',
    ingredients: ['lomo', 'cebollín', 'queso crema'],
    price: 6490,
    imageUrl: 'https://images.unsplash.com/photo-1601315488950-3b5047998b38?w=900&q=80&fit=crop',
    category: 'especiales',
    badge: 'promo',
  },
  {
    id: 12005,
    name: 'Pulpo al Olivo Roll',
    description: 'Roll especial con pulpo al olivo y acabado de sésamo tostado.',
    ingredients: ['pulpo', 'olivo', 'queso crema'],
    price: 6490,
    imageUrl: 'https://images.unsplash.com/photo-1625944525533-473f1d3d54e7?w=900&q=80&fit=crop',
    category: 'especiales',
    badge: 'promo',
  },
  {
    id: 12006,
    name: 'Acevichado Roll',
    description: 'Especial acevichado con salsa cremosa y toque cítrico.',
    ingredients: ['camarón', 'kanikama', 'salsa acevichada'],
    price: 6490,
    imageUrl: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=900&q=80&fit=crop',
    category: 'especiales',
    badge: 'promo',
  },
  {
    id: 12007,
    name: 'Huancaína Roll',
    description: 'Especial de la carta con salsa huancaína y terminación en tempura.',
    ingredients: ['pollo', 'palta', 'salsa huancaína'],
    price: 6490,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=900&q=80&fit=crop',
    category: 'especiales',
    badge: 'promo',
  },
  {
    id: 12008,
    name: 'Roll Fitness',
    description: 'Preparación más liviana con proteínas magras y vegetales frescos.',
    ingredients: ['pollo', 'pepino', 'palta'],
    price: 6490,
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&q=80&fit=crop',
    category: 'fitness',
    badge: 'new',
  },
  {
    id: 12009,
    name: 'Gohan de Camarón',
    description: 'Bowl gohan de camarón con mix de vegetales y salsa de la casa.',
    ingredients: ['camarón', 'arroz gohan', 'kanikama'],
    price: 6490,
    imageUrl: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=900&q=80&fit=crop',
    category: 'gohan',
    badge: 'popular',
  },
  {
    id: 12010,
    name: '6 Balls Furay',
    description: 'Acompañamiento crocante ideal para compartir.',
    ingredients: ['mix furay'],
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1633478062482-7903b5c9b862?w=900&q=80&fit=crop',
    category: 'acompañamientos',
  },
  {
    id: 12011,
    name: '6 Bastón de Camarón',
    description: 'Bastones de camarón en panko, recién fritos.',
    ingredients: ['camarón', 'panko'],
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-4316f90f9e9a?w=900&q=80&fit=crop',
    category: 'acompañamientos',
  },
  {
    id: 12012,
    name: 'Salsa extra (unidad)',
    description: 'Salsas adicionales para personalizar tus rolls.',
    ingredients: ['salsa a elección'],
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?w=900&q=80&fit=crop',
    category: 'extras',
  },
  {
    id: 12013,
    name: 'Combo Tradicional 30 piezas',
    description: 'Selección tradicional para compartir. Rango de carta oficial hasta $27.000.',
    ingredients: ['rolls variados'],
    originalPrice: 29000,
    price: 27000,
    imageUrl: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=900&q=80&fit=crop',
    category: 'combos',
    isPromo: true,
    badge: 'promo',
  },
];
