import { Component } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-epil-laser-page',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './epil-laser-page.component.html',
  styleUrl: './epil-laser-page.component.scss'
})
export class EpilLaserPageComponent {
  protected readonly header_title: string = 'care-feature-page-epil-laser-header-title';
  protected readonly header_sub_title: string = 'care-feature-page-epil-laser-header-sub';
  protected readonly header_text: string = 'care-feature-page-epil-laser-header-text';
  protected readonly header_btn_text: string = 'care-feature-page-epil-laser-header-btn';

  protected readonly resume: string = 'care-feature-page-epil-laser-resume';
  protected readonly title: string = 'care-feature-page-epil-laser-title';
  protected readonly sub_title: string = 'care-feature-page-epil-laser-sub-title';
  protected readonly title2: string = 'care-feature-page-epil-laser-title2';
  protected readonly sub_title2: string = 'care-feature-page-epil-laser-sub-title2';
  protected readonly text2: string = 'care-feature-page-epil-laser-text2';
  protected readonly title3: string = 'care-feature-page-epil-laser-title3';
  protected readonly text3: string = 'care-feature-page-epil-laser-text3';
  protected readonly title4: string = 'care-feature-page-epil-laser-title4';
  protected readonly title5: string = 'care-feature-page-epil-laser-title5';
  protected readonly text5: string = 'care-feature-page-epil-laser-text5';
  protected readonly title6: string = 'care-feature-page-epil-laser-title6';
  protected readonly text6: string = 'care-feature-page-epil-laser-text6';
  protected readonly title7: string = 'care-feature-page-epil-laser-title7';
  protected readonly title8: string = 'care-feature-page-epil-laser-title8';
  protected readonly text8: string = 'care-feature-page-epil-laser-text8';
  protected readonly title9: string = 'care-feature-page-epil-laser-title9';
  protected readonly text9: string = 'care-feature-page-epil-laser-text9';
  protected readonly title10: string = 'care-feature-page-epil-laser-title10';
  protected readonly text10: string = 'care-feature-page-epil-laser-text10';

  protected readonly pre_treatment:string = 'care-feature-page-epil-laser-avant';
  protected readonly raser: string = 'care-feature-page-epil-laser-raser';
  protected readonly retirez:string = 'care-feature-page-epil-laser-retirez';
  protected readonly resultat: string = 'care-feature-page-epil-laser-resultat';
  protected readonly general: string ='care-feature-page-epil-laser-general';
  protected readonly apres:string = 'care-feature-page-epil-laser-apres';
  protected readonly maintenez: string = 'care-feature-page-epil-laser-maintenez';
  protected readonly appliquez: string ='care-feature-page-epil-laser-appliquez';
  protected readonly eviter: string ='care-feature-page-epil-laser-eviter';
  protected readonly rdv: string = 'care-feature-page-epil-laser-rdv';

  protected readonly tarif:string = 'care-feature-page-epil-laser-tarif';
  protected readonly coute: string = 'care-feature-page-epil-laser-coute';

  protected readonly femme: string = 'common.body.part-femme';
  protected readonly homme: string = 'common.body.part-homme';
  protected readonly visage: string = 'common.body.part-visage';
  protected readonly sourcil: string = 'common.body.part-sourcil';
  protected readonly visage_complet: string = 'common.body.part-visage-complet';
  protected readonly corps: string = 'common.body.part-corps';
  protected readonly cou: string = 'common.body.part-cou';
  protected readonly aisselles: string = 'common.body.part-aisselles';
  protected readonly aisselles_avant_bras: string = 'common.body.part-aisselles-avant-bras';
  protected readonly dos: string = 'common.body.part-dos';
  protected readonly demies_jambes: string = 'common.body.part-demies-jambes';
  protected readonly jambes_entieres: string = 'common.body.part-jambes-entieres';
  protected readonly aisselles_demies_jambes: string = 'common.body.part-aisselles-demi-jambes';
  protected readonly aisselles_jambes_complete: string = 'common.body.part-aisselles-jambes-completes';
  protected readonly maillot: string = 'common.body.part-maillot-intégral-aisselles';
  protected readonly corps_entier: string = 'common.body.part-corps-entier';
  protected readonly mfbarbe: string = 'common.body.part-mise-en-forme-barbe';
  protected readonly barbe: string = 'common.body.part-barbe-entiere';
  protected readonly haut_dos_epaule: string = 'common.body.part-haut-dos-epaule';
  protected readonly main_pied: string = 'common.body.part-main-pied';

  protected readonly minute:string = 'common.time.minute';
}
