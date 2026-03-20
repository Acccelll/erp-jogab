# 02 — Arquitetura técnica

## Princípios
- Tudo tem histórico
- Nada crítico é sobrescrito sem rastreabilidade
- Os módulos se alimentam entre si
- Planejado, comprometido e realizado coexistem
- Documentos e vencimentos são controlados
- Permissões e aprovações são parametrizáveis

## Macroestrutura
### Núcleo central
- Obras
- Cadastros Gerais
- Administração

### Núcleo operacional
- RH
- Horas Extras
- FOPAG
- Compras
- Fiscal
- Financeiro
- Estoque
- Medições e Faturamento
- Gestão Documental

### Núcleo gerencial
- Dashboard Executivo
- Relatórios
- Alertas e Pendências
- Indicadores por Obra

## Fluxos essenciais
- RH → FOPAG → Financeiro → Custo da obra
- Horas Extras → FOPAG → Financeiro → Custo da obra
- Compras → Fiscal → Estoque/Custo → Financeiro
- Medições → Faturamento → Financeiro
