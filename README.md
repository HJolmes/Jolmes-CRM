# Jolmes CRM – Dokumentation

**Version:** 0.1.0  
**Stand:** 26.05.2026  
**Entwicklerin:** N. Alaoui (Werkstudentin)

---

## 📋 Übersicht

Jolmes CRM ist eine webbasierte Kundenverwaltung für die Jolmes GmbH. Es ersetzt das bisherige SharePoint-CRM und bietet eine moderne, schnelle Oberfläche für die Verwaltung von Kunden, Objekten, Ansprechpartnern und Angeboten.

---

## 🏗️ Tech-Stack

| Technologie | Verwendung |
|---|---|
| Next.js 16 + TypeScript | Frontend + Backend (App Router) |
| PostgreSQL 16 | Datenbank |
| Prisma ORM | Datenbankzugriff |
| Auth.js v5 | Login / Authentifizierung |
| Tailwind CSS | Styling |
| Docker + Docker Compose | Lokale Entwicklung |

---

## 🚀 Setup (lokale Entwicklung)

### Voraussetzungen
- Node.js 22+
- Docker Desktop
- Git

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/HJolmes/Jolmes-CRM crm
cd crm

# 2. Abhängigkeiten installieren
npm install

# 3. Umgebungsvariablen erstellen
# Erstelle eine .env Datei mit folgendem Inhalt:
```

**.env Datei:**
```env
DATABASE_URL="postgresql://crm:crm@localhost:5433/jolmescrm?schema=public"
AUTH_SECRET="dein-geheimes-secret-hier"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="http://localhost:3001"
```

```bash
# 4. Datenbank starten
docker compose up -d

# 5. Datenbank-Schema erstellen
npx prisma migrate dev

# 6. Admin-User erstellen
npx ts-node --esm prisma/seed.ts

# 7. App starten
npm run dev
```

App läuft unter: `http://localhost:3001`

### Standard-Login
- **Email:** admin@jolmes.de
- **Passwort:** admin123

⚠️ **Passwort nach erstem Login ändern!**

---

## 📁 Projektstruktur

```
crm/
├── app/
│   ├── (app)/                    # Geschützte Seiten (mit Sidebar)
│   │   ├── customers/            # Kundenliste + Detailseite
│   │   ├── buildings/            # Objektliste
│   │   ├── contacts/             # Ansprechpartner
│   │   └── offers/               # Angebote (in Entwicklung)
│   ├── api/                      # API Routes
│   │   ├── customers/            # Kunden CRUD
│   │   ├── contacts/             # Ansprechpartner CRUD
│   │   ├── buildings/            # Objekte CRUD
│   │   └── auth/                 # Auth.js Handler
│   ├── components/               # Wiederverwendbare Komponenten
│   │   ├── Sidebar.tsx           # Navigation links
│   │   ├── LogoutButton.tsx      # Abmelden Button
│   │   └── ScrollToTop.tsx       # Scroll-to-Top Button
│   └── login/                    # Login-Seite
├── prisma/
│   ├── schema.prisma             # Datenbankmodell
│   ├── seed.ts                   # Admin-User erstellen
│   ├── import-customers.ts       # Kunden aus Excel importieren
│   ├── import-buildings.ts       # Objekte aus Excel importieren
│   ├── import-contacts-v2.ts     # Ansprechpartner importieren
│   └── migrations/               # SQL-Migrationen
├── docker-compose.yml            # PostgreSQL Container
└── middleware.ts                 # Auth-Schutz für alle Seiten
```

---

## 🗄️ Datenbankmodell

### Customer (Kunde)
| Feld | Typ | Beschreibung |
|---|---|---|
| id | String | Eindeutige ID |
| name | String | Firmenname |
| kdNrGebaeudereinigung | String? | Kundennummer Gebäudereinigung |
| kdNrHandwerk | String? | Kundennummer Handwerk |
| kdNrEnergie | String? | Kundennummer Energie/Personal |
| interessentennummer | String? | Interessentennummer |
| strasse | String? | Straße |
| plz | String? | Postleitzahl |
| ort | String? | Ort |
| telefon | String? | Telefonnummer |
| fax | String? | Faxnummer |
| email | String? | E-Mail |
| web | String? | Webseite |
| branche | String? | Branche |
| entscheider | String? | Entscheider |
| status | KundenStatus? | AKTIV / INAKTIV |
| notes | String? | Notizen / Hauptansprechpartner |

### ContactPerson (Ansprechpartner)
| Feld | Typ | Beschreibung |
|---|---|---|
| id | String | Eindeutige ID |
| anrede | Anrede? | HERR / FRAU / DIVERS |
| vorname | String? | Vorname |
| nachname | String | Nachname (Pflicht) |
| email | String? | E-Mail |
| telefon | String? | Telefon |
| rolle | String? | Rolle/Funktion |
| isHauptansprechpartner | Boolean | Hauptansprechpartner? |
| customerId | String | Verknüpfung zu Kunde |
| buildingId | String? | Verknüpfung zu Objekt |

### Building (Objekt)
| Feld | Typ | Beschreibung |
|---|---|---|
| id | String | Eindeutige ID |
| customerId | String | Verknüpfung zu Kunde |
| name | String | Objektbezeichnung |
| objektNummer | String? | Objektnummer |
| auftragsNummer | String? | Auftragsnummer |
| kategorie | String? | Kategorie (a/b/c) |
| strasse | String? | Straße |
| plz | String? | PLZ |
| ort | String? | Ort |
| bereich | Sparte? | Sparte (GEBAEUDEREINIGUNG etc.) |
| verantwortlicher | String? | Interner Verantwortlicher |

### Offer (Angebot/Auftrag)
| Feld | Typ | Beschreibung |
|---|---|---|
| id | String | Eindeutige ID |
| customerId | String | Verknüpfung zu Kunde |
| buildingId | String? | Verknüpfung zu Objekt |
| sparte | Sparte | GEBAEUDEREINIGUNG / HANDWERK etc. |
| angebotsNummer | String? | Angebotsnummer |
| angebotsDatum | DateTime? | Angebotsdatum |
| angebotsSumme | Float? | Angebotssumme netto |
| status | AngebotsStatus | OFFEN / BEAUFTRAGT / ABGELEHNT |
| gewerk | String? | Gewerk (nur Handwerk) |
| bauphaseBeginn | DateTime? | Bauphase Beginn |
| bauphaseEnde | DateTime? | Bauphase Ende |
| rechnungNummer | String? | Rechnungsnummer |
| rechnungSumme | Float? | Rechnungssumme |
| rgBezahlt | Boolean? | Rechnung bezahlt? |

---

## 📊 Importierte Daten (Stand 26.05.2026)

| Daten | Anzahl | Quelle |
|---|---|---|
| Kunden | 7.298 | SharePoint Kundenliste |
| Objekte | 1.258 | SharePoint Objektliste |
| Ansprechpartner | 208 | SharePoint Objektliste (Hauptansprechpartner) |
| Angebote | 0 | Noch nicht importiert |

---

## ✅ Fertige Features

- **Login/Logout** mit Email + Passwort
- **Kundenliste** mit Suche (Name, Ort, KdNr)
- **Kunden-Detailseite** (alle Felder, Ansprechpartner, Objekte)
- **Kunden anlegen** und **bearbeiten**
- **Ansprechpartner** hinzufügen pro Kunde
- **Objekte** hinzufügen pro Kunde
- **Objektliste** mit Suche
- **Ansprechpartner-Liste** mit Suche
- **Sidebar-Navigation**
- **Import-Skripte** für alle SharePoint-Listen

---

## 🔄 Noch offen (Roadmap)

### Phase 2 – Angebote/Aufträge
- [ ] Angebote aus SharePoint importieren (4 Listen: UR, Glas, Handwerk, Allgemein)
- [ ] Angebots-Liste mit Filter nach Sparte
- [ ] Neues Angebot anlegen
- [ ] Status-Workflow (Offen → Beauftragt → Abgelehnt)
- [ ] Handwerk-spezifisch: Bauphase, Rechnung, Zahlung

### Phase 3 – Erweiterungen
- [ ] Dashboard mit Übersicht (Anzahl Kunden, Objekte, offene Angebote)
- [ ] Benutzer-Verwaltung (Mitarbeiter anlegen)
- [ ] Microsoft-Login (Azure AD / Entra ID)
- [ ] Objekt-Detailseite mit Bearbeiten
- [ ] Ansprechpartner bearbeiten
- [ ] Filter in allen Listen (nach Sparte, Status, Ort)

### Phase 4 – Deployment
- [ ] Server einrichten (Hetzner oder Firmen-Server)
- [ ] Docker Compose für Produktion
- [ ] Automatische Backups
- [ ] HTTPS mit eigenem Zertifikat

### Phase 5 – Verbindung mit LV-Kalkulator
- [ ] Gemeinsame Datenbank oder API
- [ ] Kunde im CRM = Kunde im LV-Kalkulator

---

## 🔧 Nützliche Befehle

```bash
# App starten
docker compose up -d      # Datenbank starten
npm run dev               # App starten

# Datenbank
npx prisma migrate dev    # Migration ausführen
npx prisma generate       # Prisma Client neu generieren
npx prisma studio         # Datenbank im Browser anschauen

# Daten importieren
npx ts-node --esm prisma/import-customers.ts "pfad/zur/datei.xlsx"
npx ts-node --esm prisma/import-buildings.ts "pfad/zur/datei.xlsx"
npx ts-node --esm prisma/import-contacts-v2.ts "pfad/zur/datei.xlsx"

# Git
git add .
git commit -m "feat: beschreibung"
git push origin feature/auth
```

---

## ⚠️ Wichtige Hinweise

- `docker compose down -v` **NIEMALS** benutzen – löscht alle Daten!
- Die `.env` Datei **niemals** auf GitHub pushen – sie enthält Passwörter
- Vor jedem neuen Feature: neuen Branch erstellen
- Nach jedem Feature: Code pushen und Pull Request erstellen

---

## 📞 Kontakt

Bei Fragen: Nada Alaoui Ismaili (Werkstudentin IT)