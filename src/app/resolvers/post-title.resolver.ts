import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { map, of, catchError } from 'rxjs';

// import post service
import { PostService } from '../services/post.service';

export const postTitleResolver: ResolveFn<string> = (route) => {
  const postService = inject(PostService);
  const id = route.paramMap.get('id');

  if (!id) {
    return of('Post Details');
  }

  // assumes getPost returns an observable with a 'title' property
  return postService.getPostById(id).pipe(
    map((post) => (post ? `${post.title} | Portfolio` : 'Post Details')),
    // fallback in case of error
    catchError(() => of('Post Details')),
  );
};
