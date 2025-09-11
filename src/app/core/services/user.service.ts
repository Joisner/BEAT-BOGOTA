import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { BearerService } from './bearer.service';

export interface User {
    id?: string;
    email: string;
    role: 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    environment = environment;

    constructor(private http: HttpClient, private bearerService: BearerService) { }

    /**
     * Crea un nuevo usuario (solo para administradores)
     * @param userData Datos del usuario a crear
     */
    createUser(userData: { email: string; role: 'ADMIN' | 'PROMOTOR' | 'ASSISTANT' }): Observable<User> {
        return this.http.post<User>(this.environment.userService, userData, this.bearerService.bearerToken);
    }

    /**
     * Obtiene todos los usuarios (solo para administradores)
     */
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.environment.userService, this.bearerService.bearerToken);
    }
}
