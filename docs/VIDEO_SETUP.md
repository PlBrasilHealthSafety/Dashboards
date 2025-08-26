# Configuração do Vídeo de Novo Contrato

## 📹 Como Adicionar o Vídeo Local

Para que o vídeo funcione corretamente na TV, você precisa adicionar o arquivo de vídeo na pasta `public/` do projeto.

### 1. **Localização do Arquivo:**
Coloque o arquivo de vídeo em:
```
public/novo-contrato-video.mp4
```

### 2. **Formatos Suportados:**
O componente suporta dois formatos para máxima compatibilidade:
- **MP4** (recomendado): `novo-contrato-video.mp4`
- **WebM** (opcional): `novo-contrato-video.webm`

### 3. **Especificações Recomendadas:**
- **Duração**: Flexível (detecta automaticamente quando termina)
- **Resolução**: 1920x1080 (Full HD) para TVs
- **Codec**: H.264 para MP4
- **Taxa de bits**: 5-10 Mbps para qualidade TV
- **Áudio**: OBRIGATÓRIO - O vídeo deve ter trilha sonora
- **Duração**: Detecta automaticamente + 5 segundos de margem de segurança

### 4. **Vantagens do Vídeo Local:**
- ✅ **Som habilitado** com fallback inteligente
- ✅ **Carregamento mais rápido** (sem dependência externa)
- ✅ **Funciona offline**
- ✅ **Compatível com navegadores de TV**
- ✅ **Sem restrições do YouTube**
- ✅ **Controle manual de som** se necessário

### 5. **Como Testar:**
1. Adicione o arquivo `novo-contrato-video.mp4` na pasta `public/`
2. Faça o deploy ou teste localmente
3. Crie um novo contrato para testar a reprodução

### 6. **Fallback:**
Se o vídeo não carregar, será exibida a mensagem: "Seu navegador não suporta o elemento de vídeo."

## 🔧 Configurações Aplicadas:
- **autoPlay**: Reprodução automática habilitada
- **Som Forçado**: Volume máximo (1.0) e muted=false por padrão
- **preload="auto"**: Carrega o vídeo completamente antes de reproduzir
- **playsInline**: Reprodução inline em dispositivos móveis
- **object-cover**: Vídeo preenche toda a tela
- **Event Listeners**: Monitora carregamento para garantir som
- **Controle Manual**: Clique/toque para ativar som se necessário
- **Timer Dinâmico**: Ajusta automaticamente à duração real do vídeo + 5s de margem

## 🔊 Como Funciona o Som:
1. **Primeira tentativa**: Reproduz com som automaticamente
2. **Se bloqueado**: Reproduz sem som com indicador visual
3. **Interação do usuário**: Clique/toque ativa o som
4. **TVs modernas**: Geralmente permitem autoplay com som
## ⏱️ S
istema de Timing Inteligente:

### Como Funciona:
1. **Detecção Automática**: O vídeo termina naturalmente (event 'ended')
2. **Timer de Segurança Dinâmico**: 
   - Detecta a duração real do vídeo quando carrega
   - Adiciona 5 segundos de margem de segurança
   - Mínimo de 30 segundos se a duração não for detectada
3. **Logs de Monitoramento**: Console mostra duração detectada e ajustes

### Vantagens:
- ✅ **Nunca corta o vídeo** prematuramente
- ✅ **Adapta-se a qualquer duração** de vídeo
- ✅ **Margem de segurança** automática
- ✅ **Fallback robusto** para casos de erro
- ✅ **Logs detalhados** para debugging

### Exemplo de Funcionamento:
- Vídeo de 12 segundos → Timer de segurança: 17 segundos
- Vídeo de 20 segundos → Timer de segurança: 25 segundos
- Duração não detectada → Timer de segurança: 30 segundos