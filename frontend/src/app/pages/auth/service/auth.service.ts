import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, take, map } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { Store } from '@ngrx/store';
import { loginSucess, logout } from '../../../core/store/auth/auth.actions';
import { AuthState } from '../../../core/store/auth/auth.state';
import { selectAuthState } from '../../../core/store/auth/auth.selector';
import { Router } from '@angular/router';

// Interface for the login request payload
interface AuthRequest {
  email: string;
  password: string;
}

// Interface describing the expected structure of your decoded JWT payload
// Adjust this based on the actual claims included in your token by the backend
interface DecodedToken {
  exp?: number; // Expiration time (Unix timestamp)
  iat?: number; // Issued at time (Unix timestamp)
  nbf?: number; // Not before time (Unix timestamp)

  // Claims added by your backend (match case and name exactly)
  // Based on your Authentication.cs using ClaimTypes.Email and ClaimTypes.Role:
  // Use the actual claim name present in the token. Inspect a real token if unsure.
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string; // Often the long name for ClaimTypes.Email
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string; // Often the long name for ClaimTypes.Role
  email?: string; // Sometimes short names like 'email' are used instead
  role?: string; // Sometimes short names like 'role' are used instead
  employeeId?: string;

  // Allow other potential claims
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL for the authentication endpoint in your backend
  private authApiUrl = 'https://localhost:7272/api/Employee/authentication'; // Your login endpoint
 

  // Public observable for components to subscribe to login status changes
  isLoggedIn$ !: Observable<boolean>;
  authState$ !: Observable<AuthState>;

  constructor(private http: HttpClient, private readonly store: Store, private router: Router) {
    // Check initial login status when the service is first reate
    this.isLoggedIn$ = this.store.select(selectAuthState).pipe(
      take(1),
      map((authState: AuthState) => !!authState.authToken) // Ensure a boolean is always returned
    );
  }

  /**
   * Attempts to log in the user.
   * @param credentials Email and password object.
   * @returns Observable containing the JWT token string on success.
   */
  login(credentials: AuthRequest): Observable<string> {
    // Note: Using { responseType: 'text' as 'json' } because the backend
    // returns the token string directly in the body, not wrapped in a JSON object.
    return this.http
      .post<string>(this.authApiUrl, credentials, {
        responseType: 'text' as 'json',
      })
      .pipe(
        // Use 'tap' operator to perform side effects (storing token, updating status)
        tap((authToken) => {
          if (authToken) {
            this.store.dispatch(loginSucess({authToken})) // Store the token on successful login
            this.navigateToUserDashboard()
          } 
        })
      );
  }

  navigateToUserDashboard() {
    const role = this.getUserRole();
    if (role === 'Manager') {
      this.router.navigate(['/pages/managers']);
    } else if (role === 'Employee') {
      this.router.navigate(['/pages/employees']);
    } else {
      // Handle cases where the role is not recognized or the user is not logged in
      this.router.navigate(['/auth/login']); // Or a default unauthorized page
    }
  }

  /**
   * Logs the user out by removing the token and updating status.
   */
  logout(): void {
    this.store.dispatch(logout())
    this.router.navigate(['/auth/login'])
    console.log('User logged out.');
  }

  /**
   * Retrieves the JWT token from sessionStorage.
   * @returns The token string or null if not found.
   */
  getToken(): string | null {
    let token: string | null = null;
    this.store.select(selectAuthState).pipe(
      take(1),
      map((authState: AuthState) => authState.authToken)
    ).subscribe((authToken) => {
      token = authToken;
    });
    return token;
  }
  /**
   * Checks if a user is currently considered logged in based on token presence.
   * Note: This is a basic check and doesn't validate token expiry/signature here.
   * @returns True if a token exists, false otherwise.
   */



  // --- Methods using jwt-decode ---

  /**
   * Decodes the stored JWT token using the jwt-decode library.
   * Run 'npm install jwt-decode' first.
   * @returns The decoded token payload object (matching DecodedToken interface) or null.
   */
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try 
      {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded;
      } 
      catch (error) 
      {
        return null;
      }
    }
    return null;
  }
  /**
   * Gets the user's role from the decoded JWT token.
   * Run 'npm install jwt-decode' first.
   * @returns The role string (e.g., 'Manager', 'Employee') or null.
   */
  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    const longRoleClaim =
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const shortRoleClaim = 'role';

    // Provide a fallback for undefined values
    return decoded
      ? decoded[longRoleClaim] || decoded[shortRoleClaim] || null
      : null;
  }
  /**
   * Gets the user's name from the decoded JWT token.
   * @returns The name string or null if not found.
   */
  getUserName(): string | null {
    const decoded = this.getDecodedToken();
    if (decoded && typeof decoded['unique_name'] === 'string') {
      return decoded['unique_name'];
    }
    return null;
  }
  /**
   * Gets the user's email from the decoded JWT token.
   * Run 'npm install jwt-decode' first.
   * @returns The email string or null.
   */
  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    const longEmailClaim =
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
    const shortEmailClaim = 'email';

    // Provide a fallback for undefined values
    return decoded
      ? decoded[longEmailClaim] || decoded[shortEmailClaim] || null
      : null;
  }
  getUserEmployeeId(): number | null {
    const decoded = this.getDecodedToken();
    const empIdString = decoded ? decoded['employeeId'] : null; // Use the claim name you added
 
    if (empIdString) {
        const empId = parseInt(empIdString, 10); // Convert string claim to number
        return isNaN(empId) ? null : empId; // Return number or null if conversion failed
    }
    return null;
 }
}