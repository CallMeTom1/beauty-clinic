import {Component, inject, OnInit} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SecurityService} from "@feature-security";
import {Customer} from "../../../customer/data/model/customer.business";

@Component({
  selector: 'app-manage-customer',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './manage-customer.component.html',
  styleUrl: './manage-customer.component.scss'
})
export class ManageCustomerComponent implements OnInit {

  protected readonly title: string = "admin-feature.admin.manage-customer.title";
  protected readonly col_firstname: string = "admin-feature.admin.manage-customer.col_firstname";
  protected readonly col_lastname: string = "admin-feature.admin.manage-customer.col_lastname";
  protected readonly col_phoneNumber: string = "admin-feature.admin.manage-customer.col_phoneNumber";
  protected readonly col_id: string = "admin-feature.admin.manage-customer.col_id";

  private readonly translateService: TranslateService = inject(TranslateService);
  protected readonly securityService: SecurityService = inject(SecurityService);

  public sortColumn: string = '';
  public sortAscending: boolean = true;


  ngOnInit() {
    console.log('Customers fetching');
    this.securityService.fetchCustomers().subscribe();
    console.log(this.securityService.customers$());

  }

  // Toggle sorting of the table
  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.sortCustomers();
  }

  // Sort the customers based on the selected column and order
  private sortCustomers(): void {
    const sortedCustomers = [...this.securityService.customers$()].sort((a, b) => {
      const valA = a[this.sortColumn as keyof Customer];
      const valB = b[this.sortColumn as keyof Customer];

      if (valA! < valB!) {
        return this.sortAscending ? -1 : 1;
      }
      if (valA! > valB!) {
        return this.sortAscending ? 1 : -1;
      }
      return 0;
    });
    this.securityService.customers$.set(sortedCustomers);
  }

}
