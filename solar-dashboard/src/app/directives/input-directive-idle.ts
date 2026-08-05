import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
} from '@angular/core';
import { OfferUnitStore } from '../stores/offer-unit.store';

@Directive({
  selector: '[appInputDirectiveIdle]',
  standalone: true,
})

export class InputDirectiveIdle {
  private elementRef = inject(ElementRef<HTMLInputElement>)
  offerUnitStore = inject(OfferUnitStore);
  input = this.elementRef.nativeElement;

  @Output()
  ctrlEnter = new EventEmitter<number>();

  @HostListener('input')
  onInput() {

    const value = this.input.value.toLowerCase();

    if (value === 'i') {
      this.input.value = 'i';
      return;
    }

    this.input.value = '';
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      this.ctrlEnter.emit(
        this.input.value === 'i' ? 1 : 0
      );
    }
  }

}
