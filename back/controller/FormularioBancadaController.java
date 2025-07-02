package br.com.pdasrs.laboratorioapi.controller;

import br.com.pdasrs.laboratorioapi.dto.FormularioBancadaDTO;
import br.com.pdasrs.laboratorioapi.dto.FormularioBancadaSimplificadoDTO;
import br.com.pdasrs.laboratorioapi.model.FormularioBancada;
import br.com.pdasrs.laboratorioapi.service.FormularioBancadaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@ResponseBody
@CrossOrigin(origins = "*")
@RequestMapping("/formulario-bancada")
public class FormularioBancadaController {

    private final FormularioBancadaService formularioBancadaService;

    public FormularioBancadaController(FormularioBancadaService formularioBancadaService) {
        this.formularioBancadaService = formularioBancadaService;
    }

    // Método para buscar todas as amostras por ordem de serviço selecionaas
    // jah vai criar a estrutura de um formulario de bancada e enviar para o front
    @GetMapping("/find/all/by/orden-servico/tipo-amostra/{ordens}/{idLab}")
    public FormularioBancadaDTO findAllByIdOrdemServicosAndTipoAmostra(
            @PathVariable List<Long> ordens,
            @PathVariable Long idLab
    ) {
        return formularioBancadaService.findAllByIdOrdemServicosAndTipoAmostra(ordens, idLab);
    }

    @PostMapping("/salvar-placas/ordem-servico/")
    public FormularioBancadaDTO salvarPlacas(@RequestBody FormularioBancadaDTO form){
        return formularioBancadaService.criarFormularioBancada(form);
    }

    @GetMapping("/buscar-formularios-bancada/{laboratorioId}")
    public List<FormularioBancadaSimplificadoDTO> findAllByIdLab(@PathVariable Long laboratorioId) {
        return this.formularioBancadaService.findAllByIdLab(laboratorioId);
    }

    @GetMapping("/buscar-placas-formulario-bancada/{formularioId}")
    public FormularioBancadaDTO findByFormularioBancadaIdWithDetails(@PathVariable Long formularioId) {
        FormularioBancadaDTO placas =
                this.formularioBancadaService.findFormularioCompletoById(formularioId);
        return placas;
    }

    @PostMapping("/salvar-form-interno-psc/")
    public FormularioBancadaDTO salvarFormsInternoPsc(@RequestBody FormularioBancadaDTO form){
        return this.formularioBancadaService.salvarFormsInternoPsc(form);
    }

    @GetMapping("/buscar-formulario-bancada-by-id/{formularioId}")
    public FormularioBancadaDTO findById(@PathVariable Long formularioId) {
        return this.formularioBancadaService.findById(formularioId);
    }
}
