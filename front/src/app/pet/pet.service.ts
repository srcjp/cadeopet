import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environmet/environment';
import { Observable, map } from 'rxjs';

export interface PetReport {
  id?: number;
  status: string;
  name?: string;
  date?: string;
  breed?: string;
  size?: string;
  color?: string;
  observation?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
}

@Injectable({ providedIn: 'root' })
export class PetService {
  private api = environment.apiUrl + '/pets';
  private filesBase = environment.apiUrl.replace('/api/v1', '') + '/';
  constructor(private http: HttpClient) {}

  private get authOptions() {
    const token = localStorage.getItem('accessToken');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }

  list(): Observable<PetReport[]> {
    return this.http.get<PetReport[]>(this.api).pipe(
      map(pets => this.mapImages(pets))
    );
  }

  myList(): Observable<PetReport[]> {
    return this.http.get<PetReport[]>(this.api + '/my', this.authOptions).pipe(
      map(pets => this.mapImages(pets))
    );
  }

  create(data: FormData): Observable<PetReport> {
    return this.http.post<PetReport>(this.api, data, this.authOptions).pipe(
      map(p => this.mapImages(p))
    );
  }

  update(id: number, data: FormData): Observable<PetReport> {
    return this.http.put<PetReport>(`${this.api}/${id}`, data, this.authOptions).pipe(
      map(p => this.mapImages(p))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`, this.authOptions);
  }

  get(id: number): Observable<PetReport> {
    return this.http.get<PetReport>(`${this.api}/${id}`).pipe(
      map(p => this.mapImages(p))
    );
  }

  private mapImages<T extends PetReport | PetReport[]>(data: T): T {
    const mapFn = (p: PetReport) => {
      if (p.images) {
        p.images = p.images.map(img => this.filesBase + img);
      }
      return p;
    };
    if (Array.isArray(data)) {
      return data.map(mapFn) as T;
    }
    return mapFn(data) as T;
  }
}
