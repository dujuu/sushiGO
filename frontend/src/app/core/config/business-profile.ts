export interface WeeklyScheduleSlot {
  day: number;
  label: string;
  openMinutes: number;
  closeMinutes: number;
}

export interface BusinessProfile {
  name: string;
  address: string;
  city: string;
  instagramHandle: string;
  instagramUrl: string;
  whatsappDisplay: string;
  whatsappApiNumber: string;
  menuUrl: string;
}

export const SUSHI_GO_BUSINESS_PROFILE: BusinessProfile = {
  name: 'Sushi Go',
  address: 'Los Piñones #2220, Arica',
  city: 'Arica',
  instagramHandle: '@sushigoarica',
  instagramUrl: 'https://www.instagram.com/sushigoarica',
  whatsappDisplay: '+569 8782 0089',
  whatsappApiNumber: '56987820089',
  menuUrl: 'https://drive.google.com/file/d/1D6S-8Hv6NqG419yhmrJV8pHTrcsREfHP/view',
};

export const SUSHI_GO_WEEKLY_SCHEDULE: WeeklyScheduleSlot[] = [
  { day: 1, label: 'Lunes', openMinutes: 16 * 60, closeMinutes: 23 * 60 + 30 },
  { day: 2, label: 'Martes', openMinutes: 16 * 60, closeMinutes: 23 * 60 + 30 },
  { day: 3, label: 'Miércoles', openMinutes: 16 * 60, closeMinutes: 23 * 60 + 30 },
  { day: 4, label: 'Jueves', openMinutes: 16 * 60, closeMinutes: 23 * 60 + 30 },
  { day: 5, label: 'Viernes', openMinutes: 17 * 60, closeMinutes: 30 },
  { day: 6, label: 'Sábado', openMinutes: 17 * 60, closeMinutes: 30 },
];

export const SUSHI_GO_OPENING_HOURS_TEXT =
  'Lunes a Jueves: 16:00 a 23:30 hrs · Viernes y Sábado: 17:00 a 00:30 hrs';
