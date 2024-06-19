import { Component, OnInit } from '@angular/core';
import { HeaderComponent, SideNavbarComponent, DialogModelComponent } from 'lib-shared-modules';
import { MatIconModule, getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { MatCardModule }  from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibProjectService } from '../../../lib-project.service'

@Component({
  selector: 'lib-sub-tasks-resources',
  standalone:true,
  imports: [
    HeaderComponent,
    SideNavbarComponent,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './sub-tasks-resources.component.html',
  styleUrl: './sub-tasks-resources.component.scss'
})
export class SubTasksResourcesComponent implements OnInit{
  myForm: FormGroup = this.fb.group({});
  resources:any;
  taskData : any[] = [];
  subtask: FormGroup;
  learningResources:any

  constructor(private dialog : MatDialog,private fb: FormBuilder,private libProjectService:LibProjectService) {
    this.subtask = this.fb.group({
      subtasks: this.fb.array([])  
    });
  }

  ngOnInit() {
    this.libProjectService.currentData.subscribe(data => {
      this.learningResources = data.tasksData.subTaskLearningResources
    });
    for (let i = 0; i < 5; i++) {
      const subtaskForm = this.fb.group({
        subtasks: this.fb.array([])  // Initialize a new FormArray for each task
    });
      this.taskData.push({
        header: `Task Description for task ${i + 1}`,
        buttons: [{"label":"ADD_OBSERVATION","disable":false},{"label":"ADD_LEARNING_RESOURCE","disable":false},{"label":"ADD_SUBTASKS","disable":false}],
        subTasks: subtaskForm,
        resources: []  // Initialize an empty array for resources
      });
    }
  }

  onAction(button : string, taskIndex: number) {
      switch (button) {
        case 'ADD_OBSERVATION':
          break;
  
        case 'ADD_LEARNING_RESOURCE':
          const dialogRef = this.dialog.open(DialogModelComponent, { 
            data: {
              control: this.learningResources
            }
            });

            const componentInstance = dialogRef.componentInstance;
            componentInstance.saveLearningResource.subscribe((result: any) => {
              if (result) {
                this.taskData[taskIndex].resources = result; // Save resources to the specific task
              }
            });
          break;
  
        case 'ADD_SUBTASKS':
          this.addSubTask(taskIndex)
          break;
  
        default:
          break;
      }
  }

  addSubTask(taskIndex: number) {
    const control = <FormArray>this.taskData[taskIndex].subTasks.get('subtasks');
    control.push(this.fb.control(''));
  }

  onDeleteSubtask(taskIndex: number, subTaskIndex: number) {
    const control = <FormArray>this.taskData[taskIndex].subTasks.get('subtasks');
    control.removeAt(subTaskIndex);
  }

  deleteResource(taskIndex: number, resourceIndex: number) {
    this.taskData[taskIndex].resources.splice(resourceIndex, 1);
  }
  onSubtasks(form: FormGroup, taskIndex: number) {}
}