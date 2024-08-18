import {inject, Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {CareCategory, CareCategoryTranslations} from "../care/data/care-category.enum";

@Injectable({
  providedIn: 'root'
})
export class AdminService{
  protected readonly translateService: TranslateService = inject(TranslateService);

  getTranslation(category: CareCategory): string {
    const translationKey = CareCategoryTranslations[category];
    return this.translateService.instant(translationKey);
  }
}
