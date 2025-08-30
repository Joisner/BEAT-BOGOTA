import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MercadoPagoService } from '../../core/services/mercado-pago.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private mercadoPagoService: MercadoPagoService) {}

  ngOnInit(): void {
    // This amount should ideally come from a cart service or route params
    const amount = "100.00"; 
    this.mercadoPagoService.loadMp(amount);
  }
}
