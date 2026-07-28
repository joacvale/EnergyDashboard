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
  selector: '[appInputDirective]',
  standalone: true,
})
export class InputDirective {
  private elementRef = inject(ElementRef<HTMLInputElement>)
  offerUnitStore = inject(OfferUnitStore);
  input = this.elementRef.nativeElement;

  @Output()
  ctrlEnter = new EventEmitter<number>();



  @HostListener('blur')
  onBlur() {
    const normalizedValue = this.input.value.replaceAll(',', '.');
    const value = Number(normalizedValue);

    if (!!!value) {
      return;
    }

    this.elementRef.nativeElement.value =
      value.toFixed(2);
  }



  @HostListener('input')
  onInput() {
    this.input.value = this.input.value.replace(/[^0-9,.]/g, '');
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      const value = Number(
        this.input.value.replace(',', '.')
      );

      this.ctrlEnter.emit(value);
    }

  }



}