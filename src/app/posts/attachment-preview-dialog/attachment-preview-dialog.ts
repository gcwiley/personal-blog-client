import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

// material components
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// app types
import { Attachment } from '../../types/post.interface';

@Component({
  selector: 'app-attachment-preview-dialog',
  templateUrl: './attachment-preview-dialog.html',
  styleUrl: './attachment-preview-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatDialogModule, MatButtonModule],
})
export class AttachmentPreviewDialog {
  public readonly data = inject<Attachment>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AttachmentPreviewDialog>);

  // Closes the attachment preview dialog
  public close(): void {
    this.dialogRef.close();
  }
}
