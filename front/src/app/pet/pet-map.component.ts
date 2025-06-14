import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { PetService, PetReport } from './pet.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pet-map',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './pet-map.component.html',
  styleUrls: ['./pet-map.component.scss']
})
export class PetMapComponent implements OnInit {
  private map?: L.Map;
  pets: PetReport[] = [];
  myPets: PetReport[] = [];
  showTable = false;

  constructor(private service: PetService) {}

  get loggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  ngOnInit() {
    this.service.list().subscribe({
      next: pets => {
        this.pets = pets;
        this.initMap();
      },
      error: () => this.initMap()
    });

    if (this.loggedIn) {
      this.service.myList().subscribe({
        next: p => (this.myPets = p),
        error: () => {}
      });
    }
  }

  private initMap() {
    navigator.geolocation.getCurrentPosition(pos => {
      const coords: L.LatLngTuple = [pos.coords.latitude, pos.coords.longitude];
      this.map = L.map('map').setView(coords, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);
      this.loadMarkers();

      }, () => {
        // Default to Londrina if geolocation fails
        const coords: L.LatLngTuple = [-23.31, -51.17];
        this.map = L.map('map').setView(coords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);
      this.loadMarkers();
    });
  }

  private loadMarkers() {
    if(!this.map) return;
    for(const pet of this.pets){
      if(pet.latitude && pet.longitude){
        const marker = L.marker([pet.latitude, pet.longitude]).addTo(this.map!);
        const img = pet.images && pet.images[0] ? `<img src="${pet.images[0]}" class="popup-img" />` : '';
        const html = `${img}<div><strong>${pet.name || ''}</strong><br/>${pet.date || ''}<br/><strong>${pet.status}</strong><br/>${pet.breed || ''}<br/>${pet.color || ''}<br/>${pet.phone || ''}<br/>${pet.observation || ''}</div>`;
        marker.bindPopup(html);
        marker.on('popupopen', () => {
          const el = document.querySelector('.popup-img') as HTMLImageElement;
          if(el){
            el.addEventListener('click', () => {
              const src = el.getAttribute('src');
              if(src){
                const overlay = document.createElement('div');
                overlay.className = 'img-overlay';
                overlay.innerHTML = `<button class="close-btn">X</button><img src="${src}"/>`;
                const btn = overlay.querySelector('.close-btn') as HTMLButtonElement;
                btn.addEventListener('click', () => overlay.remove());
                overlay.addEventListener('click', e => {
                  if(e.target === overlay) overlay.remove();
                });
                document.body.appendChild(overlay);
              }
            });
          }
        });
      }
    }
  }

  toggleTable(){
    this.showTable = !this.showTable;
  }

  remove(p: PetReport){
    if(!p.id) return;
    this.service.delete(p.id).subscribe(()=>{
      this.myPets = this.myPets.filter(m => m.id !== p.id);
    });
  }

  onImageChange(event: any, p: PetReport){
    if(!p.id) return;
    const files: FileList = event.target.files;
    const data = new FormData();
    data.append('status', p.status);
    if(p.name) data.append('name', p.name);
    if(p.date) data.append('date', p.date);
    if(p.breed) data.append('breed', p.breed);
    if(p.size) data.append('size', p.size);
    if(p.color) data.append('color', p.color);
    if(p.observation) data.append('observation', p.observation);
    if(p.phone) data.append('phone', p.phone);
    if(p.latitude) data.append('latitude', ''+p.latitude);
    if(p.longitude) data.append('longitude', ''+p.longitude);
    Array.from(files).slice(0,3).forEach(f => data.append('images', f));
    this.service.update(p.id, data).subscribe(r => {
      p.images = r.images;
    });
  }
}
