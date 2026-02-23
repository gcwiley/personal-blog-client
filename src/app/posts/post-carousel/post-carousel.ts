import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  input,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
  NgZone,
} from '@angular/core';

import { Router, RouterModule } from '@angular/router';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// rxjs
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

// post interface
import { Post } from '../../types/post.interface';

@Component({
  selector: 'app-post-carousel',
  templateUrl: './post-carousel.html',
  styleUrl: './post-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
})
export class PostCarousel implements AfterViewInit, OnDestroy {
  public posts = input<Post[]>([]);

  @ViewChild('postCarouselWrapper', { read: ElementRef })
  postCarouselWrapper?: ElementRef<HTMLDivElement>;

  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  // autoplay configuration
  private autoplayId: ReturnType<typeof setInterval> | null = null;
  private readonly autoplayIntervalMs = 5000;
  private isPaused = false;

  // visual state
  public activeIndex = 0;
  public canPrev = false;
  public canNext = false;

  public ngAfterViewInit(): void {}

  public ngOnDestroy(): void {}
}
