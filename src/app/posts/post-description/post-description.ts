import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { DatePipe } from '@angular/common';

// material components
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

// speech service
import { SpeechService } from '../../services/speech.service';

// post interface
import { Post } from '../../types/post.interface';
import { stripHtml } from '../../utils/html.utils';

@Component({
  selector: 'app-post-description',
  templateUrl: './post-description.html',
  styleUrl: './post-description.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class PostDescription {
  public readonly post = input.required<Post>();
  public readonly speechService = inject(SpeechService);

  public stripHtml = stripHtml;
}
