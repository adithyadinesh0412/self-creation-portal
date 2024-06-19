import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LibProjectService } from '../../../lib-project.service'


@Component({
  selector: 'lib-tasks',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SideNavbarComponent,MatFormFieldModule,MatIconModule,FormsModule,ReactiveFormsModule,MatInputModule,MatSlideToggleModule,MatSelectModule,MatButtonModule,TranslateModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {

  tasksForm: FormGroup;
  taskFileTypes: string[] = ['PDF', 'Image'];
  tasksData:any;
  constructor(private fb: FormBuilder,private libProjectService:LibProjectService) {
    this.tasksForm = this.fb.group({
      tasks: this.fb.array([])
    });
  }
  
  ngOnInit() {
    this.libProjectService.currentData.subscribe(data => {
      this.tasksData = data.tasksData.tasks
      this.addTask();
    });
    
  }

  get tasks() {
    return this.tasksForm.get('tasks') as FormArray;
  }

  addTask() {
    const taskGroup = this.fb.group({
      description: ['', Validators.required],
      is_mandatory: [false],
      allow_evidence: [false],
      evidence_details: this.fb.group({
        file_types: [''],
        min_no_of_evidences: [1, Validators.min(1)]
      })  
    });
    this.tasks.push(taskGroup);
  }

  deleteTask(index: number) {
    this.tasks.removeAt(index);
  }

  moveTask(index: number, direction: number) {
    if ((index + direction) >= 0 && (index + direction) < this.tasks.length) {
      const task = this.tasks.at(index);
      this.tasks.removeAt(index);
      this.tasks.insert(index + direction, task);
    }
  }

  submit() {}

}
