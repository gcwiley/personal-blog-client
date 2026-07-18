import { Pipe, PipeTransform } from '@angular/core';
import { toPoint } from 'mgrs';

@Pipe({
  name: 'mgrsToLatLng',
  standalone: true,
  pure: true,
})
export class MgrsToLatLngPipe implements PipeTransform {
  /**
   * Converts an MGRS coordinate string to a formatted lat/lng string.
   *
   * @param value  MGRS string (e.g. "33TWN8827272737")
   * @param decimals  Number of decimal places (default: 4)
   * @returns Formatted string like "40.7128° N, 74.0060° W", or '' on invalid input
   */
  transform(value: string | null | undefined, decimals = 4): string {
    if (!value?.trim()) return '';

    try {
      const [lng, lat] = toPoint(value.trim());

      const latDir = lat >= 0 ? 'N' : 'S';
      const lngDir = lng >= 0 ? 'E' : 'W';

      const latStr = Math.abs(lat).toFixed(decimals);
      const lngStr = Math.abs(lng).toFixed(decimals);

      return `${latStr}° ${latDir}, ${lngStr}° ${lngDir}`;
    } catch {
      return '';
    }
  }
}
