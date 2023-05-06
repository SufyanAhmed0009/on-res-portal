import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalUserSheetUpload } from 'src/app/core/models/notification';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-modal-user-sheet-upload',
  templateUrl: './modal-user-sheet-upload.component.html',
  styleUrls: ['./modal-user-sheet-upload.component.css']
})
export class ModalUserSheetUploadComponent implements OnInit {

  isUploading: boolean = false;
  progress: number;

  constructor(
    private snackBarService: ServiceSnackbar,
    private dialogRef: MatDialogRef<ModalUserSheetUploadComponent>,
  ) { }

  ngOnInit(): void {
    this.progress = 0;
  }

  onSelected(event: any) {
    let files: File[] = event.srcElement.files;
    if (files.length > 0) {
      let file = files[0];
      if (this.isValidXLSX(file)) {
        this.readXLSX(event);
      } else {
        this.snackBarService.showErrorMessage("Not a valid xlsx file.");
      }
    }
  }

  isValidXLSX(file: File) {
    return file.name.endsWith(".xlsx");
  }

  readXLSX(select) {
    if (select.target.files.length == 0) {
      console.error("No file selected!");
    } else {
      this.isUploading = true;
      let workBook = null;
      let jsonData = null;
      const reader = new FileReader();
      const file = select.target.files[0];
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});

        let sheetData : any[] = Object.values(jsonData);
        let request: ModalUserSheetUpload = {
          users: sheetData[0].map(
            (data) => {
              return {
                id: data.User_id,
                title: data.Name,
              }
            }
          )
        }
        this.progress = 100;
        setTimeout(
          () => {
            this.snackBarService.showSuccessMessage("Successfully Uploaded Sheet");
            this.isUploading = false;
            this.dialogRef.close(request.users);
          }, 1000
        );

      }
      reader.readAsBinaryString(file);
    }
  }

}
