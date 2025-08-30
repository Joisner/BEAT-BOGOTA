import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../core/module/icons.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, IconsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {}
