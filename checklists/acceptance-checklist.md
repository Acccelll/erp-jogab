# Checklist de aceite

> **Template reutilizável de sprint/fase.** Este arquivo é um template — não um checklist preenchido contínuo.
> Copie e preencha para cada sprint ou fase de entrega. Não deixe itens `[ ]` como estado permanente no repositório.

## Arquitetura
- [ ] Stack correta
- [ ] Estrutura por domínio respeitada
- [ ] Layouts obrigatórios presentes (AppLayout, Sidebar, Topbar, ModuleLayout, ObraWorkspaceLayout)
- [ ] Rotas seguem a documentação

## UX
- [ ] Sidebar funcional
- [ ] Topbar funcional (breadcrumbs + seletores Obra/Competência + menu do usuário)
- [ ] Filtros visíveis
- [ ] KPIs visíveis quando aplicável
- [ ] Drawer/modal padronizado

## Qualidade técnica
- [ ] TypeScript consistente
- [ ] Sem duplicação desnecessária
- [ ] Estados de loading/erro/vazio
- [ ] Componentes compartilhados reutilizáveis
- [ ] Query/Store usados corretamente
- [ ] Build e lint passando (`npm run build && npm run lint`)
- [ ] Testes passando (`npm run test`)

## Negócio
- [ ] Obra permanece central
- [ ] Horas Extras tratadas como módulo formal
- [ ] FOPAG tratada como módulo formal
- [ ] Navegação cruzada coerente entre módulos

## Integração
- [ ] withApiFallback em uso nos endpoints integrados
- [ ] Fallback para mock controlado por `VITE_API_FALLBACK`
- [ ] Normalizadores validam payloads parciais
