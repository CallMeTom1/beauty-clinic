import {Component, inject, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {SecurityService} from "@feature-security";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Care} from "../../../security/data/model/care/care.business";
import {UpdateCareMachinesPayload} from "../../../security/data/payload/care/update-care-machine.payload";

@Component({
  selector: 'app-care-machine-selector',
  standalone: true,
  imports: [
    NgForOf,
    TranslateModule
  ],
  templateUrl: './care-machine-selector.component.html',
  styleUrl: './care-machine-selector.component.scss'
})
export class CareMachineSelectorComponent {
  @Input() careId!: string;
  protected securityService: SecurityService = inject(SecurityService);

  public selectedMachines: string[] = [];
  public machineFormGroup: FormGroup = new FormGroup({
    machines: new FormControl([], [Validators.required])
  });

  public isDropdownOpen = false;

  ngOnInit() {
    this.securityService.fetchCareMachine().subscribe();
    this.loadInitialMachines();
  }

  loadInitialMachines() {
    const cares: Care[] = this.securityService.cares$();
    const care = cares.find(c => c.care_id === this.careId);

    if (care && care.machines) {
      this.selectedMachines = care.machines.map(machine => machine.care_machine_id);
      this.machineFormGroup.get('machines')!.setValue(this.selectedMachines);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onMachineChange(event: Event, machineId: string) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedMachines.push(machineId);
    } else {
      this.selectedMachines = this.selectedMachines.filter(id => id !== machineId);
    }
    this.machineFormGroup.get('machines')!.setValue(this.selectedMachines);
    this.updateMachinesOnServer();
  }

  isMachineSelected(machineId: string): boolean {
    return this.selectedMachines.includes(machineId);
  }

  updateMachinesOnServer() {
    const payload: UpdateCareMachinesPayload = {
      care_id: this.careId,
      care_machine_ids: this.selectedMachines
    };

    this.securityService.updateCareMachines(payload).subscribe({
      next: (response) => {
        if (response.result) {
          console.log('Machines de soin mises à jour avec succès:', response.data);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour des machines:', err);
      }
    });
  }

  getMachineName(machineId: string): string {
    const machine = this.securityService.careMachine$().find(
      machine => machine.care_machine_id === machineId
    );
    return machine ? machine.name : '';
  }

  removeMachine(machineId: string) {
    this.selectedMachines = this.selectedMachines.filter(id => id !== machineId);
    this.machineFormGroup.get('machines')!.setValue(this.selectedMachines);
    this.updateMachinesOnServer();
  }
}
