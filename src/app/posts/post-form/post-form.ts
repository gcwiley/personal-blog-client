import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of, first, switchMap, finalize } from 'rxjs';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// post service and interface
import { PostService } from '../../services/post.service';
import { PostInput, SelectOption } from '../../types/post.interface';

// import the post categories
import { POST_CATEGORIES } from '../../../assets/data/post-data';

// snack duration
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
  ],
})
export class PostForm implements OnInit {
  public mode = signal<'create' | 'edit'>('create');
  public isSaving = signal(false);
  public submitted = signal(false);

  private id!: string | null;

  readonly categories: SelectOption[] = POST_CATEGORIES;

  // inject dependencies
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);
  private readonly snackBar = inject(MatSnackBar);

  // create the post form
  postForm = this.formBuilder.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    body: ['', Validators.required],
    category: ['', Validators.required],
    favorite: [false, Validators.required],
    publishedDate: [null as Date | null, Validators.required],
  });

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
            publishedDate: post.publishedDate ? new Date(post.publishedDate) : null,
          });
        }
      });
  }

  // saves a new post to database
  public onSavePost(): void {
    // error checking
    if (!this.postForm.valid) {
      return;
    }

    const formValue = this.postForm.value as PostInput;

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
        .updatePostById(this.id!, this.postForm.value as PostInput)
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
