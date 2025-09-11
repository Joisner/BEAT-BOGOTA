import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { BearerService } from './bearer.service';
import { UserAuth } from '../models/users.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    environment = environment;

    constructor(private http: HttpClient, private bearerService: BearerService) { }

    /**
     * Crea un nuevo usuario (solo para administradores)
     * @param userData Datos del usuario a crear
     */
    createUser(userData: { name: string; lastname: string; email: string; role: 'ADMIN' | 'PROMOTER' | 'ASSISTANT' }): Observable<UserAuth> {
        return this.http.post<UserAuth>(this.environment.userService, userData, this.bearerService.bearerToken);
    }

    /**
     * Obtiene todos los usuarios (solo para administradores)
     */
    getUsers(): Observable<UserAuth[]> {
        return this.http.get<UserAuth[]>(this.environment.userService, this.bearerService.bearerToken);
    }

    /**
     * Obtiene un usuario por su ID
     * @param id ID del usuario a obtener
     */
    getUserById(id: string): Observable<UserAuth> {
        return this.http.get<UserAuth>(`${this.environment.userService}/${id}`, this.bearerService.bearerToken);
    }

    /**
     * Actualiza un usuario existente
     * @param id ID del usuario a actualizar
     * @param userData Datos actualizados del usuario
     */
    updateUser(id: string, userData: Partial<UserAuth>): Observable<UserAuth> {
        return this.http.put<UserAuth>(`${this.environment.userService}/${id}`, userData, this.bearerService.bearerToken);
    }

    /**
     * Elimina un usuario
     * @param id ID del usuario a eliminar
     */
    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.environment.userService}/${id}`, this.bearerService.bearerToken);
    }
}
