import { Injectable, inject } from '@angular/core';
import { Observable, catchError, from, throwError, map } from 'rxjs';

// firebase auth
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  UserCredential,
  signInAnonymously,
  user,
  User,
  updatePassword,
  sendPasswordResetEmail,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);

  // observable for the current user (emits User object or null)
  public readonly user$: Observable<User | null> = user(this.auth);

  // observable for the authentication status (emits true if logged in, false otherwise)
  public readonly isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map((user) => !!user)
  );

  // CREATE NEW USER
  public createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(catchError((error) => this.handleError(error)));
  }

  // SIGN IN WITH EMAIL AND PASSWORD
  public signInWithEmailAndPassword(
    email: string,
    password: string
  ): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // SIGN IN WITH GOOGLE
  public signInWithGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // SIGN IN ANONYMOUSLY
  public signInAnonymously(): Observable<UserCredential> {
    return from(signInAnonymously(this.auth)).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // SIGN OUT USER
  public signOutUser(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // RESET PASSWORD
  public sendPasswordResetEmail(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // CHANGE USER PASSWORD
  public changeUserPassword(newPassword: string): Observable<void> {
    // get the current user
    const currentUser = this.auth.currentUser;

    if (currentUser) {
      // use the updatePassword function with the current user and new password
      return from(updatePassword(currentUser, newPassword)).pipe(
        catchError(this.handleError) // handle error
      );
    } else {
      // if there's no current user, throw an error
      return throwError(() => new Error('No user is currently logged in.'));
    }
  }

  // HANDLE ERROR
  private handleError(error: Error): Observable<never> {
    console.error('There was an error', error);
    return throwError(() => error);
  }
}
