// order-status.enum.ts
export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PENDING_SHIPPING = 'PENDING_SHIPPING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

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
