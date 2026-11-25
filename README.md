# BuckMe 🍑

Eine Banking-App mit Humor – als installierbare Web-App (PWA) fürs Handy. **Spielgeld, keine echte Bank.**

## Features
- **Ladebildschirm** in Lila mit großem BuckMe-Logo
- **Bankkarte** (Girokonto) – Tippen öffnet ein Bottom-Sheet mit:
  1. Jemanden bezahlen
  2. Buck dich selbst (Girokonto → Sparkonto)
  3. Überweisungen (Verlauf)
- **Sparziele** – nur selbst gebucktes Geld zählt:

| Stufe | Ziel | Karte | Kontolimit danach | Maskottchen |
|---|---|---|---|---|
| Start | – | Lila | 5.000 € | grau, stinkt, Fliegen, sabbert |
| 1 | 5.000 € | Bronze | 25.000 € | nur noch 2 Fliegen, Pflaster |
| 2 | 25.000 € | Silber | 50.000 € | keine Fliegen mehr |
| 3 | 50.000 € | Gold | 100.000 € | wieder lila, kein Sabbern, Münzen |
| 4 | 100.000 € | Platin | 1.000.000 € | lächelt, kleine Familie, Münzen |
| 5 | 1.000.000 € | Diamant | 1.000.000 € | Palmen, Sonnenbrille, Frau in „Louis Buckton“, Scheine am Boden |

- **Kontolimit**: Das Girokonto kann maximal so viel halten wie das aktuelle Ziel. Sparkonto und Girokonto sind unabhängig.
- **Einstellungen** (Zahnrad): Testgeld geben, Name ändern, App zurücksetzen.
- Daten werden lokal im Browser gespeichert (localStorage), funktioniert offline.

## Aufs Handy
Seite über GitHub Pages öffnen → im Browser-Menü **„Zum Startbildschirm hinzufügen“** (Android/Chrome) bzw. **Teilen → „Zum Home-Bildschirm“** (iPhone/Safari). Dann startet BuckMe wie eine echte App im Vollbild.

## Lokal starten
```
py -m http.server 8123
```
Dann http://localhost:8123 öffnen.
