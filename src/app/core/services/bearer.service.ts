import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BearerService {
    constructor(private http: HttpClient) { }

    public get bearerToken(): { headers: HttpHeaders } {
        const token = localStorage.getItem('firebase_token');
        return {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };
    }
}