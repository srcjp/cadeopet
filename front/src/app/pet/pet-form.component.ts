import { Component, OnInit, AfterViewInit, Optional, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PetService } from './pet.service';
import * as L from 'leaflet';
import { lostIcon, foundIcon } from './map-icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    NgxMaskDirective
  ],
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss']
})
export class PetFormComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  images: File[] = [];
  imageUrls: string[] = [];
  private existingImages: string[] = [];
  loading = false;
  imageLoading = false;
  private map?: L.Map;
  private marker?: L.Marker;
  private pendingCoords?: L.LatLngTuple;

  private getCurrentIcon(): L.Icon {
    return this.form?.value.status === 'FOUND' ? foundIcon : lostIcon;
  }

  id?: number;

  constructor(
    private fb: FormBuilder,
    private service: PetService,
    private router: Router,
    private route: ActivatedRoute,
    @Optional() public dialogRef?: MatDialogRef<PetFormComponent>,
    @Inject(MAT_DIALOG_DATA) @Optional() data?: { id?: number }
  ) {
    this.form = this.fb.group({
      status: ['LOST', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      breed: ['', Validators.required],
      size: ['', Validators.required],
      color: ['', Validators.required],
      observation: ['', Validators.required],
      phone: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required]
    });
    this.form.get('status')!.valueChanges.subscribe(() => this.updateMarkerIcon());
    if (data && data.id) {
      this.id = data.id;
    }
  }

  ngOnInit(): void {
    const paramId = this.id ?? this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id = +paramId;
      this.service.get(this.id).subscribe(p => {
        this.form.patchValue(p);
        if (p.images) {
          this.existingImages = p.images;
          this.imageUrls = [...p.images];
        }
        if(p.latitude && p.longitude){
          this.pendingCoords = [p.latitude, p.longitude];
          this.setMarkerIfPossible();
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(){
    navigator.geolocation.getCurrentPosition(pos => {
      const coords: L.LatLngTuple = [pos.coords.latitude, pos.coords.longitude];
      this.map = L.map('selectMap').setView(coords, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);
      this.map.on('click', e => this.onMapClick(e as L.LeafletMouseEvent));
      this.setMarkerIfPossible();
    }, () => {
      const coords: L.LatLngTuple = [-23.31, -51.17];
      this.map = L.map('selectMap').setView(coords, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);
      this.map.on('click', e => this.onMapClick(e as L.LeafletMouseEvent));
      this.setMarkerIfPossible();
    });
  }

  private setMarkerIfPossible(){
    if(this.map && this.pendingCoords){
      const [lat, lng] = this.pendingCoords;
      this.pendingCoords = undefined;
      this.marker = L.marker([lat, lng], { icon: this.getCurrentIcon() }).addTo(this.map);
      this.map.setView([lat, lng], 13);
    }
  }

  private updateMarkerIcon(){
    if(this.marker){
      this.marker.setIcon(this.getCurrentIcon());
    }
  }

  private onMapClick(ev: L.LeafletMouseEvent){
    if(this.marker){
      this.map!.removeLayer(this.marker);
    }
    this.marker = L.marker(ev.latlng, { icon: this.getCurrentIcon() }).addTo(this.map!);
    this.form.patchValue({
      latitude: ev.latlng.lat,
      longitude: ev.latlng.lng
    });
  }

  onFile(event: any){
    const files: FileList = event.target.files;
    this.imageLoading = true;
    this.images = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, 3);
    this.imageUrls = [...this.existingImages];
    let remaining = this.images.length;
    if (remaining === 0) {
      this.imageLoading = false;
    }
    this.images.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrls.push(reader.result as string);
        remaining--;
        if (remaining === 0) {
          this.imageLoading = false;
        }
      };
      reader.readAsDataURL(file);
    });
  }

  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  canSave(): boolean {
    if(this.id){
      return this.form.valid;
    }
    return this.form.valid && this.images.length > 0;
  }

  submit(){
    this.loading = true;
    const data = new FormData();
    for(const key in this.form.value){
      const val = (this.form.value as any)[key];
      if(val !== null && val !== undefined){
        data.append(key, ''+val);
      }
    }
    this.images.forEach(f => data.append('images', f));
    const handle = (obs: any) => {
      obs
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => {
        if (this.dialogRef) {
          this.dialogRef.close(true);
        } else {
          this.router.navigate(['/pet']);
        }
      });
    };

    if (this.id) {
      handle(this.service.update(this.id, data));
    } else {
      handle(this.service.create(data));
    }
  }
}
