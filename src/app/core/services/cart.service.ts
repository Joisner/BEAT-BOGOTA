import { Injectable } from '@angular/core';

export interface CartItem {
  eventId: string;
  eventName: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];

  getItems(): CartItem[] {
    return this.items;
  }

  addItem(item: CartItem) {
    const found = this.items.find(i => i.eventId === item.eventId);
    if (found) {
      found.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
  }

  removeItem(eventId: string) {
    this.items = this.items.filter(i => i.eventId !== eventId);
  }

  clear() {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
