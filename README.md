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
