import {Injectable, signal, WritableSignal} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme$: WritableSignal<string> = signal(localStorage.getItem('theme') || 'dark')
}
