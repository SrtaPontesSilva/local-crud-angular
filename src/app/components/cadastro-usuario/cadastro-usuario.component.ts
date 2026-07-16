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
    private route: ActivatedRoute
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

      } else {

        this.usuarioService.salvar(usuario);

      }

      this.router.navigate(['/usuarios']);

    } catch (erro) {

      if (erro instanceof Error) {

        alert(erro.message);

      }

    }

  }

  cancelar(): void {

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

}