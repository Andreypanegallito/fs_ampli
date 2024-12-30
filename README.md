## Desafio técnico Amplimed

Como foi solicitado o arquivo readme informando como eu fiz e o motivo de ter escolhido tal abordagem. Abaixo está detalhado as ferramentas utilizadas.

# Projeto de Consulta e Comparação de Previsão do Tempo

## Descrição do Projeto

Este projeto tem como objetivo fornecer uma interface para consulta de previsão do tempo de diferentes localidades, salvar essas previsões e comparar os dados salvos.
O projeto foi desenvolvido utilizando React para o frontend e Laravel para o backend, e MySQL como banco de dados.

## Tecnologias Utilizadas

### Frontend

-   **React**: Biblioteca JavaScript para construção de interfaces de usuário.
-   **TypeScript**: Superconjunto de JavaScript que adiciona tipagem estática e outros recursos.
-   **Axios**: Biblioteca para fazer requisições HTTP.
-   **date-fns**: Biblioteca para manipulação e formatação de datas.
-   **InputMask**: Biblioteca para aplicar máscaras em campos de entrada.
-   **Bootstrap**: Framework CSS para estilização e layout responsivo.

### Backend

-   **Laravel**: Framework PHP para construção de aplicações web robustas e escaláveis.
-   **MySQL**: Sistema de gerenciamento de banco de dados relacional utilizado para armazenar os dados das previsões.
-   **HTTP Client**: Ferramenta do Laravel para fazer requisições HTTP.

## Motivação e Decisões de Implementação

### Escolha do React com TypeScript

Decidi utilizar React no frontend devido à sua flexibilidade, eficiência e ampla adoção na comunidade de desenvolvimento. O TypeScript foi escolhido para garantir a tipagem estática e detectar erros durante o desenvolvimento, proporcionando um código mais robusto e fácil de manter.

### Axios para Requisições HTTP

Optamos por usar Axios para lidar com as requisições HTTP devido à sua simplicidade e suporte a recursos avançados, como interceptores e cancelamento de requisições.

### date-fns para Manipulação de Datas

A biblioteca date-fns foi selecionada para formatação de datas por ser leve, modular e oferecer uma sintaxe simples.

### Estrutura do Projeto

-   **Componentização**: O projeto foi dividido em componentes menores e reutilizáveis, seguindo boas práticas de desenvolvimento com React.
-   **Uso de Estado**: Utilizamos `useState` e `useEffect` para gerenciar o estado e efeitos colaterais, garantindo que a interface seja reativa às mudanças de dados.
-   **Controle de Formulários**: Implementamos máscaras de entrada utilizando InputMask para garantir que os dados inseridos pelo usuário sigam o formato correto.

### Backend em Laravel

Laravel foi escolhido para o backend devido à sua robustez, facilidade de uso e integração perfeita com o MySQL. Além disso, Laravel oferece diversos recursos integrados, como roteamento, autenticação e ORM (Eloquent), que facilitam o desenvolvimento de aplicações web.

### Considerações Importantes

-   **Validação de Dados**: Implementamos validações de dados tanto no frontend quanto no backend para garantir a integridade e consistência dos dados armazenados.
-   **UI Responsiva**: Utilizamos Bootstrap para garantir que a interface seja responsiva e adaptável a diferentes tamanhos de tela.
-   **Histórico de Previsões**: Salvamos o histórico das previsões de tempo para que os usuários possam consultar dados passados e compará-los.
-   **Comparação de Localidades**: Implementamos uma funcionalidade para comparar previsões de tempo de diferentes localidades, oferecendo uma visão abrangente das condições climáticas.

## Vídeo da aplicação funcionando

![alt text](view.gif)
