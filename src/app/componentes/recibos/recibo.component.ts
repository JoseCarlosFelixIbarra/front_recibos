import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { recibo_model } from 'src/app/modelos/recibo_model';
import { usuario_model } from 'src/app/modelos/usuario_model';
import { recibo_service } from 'src/app/providers/rest_recibos';
import Swal from 'sweetalert2'

@Component({
    selector: 'recibo',
    templateUrl: './recibo.component.html',
    styleUrls: ['./recibo.component.css']
})
export class reciboComponent {
    obj_usuario: usuario_model = new usuario_model();
    obj_recibo: recibo_model = new recibo_model();
    title = 'AXOSNET';

    lista_recibos: Array<recibo_model> = new Array<recibo_model>();
    modo_vista: boolean = false;
    modo_agregar: boolean = false;
    panel_recibo: boolean = false;

    lista_tipo_monedas = [
        {
            "clave":"USD",
            "nombre": "Dólar americano"
        },
        {
            "clave":"EUR",
            "nombre": "Euro"
        },
        {
            "clave":"GBP",
            "nombre": "Libra esterlina"
        },
        {
            "clave":"MXN",
            "nombre": "Peso mexicano"
        }
    ]
    constructor(
        private router: Router ,
        private rest_recibo_service: recibo_service
        
        ) {

    }
    ngOnInit() {
        let usuario_actual =  JSON.parse(localStorage.getItem('current_user') || '{}'); 
        if(usuario_actual.nombre_usuario == undefined){
            localStorage.clear();
            this.router.navigate(['/login']);
        }else{
            this.obj_usuario.nombre_usuario = usuario_actual.nombre_usuario;
            this.obj_usuario.apellido_usuario = usuario_actual.apellido_usuario
            this.obj_usuario.id = usuario_actual.id;
            this.obj_usuario.correo_usuario = usuario_actual.correo_usuario;
            this.obtener_recibos();
        } 
    }

    cerrar_sesion() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    limpiar() {
        this.modo_agregar = false;
        this.panel_recibo = false;
        this.modo_vista = false;
        this.obj_recibo = new recibo_model();
    }

    abrir_panel_recibo() {
        this.obj_recibo = new recibo_model();
        this.panel_recibo = true;
    }
    abrir_panel_recibo_ver(obj_recibo: recibo_model) {
        this.obj_recibo = obj_recibo;
        this.panel_recibo = true;
        this.modo_vista = true;
    }
    abrir_panel_recibo_edicion(obj_recibo: recibo_model) { 
        this.obj_recibo = obj_recibo;
        this.panel_recibo = true;
    }

    formatear_recibo_mostrar(obj_recibo: recibo_model){
        obj_recibo.monto_recibo = this.formato_moneda(''+obj_recibo.monto_recibo);
        obj_recibo.fecha_recibo = this.formatear_fecha(obj_recibo.fecha_recibo);
        return obj_recibo;
    }

    formatear_fecha(fecha_normal: string){
        let fecha_formateada: string = fecha_normal.split('T')[0];
        return fecha_formateada;
    }

    formato_moneda(data: string) {
        let partes1 = data.split('.');
        let val = '';
        if (partes1[0].split('')[0] == '0') {
            partes1[0] = ''
        }
        if (partes1.length > 1) { 
            val = partes1[0].replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",") + '.' + partes1[1];
        } else { 
            val = partes1[0].replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
        } 
        return '$' + val;
    }

    formatear_monto_recibos() {
        for (let i = 0; i < this.lista_recibos.length; i++) {
            this.lista_recibos[i].monto_recibo = this.formato_moneda(this.lista_recibos[i].monto_recibo);
        }
    }

    datos_correctos_recibo() {
        let correcto: boolean = true;
        let dato_faltante: string = '';
        if (this.obj_recibo.proveedor_recibo === '' || this.obj_recibo.proveedor_recibo === null) {
            dato_faltante = "Proveedor";
            correcto = false;
        } else if (this.obj_recibo.monto_recibo === '' || this.obj_recibo.monto_recibo === '$') {
            dato_faltante = "Monto";
            correcto = false;
        } else if (this.obj_recibo.moneda_recibo === '' || this.obj_recibo.moneda_recibo === null) {
            dato_faltante = "Moneda";
            correcto = false;
        } else if (this.obj_recibo.fecha_recibo === '' || this.obj_recibo.fecha_recibo === null) {
            dato_faltante = "Fecha";
            correcto = false;
        } else if (this.obj_recibo.comentario_recibo === '' || this.obj_recibo.comentario_recibo === null) {
            dato_faltante = "Comentarios";
            correcto = false;
        }

        if (!correcto) {
            Swal.fire({
                icon: 'info',
                title: 'Datos incompletos',
                text: 'Debe llenar el campo "' + dato_faltante + '"'
            })
        }
        return correcto;
    }
    formatear_datos_recibo(){
        this.obj_recibo.id_usuario = this.obj_usuario.id;
        this.obj_recibo.monto_recibo = +this.obj_recibo.monto_recibo.replace('$', '').replace(/,/g, '');
    }
    guardar_recibo() {
        if (this.datos_correctos_recibo()) {
                this.formatear_datos_recibo(); 
                this.insertar_recibo();
                this.limpiar();
        }
    }
    editar_recibo() {
        if (this.datos_correctos_recibo()) {
            if (true) {
                this.formatear_datos_recibo(); 
                this.modificar_recibo();
                this.limpiar();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Algo salió mal',
                    text: 'Vuelve a intentarlo.'
                })
            }
        }
    }
    validar_eliminar_recibo(id_recibo: number) {
        Swal.fire({
            title: 'Eliminar recibo',
            text: "¿Estas seguro que deseas eliminar el recibo? Esto podría ser irreversible",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText:'Cancelar',
            confirmButtonText: 'Sí'
        }).then((result) => {
            if (result.isConfirmed) {
                this.eliminar_recibo(id_recibo);
                Swal.fire(
                    'Eliminado!',
                    'Se elimino correctamente.',
                    'success'
                )
            }
        })
    }

    obtener_recibos() {
        this.rest_recibo_service.obtener_recibos(this.obj_usuario.id).subscribe(success => {  
            this.lista_recibos = success;
            this.lista_recibos.forEach(recibo => {
                recibo = this.formatear_recibo_mostrar(recibo);
            });
        }, error => {  
            Swal.fire(
                'Algo salió',
                'Error al obtener los recibos, intentalo de nuevo, error: '+error.message,
                'error'
            )
        })
    }
    insertar_recibo() {
        this.rest_recibo_service.agregar_recibo(this.obj_recibo).subscribe(success => {
            this.limpiar();
            Swal.fire(
                'Agregado correctamente',
                'Se guardaron los cambios correctamente.',
                'success'
            )
            this.obtener_recibos();
        }, error => { 
            console.log(error)
            Swal.fire(
                'Algo salió',
                'Error al insertar el recibo. Intentalo de nuevo, error: '+error.message,
                'error'
            )
        })
    }

    modificar_recibo() {
        this.rest_recibo_service.modificar_recibo(this.obj_recibo).subscribe(success => {
            this.limpiar();
            Swal.fire(
                'Editado correctamente',
                'Se guardaron los cambios correctamente.',
                'success'
            )
            this.obtener_recibos();
        }, error => { 
            console.log(error)
            Swal.fire(
                'Algo salió',
                'Error al editar el recibo. Intentalo de nuevo, error: '+error.message,
                'error'
            )
        })
    }
    eliminar_recibo(id_recibo: number){
        this.rest_recibo_service.eliminar_recibo(id_recibo).subscribe(success => {
            this.limpiar();
            Swal.fire(
                'Eliminado correctamente',
                'Se guardaron los cambios correctamente.',
                'success'
            )
            this.obtener_recibos();
        }, error => { 
            console.log(error)
            Swal.fire(
                'Algo salió',
                'Error al eliminar el recibo. Intentalo de nuevo, error: '+error.message,
                'error'
            )
        })
    }

}