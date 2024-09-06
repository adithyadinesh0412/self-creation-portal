import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LibSharedModulesService } from '../../lib-shared-modules.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, TranslateModule,CommonModule,MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() backButton : boolean = true ;
  @Input() title!: string;
  @Input() headerData : any;
  mode:any = "edit";
  private subscription: Subscription = new Subscription();
  @Output() buttonClick: EventEmitter<string> =  new EventEmitter<string>();

  constructor( private libsharedservice: LibSharedModulesService, private router: Router, private route: ActivatedRoute,) {
    this.subscription.add(
      this.route.queryParams.subscribe((params: any) => {
        this.mode = params.mode ? params.mode : "edit"
     })
    )
    
  }

  backArrowButton() {
    this.libsharedservice.goBack()
  }

  onButtonClick(button : any) {
    this.buttonClick.emit(button.title)
  }

  logout() {
    this.libsharedservice.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
