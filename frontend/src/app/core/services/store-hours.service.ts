import { Injectable } from '@angular/core';
import { SUSHI_GO_WEEKLY_SCHEDULE, WeeklyScheduleSlot } from '../config/business-profile';

export interface StoreStatus {
  isOpen: boolean;
  statusLabel: string;
  statusDetail: string;
  todayHours: string;
}

@Injectable({ providedIn: 'root' })
export class StoreHoursService {
  private readonly schedule = SUSHI_GO_WEEKLY_SCHEDULE;

  getCurrentStatus(now: Date = new Date()): StoreStatus {
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const todaySlot = this.findByDay(day);
    const previousDay = (day + 6) % 7;
    const previousSlot = this.findByDay(previousDay);
    const openFromPrevious = previousSlot && this.isOvernight(previousSlot) && minutes < previousSlot.closeMinutes;

    if (todaySlot && this.isOpenInSlot(todaySlot, minutes)) {
      return {
        isOpen: true,
        statusLabel: 'Abierto ahora',
        statusDetail: `Cierra a las ${this.formatMinutes(todaySlot.closeMinutes)} hrs`,
        todayHours: `${todaySlot.label}: ${this.formatMinutes(todaySlot.openMinutes)} a ${this.formatMinutes(todaySlot.closeMinutes)} hrs`,
      };
    }

    if (openFromPrevious) {
      return {
        isOpen: true,
        statusLabel: 'Abierto ahora',
        statusDetail: `Cierra a las ${this.formatMinutes(previousSlot.closeMinutes)} hrs`,
        todayHours: todaySlot
          ? `${todaySlot.label}: ${this.formatMinutes(todaySlot.openMinutes)} a ${this.formatMinutes(todaySlot.closeMinutes)} hrs`
          : 'Domingo: cerrado',
      };
    }

    const nextOpening = this.findNextOpening(day, minutes);

    return {
      isOpen: false,
      statusLabel: 'Cerrado ahora',
      statusDetail: nextOpening,
      todayHours: todaySlot
        ? `${todaySlot.label}: ${this.formatMinutes(todaySlot.openMinutes)} a ${this.formatMinutes(todaySlot.closeMinutes)} hrs`
        : 'Domingo: cerrado',
    };
  }

  private findByDay(day: number): WeeklyScheduleSlot | undefined {
    return this.schedule.find((slot) => slot.day === day);
  }

  private isOvernight(slot: WeeklyScheduleSlot): boolean {
    return slot.closeMinutes <= slot.openMinutes;
  }

  private isOpenInSlot(slot: WeeklyScheduleSlot, minutes: number): boolean {
    if (!this.isOvernight(slot)) {
      return minutes >= slot.openMinutes && minutes < slot.closeMinutes;
    }

    return minutes >= slot.openMinutes || minutes < slot.closeMinutes;
  }

  private findNextOpening(currentDay: number, minutes: number): string {
    for (let offset = 0; offset <= 7; offset += 1) {
      const day = (currentDay + offset) % 7;
      const slot = this.findByDay(day);

      if (!slot) {
        continue;
      }

      if (offset === 0 && minutes < slot.openMinutes) {
        return `Abre hoy a las ${this.formatMinutes(slot.openMinutes)} hrs`;
      }

      if (offset > 0) {
        return `Vuelve ${offset === 1 ? 'mañana' : slot.label.toLowerCase()} a las ${this.formatMinutes(slot.openMinutes)} hrs`;
      }
    }

    return 'Horario no disponible';
  }

  private formatMinutes(value: number): string {
    const normalized = value % (24 * 60);
    const hours = Math.floor(normalized / 60)
      .toString()
      .padStart(2, '0');
    const mins = (normalized % 60).toString().padStart(2, '0');

    return `${hours}:${mins}`;
  }
}
