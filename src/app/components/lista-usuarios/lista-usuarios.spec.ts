import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { ListaUsuariosComponent } from './lista-usuarios.component';

describe('ListaUsuarios', () => {

  let component: ListaUsuariosComponent;
  let fixture: ComponentFixture<ListaUsuariosComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      imports: [ListaUsuariosComponent],

      providers: [
        provideRouter([]),
        provideEnvironmentNgxMask({
          dropSpecialCharacters: false
        })
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(ListaUsuariosComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});