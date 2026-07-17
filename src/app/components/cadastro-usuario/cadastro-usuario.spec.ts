import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { CadastroUsuarioComponent } from './cadastro-usuario.component';

describe('CadastroUsuario', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroUsuarioComponent],
      providers: [
        provideRouter([]),
        provideEnvironmentNgxMask({
          dropSpecialCharacters: false
        })
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CadastroUsuarioComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});