import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { LibProjectService } from '../../../lib-project.service'
import { DynamicFormModule } from 'dynamic-form-ramkumar';



@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [
    HeaderComponent,DynamicFormModule
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent {
 data:any;
  constructor(private libProjectService:LibProjectService) {}
  ngOnInit() {
    this.libProjectService.currentData.subscribe(data => {
      this.data= data.res.controls
    });
}
}
