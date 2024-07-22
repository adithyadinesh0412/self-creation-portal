import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogPopupComponent, HeaderComponent, SideNavbarComponent, ToastService } from 'lib-shared-modules';
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
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'lib-tasks',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SideNavbarComponent,MatFormFieldModule,MatIconModule,FormsModule,ReactiveFormsModule,MatInputModule,MatSlideToggleModule,MatSelectModule,MatButtonModule,TranslateModule,MatTooltipModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit,OnDestroy {

  tasksForm: FormGroup;
  projectId:string|number = '';
  taskFileTypes: string[] = ['PDF', 'Image'];
  tasksData:any;
  SHIFT_TASK_UP ='SHIFT_TASK_UP';
  SHIFT_TASK_DOWN = 'SHIFT_TASK_DOWN'
  private autoSaveSubscription: Subscription = new Subscription();
  maxTaskLength = this.libProjectService.maxTaskCount
  private subscription: Subscription = new Subscription();
  constructor(private fb: FormBuilder,private libProjectService:LibProjectService, private route:ActivatedRoute, private router:Router,private dialog : MatDialog,private _snackBar:MatSnackBar,private toastService:ToastService) {
    this.tasksForm = this.fb.group({
      tasks: this.fb.array([])
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.libProjectService.currentProjectMetaData.subscribe(data => {
        this.tasksData = data?.tasksData.tasks;
      })
    )
    this.subscription.add(
      this.route.queryParams.subscribe((params:any) => {
        this.projectId = params.projectId;
        console.log(this.route)
        if(params.projectId){
          if(params.mode === 'edit') {
            if(Object.keys(this.libProjectService.projectData).length) {
              this.tasksForm.reset()
              if(this.libProjectService.projectData.tasks && this.libProjectService.projectData.tasks.length) {
                this.libProjectService.projectData.tasks.forEach((element:any) => {
                  const task = this.fb.group({
                    id:[element.id],
                    description: [element.description ? element.description : '', Validators.required],
                    is_mandatory: [element.is_mandatory ? element.is_mandatory : false],
                    allow_evidence: [element.allow_evidence ? element.allow_evidence : false],
                    evidence_details: this.fb.group({
                      file_types: [element.evidence_details.file_types ? element.evidence_details.file_types : ''],
                      min_no_of_evidences: [element.evidence_details.min_no_of_evidences ? element.evidence_details.min_no_of_evidences : 1, Validators.min(1)]
                    }),
                    resources: [element.resources ? element.resources : ''],
                    subtask: [element.subtask ? element.subtask : ''],
                    sequence_no:[element.sequence_no]
                  });
                  this.tasks.push(task);
                })
              }
              else{
                this.addTask();
                this.addTask();
              }
              this.startAutoSaving();
            }
            else {
              this.libProjectService.readProject(this.projectId).subscribe((res:any)=> {
                this.tasksForm.reset()
                this.libProjectService.projectData = res.result;
                if(res && res.result.tasks && res.result.tasks.length) {
                  res.result.tasks.forEach((element:any) => {
                    const task = this.fb.group({
                      id:[element.id],
                      description: [element.description ? element.description : '', Validators.required],
                      is_mandatory: [element.is_mandatory ? element.is_mandatory : false],
                      allow_evidence: [element.allow_evidence ? element.allow_evidence : false],
                      evidence_details: this.fb.group({
                        file_types: [element.evidence_details.file_types ? element.evidence_details.file_types : ''],
                        min_no_of_evidences: [element.evidence_details.min_no_of_evidences ? element.evidence_details.min_no_of_evidences : 1, Validators.min(1)]
                      }),
                      resources: [element.resources ? element.resources : ''],
                      subtask: [element.subtask ? element.subtask : ''],
                      sequence_no:[element.sequence_no]
                    });
                    this.tasks.push(task);
                  })
                }
                else{
                  this.addTask();
                  this.addTask();
                }
                this.startAutoSaving();
              })
            }
          }
        }
        else {
          this.addTask();
          this.libProjectService.createOrUpdateProject().subscribe((res:any) => {
            this.projectId = res.result.id
            this.router.navigate([], {
              queryParams: {
                projectId: this.projectId
              },
              queryParamsHandling: 'merge'
            });
          })
        }
      })
    )
    this.subscription.add(
      this.libProjectService.isProjectSave.subscribe((isProjectSave:boolean) => {
        if(isProjectSave && this.router.url.includes('tasks')) {
          console.log("from subject it's getting called")
          this.submit();
        }
      })
    );
    this.libProjectService.validForm.tasks =  this.tasks?.status ? this.tasks?.status: "INVALID"
    this.libProjectService.checkValidationForSubmit()
  }

  get tasks() {
    return this.tasksForm.get('tasks') as FormArray;
  }

  addTask() {
    const taskGroup = this.fb.group({
      id:uuidv4(),
      type: "content",
      description: ['', Validators.required],
      is_mandatory: [false],
      allow_evidence: [true],
      evidence_details: this.fb.group({
        file_types: [[]],
        min_no_of_evidences: [1, Validators.min(1)]
      })
    });
    this.tasks.push(taskGroup);
  }

  deleteTask(index: number) {
    let content = (this.tasks.value[index].subtask &&  this.tasks.value[index].subtask.length) || (this.tasks.value[index].resources && this.tasks.value[index].resources.length) ? "DELETE_TASK_WITH_SUBTASK_MESSAGE" :"DELETE_TASK_MESSAGE";
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      disableClose: true,
      data: {
        header: "DELETE_TASK",
        content:content ,
        cancelButton: "NO",
        exitButton: "YES"
      }
    });

    return dialogRef.afterClosed().toPromise().then(result => {
      if (result.data === "NO") {
        return true;
      } else if (result.data === "YES") {
        this.tasks.removeAt(index);
        return true;
      } else {
        return false;
      }
    });
  }

  startAutoSaving() {
    this.subscription.add(
      this.libProjectService
      .startAutoSave(this.projectId)
      .subscribe((data) => console.log(data))
    )
  }

  moveTask(index: number, direction: number) {
    if ((index + direction) >= 0 && (index + direction) < this.tasks.length) {
      const task = this.tasks.at(index);
      this.tasks.removeAt(index);
      this.tasks.insert(index + direction, task);
    }
  }

  submit() {
    this.libProjectService.validForm.tasks =  this.tasks?.status? this.tasks?.status: "INVALID"
    console.log(this.tasks)
    this.tasks.value.forEach((item:any, index:any) => {
      item.sequence_no = index + 1;
    });
  console.log(this.tasks.value)
    this.libProjectService.setProjectData({'tasks':this.tasks.value})
    this.libProjectService.updateProjectDraft(this.projectId).subscribe();
  }

  ngOnDestroy(){
    this.libProjectService.validForm.tasks =  this.tasks?.status? this.tasks?.status: "INVALID"
    this.libProjectService.checkValidationForSubmit()
    this.libProjectService.setProjectData({'tasks':this.tasks.value})
    this.subscription.unsubscribe();
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
    this.libProjectService.createOrUpdateProject(this.libProjectService.projectData,this.projectId).subscribe((res)=> console.log(res))
  }

  addingTask() {
    const taskCantAddMessage = !this.tasksForm.valid
      ? 'FILL_THE_DISCRIPTION_OF_THE_ALREADY_ADDED_FIRST'
      : this.tasks.length >= this.maxTaskLength
        ? 'TASK_LIMIT_REACHED'
        : '';

    if (taskCantAddMessage) {
      let data = {
        "message":taskCantAddMessage,
        "class":"error"
      }
     this.toastService.openSnackBar(data)
    } else {
      this.addTask();
    }
  }

}
