import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxMaskDirective } from 'ngx-mask';

import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { DialogService } from '../../shared/dialog-host/dialog.service';

const CORES_AVATAR = [
  '#2D3A6B',
  '#0F9B8E',
  '#6C63B5',
  '#3E7CB1',
  '#C98A2C',
  '#B15A9A'
];

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent implements OnInit {

  formulario: FormGroup;

  modoEdicao = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {

    this.formulario = this.fb.group({

      id: [0],

      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
        ]
      ],

      dataNascimento: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]

    });

  }

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      return;
    }

    const usuario = this.usuarioService.buscarPorId(id);

    if (!usuario) {
      return;
    }

    this.modoEdicao = true;

    const usuarioFormatado: Usuario = {

      ...usuario,

      cpf: usuario.cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      ),

      dataNascimento: usuario.dataNascimento.replace(
        /(\d{2})(\d{2})(\d{4})/,
        '$1/$2/$3'
      )

    };

    this.formulario.patchValue(usuarioFormatado);

  }

  salvar(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      return;

    }

    const usuario = this.formulario.getRawValue() as Usuario;

    try {

      if (this.modoEdicao) {

        this.usuarioService.editar(usuario);

        this.dialogService.toast('Usuário atualizado com sucesso.');

      } else {

        this.usuarioService.salvar(usuario);

        this.dialogService.toast('Usuário cadastrado com sucesso.');

      }

      this.router.navigate(['/usuarios']);

    } catch (erro) {

      if (erro instanceof Error) {

        this.dialogService.toast(erro.message, 'erro');

      }

    }

  }

  async cancelar(): Promise<void> {

    if (this.formulario.dirty) {

      const confirmado = await this.dialogService.confirm({
        titulo: 'Descartar alterações?',
        mensagem: 'Os dados preenchidos ainda não foram salvos e serão perdidos.',
        textoConfirmar: 'Descartar',
        variante: 'perigo'
      });

      if (!confirmado) {
        return;
      }

    }

    this.router.navigate(['/usuarios']);

  }

  campoInvalido(nomeCampo: string): boolean {

    const campo = this.formulario.get(nomeCampo);

    return !!(
      campo &&
      campo.invalid &&
      campo.touched
    );

  }

  // ==========================
  // AUXILIARES DE EXIBIÇÃO (prévia da credencial)
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