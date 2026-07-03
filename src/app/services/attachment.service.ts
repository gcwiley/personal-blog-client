import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

// rxjs
import { Observable, map, throwError, catchError } from 'rxjs';

// environment
import { environment } from '../../environments/environment';

// interfaces
import { Attachment } from '../types/post.interface';
import { ApiResponse } from '../types/api-response.interface';

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  // Base URL for the API endpoint
  private readonly API_URL = `${environment.apiUrl}/posts`;
  // inject HttpClient for making HTTP requests
  private readonly http = inject(HttpClient);

  // GET: fetch all attachments for a post
  public getAttachmentsByPostId(postId: string): Observable<Attachment[]> {
    return this.http
      .get<ApiResponse<Attachment[]>>(`${this.API_URL}/${postId}/attachments`)
      .pipe(
        map((res) => res.data),
        catchError((error) => this.handleError(error)),
      );
  }

  // POST: upload a new attachment (image file) to a post
  public addAttachment(
    postId: string,
    file: File,
    description = '',
  ): Observable<Attachment> {
    const formData = new FormData();
    // Append the file and description to the FormData object
    formData.append('file', file);
    formData.append('description', description);
    // Send the POST request to upload the attachment
    return this.http
      .post<
        ApiResponse<Attachment>
      >(`${this.API_URL}/${postId}/attachments`, formData)
      .pipe(
        map((res) => res.data),
        catchError((error) => this.handleError(error)),
      );
  }

  // DELETE: remove an attachment by id
  public deleteAttachment(postId: string, id: string): Observable<Attachment> {
    return this.http
      .delete<
        ApiResponse<Attachment>
      >(`${this.API_URL}/${postId}/attachments/${id}`)
      .pipe(
        map((res) => res.data),
        catchError((error) => this.handleError(error)),
      );
  }

  // Centralized error handling for HTTP requests
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Network error:', error.message);
    } else {
      console.error(`Backend error ${error.status}:`, error.error);
    }
    return throwError(() => error);
  }
}
