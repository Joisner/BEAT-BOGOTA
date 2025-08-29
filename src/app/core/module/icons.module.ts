import { NgModule } from '@angular/core';
import { LucideAngularModule, Plus, Calendar, MapPin, ChevronLeft, Ticket, Phone, Link, Info, FileText, DollarSign, Users, Tag, Sparkles, CheckCircle, Star } from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      Plus,
      Calendar,
      MapPin,
      ChevronLeft,
      Ticket,
      Phone,
      Info,
      Link,
      FileText,
      DollarSign,
      Users,
      Tag,
      Sparkles,
      CheckCircle,
      Star,
      
    })
  ],
  exports: [LucideAngularModule]
})
export class IconsModule {}
