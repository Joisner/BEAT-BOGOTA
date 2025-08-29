import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { environment } from '../../env/environment';

// Importa los módulos de autenticación de Firebase
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  environment = environment;
  private app: FirebaseApp;
  private auth: Auth;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    getAnalytics(this.app);
    this.auth = getAuth(this.app);
  }

  // Método para loguear con email y contraseña
  login(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => userCredential.user);
  }

  // Método para cerrar sesión
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Método para obtener el usuario autenticado actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Método para escuchar cambios de autenticación
  onAuthStateChanged(callback: (user: User | null) => void): void {
    onAuthStateChanged(this.auth, callback);
  }

  // Método para loguear con Google (ventana emergente)
  loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then((userCredential) => userCredential.user);
  }
}
