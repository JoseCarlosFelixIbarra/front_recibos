import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../global/global';
import { usuario_model } from '../modelos/usuario_model';

@Injectable({
    providedIn: 'root'
})
export class usuario_service {
    getApiBaseUrl() {
        return API_BASE_URL.url;
    }

    constructor(private http: HttpClient) { }

    iniciar_sesion(usuario: usuario_model): Observable<usuario_model[]> {
        return this.http.post<usuario_model[]>(API_BASE_URL.url+'usuario/iniciar_sesion', usuario);
    }

    agregar_usuario(usuario: usuario_model): Observable<boolean> {
        return this.http.post<boolean>(API_BASE_URL.url+'usuario/insert_usuario', usuario);
    }

}