import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-tasks',
  standalone: true,
  imports: [HeaderComponent,SideNavbarComponent,MatFormFieldModule,MatIconModule,FormsModule,ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  constructor(private fb: FormBuilder) {
  }
  myForm: FormGroup = this.fb.group({});
 
  public tasksData = [
    {
      "name": "objective",
      "label": "Objective",
      "value": "",
      "class": "",
      "type": "textarea",
      "placeHolder": "Summarize the goal of the project",
      "position": "floating",
      "errorMessage": {
          "required": "Summarize the goal of the project",
      },
      "validators": {
          "required": true,
      }
    }
  ]


}
