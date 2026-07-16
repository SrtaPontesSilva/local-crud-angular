// app.routes.ts
import { Routes } from '@angular/router';

import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'usuarios',
    pathMatch: 'full'
  },

  {
    path: 'usuarios',
    component: ListaUsuariosComponent
  },

  {
    path: 'usuarios/novo',
    component: CadastroUsuarioComponent
  },

  {
    path: 'usuarios/editar/:id',
    component: CadastroUsuarioComponent
  },

  {
    path: '**',
    redirectTo: 'usuarios'
  }

];