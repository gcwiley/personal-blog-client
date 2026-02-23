import { ChangeDetectionStrategy, Component } from '@angular/core';

// shared components
import {
  Navbar,
  Clock,
  Footer,
} from '../../components';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, Clock, Footer],
})
export class AboutPage {}
