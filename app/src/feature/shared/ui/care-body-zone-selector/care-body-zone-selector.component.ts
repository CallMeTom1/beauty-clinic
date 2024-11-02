import {Component, inject, Input, OnInit} from '@angular/core';
import {SecurityService} from "@feature-security";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Care} from "../../../security/data/model/care/care.business";
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf} from "@angular/common";
import {
  UpdateCareBodyZonesPayload
} from "../../../security/data/payload/care/update-care-body-zone.payload";

@Component({
  selector: 'app-care-body-zone-selector',
  standalone: true,
  imports: [
    TranslateModule,
    NgForOf
  ],
  templateUrl: './care-body-zone-selector.component.html',
  styleUrl: './care-body-zone-selector.component.scss'
})
export class BodyZoneSelectorComponent implements OnInit {
  @Input() careId!: string;
  protected securityService: SecurityService = inject(SecurityService);

  public selectedZones: string[] = [];
  public zoneFormGroup: FormGroup = new FormGroup({
    zones: new FormControl([], [Validators.required])
  });

  public isDropdownOpen = false;

  ngOnInit() {
    this.securityService.fetchBodyZones().subscribe();
    this.loadInitialZones();
  }

  loadInitialZones() {
    const cares: Care[] = this.securityService.cares$();
    const care = cares.find(c => c.care_id === this.careId);

    if (care && care.bodyZones) {
      this.selectedZones = care.bodyZones.map(zone => zone.body_zone_id);
      this.zoneFormGroup.get('zones')!.setValue(this.selectedZones);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onZoneChange(event: Event, zoneId: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedZones.push(zoneId);
    } else {
      this.selectedZones = this.selectedZones.filter(id => id !== zoneId);
    }
    this.zoneFormGroup.get('zones')!.setValue(this.selectedZones);
    this.updateZonesOnServer();
  }

  isZoneSelected(zoneId: string): boolean {
    return this.selectedZones.includes(zoneId);
  }

  updateZonesOnServer() {
    const payload: UpdateCareBodyZonesPayload = {
      care_id: this.careId,
      body_zone_ids: this.selectedZones
    };

    this.securityService.updateCareBodyZones(payload).subscribe({
      next: (response) => {
        if (response.result) {
          console.log('Zones du corps mises à jour avec succès:', response.data);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour des zones du corps:', err);
      }
    });
  }

  getZoneName(zoneId: string): string {
    const zone = this.securityService.bodyZones$().find(
      zone => zone.body_zone_id === zoneId
    );
    return zone ? zone.name : '';
  }

  removeZone(zoneId: string) {
    this.selectedZones = this.selectedZones.filter(id => id !== zoneId);
    this.zoneFormGroup.get('zones')!.setValue(this.selectedZones);
    this.updateZonesOnServer();
  }
}
