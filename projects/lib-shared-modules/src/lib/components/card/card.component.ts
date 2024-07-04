import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DialogPopupComponent } from '../dialogs/dialog-popup/dialog-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [MatCardModule,CommonModule,MatButtonModule,MatIconModule,TranslateModule,MatTooltipModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() list: any;
  @Input() showActionButton: boolean = false;
  @Input() project:any;

  constructor(private router:Router, private dialog : MatDialog) {}

  cardClick(item:any) {
    console.log(item);
    console.log(item.actionButton);
    this.router.navigate(['solution/project/project-details'],{
      queryParams: {
        projectId: item.id,
        mode:'edit'
      }
    })
  }

  onButtonClick(label: string, item: any){
    console.log("buttonclick");
    switch (label) {
      case 'EDIT':
        console.log(label)
        this.router.navigate(['solution/project/project-details'],{
          queryParams: {
            projectId: item.id,
            mode:'edit'
          }
        })
        break;
      case 'DELETE':
        this.handleDelete(item);
          // Action for button at index 1
        break;
      default:
          break;
    }
  }

  handleDelete(item: any) {
    console.log("Deleting item: ");
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      data : {
        header: "DELETE_RESOURCE",
        content:"CONFIRM_DELETE_MESSAGE",
        cancelButton:"CANCEL",
        exitButton:"DELETE"
      }
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
  }
}
