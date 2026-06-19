import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { postTitleResolver } from './resolvers/post-title.resolver';

export const routes: Routes = [
  // home page
  {
    path: '',
    pathMatch: 'full',
    title: 'Home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home-page/home-page').then((m) => m.Homepage),
  },
  // about page
  {
    path: 'about',
    title: 'About',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/about-page/about-page').then((m) => m.AboutPage),
  },
  // profile page
  {
    path: 'profile',
    title: 'My Profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-profile-page/user-profile-page').then((m) => m.UserProfilePage),
  },
  // sign in page
  {
    path: 'signin',
    title: 'Sign In',
    loadComponent: () =>
      import('./pages/signin-page/signin-page').then((m) => m.SignInPage),
  },
  // sign up page
  {
    path: 'signup',
    title: 'Create New Account',
    loadComponent: () =>
      import('./pages/signup-page/signup-page').then((m) => m.SignUpPage),
  },
  // grouped post routes
  {
    path: 'posts',
    canActivate: [authGuard], // protects all children
    children: [
      {
        path: '',
        title: 'Posts',
        loadComponent: () =>
          import('./pages/post-pages/post-display-page/post-display-page').then(
            (m) => m.PostDisplayPage,
          ),
      },
      {
        path: 'create',
        title: 'Create Post',
        canDeactivate: [canDeactivateGuard],
        loadComponent: () =>
          import('./pages/post-pages/post-form-page/post-form-page').then(
            (m) => m.PostFormPage,
          ),
      },
      {
        path: ':id/edit',
        title: 'Edit Post',
        canDeactivate: [canDeactivateGuard],
        loadComponent: () =>
          import('./pages/post-pages/post-form-page/post-form-page').then(
            (m) => m.PostFormPage,
          ),
      },
      {
        path: ':id',
        title: postTitleResolver,
        loadComponent: () =>
          import('./pages/post-pages/post-details-page/post-details-page').then(
            (m) => m.PostDetailsPage,
          ),
      },
    ],
  },
  // error page
  {
    path: 'error',
    title: 'Error',
    loadComponent: () =>
      import('./pages/error-page/error-page').then((m) => m.ErrorPage),
  },
  // page not found
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then(
        (m) => m.NotFoundPage,
      ),
  },
];
