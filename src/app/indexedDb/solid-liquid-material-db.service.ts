import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';
import { SolidLiquidFlueGasMaterial } from '../shared/models/materials';
import { SolidLiquidFlueGasMaterialStoreMeta } from './dbConfig';

@Injectable()
export class SolidLiquidMaterialDbService {
  storeName: string = SolidLiquidFlueGasMaterialStoreMeta.store;
  constructor(private dbService: NgxIndexedDBService) {}


  getAllWithObservable(): Observable<Array<SolidLiquidFlueGasMaterial>> {
    return this.dbService.getAll(this.storeName);
  }

  getByIdWithObservable(materialId: number): Observable<SolidLiquidFlueGasMaterial> {
    return this.dbService.getByKey(this.storeName, materialId);
  }

  addWithObservable(material: SolidLiquidFlueGasMaterial): Observable<SolidLiquidFlueGasMaterial> {
    return this.dbService.add(this.storeName, material);
  }

  deleteByIdWithObservable(materialId: number): Observable<Array<SolidLiquidFlueGasMaterial>> {
    return this.dbService.delete(this.storeName, materialId);
  }

  updateWithObservable(material: SolidLiquidFlueGasMaterial): Observable<any> {
    return this.dbService.update(this.storeName, material);
  }

  clearSolidLiquidFlueGasMaterials(): Observable<boolean> {
    return this.dbService.clear(this.storeName);
  }

}