import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: 'padrao' | 'perigo';
}

interface ConfirmState extends ConfirmOptions {
  resolver: (valor: boolean) => void;
}

export interface Toast {
  id: number;
  mensagem: string;
  tipo: 'sucesso' | 'erro';
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  confirmAtual = signal<ConfirmState | null>(null);

  toasts = signal<Toast[]>([]);

  private proximoIdToast = 0;

  /**
   * Substitui o confirm() nativo. Retorna uma Promise resolvida com
   * true/false conforme o botão clicado pelo usuário.
   */
  confirm(opcoes: ConfirmOptions): Promise<boolean> {

    return new Promise(resolver => {

      this.confirmAtual.set({
        ...opcoes,
        resolver
      });

    });

  }

  responderConfirm(valor: boolean): void {

    const estado = this.confirmAtual();

    if (!estado) {
      return;
    }

    estado.resolver(valor);

    this.confirmAtual.set(null);

  }

  /**
   * Substitui o alert() nativo para mensagens de sucesso/erro.
   */
  toast(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso'): void {

    const id = this.proximoIdToast++;

    this.toasts.update(lista => [...lista, { id, mensagem, tipo }]);

    setTimeout(() => this.removerToast(id), 3200);

  }

  removerToast(id: number): void {

    this.toasts.update(lista => lista.filter(toast => toast.id !== id));

  }

}