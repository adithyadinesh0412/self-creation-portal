import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appLimitToRange]',
  standalone:true
})
export class LimitToRangeDirective {

  @Input() minValue: number = 0;  // Accept minimum value as input
  @Input() maxValue: number = 15;  // Accept maximum value as input

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('blur', ['$event.target.value'])
  onInput(value: string) {
    let parsedValue = parseFloat(value);
    debugger;
    if (isNaN(parsedValue)) {
      parsedValue = parsedValue;
    } else if (parsedValue < this.minValue) {
      parsedValue = this.minValue;  // Set to minValue if less than minValue
    } else if (parsedValue > this.maxValue) {
      parsedValue = this.maxValue;  // Set to maxValue if greater than maxValue
    }

    this.el.nativeElement.value = parsedValue.toString();
  }
}
