import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { usuario_model } from 'src/app/modelos/usuario_model';
import { usuario_service } from 'src/app/providers/rest_usuarios';
import Swal from 'sweetalert2'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class loginComponent {
    title = 'AXOSNET';
    obj_usuario: usuario_model = new usuario_model();
    es_inicio_sesion: boolean = true;

    constructor(
        private router: Router,
        private rest_usuario_service: usuario_service) {

    }
    ngOnInit() {

    }

    datos_correctos_registro() {
        let correcto: boolean = true;
        let dato_faltante: string = '';
        let expemail = new RegExp('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}');

        if (this.obj_usuario.nombre_usuario === '' || this.obj_usuario.nombre_usuario === null) {
            dato_faltante = "Nombre(s)";
            correcto = false;
        } else if (this.obj_usuario.apellido_usuario === '' || this.obj_usuario.apellido_usuario === null) {
            dato_faltante = "Apellidos";
            correcto = false;
        } else if (this.obj_usuario.correo_usuario === '' || this.obj_usuario.correo_usuario === null) {
            dato_faltante = "Correo electrónico";
            correcto = false;
        } else if (this.obj_usuario.contrasenia_usuario === '' || this.obj_usuario.contrasenia_usuario === null) {
            dato_faltante = "Contraseña";
            correcto = false;
        } 
        if (!correcto) {
            Swal.fire({
                icon: 'info',
                title: 'Datos incompletos',
                text: 'Debe llenar el campo "' + dato_faltante + '"'
            })
        }else if(!expemail.test(this.obj_usuario.correo_usuario)){
            correcto = false;
            Swal.fire({
                icon: 'info',
                title: 'Correo incorrecto',
                text: 'El correo debe cumplir con la estructura adecuada.'
            })
        }
        return correcto;
    } 
    registrarse() {
        if (this.datos_correctos_registro()) {
            this.crear_usuario();

        }
    }
    crear_usuario() {
        this.rest_usuario_service.agregar_usuario(this.obj_usuario).subscribe(success => {
            this.limpiar();
            Swal.fire(
                'Creado correctamente',
                'Se guardaron los cambios correctamente.',
                'success'
            )
        }, error => {
            console.log(error)
            Swal.fire(
                'Algo salió',
                'Error al crear el usuario. Intentalo de nuevo, error: ' + error.message,
                'error'
            )
        })
    }

    iniciar_sesion() {
        this.iniciar_sesion_servicio();
    }

    limpiar() {
        this.es_inicio_sesion = !this.es_inicio_sesion;
        this.obj_usuario = new usuario_model();
    }

    iniciar_sesion_servicio() {
        this.obj_usuario.apellido_usuario = 'apellido';
        this.obj_usuario.nombre_usuario = 'nombre';
        this.rest_usuario_service.iniciar_sesion(this.obj_usuario).subscribe(success => {
            if (success) {
                localStorage.setItem('current_user', JSON.stringify(success));
                this.router.navigate(['/recibo']);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Datos erroneos',
                    text: 'El usuario y la contraseña no coinciden.'
                })
            }
        }, error => {
            console.log(error)
            Swal.fire(
                'Algo salió',
                'intentalo de nuevo, error: ' + error,
                'error'
            )
        })
    }
}