import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, of, throwError, map, retry } from 'rxjs';

// environment
import { environment } from '../../environments/environment';

// post interfaces
import { Post, PostInput } from '../types/post.interface';
import {
  ApiResponse,
  PaginatedResponse,
} from '../types/api-response.interface';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly API_URL = `${environment.apiUrl}/posts`;
  private readonly http = inject(HttpClient);

  private readonly DEFAULT_RETRY = { count: 1, delay: 1000 };

  // GET: - GET ALL POSTS
  public getPosts(): Observable<Post[]> {
    return this.http.get<ApiResponse<Post[]>>(this.API_URL).pipe(
      retry(this.DEFAULT_RETRY),
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: - GET POSTS WITH PAGINATION
  public getPostsPaginated(
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Observable<PaginatedResponse<Post>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);

    return this.http
      .get<PaginatedResponse<Post>>(this.API_URL, { params })
      .pipe(
        retry(this.DEFAULT_RETRY),
        catchError((error) => this.handleError(error)),
      );
  }

  // GET: - GET POST BY ID
  public getPostById(id: string): Observable<Post> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<ApiResponse<Post>>(url).pipe(
      retry(this.DEFAULT_RETRY),
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET - SEARCH POSTS
  public searchPosts(term: string): Observable<Post[]> {
    if (!term.trim()) {
      // if no search term, return an empty post array
      return of([]);
    }
    const params = new HttpParams().set('query', term);
    return this.http.get<ApiResponse<Post[]>>(this.API_URL, { params }).pipe(
      retry(this.DEFAULT_RETRY),
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: - GET POST COUNT
  public getPostsCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.API_URL}`).pipe(
      retry(this.DEFAULT_RETRY),
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: GET RECENTLY CREATED POSTS
  public getRecentlyCreatedPosts(): Observable<Post[]> {
    return this.http.get<ApiResponse<Post[]>>(`${this.API_URL}/recent`).pipe(
      retry(this.DEFAULT_RETRY),
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // SAVE METHODS

  // POST: - NEW POST
  public addPost(newPost: PostInput): Observable<Post> {
    return this.http.post<ApiResponse<Post>>(this.API_URL, newPost).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // DELETE: - DELETE POST BY ID
  public deletePostById(id: string): Observable<Post> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<ApiResponse<Post>>(url).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // PATCH: - UPDATE POST BY ID
  public updatePostById(id: string, body: Partial<Post>): Observable<Post> {
    const url = `${this.API_URL}/${id}`;
    return this.http.patch<ApiResponse<Post>>(url, body).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // HANDLE ERROR
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Network error:', error.message);
    } else {
      console.error(`Backend error ${error.status}:`, error.error);
    }
    return throwError(() => error);
  }
}
