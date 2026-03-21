import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../core/services/notification.service';
import { BusinessSettingsService } from '../../../core/services/business-settings.service';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent],
  template: `
    <app-page-header
      title="Configuración del negocio"
      subtitle="Define WhatsApp, transferencia, horario y despacho para el flujo real."
    />

    <form class="card form" [formGroup]="form" (ngSubmit)="save()">
      <h3 class="display-font">Canal principal</h3>
      <label>WhatsApp del local (formato internacional, sin +)</label>
      <input type="text" formControlName="whatsappNumber" placeholder="56912345678" />

      <h3 class="display-font">Transferencia</h3>
      <label>Alias o cuenta</label>
      <input type="text" formControlName="transferAlias" />

      <label>Banco</label>
      <input type="text" formControlName="transferBank" />

      <label>Titular</label>
      <input type="text" formControlName="transferOwner" />

      <label>RUT</label>
      <input type="text" formControlName="transferRut" />

      <h3 class="display-font">Atención y despacho</h3>
      <label>Horario</label>
      <input type="text" formControlName="openingHours" />

      <label>Costo de delivery (CLP)</label>
      <input type="number" min="0" formControlName="deliveryFee" />

      <label>Zonas de reparto</label>
      <textarea rows="3" formControlName="deliveryZones"></textarea>

      <div class="actions">
        <button class="btn-primary" type="submit" [disabled]="form.invalid">Guardar configuración</button>
      </div>
    </form>
  `,
  styles: [
    `
      .form {
        display: grid;
        gap: 0.55rem;
        max-width: 760px;
      }

      h3 {
        font-size: 1rem;
        margin: 0.4rem 0 0.1rem;
      }

      label {
        color: #d8d0c9;
        font-size: 0.78rem;
        font-weight: 700;
      }

      input,
      textarea {
        background: var(--surface-2);
        border: 1px solid var(--border-2);
        border-radius: 10px;
        color: var(--white);
        padding: 0.6rem 0.7rem;
      }

      .actions {
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class AdminSettingsPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly settingsService = inject(BusinessSettingsService);
  private readonly notificationService = inject(NotificationService);

  readonly form = this.formBuilder.nonNullable.group({
    whatsappNumber: [
      this.settingsService.settings().whatsappNumber,
      [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)],
    ],
    transferAlias: [this.settingsService.settings().transferAlias, [Validators.required, Validators.maxLength(120)]],
    transferBank: [this.settingsService.settings().transferBank, [Validators.required, Validators.maxLength(120)]],
    transferOwner: [this.settingsService.settings().transferOwner, [Validators.required, Validators.maxLength(120)]],
    transferRut: [this.settingsService.settings().transferRut, [Validators.required, Validators.maxLength(20)]],
    openingHours: [this.settingsService.settings().openingHours, [Validators.required, Validators.maxLength(140)]],
    deliveryFee: [this.settingsService.settings().deliveryFee, [Validators.required, Validators.min(0)]],
    deliveryZones: [this.settingsService.settings().deliveryZones, [Validators.required, Validators.maxLength(240)]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.settingsService.save(this.form.getRawValue());
    this.notificationService.success('Configuración del negocio guardada.');
  }
}
