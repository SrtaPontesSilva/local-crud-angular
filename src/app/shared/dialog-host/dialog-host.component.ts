import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-dialog-host',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-host.component.html',
  styleUrl: './dialog-host.component.css'
})
export class DialogHostComponent {

  dialogService = inject(DialogService);

}