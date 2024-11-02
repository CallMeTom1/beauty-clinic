import { Injectable, signal } from '@angular/core';
import { computed } from '@angular/core';

interface ModalState {
  isOpen: boolean;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = signal<ModalState>({
    isOpen: false,
    type: ''
  });

  readonly isOpen = computed(() => this.modalState().isOpen);
  readonly type = computed(() => this.modalState().type);

  openAuthModal() {
    console.log('Opening auth modal');
    this.modalState.set({
      isOpen: true,
      type: 'auth'
    });
  }

  closeModal() {
    console.log('Closing modal');
    this.modalState.set({
      isOpen: false,
      type: ''
    });
  }

  // Debug method
  getState() {
    return this.modalState();
  }
}
