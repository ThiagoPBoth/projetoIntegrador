package br.com.pdasrs.laboratorioapi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "placa_formulario_bancada", schema = "laboratorio")
public class PlacaFormularioBancada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String numero;

    @OneToOne(optional = true, cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    @JoinColumn(name = "formulario_interno_id", referencedColumnName = "id", unique = true)
    private FormularioInterno formularioInterno;

    @JsonManagedReference
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "placa_formulario_bancada_id", referencedColumnName = "id")
    private Set<CelulaPlaca> celulas = new HashSet<>();
    public void adicionarCelula(CelulaPlaca celula) {
        celulas.add(celula);
    }

    @Override
    public String toString() {
        return "PlacaFormularioBancada{" +
                "id= " + this.id +
                ", numero= '" + this.numero + '\'' +
                ", form interno= '" + this.formularioInterno + '\'' +
                '}';
    }
}
