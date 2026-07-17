// app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogHostComponent } from './shared/dialog-host/dialog-host.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DialogHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}