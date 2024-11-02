export enum OrderStatus {
    PENDING_PAYMENT = 'PENDING_PAYMENT',           // En attente de paiement
    PAYMENT_FAILED = 'PAYMENT_FAILED',            // Échec du paiement
    PENDING_SHIPPING = 'PENDING_SHIPPING',        // En attente d'expédition
    PROCESSING = 'PROCESSING',                    // En cours de traitement
    SHIPPED = 'SHIPPED',                          // Expédié
    DELIVERED = 'DELIVERED',                      // Livré
    CANCELLED = 'CANCELLED',                      // Annulé
    REFUNDED = 'REFUNDED'                        // Remboursé
}

// Objet pour l'affichage en français
export const OrderStatusLabels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING_PAYMENT]: 'En attente de paiement',
    [OrderStatus.PAYMENT_FAILED]: 'Échec du paiement',
    [OrderStatus.PENDING_SHIPPING]: 'En attente d\'expédition',
    [OrderStatus.PROCESSING]: 'En cours de traitement',
    [OrderStatus.SHIPPED]: 'Expédié',
    [OrderStatus.DELIVERED]: 'Livré',
    [OrderStatus.CANCELLED]: 'Annulé',
    [OrderStatus.REFUNDED]: 'Remboursé'
};