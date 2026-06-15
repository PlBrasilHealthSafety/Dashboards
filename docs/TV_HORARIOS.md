# Modo TV — Horários e Conteúdo

Documentação do carrossel exibido na TV corporativa (rota `/tv`). Todos os horários usam o fuso **America/Sao_Paulo**.

## Visão geral

A TV exibe um carrossel em loop com **14 posições fixas**. Slides fora do horário não são removidos da lista — ficam marcados como `autoSkip` e o carrossel pula automaticamente para o próximo conteúdo válido. Isso evita travamentos por ponteiro apontando para posição vazia.

Componentes de segurança em runtime:

- `carousel-pointer.ts` — lógica de ponteiros (252+ testes automatizados)
- `TVCarouselGuard` — auditoria a cada 4s e recuperação automática se detectar travamento

## Horários

### Gráficos Looker Studio

| Período     | Horário        | Ciclos máximos/dia |
|------------|----------------|--------------------|
| Manhã      | **08:00–10:00** | 5 ciclos completos |
| Tarde      | **14:00–17:00** | 7 ciclos completos |

**Fora dessas janelas:** os 5 painéis Looker são pulados. A TV exibe apenas os 8 slides PPT em loop (~4 min por volta).

**Duração de cada painel Looker:** 4 minutos.

**Timeout de carregamento:** 15 segundos — se o iframe não carregar, o slide é pulado.

Configuração em `src/lib/looker-schedule.ts`.

### Slide de aniversariantes

| Período | Horário        | Frequência   |
|---------|----------------|--------------|
| Manhã   | **10:00–10:30** | 1x por dia  |
| Tarde   | **15:00–15:30** | 1x por dia  |

**Fora dessas janelas:** o slot de aniversariantes é pulado.

**Duração:** 3 minutos (180 segundos).

Configuração em `src/hooks/useBirthdaySlideSchedule.ts`.

### Slides PPT (apresentação institucional)

| Conteúdo | Horário   | Duração  |
|----------|-----------|----------|
| 8 slides | **Sempre** | 30s cada |

Arquivos em `public/slides/slide-1.png` … `slide-8.png`.

## Ordem do carrossel (14 posições)

A ordem é fixa e definida em `src/lib/lookerConfig.ts` (`TV_MODE_CAROUSEL_LAYOUT`):

| # | Tipo        | Conteúdo |
|---|-------------|----------|
| 1 | PPT         | Slide 1 |
| 2 | PPT         | Slide 2 |
| 3 | Looker      | Medicina — Convocação |
| 4 | PPT         | Slide 3 |
| 5 | PPT         | Slide 4 |
| 6 | Looker      | Medicina — Liberação Dados Gerais |
| 7 | Looker      | Medicina — Agendamento |
| 8 | Looker      | Medicina — Desempenho Agendamento |
| 9 | Aniversário | Aniversariantes do mês |
| 10 | PPT        | Slide 5 |
| 11 | PPT        | Slide 6 |
| 12 | Looker      | Medicina — ASOs Dados Gerais |
| 13 | PPT        | Slide 7 |
| 14 | PPT        | Slide 8 |

### O que o público vê em cada faixa de horário

**Exemplo — 11:00 (fora de Looker e aniversário):**

PPT 1 → PPT 2 → *(pula Looker)* → PPT 3 → PPT 4 → *(pula 3 Lookers)* → *(pula aniversário)* → PPT 5 → PPT 6 → *(pula Looker)* → PPT 7 → PPT 8 → repete.

**Exemplo — 09:00 (janela Looker manhã):**

Todos os slots são exibidos na ordem acima, incluindo gráficos e (se dentro de 10:00–10:30) aniversariantes.

**Exemplo — 15:15 (tarde, Looker + aniversário):**

Carrossel completo com gráficos e slide de aniversariantes (se ainda não exibido na janela da tarde).

## Ciclo Looker

Um **ciclo** começa ao entrar no primeiro painel Looker (`medicina-convocacao`) e termina ao sair do último (`medicina-asos`). O contador de ciclos é salvo em `localStorage` (`plbrasil:looker-cycle-history`) e reinicia a cada dia.

Quando o horário Looker termina (10:00 ou 17:00), qualquer ciclo em andamento é encerrado e os gráficos passam a ser pulados imediatamente.

## Notificações sobrepostas

Independente do carrossel:

- **Novo contrato** — vídeo + dados do contrato (listener Firestore em tempo real)
- **Imagem fixa** — overlay configurável (`ImageNotificationOverlay`)

## Duas TVs (ou mais) na mesma rede

O aviso do navegador **"deseja continuar usando a outra"** restaura a sessão/cache de outra aba ou TV. Isso pode trazer o carrossel **travado no slide errado** (estado antigo + horário que mudou).

### Configuração recomendada (obrigatória para 2+ TVs)

Abra cada TV com um **ID fixo na URL**, para não compartilhar histórico de ciclos Looker e aniversário:

| TV | URL de favorito |
|----|-----------------|
| TV 1 | `https://seu-dominio.vercel.app/tv-dashboard?tv=sala-a` |
| TV 2 | `https://seu-dominio.vercel.app/tv-dashboard?tv=sala-b` |

Substitua `sala-a` / `sala-b` por nomes que identifiquem cada aparelho.

### Se aparecer "continuar sessão / continuar de onde parou"

Pode clicar **Sim** — o sistema foi preparado para isso. Ao restaurar sessão antiga:

1. **Script em `index.html`** (antes do React) — recarrega a página imediatamente se detectar cache (`pageshow` / `resume`).
2. **`useTvCarouselSessionRecovery`** — segunda camada: reload se ainda estiver instável.
3. **`TVCarouselGuard`** — se falhar 3 vezes em 45s, força reload completo.
4. **Detecção de aba duplicada** — duas abas com o mesmo `?tv=sala-a` na mesma máquina: uma recarrega para não disputar estado.

Ainda assim, o ideal é usar **favoritos com `?tv=` diferentes** em cada aparelho.

- **Não use a mesma URL sem `?tv=`** nas duas TVs — elas disputam o mesmo `localStorage`.

### O que o sistema faz automaticamente (software)

| Camada | Quando age |
|--------|------------|
| Script `index.html` | Imediato ao clicar "Sim" / bfcache |
| `useTvCarouselSessionRecovery` | Sessão restaurada, outra aba, storage alterado |
| `TVCarouselGuard` | A cada 4s + escalada após 3 falhas |
| `useTvKioskShield` | Erro JS, internet volta, slide parado tempo demais, reload 3h |
| `TvErrorBoundary` | Qualquer crash React → reload |
| Wake Lock | Tenta manter a tela ligada (se o navegador permitir) |
| `?tv=sala-a` / `?tv=sala-b` | Histórico Looker/aniversário isolado por TV |

### Travas recomendadas no aparelho (hardware / navegador)

Estas não estão no código, mas **evitam 90% dos problemas em TV**:

| Trava | Como fazer |
|-------|------------|
| **Favorito fixo com `?tv=`** | Uma URL por aparelho, abrir em tela cheia |
| **Modo quiosque** | Chrome Kiosk / Fully Kiosk / iniciar navegador em `--kiosk` |
| **Desligar suspensão da TV** | Configurações da TV → Energia → Nunca desligar |
| **Desligar "continuar de onde parou"** | Nas configurações do navegador da TV, se existir |
| **Cabo de rede** | Preferir ethernet em vez de Wi‑Fi instável |
| **Não abrir duas abas** | Só uma instância do `/tv-dashboard` por TV |

### Reload automático de manutenção

Todo dia entre **03:00 e 03:05** (horário do relógio da TV), a página recarrega uma vez para limpar memória — fora do horário dos gráficos Looker.

## Comandos úteis

```bash
npm run test        # Testes de ponteiros e saúde do carrossel
npm run build       # Build de produção
npm run type-check  # Verificação TypeScript
```

## Arquivos principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/pages/TVDashboard.tsx` | Montagem do carrossel e overlays |
| `src/components/custom/DynamicTimerCarousel.tsx` | Timer, navegação e render |
| `src/components/custom/TVCarouselGuard.tsx` | Vigilância e recuperação em runtime |
| `src/lib/carousel-pointer.ts` | Algoritmos de ponteiro |
| `src/lib/tv-carousel-health.ts` | Auditoria de saúde |
| `src/hooks/useLookerSlideSchedule.ts` | Horários Looker |
| `src/hooks/useBirthdaySlideSchedule.ts` | Horários aniversário |
| `src/lib/lookerConfig.ts` | Layout e URLs dos dashboards |
| `src/hooks/useTvKioskShield.ts` | Erros, rede, stall, reload noturno |
| `src/components/custom/TvErrorBoundary.tsx` | Crash React |
| `src/lib/tv-session-shield.ts` | Reload por sessão/bfcache |
| `src/lib/tv-station.ts` | ID por TV (`?tv=`) |
