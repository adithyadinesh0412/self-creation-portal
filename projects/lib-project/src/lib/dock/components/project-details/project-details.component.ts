
import { Component } from '@angular/core';
import { DynamicFormModule } from '@elevate/dynamic-form';
import { HeaderComponent, SideNavbarComponent } from 'lib-shared-modules';

DynamicFormModule
@Component({
  selector: 'lib-project-details',
  standalone: true,
  imports: [
    HeaderComponent,
    SideNavbarComponent,
    DynamicFormModule
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent {
  backButton : boolean = true;
  subHeader : any;
  headerData : any = {};
  selctedCardItem : any;
  titleObj = {
    "title" : "Project name"
  }

  public sidenavData = [
    { title: 'PROJECT_DETAILS', action: "", icon: 'add',  url: 'project-details'},
        { title: 'TASKS', action: "", icon: 'search',  url: 'project-details'},
        { title: 'SUBTASKS_AND_RESOURCES', action: "", icon: 'search',  url: 'sub-tasks'},
        { title: 'CERTIFICATE', action: "", icon: 'search',  url: 'project-details'},
  ];

  data:any= [
    {
      "name": "title",
      "label": "Project title",
      "value": "",
      "class": "",
      "type": "text",
      "placeHolder": "Enter project title",
      "position": "floating",
      "errorMessage": {
          "required": "Enter project title",
      },
      "validators": {
          "required": true,
          "maxLength": 255,
      }
  },
  {
      "name": "categories",
      "label": "Category",
      "value": "",
      "class": "",
      "type": "select",
      "placeHolder": "Add project category",
      "position": "floating",
      "errorMessage": {
          "required": "Add project category",
      },
      "validators": {
          "required": true,
      },
      "options": [
        {
            "label": "Teacher",
            "value": "teacher"
        },
        {
            "label": "Student",
            "value": "student"
        },
        {
            "label": "Assam",
            "value": "as"
        },
        {
            "label": "Bihar",
            "value": "br"
        },
        {
            "label": "Chhattisgarh",
            "value": "cg"
        },
        {
            "label": "Goa",
            "value": "ga"
        },
    ],
    "meta": {
        "entityType": "category",
        "errorLabel": "Category"
    },
    "multiple": false
  },
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
  },
  {
    "name": "recommented_duration",
    "label": "Recommended duration",
    "value": "",
    "class": "",
    "type": "multipleField",
    "placeHolder": "Enter project title",
    "subfields":[
          {
            "name": "number",
            "label": "",
            "value": "",
            "class": "",
            "type": "text",
            "placeHolder": "Number",
            "position": "floating",
            "errorMessage": {
                "required": "Enter duration in numbers",
            },
            "validators": {
                "required": true,
                "maxLength": 255,
            }
        },
        {
            "name": "type",
            "label": "",
            "value": "",
            "class": "",
            "type": "select",
            "placeHolder": "Weeks",
            "position": "floating",
            "errorMessage": {
                "required": "Enter duration",
            },
            "validators": {
                "required": true,
            },
            "options": [
              {
                  "label": "Days",
                  "value": "days"
              },
              {
                  "label": "Weeks",
                  "value": "weeks"
              },
              {
                  "label": "Months",
                  "value": "months"
              },
          ],
          "meta": {
              "entityType": "category",
              "errorLabel": "Category"
          },
          "multiple": false
        },
    ],
    "position": "floating",
    "errorMessage": {
        "required": "Enter project title",
    },
    "validators": {
        "required": false,
    }
},
{
    "name": "keywords",
    "label": "Add keywords",
    "value": "",
    "class": "",
    "type": "text",
    "placeHolder": "Add a tag",
    "position": "floating",
    "errorMessage": {
        "required": "Add a tag",
    },
    "validators": {
        "required": true,
        "maxLength": 255,
    }
},
  {
      "name": "recommeneded_for",
      "label": "Recommended for",
      "value": "",
      "class": "",
      "type": "select",
      "placeHolder": "Select role",
      "position": "floating",
      "errorMessage": {
          "required": "Select role",
      },
      "validators": {
          "required": true,
      },
      "options": [
        {
            "label": "Head master",
            "value": "HM"
        },
        {
            "label": "HT",
            "value": "HT"
        },
        {
            "label": "Teacher",
            "value": "teacher"
        },
    ],
    "meta": {
        "entityType": "recommeneded_for",
        "errorLabel": "Recommended for"
    },
    "multiple": false
  },
  {
      "name": "languages",
      "label": "Language",
      "value": "",
      "class": "",
      "type": "select",
      "placeHolder": "Select language",
      "position": "floating",
      "errorMessage": {
          "required": "Select language",
      },
      "validators": {
          "required": true,
      },
      "options": [
        {
            "label": "English",
            "value": "en"
        },
        {
            "label": "Student",
            "value": "student"
        },
        {
            "label": "Assam",
            "value": "as"
        },
    ],
    "meta": {
        "entityType": "languages",
        "errorLabel": "Languages"
    },
    "multiple": false
      
  },
{
    "name": "learning_resources",
    "label": "Project resource (You can add learning resource(s) as a project level)",
    "value": "",
    "class": "",
    "icon":"add_circle",
    "type": "projectResource",
    "textForLink":"Add learning resource(s)",
    "placeHolder": "",
    "position": "floating",
    "dialogData":{
        header:"Add learning resource(s)",
        headerCss:"flex flex-row justify-between items-center bg-[#0a4f9d] h-10",
        resource:[[
            {
            "name": "nameOfResource",
            "label": "Name of the resource",
            "value": "",
            "class": "",
            "type": "text",
            "placeHolder": "Name",
            "position": "floating",
        },{
            "name": "linkToResource",
            "label": "Link to the resource",
            "value": "",
            "class": "",
            "type": "text",
            "placeHolder": "Link",
            "position": "floating",
        }
    ],
],
        "confirmButton":"Save",
        "cancelButton":"Cancel"
     },
    "errorMessage": {
        "required": "Enter project title",
    },
    "validators": {
        "required": true,
        "maxLength": 255,
    }
},
{
    "name": "license",
    "label": "License",
    "value": "",
    "class": "",
    "type": "select",
    "placeHolder": "Select license",
    "position": "floating",
    "errorMessage": {
        "required": "Select license",
    },
    "validators": {
        "required": true,
    },
    "options": [
        {
            "label": "English",
            "value": "en"
        },
        {
            "label": "Student",
            "value": "student"
        },
        {
            "label": "Assam",
            "value": "as"
        },
    ],
    "meta": {
        "entityType": "license",
        "errorLabel": "License"
    },
    "multiple": false
},

  ]

  constructor() {
  }

  onButtonClick(buttonTitle: string) {
  }
}
