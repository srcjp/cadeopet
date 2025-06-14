import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { lostIcon, foundIcon } from './map-icon';
import Supercluster from 'supercluster';
import { PetService, PetReport } from './pet.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyPetsDialogComponent } from './my-pets-dialog.component';
import { PetPopupComponent } from './pet-popup.component';
import { ViewContainerRef, EnvironmentInjector } from '@angular/core';
import { PetFormComponent } from './pet-form.component';

@Component({
  selector: 'app-pet-map',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
    PetPopupComponent
  ],
  templateUrl: './pet-map.component.html',
  styleUrls: ['./pet-map.component.scss']
})
export class PetMapComponent implements OnInit {
  private map?: L.Map;
  private cluster?: Supercluster<{ pet: PetReport }>;
  private clusterLayer = L.layerGroup();
  pets: PetReport[] = [];
  myPets: PetReport[] = [];
  private myPetsDialog?: MatDialogRef<MyPetsDialogComponent>;

  constructor(
    private service: PetService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private vcr: ViewContainerRef,
    private injector: EnvironmentInjector
  ) {}

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
        const icon = pet.status === 'FOUND' ? foundIcon : lostIcon;
        const marker = L.marker([lat, lng], { icon });
        const popupHost = document.createElement('div');
        const compRef = this.vcr.createComponent(PetPopupComponent, {
          environmentInjector: this.injector
        });
        compRef.instance.pet = pet;
        popupHost.appendChild(compRef.location.nativeElement);
        marker.bindPopup(popupHost, { className: 'pet-popup', maxWidth: 260 });
        marker.on('popupclose', () => compRef.destroy());
        this.clusterLayer.addLayer(marker);
      }
    }
  }

  openMyPets() {
    this.myPetsDialog = this.dialog.open(MyPetsDialogComponent, {
      width: '90vw',
      maxWidth: '90vw',
      data: { pets: this.myPets }
    });

    this.myPetsDialog.afterClosed().subscribe(result => {
      if (result && result.edit) {
        this.openPetForm(result.edit);
      } else if (result) {
        this.reloadPets();
      }
    });
  }

  private reloadPets() {
    this.service.list().subscribe({
      next: pets => {
        this.pets = pets;
        this.buildCluster();
        this.updateClusters();
      }
    });

    if (this.loggedIn) {
      this.service.myList().subscribe({
        next: p => {
          this.myPets = p;
          if (this.myPetsDialog) {
            this.myPetsDialog.componentInstance.data.pets = this.myPets;
          }
        },
        error: () => {}
      });
    }
  }

  openPetForm(id?: number) {
    this.dialog
      .open(PetFormComponent, {
        width: '95vw',
        maxWidth: '95vw',
        data: id ? { id } : undefined
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.reloadPets();
        }
      });
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
