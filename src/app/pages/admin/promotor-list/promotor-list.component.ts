import { Component, OnInit } from '@angular/core';
import { PromotorService } from '../../../core/services/promotor.service';
import { Promotor } from '../../../core/models/promotor.model';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../../core/module/icons.module';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    imports: [CommonModule, LucideAngularModule, IconsModule, RouterModule],
    selector: 'app-promotor-list',
    templateUrl: './promotor-list.component.html',
    styleUrls: ['./promotor-list.component.css']
})
export class PromotorListComponent implements OnInit {
    promotores: Promotor[] = []

    constructor(private promotorService: PromotorService) {}
  
    ngOnInit(): void {
      this.loadPromotores()
    }
  
    private loadPromotores(): void {
      this.promotorService.getPromotores().subscribe({
        next: (promotores) => {
          this.promotores = promotores
        },
        error: (error) => {
          console.error(`No fue posible cargar promotores ${error}`)
        },
      })
    }
  
    eliminarPromotor(id: string): void {
      if (confirm("¿Estás seguro de que deseas eliminar este promotor?")) {
        this.promotorService.deletePromotor(id).subscribe({
          next: () => {
            this.loadPromotores() // Reload the list
            console.log("Promotor eliminado exitosamente")
          },
          error: (error) => {
            console.error("Error al eliminar promotor:", error)
          },
        })
      }
    }
  }
  