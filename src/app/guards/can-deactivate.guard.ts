import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
  hasUnsavedChanges?: () => boolean; // ✅ optional — skip dialog if no changes
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
) => {
  // ✅ if no unsaved changes, allow navigation immediately
  if (component.hasUnsavedChanges && !component.hasUnsavedChanges()) {
    return true;
  }

  if (component.canDeactivate) {
    return component.canDeactivate();
  }

  // ✅ show confirmation dialog as fallback
  const dialog = inject(MatDialog);
  return dialog
    .open(ConfirmDialog, {
      data: {
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to leave?',
        confirmLabel: 'Leave',
        cancelLabel: 'Stay',
      },
    })
    .afterClosed()
    .pipe(map((confirmed) => confirmed ?? false));
};
