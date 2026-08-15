# Brisa — Gestão de Estoque

Painel administrativo para controle de estoque e vendas de uma loja de perfumes de ambientes. A aplicação permite acompanhar produtos, registrar movimentações e visualizar receitas, custos e lucros em tempo real.

## Funcionalidades

- Autenticação de administradores por e-mail e senha
- Cadastro de produtos com marca, fragrância, volume, custo, preço de venda e quantidade inicial
- Registro de entradas, saídas e vendas com atualização automática do estoque
- Validação de estoque disponível antes de concluir uma saída
- Indicadores de quantidade, produtos esgotados e valor total em estoque
- Histórico das movimentações mais recentes
- Resumo mensal de unidades vendidas, receita e lucro
- Gráficos de evolução de lucros e de receitas versus gastos
- Balanço anual com detalhamento por mês
- Sincronização dos dados em tempo real com o Cloud Firestore

## Tecnologias

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Recharts](https://recharts.org/)

## Regras de negócio

- A quantidade de uma saída deve ser um número inteiro maior que zero.
- Uma venda não pode ultrapassar o estoque disponível.
- O lucro é calculado como `(preço de venda − custo unitário) × quantidade`.
- O balanço considera vendas como receitas e entradas de estoque contabilizáveis como gastos.
- O custo unitário é armazenado no momento da venda, preservando o histórico.

## Licença

Este projeto está disponível sob a [Licença MIT](LICENSE). Copyright © 2026 Kauã de Sousa Novais.
