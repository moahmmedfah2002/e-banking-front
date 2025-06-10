import {Component, Inject, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

@Component({
  selector:'pop',
  templateUrl:'./pop.component.html',
  standalone:false
})
export class PopComponent {
  private dialog: MatDialog=inject(MatDialog)
  // public data?: {
  //   message: string;
  // };
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
