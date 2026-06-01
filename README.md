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

Modificação relativamente simples, exigindo alterações em grande parte dos arquivos no serviço de pedidos, como o modelo, tipagem, repositório e API. Apesar disso, os demais serviços do sistema não precisam ser alterados tendo em vista que não há a necessidade de conhecerem o atributo em questão. A arquitetura de microsserviços ajuda a isolar modificações pontuais no módulo de pedidos, facilitando a manutenção do sistema e integração entre suas partes.

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

No contexto da arquitetura de microsserviços, uma falha no serviço de pagamentos, apesar de ser grave e comprometer a operação do sistema não impossibilita o seu uso. Pedidos ainda podem ser feitos, itens ainda podem ser adicionados ao cardápio e, a princípio, notificações ainda podem ser geradas. O modelo de microsserviços faz com que os serviços operem em conjunto, mas isolados em seus próprios contextos, fazendo com que uma falha local não comprometa todo o funcionamento do sistema.

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

Fazendo com que cada parte do sistema opere de maneira independente, a arquitetura em microsserviços é a ideal em cenários nos quais escalabilidade seja necessária. A carga de 50 requisições simultâneas não se mostra um gargalo para a aplicação, sendo executada em um período de alguns milissegundos, mesmo considerando que o endpoint em questão se comunica com os serviços de cardapio e pagamento.

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

Por conta de sua natureza distribuída, rastrear o fluxo de uma operação em um sistema dividido em serviços se torna uma operação um pouco mais complexa, exigindo consultar todos os serviços por onde o fluxo "passa". Isso torna a experiência de encontrar erros um pouco mais difícil tendo em vista as possíveis falhas na comunicação entre os serviços de forma que se torna complexo encontrar exatamente onde o erro acontece.

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

Apesar de escalável e manutenível, a arquitetura de microsserviços é também complexa, levando em conta a necessidade de gerenciar e coordenar cada um de seus serviços de maneira independente. Por conta disso, sua complexidade inicial e custo de operação são altos, sendo idealmente utilizado em casos onde a escalabilidade é essencial.

Apesar disso, esta arquitetura também apresenta como parte de suas vantagems o baixo acoplamento entre os elementos do sistema de forma que ele possa, como um todo, evoluir conforme a necessidade, enquanto cada um de seus serviços pode ser escalado de acordo com a carga que recebem e mantidos de forma isolado dos demais. Adicionalmente, falhas pontuais em um de seus serviços também acabam sendo menos severas, considerando que o resto do sistema pode continuar operando ainda que de forma limitada, embora, ao mesmo tempo, isso também acabe dificultando, por vezes, encontrar a origem de um bug no fluxo do sistema.

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

- MVPs
- Sistemas pequenos
- Equipes reduzidas

### Monólito Modular

- Sistemas em crescimento
- Equipes médias
- Projetos que podem migrar para microsserviços futuramente

### Microsserviços

- Grandes sistemas
- Equipes independentes
- Necessidade de escalabilidade seletiva
- Alta disponibilidade
