import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  public mailHome$: WritableSignal<string> = signal('');
}
