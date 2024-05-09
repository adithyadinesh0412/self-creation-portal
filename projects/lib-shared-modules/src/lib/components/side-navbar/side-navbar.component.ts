import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list'; 
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'lib-side-navbar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {
  @Input() appPages : any[] = [];
  @Output() menuItemClick: EventEmitter<any> = new EventEmitter<any>();

  onMenuItemClick(item: any) {
    this.menuItemClick.emit(item); 
  }

  
}
