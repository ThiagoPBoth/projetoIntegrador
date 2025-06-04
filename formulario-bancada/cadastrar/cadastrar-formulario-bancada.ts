import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TipoAnaliseService} from '../../../../../../../app-core/service/laboratorio/tipo-analise.service';
import {Laboratorio} from '../../../../../../../app-core/model/laboratorio.model';
import {LaboratorioService} from '../../../../../../../app-core/service/laboratorio.service';
import {Usuario} from '../../../../../../../app-core/model/usuario.model';
import {UsuarioService} from '../../../../../../../app-core/service/usuario.service';
import {LoginService} from '../../../../../../../app-core/service/login.service';
import {Observable} from 'rxjs';
import {CadastrarFormularioBancadaService} from './cadastrar-formulario-bancada.service';


@Component({
   selector: 'app-cadastrar-formulario',
   templateUrl: 'cadastrar-formulario-bancada.html',
   styleUrls: ['cadastrar-formulario-bancada.css']
})

export class CadastrarFormularioBancadaComponent implements OnInit {
   constructor(public service: CadastrarFormularioBancadaService) { }
   ngOnInit(): void {
   }
}
