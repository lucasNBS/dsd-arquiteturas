# Relatório Comparativo das Arquiteturas

## 1. Introdução

### Objetivo

Este relatório apresenta uma análise comparativa da implementação do sistema de gerenciamento de pedidos em três arquiteturas distintas:

- Monólito
- Monólito Modular
- Microsserviços

O domínio de negócio permaneceu idêntico em todas as versões, permitindo avaliar exclusivamente os impactos arquiteturais relacionados a desenvolvimento, manutenção, escalabilidade, observabilidade e resiliência.

### Funcionalidades Implementadas

- Pedidos
- Cardápio
- Pagamento
- Notificação de cozinha

Fluxo principal:

```text
Criar Itens no Cardápio
    ↓
Criar Pedido
    ↓
Confirmar Pagamento
    ↓
Notificar Cozinha
```

---

# 2. Comparação dos Experimentos

## Experimento 1 – Adicionar campo "observação" ao pedido

### Objetivo

Avaliar o esforço necessário para realizar uma modificação simples de negócio.

#### Monólito

#### Monólito Modular

#### Microsserviços

Descrever:

- Impacto da mudança.
- Dependências afetadas.
- Dificuldade de propagação da alteração.
- Necessidade de mudanças em APIs ou contratos.

## Experimento 2 – Simulação de Falha no Pagamento

### Objetivo

Avaliar comportamento do sistema diante de falhas em um componente crítico.

#### Monólito

#### Monólito Modular

#### Microsserviços

Responder:

- O sistema parou completamente?
- Houve degradação parcial?
- Foi possível continuar executando outras funcionalidades?
- Houve impacto na criação de pedidos?

## Experimento 3 – 50 Requisições Simultâneas

### Objetivo

Avaliar comportamento sob carga.

#### Monólito

#### Monólito Modular

#### Microsserviços

Descrever:

- Gargalos identificados.
- Comportamento da aplicação.
- Recursos mais pressionados.
- Diferenças de escalabilidade observadas.

## Experimento 4 – Rastreamento de um Pedido

### Objetivo

#### Monólito

#### Monólito Modular

#### Microsserviços

Responder:

- Quantos logs precisaram ser consultados?
- Foi necessário correlacionar múltiplos serviços?
- Foi fácil identificar falhas?
- Como foi a experiência de debug?

---

# 3. Comparação Geral

### Monólito

### Monólito Modular

### Microsserviços

Descrever:

- Complexidade inicial.
- Quantidade de configuração necessária.
- Curva de aprendizado.

Analisar:

- Impacto de mudanças.
- Acoplamento.
- Evolução do sistema.

Analisar:

- Escalabilidade horizontal.
- Escalabilidade seletiva.
- Custos operacionais.

Analisar:

- Isolamento de falhas.
- Disponibilidade.
- Tolerância a erros.

Analisar:

- Logs.
- Monitoramento.
- Rastreamento de requisições.
- Complexidade de investigação.

---

# 4. Respostas às Perguntas do Trabalho

## Qual arquitetura foi mais fácil de implementar?

(Descrever a arquitetura escolhida e justificar.)

## Qual arquitetura foi mais fácil de modificar?

(Descrever a arquitetura escolhida e justificar.)

## Onde o debug foi mais doloroso e por quê?

(Explicar os desafios encontrados.)

## Em qual cenário real você escolheria cada arquitetura?

### Monólito

Indicado para:

- MVPs
- Sistemas pequenos
- Equipes reduzidas

### Monólito Modular

Indicado para:

- Sistemas em crescimento
- Equipes médias
- Projetos que podem migrar para microsserviços futuramente

### Microsserviços

Indicado para:

- Grandes sistemas
- Equipes independentes
- Necessidade de escalabilidade seletiva
- Alta disponibilidade
