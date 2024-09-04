export interface UpdateBusinessHoursPayload {
  opening_time: string;  // Doit être une chaîne au format HH:mm:ss
  closing_time: string;  // Doit être une chaîne au format HH:mm:ss
  is_open: boolean;      // Indique si l'entreprise est ouverte ou non ce jour-là
}
