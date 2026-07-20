import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { signal } from '@angular/core';

const users = [
  { id: 1, firstName: 'Manoj', lastName: 'Kumar', username: 'manoj', password: 'manoj', countries: ['ES'] },
  { id: 2, firstName: 'Joao', lastName: 'Valentim', username: 'joaov', password: 'joaov', countries: [] }
];

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

  private cookieService = inject(CookieService);
  authenticated = signal(false);
  currentUser = signal<any>(null);


  constructor() {
    this.authenticated.set(this.isAuthenticated());

    const user = localStorage.getItem('currentUser');

    if (user) {
      this.currentUser.set(JSON.parse(user));
    }

  }

  login(body: any) {
    return this.authenticate(body).pipe(map(user => {
      const userData = user.body;

      this.cookieService.set('token', 'loggedin', new Date(new Date().setFullYear(new Date().getFullYear() + 1)), '/');
      localStorage.setItem('currentUser', JSON.stringify(userData));
      this.currentUser.set(userData);
      this.authenticated.set(true);

      return user;
    }));
  }

  authenticate(body: any) {
    const { username, password } = body;
    const user = users.find(x => x.username === username && x.password === password);
    if (!user) {
      return this.error('Username or password is incorrect');
    }
    return this.success({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      countries: user.countries
    });
  }

  // success code and body
  success(body: any) {
    return of(new HttpResponse({ status: 200, body }));
  }

  // for error handling
  error(error: any) {
    return throwError({ error: { error } });
  }

  // clear cookie during logout
  logout() {
    this.cookieService.delete('token');
    localStorage.removeItem('currentUser');
    this.authenticated.set(false);
    this.currentUser.set(null);
    return this.success('Logged out successfully');
  }


  

  // default login check if cookie is present already
  public isAuthenticated(): boolean {
    const value = this.cookieService.get('token');
    if (value) {
      return true;
    }
    return false;
  }

}