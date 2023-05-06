import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DtConfirmMessage } from 'src/app/core/models/confirm';

@Component({
  selector: 'app-modal-confirm-dialog',
  templateUrl: './modal-confirm-dialog.component.html',
  styleUrls: ['./modal-confirm-dialog.component.css']
})
export class ModalConfirmDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ModalConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DtConfirmMessage,
  ) { }

  ngOnInit(): void {
  }

  onConfirm(){
    this.dialogRef.close(true);
  }
 
  onCancel(){
    this.dialogRef.close();
  }

}
