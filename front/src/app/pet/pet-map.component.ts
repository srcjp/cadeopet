import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { defaultIcon } from './map-icon';
import Supercluster from 'supercluster';
import { PetService, PetReport } from './pet.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pet-map',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './pet-map.component.html',
  styleUrls: ['./pet-map.component.scss']
})
export class PetMapComponent implements OnInit {
  private map?: L.Map;
  private cluster?: Supercluster<{ pet: PetReport }>;
  private clusterLayer = L.layerGroup();
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
        this.buildCluster();
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
      this.map.addLayer(this.clusterLayer);
      this.loadMarkers();

      }, () => {
        // Default to Londrina if geolocation fails
        const coords: L.LatLngTuple = [-23.31, -51.17];
        this.map = L.map('map').setView(coords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);
      this.map.addLayer(this.clusterLayer);
      this.loadMarkers();
    });
  }

  private loadMarkers() {
    if(!this.map || !this.cluster) return;
    this.clusterLayer.clearLayers();
    this.updateClusters();
    this.map.on('moveend zoomend', () => this.updateClusters());
  }

  private buildCluster(){
    const points = this.pets
      .filter(p => p.latitude && p.longitude)
      .map(p => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.longitude!, p.latitude!] },
        properties: { pet: p }
      }));

    this.cluster = new Supercluster({ radius: 40, maxZoom: 18 });
    this.cluster.load(points as any);
  }

  private updateClusters(){
    if(!this.map || !this.cluster) return;
    this.clusterLayer.clearLayers();
    const bounds = this.map.getBounds();
    const zoom = this.map.getZoom();
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ];
    const clusters = this.cluster.getClusters(bbox, zoom);
    for(const c of clusters){
      const [lng, lat] = c.geometry.coordinates as [number, number];
      if((c.properties as any).cluster){
        const count = (c.properties as any).point_count as number;
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: `<div class="cluster-icon">${count}</div>`,
            className: '',
            iconSize: [30,30]
          })
        });
        marker.on('click', () => {
          if (c.id === undefined) return;
          const expansionZoom = this.cluster!.getClusterExpansionZoom(+c.id);
          this.map!.setView([lat, lng], expansionZoom);
        });
        this.clusterLayer.addLayer(marker);
      } else {
        const pet = (c.properties as any).pet as PetReport;
        const marker = L.marker([lat, lng], { icon: defaultIcon });
        const img = pet.images && pet.images[0]
          ? `<img src="${pet.images[0]}" class="popup-img" />`
          : '';
        const info = `
          ${pet.name ? `<div class="info-item"><span class="label">Nome:</span> ${pet.name}</div>` : ''}
          ${pet.date ? `<div class="info-item"><span class="label">Data:</span> ${pet.date}</div>` : ''}
          <div class="info-item"><span class="label">Status:</span> ${pet.status}</div>
          ${pet.breed ? `<div class="info-item"><span class="label">Raça:</span> ${pet.breed}</div>` : ''}
          ${pet.size ? `<div class="info-item"><span class="label">Tamanho:</span> ${pet.size}</div>` : ''}
          ${pet.color ? `<div class="info-item"><span class="label">Cor:</span> ${pet.color}</div>` : ''}
          ${pet.phone ? `<div class="info-item"><span class="label">Telefone:</span> ${pet.phone}</div>` : ''}
          ${pet.observation ? `<div class="info-item"><span class="label">Observação:</span> ${pet.observation}</div>` : ''}
        `;
        const html = `${img}<div class="popup-info">${info}</div>`;
        marker.bindPopup(html, { className: 'pet-popup', maxWidth: 260 });
        marker.on('popupopen', () => {
          const popupEl = marker.getPopup()?.getElement();
          const imgEl = popupEl?.querySelector('.popup-img') as HTMLImageElement | null;
          if (imgEl) {
            imgEl.addEventListener('click', () => {
              const src = imgEl.getAttribute('src');
              if (src) {
                const existing = document.querySelector('.img-overlay');
                if (existing) existing.remove();

                const overlay = document.createElement('div');
                overlay.className = 'img-overlay';
                overlay.innerHTML = `
                  <div class="mat-card img-card">
                    <button class="close-btn material-icons">close</button>
                    <img src="${src}" />
                  </div>`;
                const btn = overlay.querySelector('.close-btn') as HTMLButtonElement;
                btn.addEventListener('click', () => overlay.remove());
                overlay.addEventListener('click', e => {
                  if (e.target === overlay) overlay.remove();
                });
                document.body.appendChild(overlay);
              }
            });
          }
        });
        this.clusterLayer.addLayer(marker);
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
