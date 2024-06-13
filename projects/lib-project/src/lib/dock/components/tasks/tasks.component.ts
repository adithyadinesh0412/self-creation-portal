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

  constructor(private fb: FormBuilder) {
    this.tasksForm = this.fb.group({
      tasks: this.fb.array([])
    });
  }

  tasksData:any = 
    {
      description: { label: 'Describe the task', placeholder: 'Describe the task', type: 'text', name: 'description', validators: { required: true } },
      mandatory: { label: 'Mandatory', type: 'checkbox', name: 'mandatory', validators: {} },
      allowEvidence: { label: 'Allow evidence(s)', type: 'checkbox', name: 'allowEvidence', validators: {} },
      fileType: { label: 'File type', type: 'select', name: 'fileType', options: ['PDF', 'Image'], validators: {} },
      minEvidences: { label: 'Min. number of evidences', type: 'number', name: 'minEvidences', validators: {} }
    }

  ngOnInit() {
    this.addTask();  // Initialize the form with one task
  }

  get tasks() {
    return this.tasksForm.get('tasks') as FormArray;
  }

  addTask() {
    const taskGroup = this.fb.group({
      description: ['', Validators.required],
      mandatory: [false],
      allowEvidence: [false],
      fileType: [''],
      minEvidences: [1, Validators.min(1)]
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


}
