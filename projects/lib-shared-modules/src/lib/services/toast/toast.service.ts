import { Injectable} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(data:any) {
    this._snackBar.openFromComponent(ToastComponent, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [data.class],
      data: data
    });
  }
}