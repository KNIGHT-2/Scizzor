# Scizzor

Este projeto é uma plataforma SaaS (Software as a Service) abrangente projetada para o gerenciamento e controle operacional de barbearias e salões de beleza. Otimiza o agendamento, o acompanhamento de clientes e a gestão de serviços, proporcionando uma solução moderna para os fluxos de trabalho diários do negócio.

## 🚀 Como Rodar o Projeto

Você pode rodar o projeto usando Docker Compose.

**Pré-requisitos:** Docker e Docker Compose instalados.

1.  Na raiz do projeto, execute:
    ```bash
    docker compose up --build
    ```
2.  Acesse as aplicações nos seguintes endereços:
    *   **Frontend:** [http://localhost:4200](http://localhost:4200)
    *   **Backend:** [http://localhost:8081](http://localhost:8081)

### Parar e Limpar o Projeto

*   **Para parar o projeto (preservando os dados):**
    ```bash
    docker compose stop
    ```
*   **Para parar o projeto e limpar todos os dados do banco:**
    ```bash
    docker compose down -v
    ```

## 🛠️ Tecnologias Utilizadas

*   **Backend:** Java 25 LTS, Spring Boot 4, PostgreSQL.
*   **Frontend:** Angular 21+.
*   **Infra:** Docker & Docker Compose.