import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-head-bar',
  imports: [FontAwesomeModule],
  templateUrl: './head-bar.html',
  styleUrl: './head-bar.css',
})
export class HeadBar {
  faHeart = faHeart;
  faMoon = faMoon;
  faSun = faSun;

  @Input() darkMode = false;
  @Input() favoritesCount = 0;
  @Output() onToggleTheme = new EventEmitter<void>();

  toggleTheme() {
    this.onToggleTheme.emit();
  }
}
