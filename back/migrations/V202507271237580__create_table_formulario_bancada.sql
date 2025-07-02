-- Tabela para formulario_interno
CREATE TABLE laboratorio.formulario_interno (
                                                id BIGSERIAL PRIMARY KEY, -- de @Id @GeneratedValue
                                                lote VARCHAR(255) NOT NULL,
                                                termometro_ambiente VARCHAR(255) NOT NULL
);


-- Tabela para FormularioBancada
CREATE TABLE laboratorio.formulario_bancada (
                                                id BIGSERIAL PRIMARY KEY, -- de @Id @GeneratedValue
                                                identificador VARCHAR(255) NOT NULL UNIQUE,
                                                laboratorio_id BIGINT NOT NULL
);

-- Tabela para ConteudoCelulaPlaca
CREATE TABLE laboratorio.conteudo_celula_placa (
                                                   id BIGSERIAL PRIMARY KEY, -- de @Id @GeneratedValue
                                                   identificacao_animal VARCHAR(255) NOT NULL,
                                                   identificacao_frasco_lamina_armazenamento VARCHAR(255) NOT NULL,
                                                   protocolo VARCHAR(255) NOT NULL
);


-- Tabela para PlacaFormularioBancada
CREATE TABLE laboratorio.placa_formulario_bancada (
                                                      id BIGSERIAL PRIMARY KEY, -- de @Id @GeneratedValue
                                                      numero VARCHAR(255) NOT NULL,
                                                      formulario_interno_id BIGINT,
                                                      formulario_bancada_id BIGINT, -- Chave estrangeira para FormularioBancada (de @ManyToOne)

                                                      CONSTRAINT fk_formulario_interno
                                                          FOREIGN KEY (formulario_interno_id)
                                                              REFERENCES laboratorio.formulario_interno (id),

                                                      CONSTRAINT fk_placa_formulario
                                                          FOREIGN KEY (formulario_bancada_id)
                                                              REFERENCES laboratorio.formulario_bancada (id)
);

-- Tabela para CelulaPlaca
CREATE TABLE laboratorio.celula_placa (
    -- Colunas da chave composta (@EmbeddedId CelulaPlacaId)
                                          placa_formulario_bancada_id BIGINT NOT NULL, -- Mapeado de CelulaPlacaId.placaId e @MapsId("placaId")
                                          linha INT NOT NULL,                          -- Mapeado de CelulaPlacaId.linha
                                          coluna INT NOT NULL,                         -- Mapeado de CelulaPlacaId.coluna

    -- Chave estrangeira para ConteudoCelulaPlaca (@OneToOne)
                                          conteudo_celula_placa_id BIGINT NOT NULL UNIQUE, -- Mapeado de @JoinColumn(name = "conteudo_celula_placa_id", unique = true)

    -- Definição da chave primária composta
                                          PRIMARY KEY (placa_formulario_bancada_id, linha, coluna),

    -- Definição da chave estrangeira para PlacaFormularioBancada
                                          CONSTRAINT fk_celula_placa_placa
                                              FOREIGN KEY (placa_formulario_bancada_id)
                                                  REFERENCES laboratorio.placa_formulario_bancada (id),

    -- Definição da chave estrangeira para ConteudoCelulaPlaca
                                          CONSTRAINT fk_celula_placa_conteudo
                                              FOREIGN KEY (conteudo_celula_placa_id)
                                                  REFERENCES laboratorio.conteudo_celula_placa (id)
);
