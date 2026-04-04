import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../core/services/notification.service';
import { BusinessSettingsService } from '../../../core/services/business-settings.service';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './admin-settings-page.component.html',
  styleUrls: ['./admin-settings-page.component.css'],
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
