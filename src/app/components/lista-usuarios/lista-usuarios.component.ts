import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { DialogService } from '../../shared/dialog-host/dialog.service';

import { CpfPipe } from '../../shared/cpf.pipe';
import { DataPipe } from '../../shared/data.pipe';

const CORES_AVATAR = [
  '#2D3A6B',
  '#0F9B8E',
  '#6C63B5',
  '#3E7CB1',
  '#C98A2C',
  '#B15A9A'
];

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

  // Ordenação: null mantém a ordem de cadastro (mais previsível para
  // paginação, já que não exibimos um id na tela). Ao clicar em uma
  // coluna, passa a ordenar por ela; clicar de novo inverte a direção.
  ordenarPor: 'nome' | 'cpf' | 'dataNascimento' | 'email' | null = null;

  ordenarDirecao: 'asc' | 'desc' = 'asc';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private dialogService: DialogService
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
      this.filtroCpf,
      this.ordenarPor,
      this.ordenarDirecao
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

  ordenarPorColuna(campo: 'nome' | 'cpf' | 'dataNascimento' | 'email'): void {

    if (this.ordenarPor === campo) {

      this.ordenarDirecao = this.ordenarDirecao === 'asc' ? 'desc' : 'asc';

    } else {

      this.ordenarPor = campo;

      this.ordenarDirecao = 'asc';

    }

    this.numeroPagina = 1;

    this.carregarUsuarios();

  }

  editar(id: number): void {

    this.router.navigate([
      '/usuarios/editar',
      id
    ]);

  }

  async excluir(id: number): Promise<void> {

    const confirmado = await this.dialogService.confirm({
      titulo: 'Excluir usuário',
      mensagem: 'Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita.',
      textoConfirmar: 'Excluir',
      variante: 'perigo'
    });

    if (!confirmado) {
      return;
    }

    this.usuarioService.excluir(id);

    if (
      this.usuarios.length === 1 &&
      this.numeroPagina > 1
    ) {

      this.numeroPagina--;

    }

    this.dialogService.toast('Usuário excluído com sucesso.');

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

  // ==========================
  // AUXILIARES DE EXIBIÇÃO (avatar do usuário)
  // ==========================

  getIniciais(nome: string | null | undefined): string {

    if (!nome || !nome.trim()) {
      return '?';
    }

    const partes = nome.trim().split(/\s+/);

    const primeira = partes[0]?.[0] ?? '';
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';

    return (primeira + ultima).toUpperCase();

  }

  getCorAvatar(nome: string | null | undefined): string {

    if (!nome || !nome.trim()) {
      return CORES_AVATAR[0];
    }

    const soma = nome
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return CORES_AVATAR[soma % CORES_AVATAR.length];

  }

}