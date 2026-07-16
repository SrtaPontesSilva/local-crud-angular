// paginacao.ts
export interface Paginacao<T> {
  dados: T[];
  totalRegistros: number;
  numeroPagina: number;
  tamanhoPagina: number;
}