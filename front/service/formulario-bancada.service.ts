
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AbstractService} from '../abstract.service';
import {Observable} from 'rxjs';


@Injectable(
   {
      providedIn: 'root'
   }
)
export class FormularioBancadaService extends AbstractService {

   private readonly URL = this.API_REST_LABORATORIO + "/formulario-bancada/";

   constructor(http: HttpClient) {
      super(http);
   }

   findAllByIdOrdemServicosAndTipoAnalise(selectedOrdens: number[], idLab: number): Observable<any> {
      return this.http.get<Observable<any>>(this.URL + 'find/all/by/orden-servico/tipo-amostra/' + selectedOrdens +
         '/' + idLab);
   }

    salvarPlacas(placas: any[]): any {
      console.log('tentando salvar placas', placas);
       return this.http.post<any>(this.URL + 'salvar-placas/ordem-servico/', placas);
    }

   getAllByIdLab(laboratorioId: number): any {
      return this.http.get<any>(this.URL + "buscar-formularios-bancada/" + laboratorioId);
   }

   getAllPlacasByFromId(id: number): Observable<any> {
      return this.http.get<any>(this.URL + "buscar-placas-formulario-bancada/" + id);
   }

}
