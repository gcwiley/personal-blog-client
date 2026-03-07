import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

// angular material
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatButtonModule],
})
export class Hero {
  public readonly title = input<string>('My Blog');
  public readonly subtitle = input<string>('My opinions and thoughts');
}
