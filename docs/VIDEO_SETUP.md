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
- ✅ **Sem bloqueio de autoplay** em TVs
- ✅ **Carregamento mais rápido** (sem dependência externa)
- ✅ **Funciona offline**
- ✅ **Compatível com navegadores de TV**
- ✅ **Sem restrições do YouTube**

### 5. **Como Testar:**
1. Adicione o arquivo `novo-contrato-video.mp4` na pasta `public/`
2. Faça o deploy ou teste localmente
3. Crie um novo contrato para testar a reprodução

### 6. **Fallback:**
Se o vídeo não carregar, será exibida a mensagem: "Seu navegador não suporta o elemento de vídeo."

## 🔧 Configurações Aplicadas:
- **autoPlay**: Reprodução automática
- **muted**: Som desabilitado (necessário para autoplay)
- **playsInline**: Reprodução inline em dispositivos móveis
- **object-cover**: Vídeo preenche toda a tela