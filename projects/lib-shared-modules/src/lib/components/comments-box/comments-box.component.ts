import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import 'quill/dist/quill.snow.css';
import { FormService } from '../../services/form/form.service';
import { UtilService } from '../../../public-api';




@Component({
  selector: 'lib-comments-box',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule,FormsModule,
    QuillEditorComponent,TranslateModule],
  templateUrl: './comments-box.component.html',
  styleUrl: './comments-box.component.scss'
})
export class CommentsBoxComponent implements OnInit {
  userId:any = 0;
  isResolvable:boolean = false;
  @Input() commentPayload:any;
  @Input() resourceId:string|number = '';
  @Input() messages:any;
  @Output() comment = new EventEmitter<String>();
  value: any;
  chatFlag: boolean = false;

  @ViewChild('editor') editor:any;

  name = 'Angular';
  currentUserId:number = 25;
  modules = {
    formula: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['formula'],
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
        ['code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        //[{ 'direction': 'rtl' }],                         // text direction

        //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        //[{ 'font': [] }],
        //[{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        ['link'],
        //['link', 'image', 'video']
      ],

    }
  }

  constructor(private utilService:UtilService) { }

  ngOnInit() {
    // this.userId = localStorage.getItem('id') ? localStorage.getItem('id'):25;
    this.userId = 25;
    this.isResolvable = this.messages?.length > 0 && this.messages[this.messages.length - 1]?.resolved_at ? true : false;
    this.checkCommentIsDraft();
  }

  test=(event:any)=>{
    console.log(event.keyCode);
  }

  onSelectionChanged = (event:any) =>{
    if(event.oldRange == null){
      this.onFocus();
    }
    if(event.range == null){
      this.onBlur();
    }
  }


  onFocus = () =>{
    console.log("On Focus");
  }
  onBlur = () =>{
    console.log("Blurred");
  }

  checkCommentIsDraft() {
    if(this.messages?.length) {
      this.quillInput = this.messages[this.messages.length-1].status == "DRAFT" ? this.messages[this.messages.length-1].comment : '';
      this.draft = this.messages.pop()
    }
  }

  openChatBot() {
    this.chatFlag=!this.chatFlag;
  }

  sendMessage() {
    this.value = '';
  }

  saveComment() {
    console.log(this.quillInput)
    this.chatFlag = !this.chatFlag;
    this.comment.emit(this.quillInput)
    if(this.draft) {
      this.draft.comment = this.quillInput;
      this.utilService.updateComment(this.resourceId,this.draft,this.draft.id).subscribe((res) => console.log(res));
    }
    else {
      this.commentPayload.comment = this.quillInput;
      this.utilService.updateComment(this.resourceId,this.commentPayload).subscribe((res) => console.log(res));
    }
    this.commentPayload.comment = this.quillInput;

  }

}
