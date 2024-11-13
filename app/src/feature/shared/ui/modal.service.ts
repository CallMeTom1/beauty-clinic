import {Injectable, signal} from '@angular/core';

export interface ModalConfig {
  title?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isModalOpen = signal(false);
  private modalConfig = signal<ModalConfig>({});

  isOpen() {
    return this.isModalOpen();
  }

  getConfig() {
    return this.modalConfig();
  }

  openAuthModal(config: ModalConfig = {}) {
    const defaultConfig = {
      title: 'Connexion requise',
      message: 'Pour ajouter des articles à votre liste de souhaits, veuillez vous connecter ou créer un compte.'
    };

    this.modalConfig.set({ ...defaultConfig, ...config });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.modalConfig.set({});
  }
}
