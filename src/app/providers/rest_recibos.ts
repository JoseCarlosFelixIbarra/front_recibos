import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../global/global';
import { recibo_model } from '../modelos/recibo_model';

@Injectable({
    providedIn: 'root'
})
export class recibo_service {
    getApiBaseUrl() {
        return API_BASE_URL.url;
    }

    constructor(private http: HttpClient) { }

    obtener_recibos(id_usuario: number): Observable<recibo_model[]> {
        return this.http.get<recibo_model[]>(API_BASE_URL.url+'recibo/get_recibos_por_id_usuario/' + id_usuario);
    }

    modificar_recibo(recibo: recibo_model): Observable<boolean> {
        return this.http.put<boolean>(API_BASE_URL.url+'recibo/update_recibo', recibo);
    }

    agregar_recibo(recibo: recibo_model): Observable<boolean> {
        return this.http.post<boolean>(API_BASE_URL.url+'recibo/insert_recibo', recibo);
    }

    eliminar_recibo(id_recibo: number): Observable<boolean> {
        return this.http.delete<boolean>(API_BASE_URL.url+ 'recibo/delete_recibo/' + id_recibo);
    }

}