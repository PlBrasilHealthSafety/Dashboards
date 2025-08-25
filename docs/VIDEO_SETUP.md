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
- **Duração**: 7 segundos (conforme configurado no código)
- **Resolução**: 1920x1080 (Full HD) para TVs
- **Codec**: H.264 para MP4
- **Taxa de bits**: 5-10 Mbps para qualidade TV
- **Áudio**: Opcional (o vídeo será reproduzido mudo)

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
- **Som Inteligente**: Tenta reproduzir com som primeiro, fallback para mudo se bloqueado
- **playsInline**: Reprodução inline em dispositivos móveis
- **object-cover**: Vídeo preenche toda a tela
- **Controle Manual**: Clique/toque para ativar som se necessário
- **Indicador Visual**: Mostra quando o som está desabilitado

## 🔊 Como Funciona o Som:
1. **Primeira tentativa**: Reproduz com som automaticamente
2. **Se bloqueado**: Reproduz sem som com indicador visual
3. **Interação do usuário**: Clique/toque ativa o som
4. **TVs modernas**: Geralmente permitem autoplay com som