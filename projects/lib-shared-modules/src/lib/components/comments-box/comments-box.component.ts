import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import 'quill/dist/quill.snow.css';




@Component({
  selector: 'lib-comments-box',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule,FormsModule,
    QuillEditorComponent],
  templateUrl: './comments-box.component.html',
  styleUrl: './comments-box.component.scss'
})
export class CommentsBoxComponent {
  userId:any = 0;
  isResolvable:boolean = false;
  messages: any =  [
        {
          "id": 2,
          "comment": "Check spelling The certificate templates are completely configurable. The adopter is free to add more number of templates or make changes to the available templates to fit their needs. ",
          "context": "page",
          "page": 1,
          "status": "RESOLVED",
          "parent_id": 1,
          "commenter": {
            "id": 24,
            "name": "Priyanka"
          },
          "is_read": true,
          "resolved_by": 25,
          "resolver": {
            "id": 25,
            "name": "Adithya"
          },
          "resolved_at": "2024-04-11T06:43:43.995Z"
        },
        {
          "comment": "Add valid title The certificate templates are completely configurable. The adopter is free to add more number of templates or make changes to the available templates to fit their needs. ",
          "context": "page",
          "page": 1,
          "status": "UNRESOLVED",
          "parent_id": null,
          "commenter": {
            "id": 25,
            "name": "Ram"
          },
          "is_read": true
        },
        {
          "id": 2,
          "comment": "Check spelling The certificate templates are completely configurable. The adopter is free to add more number of templates or make changes to the available templates to fit their needs. ",
          "context": "page",
          "page": 1,
          "status": "RESOLVED",
          "parent_id": 1,
          "commenter": {
            "id": 24,
            "name": "Priyanka"
          },
          "is_read": true,
          "resolved_by": 25
        }
      ];
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

  constructor() { }

  ngOnInit() {
    // this.userId = localStorage.getItem('id') ? localStorage.getItem('id'):25;
    this.userId = 25;
    this.isResolvable = this.messages[this.messages.length - 1].resolved_at ? true : false;
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


  openChatBot() {
    this.chatFlag=!this.chatFlag;
  }

  sendMessage() {
    this.value = '';
  }

  logChange($event:any) {
    console.log(this.editor);
    console.log($event);
  }

  saveComment() {
    console.log(this.quillInput)
    this.chatFlag = !this.chatFlag;
  }

}
