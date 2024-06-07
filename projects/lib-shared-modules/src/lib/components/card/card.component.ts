import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [MatCardModule,CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() list: any;
}
