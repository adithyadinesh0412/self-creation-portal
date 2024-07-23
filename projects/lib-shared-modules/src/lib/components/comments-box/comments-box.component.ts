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
  imports: [CommonModule,MatIconModule,MatButtonModule,    FormsModule,
    QuillEditorComponent],
  templateUrl: './comments-box.component.html',
  styleUrl: './comments-box.component.scss'
})
export class CommentsBoxComponent {
  messages: any =  [
        {
          "id": 2,
          "comment": "Check spelling",
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
          "comment": "Add valid title",
          "context": "page",
          "page": 1,
          "status": "UNRESOLVED",
          "parent_id": null,
          "commenter": {
            "id": 24,
            "name": "Priyanka"
          },
          "is_read": true
        }
      ];
  value: any;
  chatFlag: boolean = false;

  @ViewChild('editor') editor:any;

  name = 'Angular';
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

}
