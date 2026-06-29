import { Pipe, PipeTransform } from '@angular/core';
import { ISODateString } from '../types/post.interface';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true, 
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: ISODateString | null): string {
    if (!value) return '';

    const date = new Date(value);
    const timeMs = date.getTime();

    // 1. handle invalid date values to prevent "NaN years ago"
    if (isNaN(timeMs)) {
      return '';
    }

    const now = Date.now();
    const elapsedMs = now - timeMs;

    // 2. handle future dates (e.g. due to client/server clock drift)
    if (elapsedMs < 0) {
      return 'just now'; // or 'in the future' if expecting true future dates
    }

    const seconds = Math.floor(elapsedMs / 1000);
    if (seconds < 60) return 'just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}
