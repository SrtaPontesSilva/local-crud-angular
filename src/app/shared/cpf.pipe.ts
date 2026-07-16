// cpf.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpf',
  standalone: true
})
export class CpfPipe implements PipeTransform {

  transform(valor: string | null | undefined): string {

    if (!valor) {
      return '';
    }

    const numeros = valor.replace(/\D/g, '');

    if (numeros.length !== 11) {
      return valor;
    }

    return numeros.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );

  }

}