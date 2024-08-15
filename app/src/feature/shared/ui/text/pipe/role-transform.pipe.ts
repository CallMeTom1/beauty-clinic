import {inject, Pipe, PipeTransform} from '@angular/core';
import { Role } from "../../../../security/data/model/user/user-role.enum";
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'roleTransform',
  pure: true,
  standalone: true
})
export class RoleTransformPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  private roleMap: { [key in Role]: string } = {
    [Role.ADMIN]: 'role.admin',
    [Role.MODO]: 'role.moderator',
    [Role.USER]: 'role.user',
    [Role.USER_VERIFY_PENDING]: 'role.verificationPending',
    [Role.USER_VERIFIED]: 'role.verifiedUser',
    [Role.USER_VERIFY_REJECTED]: 'role.verificationRejected',
    [Role.SUBSCRIBER_TIER_1]: 'role.subscriberTier1',
    [Role.SUBSCRIBER_TIER_2]: 'role.subscriberTier2',
    [Role.SUBSCRIBER_TIER_3]: 'role.subscriberTier3'
  };

  transform(value: string): string {
    if (!value) {
      return '';
    }
    const translationKey: string = this.roleMap[value as Role] || value;
    try {
      return this.translateService.instant(translationKey);
    } catch (error) {
      return value;
    }
  }
}
