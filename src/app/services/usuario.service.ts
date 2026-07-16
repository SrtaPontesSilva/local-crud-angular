import { Injectable } from '@angular/core';

import { Usuario } from '../models/usuario';
import { Paginacao } from '../models/paginacao';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly STORAGE = 'usuarios';

  private usuarios: Usuario[] = [];

  constructor() {
    this.carregarStorage();
  }

  // ==========================
  // STORAGE
  // ==========================

  private carregarStorage(): void {

    const dados = localStorage.getItem(this.STORAGE);

    if (dados) {

      this.usuarios = JSON.parse(dados);

      return;

    }

    this.usuarios = [

      {
        id: 1,
        nome: 'Maria Silva',
        cpf: '12345678900',
        dataNascimento: '15031998',
        email: 'maria@email.com'
      },

      {
        id: 2,
        nome: 'João Souza',
        cpf: '98765432100',
        dataNascimento: '20101995',
        email: 'joao@email.com'
      }

    ];

    this.salvarStorage();

  }

  private salvarStorage(): void {

    localStorage.setItem(
      this.STORAGE,
      JSON.stringify(this.usuarios)
    );

  }

  // ==========================
  // AUXILIARES
  // ==========================

  private gerarNovoId(): number {

    if (this.usuarios.length === 0) {
      return 1;
    }

    return Math.max(
      ...this.usuarios.map(usuario => usuario.id)
    ) + 1;

  }

  private normalizarUsuario(usuario: Usuario): Usuario {

    return {

      ...usuario,

      cpf: usuario.cpf.replace(/\D/g, ''),

      dataNascimento: usuario.dataNascimento.replace(/\D/g, ''),

      nome: usuario.nome.trim(),

      email: usuario.email.trim()

    };

  }

  // ==========================
  // CONSULTAS
  // ==========================

  listar(
    numeroPagina: number,
    tamanhoPagina: number,
    nome: string,
    cpf: string
  ): Paginacao<Usuario> {

    let resultado = [...this.usuarios];

    if (nome.trim()) {

      resultado = resultado.filter(usuario =>
        usuario.nome
          .toLowerCase()
          .includes(nome.toLowerCase())
      );

    }

    if (cpf.trim()) {

      const cpfSemMascara = cpf.replace(/\D/g, '');

      resultado = resultado.filter(usuario =>
        usuario.cpf.includes(cpfSemMascara)
      );

    }

    const totalRegistros = resultado.length;

    const inicio = (numeroPagina - 1) * tamanhoPagina;

    const dados = resultado.slice(
      inicio,
      inicio + tamanhoPagina
    );

    return {

      dados,

      totalRegistros,

      numeroPagina,

      tamanhoPagina

    };

  }

  buscarPorId(id: number): Usuario | undefined {

    const usuario = this.usuarios.find(
      usuario => usuario.id === id
    );

    if (!usuario) {
      return undefined;
    }

    return {

      ...usuario

    };

  }

  // ==========================
  // CRUD
  // ==========================

  salvar(usuario: Usuario): void {

    const novoUsuario = this.normalizarUsuario(usuario);

    const cpfExiste = this.usuarios.some(
      usuario => usuario.cpf === novoUsuario.cpf
    );

    if (cpfExiste) {

      throw new Error('CPF já cadastrado.');

    }

    novoUsuario.id = this.gerarNovoId();

    this.usuarios.push(novoUsuario);

    this.salvarStorage();

  }

  editar(usuarioAtualizado: Usuario): void {

    const indice = this.usuarios.findIndex(
      usuario => usuario.id === usuarioAtualizado.id
    );

    if (indice === -1) {
      return;
    }

    const usuarioExistente = this.usuarios[indice];

    const usuario = this.normalizarUsuario(usuarioAtualizado);

    usuario.id = usuarioExistente.id;

    // CPF permanece sempre o original

    usuario.cpf = usuarioExistente.cpf;

    this.usuarios[indice] = usuario;

    this.salvarStorage();

  }

  excluir(id: number): void {

    this.usuarios = this.usuarios.filter(
      usuario => usuario.id !== id
    );

    this.salvarStorage();

  }

}