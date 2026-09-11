import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

// rxjs
import { of, first, switchMap, finalize } from 'rxjs';

// import quill rich text editor
import { QuillModule } from 'ngx-quill';

// material components
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

// post service and interface
import { PostService } from '../../services/post.service';
import { PostInput, SelectOption } from '../../types/post.interface';

// import the post categories
import { POST_CATEGORIES } from '../../../assets/data/post-data';

// snack bar duration 
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    QuillModule,
  ],
})
export class PostForm implements OnInit {
  public mode = signal<'create' | 'edit'>('create');
  public isSaving = signal(false);
  public submitted = signal(false);
  public tags = signal<string[]>([]);

  // separator keys for the tag input field
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // configuration for the Quill rich text editor
  readonly quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, false] }],
      ['link', 'blockquote', 'code-block'],
      ['clean'],
    ],
  };

  // adds a new tag to the list of tags
  public addTag(event: MatChipInputEvent): void {
    const value = (event.value ?? '').trim().toLowerCase();
    if (value && !this.tags().includes(value)) {
      this.tags.update((tags) => [...tags, value]);
      this.postForm.markAsDirty();
    }
    event.chipInput?.clear();
  }

  // removes a tag from the list of tags
  public removeTag(tag: string): void {
    this.tags.update((tags) => tags.filter((t) => t !== tag));
    this.postForm.markAsDirty();
  }

  // checks if the form has unsaved changes
  public hasUnsavedChanges(): boolean {
    return this.postForm.dirty;
  }

  // the ID of the post being edited (null if creating a new post)
  private id: string | null = null;

  // list of available post categories
  readonly categories: SelectOption[] = POST_CATEGORIES;

  // inject dependencies
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly snackBar = inject(MatSnackBar);

  // post form
  postForm = this.formBuilder.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    body: ['', Validators.required],
    category: ['', Validators.required],
    favorite: [false, Validators.required],
    publishedDate: [null as Date | null, Validators.required],
  });

  // initializes the component and loads the post if in edit mode
  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        first(),
        switchMap((paramMap: ParamMap) => {
          if (paramMap.has('id')) {
            this.mode.set('edit');
            this.id = paramMap.get('id');
            return this.postService.getPostById(this.id!);
          } else {
            this.mode.set('create');
            return of(undefined);
          }
        }),
      )
      .subscribe((post) => {
        if (post) {
          this.postForm.patchValue({
            ...post,
            publishedDate: post.publishedDate
              ? new Date(post.publishedDate)
              : null,
          });
          this.tags.set(post.tags ?? []);
        }
      });
  }

  // saves a new post to database
  public onSavePost(): void {
    this.submitted.set(true);
    if (!this.postForm.valid) {
      return;
    }

    this.isSaving.set(true);
    const formValue = {
      ...(this.postForm.value as PostInput),
      tags: this.tags(),
    };

    if (this.mode() === 'create') {
      this.postService
        .addPost(formValue)
        .pipe(
          first(),
          finalize(() => this.isSaving.set(false)),
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Post successfully created.', 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
            this.postForm.markAsPristine();
            this.router.navigateByUrl('/');
          },
          error: () => {
            this.snackBar.open('Error creating post.', 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
          },
        });
    } else {
      this.postService
        .updatePostById(this.id!, formValue)
        .pipe(
          first(),
          finalize(() => this.isSaving.set(false)),
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Post successfully updated', 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
          },
          error: (error) => {
            console.error('Error updating post:', error);
            this.snackBar.open('Error updating post.', 'Close', {
              duration: SNACK_BAR_DURATION_MS,
            });
          },
        });
    }
  }

  // navigates away from the form with saving
  public onCancel(): void {
    const destination = this.mode() === 'edit' ? `/posts/${this.id}` : '/posts';
    this.router.navigateByUrl(destination);
  }
}
