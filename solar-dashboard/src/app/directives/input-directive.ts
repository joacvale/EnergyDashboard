import {
  Directive,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appInputDirective]',
  standalone: true,
})
export class InputDirective {
  private elementRef = inject(ElementRef<HTMLInputElement>)

  input = this.elementRef.nativeElement;

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
    this.input.value = this.input.value.replace(/[^0-9,.]/g,'');
  }

}