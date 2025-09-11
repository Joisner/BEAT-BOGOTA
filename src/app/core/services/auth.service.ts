import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from '../../env/environment';

// Firebase Auth imports
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential
} from "firebase/auth";

export interface AppUser {
  id: string;
  email: string;
  role: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  environment = environment;
  private app: FirebaseApp;
  private auth: Auth;
  private currentUserSubject: BehaviorSubject<AppUser | null>;
  public currentUser$: Observable<AppUser | null>;

  private readonly USER_STORAGE_KEY = 'currentUser';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.app = initializeApp(environment.firebaseConfig);
    getAnalytics(this.app);
    this.auth = getAuth(this.app);
    
    // Intentar cargar el usuario del localStorage al inicio
    const savedUser = localStorage.getItem(this.USER_STORAGE_KEY);
    const initialUser = savedUser ? JSON.parse(savedUser) : null;
    this.currentUserSubject = new BehaviorSubject<AppUser | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    this.setupAuthStateListener();
  }
  
  private setupAuthStateListener(): void {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        debugger;
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('firebase_token', token);
        await this.verifyUserInBackend(firebaseUser.uid, token);
      } else {
        this.clearUserData();
      }
    });
  }

  async login(email: string, password: string): Promise<AppUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('firebase_token', token);
      return this.verifyUserInBackend(userCredential.user.uid, token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async loginWithGoogle(): Promise<AppUser> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('firebase_token', token);
      return this.verifyUserInBackend(userCredential.user.uid, token);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.clearUserData();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  async refreshToken(): Promise<string | null> {
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        return null;
      }
      const token = await currentUser.getIdToken(true); // Force token refresh
      localStorage.setItem('firebase_token', token);
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('firebase_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private async verifyUserInBackend(uid: string, token: string): Promise<AppUser> {
    try {
      debugger;
      // Get the current Firebase user to access email
      const firebaseUser = this.auth.currentUser;
      if (!firebaseUser?.email) {
        throw new Error('No se pudo obtener la información del usuario de Firebase');
      }

      // Call the verify endpoint with email and firebase UID
      const response = await this.http.get<AppUser>(
        `${environment.userService}/me`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      ).toPromise();

      if (!response) {
        throw new Error('No se pudo verificar el usuario en el backend');
      }

      // Update the current user with the verified user data
      this.currentUserSubject.next(response);
      // Guardar en localStorage
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(response));
      
      // Redirigir según el rol del usuario
      if (response.role === 'admin') {
        this.router.navigate(['/admin/events']);
      } else if (response.role === 'promotor') {
        this.router.navigate(['/promotor']);
      } else if (response.role === 'asistente') {
        this.router.navigate(['/asistente']);
      } else {
        // Redirigir a la página por defecto si no tiene un rol específico
        this.router.navigate(['/events']);
      }
      
      return response;

    } catch (error: any) {
      console.error('Error en la verificación del usuario:', error);
      if (error.status === 404) {
        await this.logout();
        throw new Error('Usuario no registrado. Por favor contacta al administrador.');
      }
      throw error;
    }
  }

  private clearUserData(): void {
    localStorage.removeItem('firebase_token');
    localStorage.removeItem(this.USER_STORAGE_KEY);
    this.currentUserSubject.next(null);
  }
}
