export enum BusinessStatus {
  Open = 'Open',
  Closed = 'Closed'
}

export const BusinessStatusTranslations = {
  [BusinessStatus.Open]: 'Ouvert',
  [BusinessStatus.Closed]: 'Fermé'
};
