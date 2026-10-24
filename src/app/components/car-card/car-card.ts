import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Auto } from '../../interfaces/auto';

@Component({
  selector: 'app-car-card',
  imports: [FontAwesomeModule],
  templateUrl: './car-card.html',
  styleUrl: './car-card.css',
})
export class CarCard {
  faHeart = faHeart;

  @Input() auto!: Auto;
  @Input() powerMax = 1;
  @Input() isFavorite = false;
  @Input() isCompared = false;

  @Output() onSelect = new EventEmitter<Auto>();
  @Output() onToggleFavorite = new EventEmitter<number>();
  @Output() onToggleCompare = new EventEmitter<number>();

  // petit label selon la puissance de la voiture
  get powerLevel(): string {
    if (this.auto.power <= 9) return 'City';
    if (this.auto.power <= 16) return 'Sport';
    return 'Beast';
  }

  get powerPercent(): number {
    return Math.round((this.auto.power / this.powerMax) * 100);
  }

  get isLowStock(): boolean {
    return this.auto.availability <= 3;
  }
}
