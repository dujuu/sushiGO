export interface BusinessSettings {
  whatsappNumber: string;
  transferAlias: string;
  transferBank: string;
  transferOwner: string;
  transferRut: string;
  openingHours: string;
  deliveryFee: number;
  deliveryZones: string;
}

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  whatsappNumber: '56900000000',
  transferAlias: 'sushigo.transferencia',
  transferBank: 'Banco de Chile',
  transferOwner: 'SushiGo SpA',
  transferRut: '76.123.456-7',
  openingHours: 'Lunes a domingo · 12:30 a 23:00',
  deliveryFee: 1500,
  deliveryZones: 'Arica centro, Chinchorro, Tucapel, Azolas',
};
