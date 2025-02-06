import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
import FlexTimer from '../index';

@Component({
  selector: 'flex-timer',
  template: '<div #timer></div>',
})
export class FlexTimerComponent implements AfterViewInit {
  @ViewChild('timer') timerRef!: ElementRef;
  @Input() options: any;

  ngAfterViewInit() {
    new FlexTimer(this.timerRef.nativeElement, this.options).start();
  }
}
