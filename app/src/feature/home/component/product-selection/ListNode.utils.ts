import {Product} from "../../../security/data/model/product/product.business";

export class ListNode {
  public product: Product; // Le produit stocké dans ce nœud
  public next: ListNode | null = null; // Pointeur vers le nœud suivant
  public prev: ListNode | null = null; // Pointeur vers le nœud précédent

  constructor(product: Product) {
    this.product = product;
  }
}

export class LinkedList {
  private head: ListNode | null = null; // Tête de la liste
  private tail: ListNode | null = null; // Queue de la liste
  private current: ListNode | null = null; // Référence au nœud actuellement sélectionné

  // Ajouter un produit dans la liste
  public add(product: Product): void {
    const newNode = new ListNode(product);

    if (!this.head) {
      // Si la liste est vide, le nouveau nœud devient la tête et la queue
      this.head = newNode;
      this.tail = newNode;
      this.head.next = this.head; // Rendre circulaire
      this.head.prev = this.head; // Rendre circulaire
    } else {
      // Ajouter un nouveau nœud à la fin de la liste
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      newNode.next = this.head;
      this.head.prev = newNode;
      this.tail = newNode;
    }

    // Initialiser le nœud actuel
    this.current = this.head;
  }

  // Aller au nœud suivant
  public next(): Product | null {
    if (this.current) {
      this.current = this.current.next;
      return this.current?.product ?? null;
    }
    return null;
  }

  // Aller au nœud précédent
  public prev(): Product | null {
    if (this.current) {
      this.current = this.current.prev;
      return this.current?.product ?? null;
    }
    return null;
  }

  // Obtenir le produit actuel
  public getCurrentProduct(): Product | null {
    return this.current?.product ?? null;
  }
}
