import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// angular material
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class Contact {
  private readonly dialogRef = inject(MatDialogRef<Contact>);

  public close(): void {
    this.dialogRef.close();
  }
}
