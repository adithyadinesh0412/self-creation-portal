import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LibSharedModulesService } from '../../lib-shared-modules.service';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() backButton : boolean = true ;
  @Input() title!: string;
  @Input() headerData : any;
  @Output() buttonClick: EventEmitter<string> =  new EventEmitter<string>();

  constructor( private libsharedservice : LibSharedModulesService) {}

  backArrowButton() {
    this.libsharedservice.goBack()
  }

  onclick(button : any) {
    this.buttonClick.emit(button.title)
  }
  
}
