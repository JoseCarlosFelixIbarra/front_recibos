import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { loginComponent } from './componentes/login/login.component';
import { reciboComponent } from './componentes/recibos/recibo.component';

const routes: Routes = [  
    { path: '', component: loginComponent, },
    { path: 'login', component: loginComponent, },
    { path: 'recibo', component: reciboComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }