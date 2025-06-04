import {Component, OnInit} from '@angular/core';
import {FormularioBancadaService} from '../../../../../../../app-core/service/laboratorio/formulario-bancada.service';
import {LoginService} from '../../../../../../../app-core/service/login.service';
import {LaboratorioService} from '../../../../../../../app-core/service/laboratorio.service';
import {Laboratorio} from '../../../../../../../app-core/model/laboratorio.model';
import {Usuario} from '../../../../../../../app-core/model/usuario.model';
import {Router} from '@angular/router';

@Component({
   selector: 'app-visualizar-formulario',
   templateUrl: 'visualizar-formulario-bancada.component.html',
   styleUrls: ['visualizar-formulario-bancada.component.css']
})

export class VisualizarFormularioBancadaComponent implements OnInit {

   formulariosBancada: any = [];
   usuarioLogado: Usuario;
   laboratorio: Laboratorio;

   constructor(private router: Router,
               private formularioBancadaService: FormularioBancadaService,
               private loginService: LoginService,
               private laboratorioService: LaboratorioService) {
      this.laboratorio = new Laboratorio();
      // pegando usuario logado
      this.usuarioLogado = this.loginService.getUsuarioLogado();
      // buscando o laboratorio do usuario logado
      this.laboratorioService.buscaLaboratorioPorUsuario(this.usuarioLogado).subscribe(data => {
         this.laboratorio = data;
         // jah busca os forms de bancada
         if (this.laboratorio.id) {
            this.formularioBancadaService.getAllByIdLab(this.laboratorio.id)
                .subscribe({
                   next: (dados) => {
                      this.formulariosBancada = dados;
                      console.log('Dados recebidos:', dados);
                   },
                   error: (erro) => {
                      console.error('Erro ao carregar dados:', erro);
                   }
                });
            console.log('Formulários de bancada carregados:', this.formulariosBancada);
         }
      });
   }

   ngOnInit(): void {
   }

   visualizarFormBancada(formularioBancadaId: number): void {
      const path = './principal/suinos/formulario-bancada/detalhes/';
      this.router.navigate([path + formularioBancadaId]);
   }
}
