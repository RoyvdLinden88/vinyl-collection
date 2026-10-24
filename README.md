# Platenkast

Je platencollectie beheren als app op je telefoon. Gebouwd met Nuxt 4 en Supabase.

## Eenmalige setup in Supabase

1. **Database en opslag**: open in het Supabase-dashboard de *SQL Editor*, plak de inhoud van
   [`supabase/schema.sql`](supabase/schema.sql) en klik op *Run*. Dit maakt de tabel `records`
   en de opslag-bucket `covers` aan.
2. **Account voor beheer**: ga naar *Authentication → Users → Add user* en maak een gebruiker aan
   met e-mailadres en wachtwoord. Daarmee log je in op de beheerpagina.
3. Zet daarna onder *Authentication → Sign In / Providers* de optie **Allow new users to sign up** uit,
   zodat niemand anders een account kan aanmaken.

Iedereen met de link kan de collectie bekijken; alleen ingelogde gebruikers kunnen platen toevoegen,
wijzigen of verwijderen.

## Ontwikkelen

```bash
npm install
npm run dev
```

De Supabase-gegevens staan in `.env` (zie `.env.example`).

## Publiceren

```bash
npm run generate
```

Zet de map `.output/public` op een statische host (bijv. Netlify, Vercel of Cloudflare Pages) en
stel daar de omgevingsvariabelen `SUPABASE_URL` en `SUPABASE_KEY` in.

Op de iPhone: open de site in Safari → deelknop → *Zet op beginscherm*.

## Iconen

Het app-icoon is [`public/favicon.svg`](public/favicon.svg). Na een wijziging:

```bash
npm run icons
```
