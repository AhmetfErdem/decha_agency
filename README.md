# Decha Agency

React (Vite) ile geliştirilen Decha kurumsal web sitesi.

## Geliştirme

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Yapı

- `src/DechaWebsite.jsx` — tüm site tek bileşende (nav, hero, hizmetler, projeler, ekip, iletişim vb.)
- `src/decha-website.css` — sitenin tüm stilleri
- İletişim ve bülten formlarının çalışması için `src/DechaWebsite.jsx` içindeki `CONFIG.WEB3FORMS_KEY` alanına [web3forms.com](https://web3forms.com) adresinden alınan anahtar girilmelidir.
