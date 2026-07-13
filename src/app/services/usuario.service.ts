import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuarios: Usuario[] = [];

  constructor() {}

  listar(): Usuario[] {
    return this.usuarios;
  }

}