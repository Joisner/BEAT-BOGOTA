import { NgModule } from '@angular/core';
import { LucideAngularModule, Plus, Calendar, MapPin, ChevronLeft, Ticket, Phone, Link, Info, FileText, DollarSign, Users, Tag, Sparkles, CheckCircle, Star, Trash2, Pencil, Clock, Music, Headphones, Share2, CalendarPlus, CalendarDays, Percent, Layers, Home, ShoppingCart } from 'lucide-angular';

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
      Trash2,
      Pencil,
      Clock,
      Music,
      Headphones,
      Share2,
      CalendarPlus,
      CalendarDays,
      Percent,
      Layers,
      Home,
      ShoppingCart
    })
  ],
  exports: [LucideAngularModule]
})
export class IconsModule {}
