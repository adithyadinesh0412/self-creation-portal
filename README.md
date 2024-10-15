# SelfCreationPortal

The SelfCreationPortal is a Angular-based project generated with Angular Framework and Angular Material
This project using multiple angular build libraries like  lib-observation, lib-observation-with-rubrics, lib-program, lib-project, lib-survey and lib-shared-modules.

## Contents
- [Dependencies](#dependencies)
- [Setting up the CLI](#setting-up-the-cli)
- [Setting up the Project](#setting-up-the-project)
- [Building the Libraries](#building-the-libraries)
- [Building the Application](#building-the-application)
- [Debugging the Application](#debugging-the-application)


## Dependencies

| Requirement | Description |
| --- | --- |
| `Angular CLI` | Version 17.3.5 |
| `Angular Framework` |  |
| `Angular Material`|  @angular/material 17.3.6 |
| `NgxIndexedDBModule`| ngx-indexed-db 19.0.1|
| `QuillEditorComponent`| ngx-quill 26.0.5|
| `System`| [nodejs](https://nodejs.org/en): v20.17.0 npm: 10.8.2 |


## Additional Information

- [Angular Framework](https://angular.dev/)

## Setting up the CLI

1. Install the Angular CLI
``` npm install -g @angular/cli@17 ```

## Setting up the  Project

1. Clone the [repository](https://github.com/ELEVATE-Project/self-creation-portal.git)
2. Go to the project folder using the below command.
   ``` cd self-creation-portal ```
3. Set the environment variables in the `environments./environment.ts` file.
4. Run `npm  i`

## Building the Libraries

1. Build the library on your local system using the following command:
   ``` ng build ```
   The build artifacts will be stored in the `dist/` directory.

## Building the Application

1. Run the project on your local system using the following command:
   ``` ng serve ```

## Debugging the Application

1. Open the running app in the browser.
2. Start inspecting using Chrome dev tools or any alternatives.
