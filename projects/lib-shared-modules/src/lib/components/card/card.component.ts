import { CommonModule } from '@angular/common';
import { Component,Input,Output,EventEmitter } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [MatCardModule,CommonModule,MatButtonModule,MatIconModule,TranslateModule,MatTooltipModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() list: any;
  @Input() showActionButton: boolean = false;
  @Input() project:any;
  @Output() buttonClickEvent = new EventEmitter<{ label: string, item: any }>();
  @Output() infoClickEvent = new EventEmitter<{item: any}>

  constructor() {}

  onButtonClick(label: string, item: any) {
    this.buttonClickEvent.emit({ label, item });
  }

  onInfoClick(item: any) {
    this.infoClickEvent.emit({item});
  }

}
