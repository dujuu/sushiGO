import {
  SUSHI_GO_BUSINESS_PROFILE,
  SUSHI_GO_OPENING_HOURS_TEXT,
} from '../config/business-profile';

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
  whatsappNumber: SUSHI_GO_BUSINESS_PROFILE.whatsappApiNumber,
  transferAlias: 'sushigo.transferencia',
  transferBank: 'Banco de Chile',
  transferOwner: 'SushiGo SpA',
  transferRut: '76.123.456-7',
  openingHours: SUSHI_GO_OPENING_HOURS_TEXT,
  deliveryFee: 1500,
  deliveryZones: 'Arica centro, Chinchorro, Tucapel, Azolas',
};
