import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCard, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardActions } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-reload-dialog-component',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardContent, MatCardSubtitle, MatIcon, MatCardActions, MatAnchor],
  templateUrl: './reload-dialog-component.html',
  styleUrl: './reload-dialog-component.scss'
})
export class ReloadDialogComponent {
  dialogRef = inject(MatDialogRef<ReloadDialogComponent>);

  data = inject(MAT_DIALOG_DATA) as {
    title: string;
    icon: string;
    message: string;
    lastOpen:string;
    cancelText: string;
    confirmText: string;
  };

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}