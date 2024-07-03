import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogPopupComponent, HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';
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


@Component({
  selector: 'lib-tasks',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SideNavbarComponent,MatFormFieldModule,MatIconModule,FormsModule,ReactiveFormsModule,MatInputModule,MatSlideToggleModule,MatSelectModule,MatButtonModule,TranslateModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit,OnDestroy {

  tasksForm: FormGroup;
  projectId:string|number = '';
  taskFileTypes: string[] = ['PDF', 'Image'];
  tasksData:any;
  private subscription: Subscription = new Subscription();
  constructor(private fb: FormBuilder,private libProjectService:LibProjectService, private route:ActivatedRoute, private router:Router,private dialog : MatDialog,private _snackBar:MatSnackBar) {
    this.tasksForm = this.fb.group({
      tasks: this.fb.array([])
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.libProjectService.currentProjectMetaData.subscribe(data => {
        this.tasksData = data.tasksData.tasks;
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
                    description: [element.description ? element.description : '', Validators.required],
                    is_mandatory: [element.is_mandatory ? element.is_mandatory : false],
                    allow_evidence: [element.allow_evidence ? element.allow_evidence : false],
                    evidence_details: this.fb.group({
                      file_types: [element.evidence_details.file_types ? element.evidence_details.file_types : ''],
                      min_no_of_evidences: [element.evidence_details.min_no_of_evidences ? element.evidence_details.min_no_of_evidences : 1, Validators.min(1)]
                    }),
                    resources: [element.resources ? element.resources : ''],
                    subtask: [element.subtask ? element.subtask : ''],
                  });
                  this.tasks.push(task);
                })
              }
              else{
                this.addTask();
                this.addTask();
              }
            }
            else {
              this.libProjectService.readProject(this.projectId).subscribe((res:any)=> {
                this.tasksForm.reset()
                this.libProjectService.projectData = res.result;
                this.libProjectService.upDateProjectTitle();
                if(res && res.result.tasks && res.result.tasks.length) {
                  res.result.tasks.forEach((element:any) => {
                    const task = this.fb.group({
                      description: [element.description ? element.description : '', Validators.required],
                      is_mandatory: [element.is_mandatory ? element.is_mandatory : false],
                      allow_evidence: [element.allow_evidence ? element.allow_evidence : false],
                      evidence_details: this.fb.group({
                        file_types: [element.evidence_details.file_types ? element.evidence_details.file_types : ''],
                        min_no_of_evidences: [element.evidence_details.min_no_of_evidences ? element.evidence_details.min_no_of_evidences : 1, Validators.min(1)]
                      }),
                      resources: [element.resources ? element.resources : ''],
                      subtask: [element.subtask ? element.subtask : ''],
                    });
                    this.tasks.push(task);
                  })
                }
                else{
                  this.addTask();
                  this.addTask();
                }
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
  }

// canDeactivate(): Promise<any> {
//   if (!this.tasksForm?.pristine ) {
//     const dialogRef = this.dialog.open(DialogPopupComponent, {
//       data: {
//         header: "SAVE_CHANGES",
//         content: "UNSAVED_CHNAGES_MESSAGE",
//         cancelButton: "DO_NOT_SAVE",
//         exitButton: "SAVE"
//       }
//     });

//     return dialogRef.afterClosed().toPromise().then(result => {
//       if (result === "DO_NOT_SAVE") {
//         return true;
//       } else if (result === "SAVE") {
//         this.subscription.add(
//               this.submit()
//         );
//         return true;
//       } else {
//         return false;
//       }
//     });
//   } else {
//     return Promise.resolve(true);
//   }
// }

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
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      data: {
        header: "SAVE_CHANGES",
        content: "Are you sure you want to delete this task?",
        cancelButton: "NO",
        exitButton: "YES"
      }
    });

    return dialogRef.afterClosed().toPromise().then(result => {
      if (result === "DO_NOT_SAVE") {
        return true;
      } else if (result === "SAVE") {
        this.subscription.add(
              this.submit()
        );
        return true;
      } else {
        return false;
      }
    });
    this.tasks.removeAt(index);
  }

  moveTask(index: number, direction: number) {
    if ((index + direction) >= 0 && (index + direction) < this.tasks.length) {
      const task = this.tasks.at(index);
      this.tasks.removeAt(index);
      this.tasks.insert(index + direction, task);
    }
  }

  submit() {
    this.libProjectService.setProjectData({'tasks':this.tasks.value})
    this.libProjectService.updateProjectDraft(this.projectId);
  }

  ngOnDestroy(){
    this.libProjectService.setProjectData({'tasks':this.tasks.value})
    this.subscription.unsubscribe();
  }

  addingTask() {
    if (!this.tasksForm.valid) {
      this._snackBar.open('Please fill the description of the already added tasks first', 'X', {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration:1000
      });
    } else {
      this.addTask()
    }
  }

}
