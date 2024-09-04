export enum CareZone {
  Facial = 'FACIAL',
  FullBody = 'FULL_BODY',
  Legs = 'LEGS',
  None = 'NONE'
}

export const CareZoneTranslations = {
  [CareZone.Facial]: 'care.zone.facial',
  [CareZone.FullBody]: 'care.zone.fullbody',
  [CareZone.Legs]: 'care.zone.legs',
  [CareZone.None]: 'care.zone.none'
};
