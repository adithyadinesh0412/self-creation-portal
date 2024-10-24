import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LibSharedModulesService } from '../../lib-shared-modules.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import { Subscription } from 'rxjs/internal/Subscription';
import {MatSelectModule} from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, TranslateModule,CommonModule,MatTooltipModule, MatSelectModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() backButton : boolean = true ;
  @Input() title!: string;
  @Input() headerData : any;
  @Input() toParent:boolean = false;
  @Output() backToParent = new EventEmitter<boolean>();
  @Input() selectedLanguage : any
  @Input() supportLanguages : any

  mode:any = "edit";
  private subscription: Subscription = new Subscription();
  @Output() buttonClick: EventEmitter<string> =  new EventEmitter<string>();

  constructor( private libsharedservice: LibSharedModulesService, private router: Router, private route: ActivatedRoute,
    private translateService: TranslateService) {
    this.subscription.add(
      this.route.queryParams.subscribe((params: any) => {
        this.mode = params.mode ? params.mode : "edit"
     })
    )

  }

  backArrowButton() {
    if(this.toParent) {
      this.backToParent.emit(true)
      return;
    }
    this.libsharedservice.goBack()
  }

  onButtonClick(button : any) {
    this.buttonClick.emit(button.title)
  }

  logout() {
    this.libsharedservice.logout();
  }

  languageChange(event:any) {
    this.selectedLanguage = event.value;
    this.translateService.use(this.selectedLanguage);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
