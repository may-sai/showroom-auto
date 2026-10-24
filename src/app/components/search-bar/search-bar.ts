import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Auto } from '../../interfaces/auto';
import { CarCard } from '../car-card/car-card';

@Component({
  selector: 'app-search-bar',
  imports: [FontAwesomeModule, CarCard],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar implements OnInit, OnChanges {
  faMagnifyingGlass = faMagnifyingGlass;
  faHeart = faHeart;

  @Input() autos: Auto[] = [];
  @Input() favorites: number[] = [];
  @Input() compareIds: number[] = [];
  @Output() onSelectCar = new EventEmitter<Auto>();
  @Output() onToggleFavorite = new EventEmitter<number>();
  @Output() onToggleCompare = new EventEmitter<number>();

  selectedAutos: Auto[] = [];

  // état des filtres
  brandQuery = '';
  selectedBrand = '';
  sortMode = '';
  onlyFavorites = false;
  brands: string[] = [];
  priceMax = 0;   // prix le plus élevé du catalogue (borne du slider)
  maxPrice = 0;   // prix maximum choisi par l'utilisateur
  powerMax = 1;   // puissance la plus élevée (pour la barre de puissance)

  // pagination "Load more"
  pageSize = 8;
  visibleCount = 8;

  ngOnInit() {
    this.priceMax = Math.max(0, ...this.autos.map(a => a.price));
    this.maxPrice = this.priceMax;
    this.powerMax = Math.max(1, ...this.autos.map(a => a.power));
    this.brands = [...new Set(this.autos.map(a => a.brand))].sort();
    this.applyFilters();
  }

  // se relance quand la liste, les favoris ou la comparaison changent (@Input)
  ngOnChanges() {
    this.applyFilters();
  }

  get visibleAutos(): Auto[] {
    return this.selectedAutos.slice(0, this.visibleCount);
  }

  get remaining(): number {
    return Math.max(0, this.selectedAutos.length - this.visibleCount);
  }

  loadMore() {
    this.visibleCount += this.pageSize;
  }

  selectAutos(query: string) {
    this.brandQuery = query;
    this.refresh();
  }

  selectBrand(brand: string) {
    this.selectedBrand = this.selectedBrand === brand ? '' : brand;
    this.refresh();
  }

  onSortChange(mode: string) {
    this.sortMode = mode;
    this.refresh();
  }

  onPriceChange(value: string) {
    this.maxPrice = Number(value);
    this.refresh();
  }

  toggleOnlyFavorites() {
    this.onlyFavorites = !this.onlyFavorites;
    this.refresh();
  }

  resetFilters() {
    this.brandQuery = '';
    this.selectedBrand = '';
    this.sortMode = '';
    this.onlyFavorites = false;
    this.maxPrice = this.priceMax;
    this.refresh();
  }

  // un filtre a changé : on revient à la première page
  private refresh() {
    this.visibleCount = this.pageSize;
    this.applyFilters();
  }

  private applyFilters() {
    const q = this.brandQuery.trim().toLowerCase();

    const result = this.autos.filter(a =>
      (!q || `${a.brand} ${a.model}`.toLowerCase().includes(q)) &&
      (!this.selectedBrand || a.brand === this.selectedBrand) &&
      a.price <= this.maxPrice &&
      (!this.onlyFavorites || this.favorites.includes(a.id))
    );

    switch (this.sortMode) {
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'power-desc': result.sort((a, b) => b.power - a.power); break;
    }

    this.selectedAutos = result;
  }
}
