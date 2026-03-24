# 07 — Regras de implementação

## Não fazer
- Não mudar a stack
- Não reorganizar o projeto fora da arquitetura por domínio
- Não remover módulos definidos
- Não inventar rotas fora do padrão documentado em `docs/06-arquitetura-de-telas.md`
- Não tratar a obra como cadastro isolado
- Não simplificar Horas Extras e FOPAG
- Não criar componentes duplicados sem necessidade
- Não remover testes úteis
- Não remover `vercel.json`

## Sempre fazer
- Implementar em lotes pequenos
- Reutilizar componentes compartilhados
- Manter nomes consistentes
- Respeitar contexto global
- Preparar navegação cruzada entre módulos
- Listar arquivos criados e alterados ao final de cada tarefa
- Usar normalização em services para proteção contra payloads parciais
- Implementar estados de loading, erro e vazio em todas as páginas

## Critérios de aceite globais
- compilação funcional (`npm run build`)
- rotas corretas conforme `docs/06-arquitetura-de-telas.md`
- layouts corretos
- tipagem consistente (TypeScript strict)
- estados de loading/erro/vazio
- aderência à documentação
- linting sem erros (`npm run lint`)
- testes passando (`npm run test`)

## Fluxo de validação
```bash
cd frontend
npm install
npm run build
npm run lint
npm run test
```

## Estratégia de testes
- Framework: Vitest + Testing Library + jsdom
- Testes co-localizados com o código (`*.test.ts` / `*.test.tsx`)
- Normalização de services deve ter testes unitários
- Páginas de lista devem ter testes de loading/erro/dados/vazio
- Não remover testes existentes sem justificativa

## Estratégia de deploy
- Vercel como plataforma principal de preview/deploy
- `frontend/vercel.json` configura SPA routing
- `netlify.toml` mantido como alternativa
- Deploy automático por branch/PR no Vercel
