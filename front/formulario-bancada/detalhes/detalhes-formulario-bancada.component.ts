import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormularioBancadaService} from '../../../../../../../app-core/service/laboratorio/formulario-bancada.service';
import {FormularioBancada} from '../../../../../../../app-core/model/suino/certificacao-suinos/formularioBancada';

@Component({
   selector: 'app-detalhes-formulario',
   templateUrl: './detalhes-formulario-bancada.component.html',
   styleUrls: ['./detalhes-formulario-bancada.component.css']
})

export class DetalhesFormularioBancadaComponent implements OnInit {

   // id do formulário bancada recebido da tela anterior
   id: number;
   formularioBancada: FormularioBancada;

   constructor(private route: ActivatedRoute,
               private formularioBancaService: FormularioBancadaService) { }

   ngOnInit(): void {
      // recebendo id do formulário bancada da tela nterior
      const idString = this.route.snapshot.paramMap.get('formularioBancadaId');
      this.id = parseInt(idString, 10);
      // buscar as placas do formulário bancada
      this.getPlacas();
   }

   changeTab($event: any) {
      if ($event.index === 0) {
         // buscar as placas do formulário bancada
         this.getPlacas();
      } else if ($event.index === 1) {
         console.log("chamando interno");
         this.getFormularioBancada();
      } else if ($event.index === 2) {
         // buscar os resultados
      }
   }

   getPlacas(): void {
      this.formularioBancaService.getAllPlacasByFromId(this.id).subscribe(data => {
         this.formularioBancada = data;
      });
   }

   getFormularioBancada(): void {
      this.formularioBancaService.getById(this.id).subscribe(data => {
         this.formularioBancada = data;
      });
   }
}
