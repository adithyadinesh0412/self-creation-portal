import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import 'quill/dist/quill.snow.css';
import { FormService } from '../../services/form/form.service';
import { ToastService, UtilService } from '../../../public-api';




@Component({
  selector: 'lib-comments-box',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule,FormsModule,
    QuillEditorComponent,TranslateModule],
  templateUrl: './comments-box.component.html',
  styleUrl: './comments-box.component.scss'
})
export class CommentsBoxComponent implements OnInit, OnDestroy {
  userId:any = 0;
  @Input() mode:string='';
  @Input() commentPayload:any;
  @Input() resourceId:string|number = '';
  @Input() messages:any;
  @Output() comment = new EventEmitter<String>();
  value: any;
  resolveDisable:boolean = false;
  chatFlag: boolean = true;

  @ViewChild('editor') editor:any;

  name = 'Angular';
  currentUserId:number = 25;
  modules = {
    formula: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['formula'],
      [{ 'font': [] }],
      ['image', 'code-block']
    ]
  };
  quillInput =""
  hasFocus = false;
  subject: any;
  draft:any = '';


  quillConfig={
    //toolbar: '.toolbar',
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'bullet' }],
        [{ 'font': [] }],                                        // remove formatting button
        ['link'],
        //['link', 'image', 'video']
      ],

    }
  }

  constructor(private utilService:UtilService,private toastService:ToastService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('id');
    this.checkCommentIsDraftAndResolvable();
  }

  test=(event:any)=>{
    // console.log(event.keyCode);
  }

  onSelectionChanged = (event:any) =>{
    if(event.oldRange == null){
      this.onFocus();
    }
    if(event.range == null){
      this.onBlur();
    }
  }


  onFocus = () =>{}
  onBlur = () =>{
    if(this.quillInput.length){
      this.saveComment()
    }
  }

  checkCommentIsDraftAndResolvable() {
    if(this.messages?.length) {
      this.quillInput = this.messages[this.messages.length-1]?.status == "DRAFT" ? this.messages[this.messages.length-1].text : '';
      this.draft = this.quillInput.length > 0 ? this.messages.pop() : '';
      if(this.messages[this.messages.length-1]?.resolver && Object.keys(this.messages[this.messages.length-1].resolver).length > 0) {
        this.resolveDisable = true;
      }
    }
  }

  resolveComment() {
    this.utilService.updateComment(this.resourceId,{...this.messages[this.messages.length-1],...{status:"RESOLVED"}},this.messages[this.messages.length-1].id).subscribe((res:any) =>{
      this.toastService.openSnackBar({
        message : res.message,
        class : 'success'
      })
      this.resolveDisable = true;
    });
  }

  openChatBot() {
    this.chatFlag=!this.chatFlag;
  }


  saveComment(save :any ="") {
    if(save?.length){
      this.chatFlag = !this.chatFlag;
    }
    
    this.comment.emit(this.quillInput)
    this.commentPayload.parent_id= this.messages.length > 0 ? this.messages[this.messages.length-1].id : 0;
    if(this.draft) {
      this.draft.text = this.quillInput;
      this.utilService.updateComment(this.resourceId,this.draft,this.draft.id).subscribe((res) => console.log(res));
    }
    else {
      this.commentPayload.text = this.quillInput;
      this.utilService.updateComment(this.resourceId,this.commentPayload).subscribe((res:any) => {
        this.draft = res.result;
      });
    }
    this.commentPayload.comment = this.quillInput;
  }

  ngOnDestroy(): void {
    if(this.quillInput.length > 0 && this.utilService.saveComment) {
      this.saveComment();
    }
  }

}
