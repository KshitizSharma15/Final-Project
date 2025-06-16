import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../pages/auth/service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {
  }
 private authService = inject(AuthService);
 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   const token = this.authService.getToken();
   if (req.url.startsWith('https://localhost:7272/api/')) {
     const cloned = req.clone({
       setHeaders: {
         Authorization: `Bearer ${token}` //////////////////////// ONLY THIS ///////////////////////////
       }
     });
     return next.handle(cloned);
   }
   return next.handle(req);
 }
}