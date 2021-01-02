import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable } from 'rxjs';

type Options = {
  element: any;
  keys: string;
}

@Injectable({
  providedIn: 'root'
})
export class HotkeyService {

  defaults: Partial<Options> = {
    element: this.document
  }

  constructor(private eventManager: EventManager,
    @Inject(DOCUMENT) private document: Document) { 
  }

  addShortcut(options: Partial<Options>) {
    const merged = { ...this.defaults, ...options };
    const event = `keyup.${merged.keys}`;

    //merged.description && this.hotkeys.set(merged.keys, merged.description);

    return new Observable(subscriber  => {
      const handler = (e: Event) => {
        e.preventDefault();
        subscriber.next(e);
      };
      
      const dispose = this.eventManager.addEventListener(
         merged.element, event, handler
      );

      return () => {
        dispose();
      };
    })
  }

}
