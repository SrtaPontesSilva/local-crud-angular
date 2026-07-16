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

  readonly TAMANHO_PAGINA = 10;

  usuarios: Usuario[] = [];

  filtroNome = '';

  filtroCpf = '';

  numeroPagina = 1;

  tamanhoPagina = this.TAMANHO_PAGINA;

  totalRegistros = 0;

  totalPaginas = 1;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  get primeiraPagina(): boolean {
    return this.numeroPagina <= 1;
  }

  get ultimaPagina(): boolean {
    return this.numeroPagina >= this.totalPaginas;
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

    if (!confirm(
      'Tem certeza que deseja excluir este usuário?\n\nEsta ação não poderá ser desfeita.'
    )) {
      return;
    }

    this.usuarioService.excluir(id);

    if (
      this.usuarios.length === 1 &&
      this.numeroPagina > 1
    ) {

      this.numeroPagina--;

    }

    alert('Usuário excluído com sucesso.');

    this.carregarUsuarios();

  }

  paginaAnterior(): void {

    if (this.primeiraPagina) {
      return;
    }

    this.numeroPagina--;

    this.carregarUsuarios();

  }

  proximaPagina(): void {

    if (this.ultimaPagina) {
      return;
    }

    this.numeroPagina++;

    this.carregarUsuarios();

  }

}