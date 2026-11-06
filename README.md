# Media Hub (webOS) — Fase 1

Preact + TypeScript + Vite. App para LG webOS.

## Comandos
- `npm run dev` — desenvolvimento no browser (setas = D-pad, Enter = OK, Esc = Voltar)
- `npm run package` — build + gera `release/com.mediahub.app_<versão>_all.ipk`

## Instalar na TV
1. Na TV: app **Developer Mode** → ligar *Dev Mode* e *Key Server*; anotar o IP.
2. No PC: `npx ares-setup-device --add tv --info "{'host':'IP_DA_TV','port':'9922','username':'prisoner'}"`
3. `npx ares-novacom --device tv --getkey` (palavra-passe = passphrase da app Developer Mode)
4. `npx ares-install --device tv release/com.mediahub.app_0.1.0_all.ipk`
5. `npx ares-launch --device tv com.mediahub.app`
(Debug: `npx ares-inspect --device tv com.mediahub.app --open`)

## Atualizações automáticas (OTA)
Cada push para `main` compila no GitHub Actions e publica:
- uma release com o `.ipk` (só precisas de reinstalar quando muda algo nativo: ícone, imagens, boot loader);
- o código novo no branch `ota` (`manifest.json`, `app.js`, `app.css`).

A app procura o `manifest.json` ao abrir (e em Definições → Atualizações), descarrega, valida tamanho e SHA-256,
e arranca a versão nova no reinício seguinte. Se a versão nova der erro, volta sozinha ao código do `.ipk`
e não tenta a mesma outra vez. Quando a atualização precisa de novo `.ipk`, a app avisa.

Marca de versão nativa: `NATIVE` em `vite.config.ts` (sobe quando muda algo que só um `.ipk` entrega).
