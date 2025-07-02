
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AbstractService} from '../abstract.service';
import {Observable} from 'rxjs';
import {FormularioBancada} from '../../model/suino/certificacao-suinos/formularioBancada';


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

   // busca as amostras - jah vem um FormularioBancada montado corretamente
   findAllByIdOrdemServicosAndTipoAnalise(selectedOrdens: number[], idLab: number): Observable<FormularioBancada> {
      return this.http.get<FormularioBancada>(this.URL + 'find/all/by/orden-servico/tipo-amostra/' + selectedOrdens +
         '/' + idLab);
   }

   // salva o FormularioBancada pela primeira vez - ou seja - salva as placas
   salvarPlacas(placas: any[]): Observable<FormularioBancada> {
       return this.http.post<FormularioBancada>(this.URL + 'salvar-placas/ordem-servico/', placas);
    }

    // busca os formularios de bancada de forma simplificada - visualizacao detodos
   getAllByIdLab(laboratorioId: number): any {
      return this.http.get<any>(this.URL + "buscar-formularios-bancada/" + laboratorioId);
   }

   // busca as placas do FormularioBanacda para exibicao detalhada
   getAllPlacasByFromId(id: number): Observable<FormularioBancada> {
      return this.http.get<FormularioBancada>(this.URL + "buscar-placas-formulario-bancada/" + id);
   }

   // salva os forms internos das placas - step 3
   salvarFormInternoPsc(formularioBancada: FormularioBancada): Observable<FormularioBancada> {
      return this.http.post<FormularioBancada>(this.URL + 'salvar-form-interno-psc/', formularioBancada);
   }

   // busca Formulariobancada inteirinho por id para visualizacao detalhada
   getById(id: number): Observable<FormularioBancada> {
      return this.http.get<FormularioBancada>(this.URL + "buscar-formulario-bancada-by-id/" + id);
   }
}
