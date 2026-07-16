import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';

import { CpfPipe } from '../../shared/cpf.pipe';
import { DataPipe } from '../../shared/data.pipe';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CpfPipe,
    DataPipe,
    NgxMaskDirective
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  filtroNome = '';

  filtroCpf = '';

  numeroPagina = 1;

  tamanhoPagina = 10;

  totalRegistros = 0;

  totalPaginas = 1;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {

    const resposta = this.usuarioService.listar(
      this.numeroPagina,
      this.tamanhoPagina,
      this.filtroNome,
      this.filtroCpf
    );

    this.usuarios = resposta.dados;

    this.totalRegistros = resposta.totalRegistros;

    this.totalPaginas = Math.max(
      1,
      Math.ceil(this.totalRegistros / this.tamanhoPagina)
    );

    if (this.numeroPagina > this.totalPaginas) {

      this.numeroPagina = this.totalPaginas;

      this.carregarUsuarios();

    }

  }

  pesquisar(): void {

    this.numeroPagina = 1;

    this.carregarUsuarios();

  }

  editar(id: number): void {

    this.router.navigate([
      '/usuarios/editar',
      id
    ]);

  }

  excluir(id: number): void {

    const confirmar = confirm(
      'Deseja realmente excluir este usuário?'
    );

    if (!confirmar) {
      return;
    }

    this.usuarioService.excluir(id);

    this.carregarUsuarios();

  }

  paginaAnterior(): void {

    if (this.numeroPagina === 1) {
      return;
    }

    this.numeroPagina--;

    this.carregarUsuarios();

  }

  proximaPagina(): void {

    if (this.numeroPagina >= this.totalPaginas) {
      return;
    }

    this.numeroPagina++;

    this.carregarUsuarios();

  }

}