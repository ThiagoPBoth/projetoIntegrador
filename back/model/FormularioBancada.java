package br.com.pdasrs.laboratorioapi.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@ToString
@Table(name = "formulario_bancada", schema = "laboratorio")
public class FormularioBancada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long laboratorioId;

    @Column(nullable = false, unique = true)
    private String identificador;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "formulario_bancada_id")
    private List<PlacaFormularioBancada> placas = new ArrayList<>();
}
