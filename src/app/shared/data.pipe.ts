// data.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'data',
  standalone: true
})
export class DataPipe implements PipeTransform {

  transform(valor: string | null |undefined): string {

    if (!valor) {
      return '';
    }

    const numeros = valor.replace(/\D/g, '');

    if (numeros.length !== 8) {
      return valor;
    }

    return numeros.replace(
      /(\d{2})(\d{2})(\d{4})/,
      '$1/$2/$3'
    );

  }

}