import {
  AfterViewInit,
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
  signal,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

// rxjs
import { forkJoin } from 'rxjs';

// angular cdk
import { SelectionModel } from '@angular/cdk/collections';

// angular material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';

// post service, interface, and directive
import { PostService } from '../../services/post.service';
import { Post } from '../../types/post.interface';
import { PostDeleteDirective } from '../../directives/post-delete.directive';

// snackbar duration
import { SNACK_BAR_DURATION_MS } from '../../constants/ui.constants';

@Component({
  selector: 'app-post-table',
  templateUrl: './post-table.html',
  styleUrl: './post-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    RouterModule,
    PostDeleteDirective,
  ],
})
export class PostTable implements OnInit, AfterViewInit {
  readonly selection = new SelectionModel<Post>(true, []);
  readonly isLoadingResults = signal(true);
  readonly dataSource = new MatTableDataSource<Post>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly columnsToDisplay = [
    'select',
    'title',
    'category',
    'date',
    'actions',
  ];

  // inject dependencies
  private readonly postService = inject(PostService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.getPosts();
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // get all posts from post service
  public getPosts(): void {
    this.isLoadingResults.set(true);
    this.postService
      .getPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (posts) => {
          this.dataSource.data = posts;
          this.isLoadingResults.set(false);
        },
        error: (error) => {
          console.error('Error fetching posts:', error);
          this.isLoadingResults.set(false);
          this.snackBar.open('Error fetching posts.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
        },
      });
  }

  public onPostDeleted(deletedId: string): void {
    this.dataSource.data = this.dataSource.data.filter(
      (p) => p.id !== deletedId,
    );

    const deletedItem = this.selection.selected.find((p) => p.id === deletedId);
    if (deletedItem) {
      this.selection.deselect(deletedItem);
    }
  }

  // whether the number of selected posts matches the total number of rows
  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // select all rows if they are not all selected; otherwise clear selection
  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  // the label for the checkbox on the passed row
  public checkboxLabel(row?: Post): string {
    if (!row) {
      // label for the header checkbox
      return `${this.isAllSelected() ? 'Deselect' : 'Select'} all posts`;
    }
    // label for a row checkbox
    // using row.title assumes 'title' is a unique and descriptive property
    return `${this.selection.isSelected(row) ? 'Deselect' : 'Select'} post ${
      row.title
    }`;
  }

  public trackByPostId(_index: number, post: Post): string {
    return post.id;
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public deleteSelected(): void {
    const selected = this.selection.selected;
    if (!selected.length) return;

    const count = selected.length;
    const confirmed = confirm(
      `Delete ${count} post(s)? This cannot be undone.`,
    );
    if (!confirmed) return;

    forkJoin(selected.map((p) => this.postService.deletePostById(p.id)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const deletedIds = new Set(selected.map((p) => p.id));
          this.dataSource.data = this.dataSource.data.filter(
            (p) => !deletedIds.has(p.id),
          );
          this.selection.clear();
          this.snackBar.open(`${count} post(s) deleted.`, 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
        },
        error: () => {
          this.snackBar.open('Failed to delete some posts.', 'Close', {
            duration: SNACK_BAR_DURATION_MS,
          });
        },
      });
  }
}
