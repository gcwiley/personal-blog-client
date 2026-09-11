import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// rxjs
import { Observable, BehaviorSubject, of, first, finalize } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';

// material components
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

// dialogs
import { AttachmentPreviewDialog } from '../attachment-preview-dialog/attachment-preview-dialog';

// services, types, and constants
import { AttachmentService } from '../../services/attachment.service';
import {
  CustomConfirmDialogService,
  CustomConfirmDialog,
} from '../../services/custom-confirm-dialog.service';
import { Attachment } from '../../types/post.interface';
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

@Component({
  selector: 'app-post-attachment-grid',
  templateUrl: './post-attachment-grid.html',
  styleUrl: './post-attachment-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})
export class PostAttachmentGrid implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  private readonly route = inject(ActivatedRoute);
  private readonly attachmentService = inject(AttachmentService);
  private readonly confirmDialogService = inject(CustomConfirmDialogService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private postId = '';
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  // Observable that emits the list of attachments for the current post
  public attachments$!: Observable<Attachment[] | null>;
  public hasError = signal(false); // Indicates whether there was an error loading attachments
  public isUploading = signal(false);

  // Lifecycle hook that initializes the component
  public ngOnInit(): void {
    this.attachments$ = this.route.paramMap.pipe(
      map((pm) => pm.get('id')),
      filter((id): id is string => !!id),
      switchMap((id) => {
        this.postId = id;
        return this.refresh$.pipe(
          switchMap(() => {
            this.hasError.set(false);
            return this.attachmentService.getAttachmentsByPostId(id).pipe(
              startWith(null),
              catchError(() => {
                this.hasError.set(true);
                return of([]);
              }),
            );
          }),
        );
      }),
    );
  }

  // Triggers the file input click event to select a new attachment
  public triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  // Opens the attachment preview dialog for the selected attachment
  public onAttachmentClick(attachment: Attachment): void {
    this.dialog.open(AttachmentPreviewDialog, {
      data: attachment,
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }

  // Handles the file selection event and uploads the selected attachment
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    input.value = ''; // reset so the same file can be re-selected

    this.isUploading.set(true);
    this.attachmentService
      .addAttachment(this.postId, file)
      .pipe(
        first(),
        finalize(() => this.isUploading.set(false)),
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Attachment uploaded successfully.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
          this.refresh$.next();
        },
        error: () => {
          this.snackBar.open('Failed to upload attachment.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
        },
      });
  }

  // Handles the deletion of the selected attachment
  public onDeleteAttachment(attachment: Attachment): void {
    this.confirmDialogService
      .openCustomConfirmDialog(CustomConfirmDialog.Delete)
      .pipe(first())
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.attachmentService
          .deleteAttachment(this.postId, attachment.id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.snackBar.open('Attachment deleted.', 'Close', {
                duration: SNACK_BAR_DURATION_MS,
              });
              this.refresh$.next();
            },
            error: () => {
              this.snackBar.open('Failed to delete attachment.', 'Close', {
                duration: SNACK_BAR_DURATION_MS,
              });
            },
          });
      });
  }

  // Formats the file size from bytes to a human-readable string
  public formatFileSize(bytes: string): string {
    const size = parseInt(bytes, 10);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
}
