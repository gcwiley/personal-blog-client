import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';
import { DestroyRef } from '@angular/core';

// angular material
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.html',
  styleUrl: './clock.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatChipsModule],
})
export class Clock implements OnInit {
  public readonly currentTime = signal(new Date());
  private readonly destroyRef = inject(DestroyRef);

  public readonly timeZones = [
    { label: 'Local', offset: '' },
    { label: 'Zulu', offset: 'UTC' },
    { label: 'Tel Aviv', offset: 'Asia/Jerusalem' },
    { label: 'Kyiv', offset: 'Europe/Kyiv' },
  ];

  // set up the clock update interval of 1 second
  public ngOnInit(): void {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.currentTime.set(new Date());
      });
  }
}
