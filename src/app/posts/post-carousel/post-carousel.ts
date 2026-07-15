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
  computed,
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

// rxjs
import { Subject } from 'rxjs';

// post interface
import { Post } from '../../types/post.interface';

// pipes
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-post-carousel',
  templateUrl: './post-carousel.html',
  styleUrl: './post-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    TimeAgoPipe,
  ],
})
export class PostCarousel implements AfterViewInit, OnDestroy {
  public posts = input<Post[]>([]);

  public readonly totalSlides = computed(() => this.posts().length);

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

  public get canPrev(): boolean {
    return this.activeIndex > 0;
  }

  public get canNext(): boolean {
    return this.activeIndex < this.totalSlides() - 1;
  }

  public ngAfterViewInit(): void {
    if (this.totalSlides() > 1) {
      this.startAutoplay();
    }
  }

  public ngOnDestroy(): void {
    this.stopAutoplay();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public goTo(index: number): void {
    if (index < 0 || index >= this.totalSlides()) return;
    this.activeIndex = index;
    this.cdr.markForCheck();
  }

  public prev(): void {
    this.goTo(this.activeIndex - 1);
  }

  public next(): void {
    this.goTo(this.activeIndex + 1);
  }

  public onMouseEnter(): void {
    this.isPaused = true;
  }

  public onMouseLeave(): void {
    this.isPaused = false;
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.prev();
    else if (event.key === 'ArrowRight') this.next();
  }

  private startAutoplay(): void {
    this.ngZone.runOutsideAngular(() => {
      this.autoplayId = setInterval(() => {
        if (!this.isPaused) {
          this.ngZone.run(() => {
            const next = (this.activeIndex + 1) % this.totalSlides();
            this.goTo(next);
          });
        }
      }, this.autoplayIntervalMs);
    });
  }

  private stopAutoplay(): void {
    if (this.autoplayId !== null) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }
}
