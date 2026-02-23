import { Component } from '@angular/core';

// angular material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

// shared components
import {
  Navbar,
  Clock,
  Calendar,
  Hero,
  Footer,
} from '../../components/index';

// post components
import { PostGrid, RecentPosts } from '../../posts';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    Navbar,
    Calendar,
    Clock,
    Footer,
    Hero,
    PostGrid,
    RecentPosts,
  ],
})
export class Homepage {}
