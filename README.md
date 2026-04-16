# Projektdokumentation - Lifelist

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2. [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen [Optional]](#4-erweiterungen-optional)
5. [Projektorganisation [Optional]](#5-projektorganisation-optional)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang [Optional]](#7-anhang-optional)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

<!-- WICHTIG: DIE KAPITELSTRUKTUR DARF NICHT VERÄNDERT WERDEN! -->

<!-- Diese Vorlage ist für eine README.md im Repository gedacht. Abschnitte mit [Optional] können weggelassen werden, wenn in den Übungen nichts anderes verlangt wird. -->

## 1. Ausgangslage

Vogelbeobachtung ("Birding") ist ein wachsendes Freizeit-Hobby, das Menschen in die Natur bringt, Achtsamkeit fördert und gleichzeitig wertvolle Daten für den Artenschutz liefern kann. Viele Hobby-Beobachter:innen möchten ihre Sichtungen festhalten – sei es aus persönlichem Interesse (eigene Erfolge sehen, Lernfortschritt verfolgen) oder um zu Citizen-Science-Projekten beizutragen. Bestehende digitale Lösungen sind jedoch entweder zu komplex (Profi-Tools wie eBird oder ornitho.ch mit wissenschaftlichem Anspruch) oder zu rudimentär (Notiz-App, Excel-Liste, Notizbuch).

- **Problem:** Hobby-Vogelbeobachter:innen fehlt ein einfaches, mobiles Werkzeug, um Sichtungen unterwegs schnell festzuhalten und ihre persönlichen Beobachtungserfolge ("Life List") motivierend sichtbar zu machen. Profi-Plattformen schrecken durch Komplexität und wissenschaftliche Pflichtfelder ab; private Notizen sind nicht durchsuchbar und gehen verloren. Beispiel: Wer auf einem Spaziergang spontan einen Eisvogel sieht, möchte das in Sekunden festhalten – nicht erst Distanz, Beobachtungsdauer und Protokolltyp eintragen.

- **Ziele:**
  - Sichtungen in unter 30 Sekunden mobil erfassen können
  - Persönliche Life List automatisch aus Sichtungen ableiten und motivierend visualisieren
  - Niedrige Einstiegshürde für Einsteiger:innen, ohne Funktionsumfang für Fortgeschrittene zu opfern
  - Optionaler Citizen-Science-Mehrwert (Sichtungen als wissenschaftlich verwertbar markieren)

- **Primäre Zielgruppe:** Hobby-Vogelbeobachter:innen vom Einsteiger bis zur fortgeschrittenen Hobbyebene, die ihre Sichtungen persönlich dokumentieren und ihre Lernfortschritte verfolgen möchten – ohne wissenschaftlichen Protokollzwang.

- **Weitere Stakeholder:** Naturpädagog:innen und Lehrpersonen, die mit Gruppen Beobachtungen sammeln; Citizen-Science-Plattformen (z.B. ornitho.ch, eBird) als potenzielle Empfänger freigegebener Sichtungen.

## 2. Lösungsidee
Beschreibt die Lösungsidee.
- **Kernfunktionalität:** _[Workflows kurz nennen und optional illustrieren]_  
- **Annahmen [Optional]:** _[welche Hypothesen werden geprüft?]_
- **Abgrenzung [Optional]:** _[Was gehört explizit nicht zum Umfang?]_

## 3. Vorgehen & Artefakte
Die Durchführung erfolgt phasenbasiert; dokumentieren Sie die wichtigsten Ergebnisse je Phase.

### 3.1 Understand & Define
- **Zielgruppenverständnis:** _[Problemraumanalyse, Recherche, (Proto-)Personas]_
- **Wesentliche Erkenntnisse:** _[Stichpunkte]_
### 3.1 Understand & Define

- **Zielgruppenverständnis:**

  **Problemraumanalyse (Recherche zum Ist-Zustand)**

  | Aspekt | Erkenntnisse |
  |---|---|
  | **Benutzer:innen** | Hobby-Vogelbeobachter:innen vom Einsteiger bis Fortgeschrittenen-Niveau; teilweise mit Bezug zu Citizen Science, mehrheitlich aber rein privat motiviert |
  | **Aufgaben** | Sichtung erfassen (Art, Ort, Zeit, ggf. Notiz/Anzahl); persönliche Life List pflegen; Sichtungen wiederfinden und zurückblicken |
  | **System (Ist)** | eBird, Merlin, ornitho.ch / NaturaList, Notizbuch, Handy-Notizen-App, Excel |
  | **Umfeld** | Outdoor-Nutzung (Wald, Park, Wanderung), oft spontan; teils kalte/feuchte Bedingungen; Smartphone als Hauptgerät; nicht immer stabile Internetverbindung |
  | **Positives (Keep)** | eBird liefert riesige Artendatenbank und globale Reichweite; Merlin's Bestimmungsfunktion ist sehr stark; Life List motiviert nachweislich |
  | **Frustpunkte** | Profi-Tools wirken überladen; lange Erfassungsformulare; analoge Notizen sind nicht durchsuchbar; keine Auswertung möglich; modernes UI fehlt oft |

  **Proto-Personas**
  -
<table>
<tr>
<td width="280">
<img src="docs/assets/persona-lena.png" alt="Lena" width="250">
</td>
<td>

> *"Als Gelegenheits-Beobachterin möchte ich meine Life List auf einen Blick sehen, damit ich meinen Lernfortschritt als Erfolgserlebnis wahrnehme."*

</td>
</tr>
</table>

  
  *Persona 1: Lena, die Gelegenheits-Beobachterin*
  - **Persönliche Attribute:** 28 Jahre, Marketing-Mitarbeiterin, geht regelmässig wandern und spazieren, interessiert sich seit ca. einem Jahr für Vögel
  - **Umfeld:** Smartphone-Nutzung unterwegs, oft im Park oder auf Wochenend-Wanderungen
  - **Ziele:** Wissen, welche Arten sie schon gesehen hat; Lernfortschritt sehen; Hobby spielerisch ausbauen
  - **Aufgaben:** Sichtung schnell festhalten; Life List anschauen; ab und zu durch alte Sichtungen scrollen
  - **Frustpunkte:** eBird wirkt für sie wie ein wissenschaftliches Tool; Notizen-App im Handy ist unstrukturiert; unsicher bei Bestimmung
---

 <table>
<tr>
<td width="280">
<img src="docs/assets/persona-markus.png" alt="Markus" width="250">
</td>
<td>

> *"Als ambitionierter Hobby-Birder möchte ich eine Sichtung nachträglich bearbeiten oder löschen können, damit ich Fehleinträge korrigieren kann."*

</td>
</tr>
</table>

  *Persona 2: Markus, der ambitionierte Hobby-Birder*
  - **Persönliche Attribute:** 52 Jahre, Lehrer, beobachtet seit 15 Jahren, kennt die meisten Schweizer Brutvögel sicher
  - **Umfeld:** Plant gezielte Beobachtungs-Touren; nutzt Fernglas und Bestimmungsbücher; offen für digitale Tools
  - **Ziele:** Persönliches Sichtungs-Archiv über Jahre pflegen; gelegentlich auch wissenschaftlich verwertbare Daten beisteuern
  - **Aufgaben:** Sichtungen detailliert erfassen (Anzahl, Verhalten, Ort); eigene Statistiken anschauen; Sichtungen exportieren
  - **Frustpunkte:** ornitho.ch-Bedienung ist unübersichtlich; will nicht für jede Notiz wissenschaftlich-formal protokollieren
---
 
 <table>
<tr>
<td width="280">
<img src="docs/assets/persona-sarah.png" alt="Sarah" width="250">
</td>
<td>

> *"Als Naturpädagogin möchte ich mit meiner Klasse gemeinsam Sichtungen erfassen können, damit wir die Beobachtungen später im Unterricht besprechen können."*

</td>
</tr>
</table>

  *Persona 3: Sarah, die Naturpädagogin*
  - **Persönliche Attribute:** 41 Jahre, Primarlehrerin mit Zusatzausbildung Naturpädagogik
  - **Umfeld:** Schulausflüge, Klassen mit 15–20 Kindern, draussen
  - **Ziele:** Beobachtungen mit der Klasse gemeinsam dokumentieren und später im Unterricht reflektieren
  - **Aufgaben:** Schnell und einfach mit Kindern Sichtungen festhalten
  - **Frustpunkte:** Vorhandene Apps sind für Kinder zu komplex

- **Wesentliche Erkenntnisse:**
  - Es gibt eine klare Lücke zwischen "Notizbuch" (zu unstrukturiert) und "eBird/ornitho" (zu komplex)
  - Die Nutzung erfolgt überwiegend mobil und unterwegs – Mobile-First und schnelle Erfassung sind kritisch
  - Die **Life List** ist ein zentrales Motivations-Element und sollte prominent platziert werden
  - Citizen-Science-Beitrag ist für einen Teil der Zielgruppe relevant, aber niemals Pflicht – **Opt-In** ist der richtige Weg
  - Bestimmungs-Unsicherheit ist real – die App muss damit umgehen können (z.B. "unsichere Sichtung" markieren), darf den Workflow aber nicht verlangsamen
  - Persona 3 (Naturpädagogik) bestätigt den Bedarf nach Einfachheit, ist aber kein primärer Designtreiber – wird im Mindestumfang nicht aktiv adressiert
  - Annahmen, die in der Validate-Phase überprüft werden müssen: Akzeptiert die Zielgruppe eine vorbefüllte Artenliste? Reichen die Pflichtfelder (Art, Datum, Ort) für unter 30 Sek. Erfassung?

### 3.2 Sketch
- **Variantenüberblick:** _[kurz]_
- **Skizzen:** _[Mehrere Varianten; Unterschiede kurz dokumentieren.]_

### 3.3 Decide
- **Gewählte Variante & Begründung:** _[Entscheidkriterien nennen]_  
- **End-to-End-Ablauf:** _[Beschreibung inkl. User Journey Map]_  
- **Mockup:** _[URL, z. B. Figma; Screenshots mit kurzen Beschreibungen]_  

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)
Beschreibt die Gestaltung und Interaktion.
> **Hinweis:** Hier wird der **Prototyp** beschrieben, nicht das **Mockup**.
- **Informationsarchitektur:** _[z. B. Seiten/Navigation: Konzept, nicht die technische Umsetzung]_
- **User Interface Design:** _[wichtige Screens: Screenshots mit kurzen Erläuterungen]_  
- **Designentscheidungen:** _[zentrale Entscheidungen und Begründungen]_

#### 3.4.2. Umsetzung (Technik)
Fasst die technische Realisierung zusammen.
- **Technologie-Stack:** _[SvelteKit, Bibliotheken falls genutzt]_
- **Tooling:** _[IDE/Erweiterungen, lokale/Cloud-Tools; den Einsatz von KI beschreiben Sie im Kapitel **KI-Deklaration**]_  
- **Struktur & Komponenten:** _[Seiten, Routen, State/Stores, wichtige Komponenten]_
- **Daten & Schnittstellen:** _[Wie werden Daten gespeichert, verwaltet, abgerufen?]_
- **Deployment:** _[URL]_  
- **Besondere Entscheidungen:** _[z. B. Trade-offs, Vereinfachungen]_  

### 3.5 Validate
- **URL der getesteten Version** (separat deployt)
- **Ziele der Prüfung:** _[welche Fragen sollen beantwortet werden?]_  
- **Vorgehen:** _[moderiert/unmoderiert; remote/on-site]_  
- **Stichprobe:** _[Mit wem wurde getestet? Profil; Anzahl]_  
- **Aufgaben/Szenarien:** _[Ausformulierte Testaufgaben]_  
- **Kennzahlen & Beobachtungen:** _[z. B. Erfolgsquote, Zeitbedarf, qualitative Findings]_  
- **Zusammenfassung der Resultate:** _[Wichtigste Erkenntnisse; 2-4 Sätze]_  
- **Abgeleitete Verbesserungen:** _[Anforderungen, die als nächstes umgesetzt werden sollten, priorisiert, kurz begründet; falls Verbesserungen im Prototyp konkret umgesetzt wurden: In Kap. 4 dokumentieren]_  

## 4. Erweiterungen [Optional]
Dokumentiert Erweiterungen über den Mindestumfang hinaus.
> **Hinweis:** Jede Erweiterung ist separat nach dem folgenden Schema zu beschreiben.

### _[4.x Kurzbeschreibung / Titel]_  
- **Beschreibung & Nutzen:** _[Was wurde erweitert? Warum?]_  
- **Wo umgesetzt:** _[Wie und wo wurde es gemacht? Frontend, Backend, Datenbank?]_  
- **Referenz:** _[Wo wird die Erweiterung auch noch beschrieben, z.B. Screenshot oder Beschreibung in einem anderen Kapitel]_  
- **Aus Evaluation abgeleitet?:** _[Wurde diese Erweiterung als Folge eines in der Evaluation identifizierten Issues implementiert?]_  

> Das folgende **Beispiel** wurde bewusst kurz gehalten. Erweiterungen dürfen auch ausführlicher beschrieben werden.

### 4.1 Tabelle nach Kategorien filtern
- **Beschreibung & Nutzen:** Tabelle X kann nach Kategorie gefiltert werden, weil User typischerweise nur an einer bestimmten Kategorie interessiert sind.  
- **Wo umgesetzt:** 
  - **Frontend:** Tabelle mit Dropdown in Datei ...
  - **Backend:** Form Action ... in Datei ...
  - **Datenbank:** MongoDB-Query in Datei ...
- **Referenz:** Screenshot in Kap. x.y
- **Aus Evaluation abgeleitet?:** Ja, Issue x.y

## 5. Projektorganisation [Optional]
Beispiele:
- **Repository & Struktur:** _[Link; kurze Strukturübersicht]_  
- **Issue-Management:** _[Vorgehen kurz beschreiben]_  
- **Commit-Praxis:** _[z. B. sprechende Commits]_

## 6. KI-Deklaration
Die folgende Deklaration ist verpflichtend und beschreibt den Einsatz von KI im Projekt.

### 6.1 KI-Tools
- **Eingesetzte Tools**: _[z. B. Copilot, ChatGPT, Claude, lokale Modelle; Version/Variante wenn bekannt]_
- **Zweck & Umfang**: _[wie, wofür und in welchem Ausmass wurde KI eingesetzt (z. B. Textentwürfe, Codevorschläge, Tests, Refactoring); welche Teile stammen (ganz/teilweise) aus KI-Unterstützung?]_
- **Eigene Leistung (Abgrenzung):** _[was ist eigenständig erarbeitet/überarbeitet worden?]_

### 6.2 Prompt-Vorgehen
_[Überlegungen zu Prompt-Vorgehen, Qualität und Urheberrecht/Quellen. Wie wurde beim Prompting vorgegangen? Zu beschreiben ist die grundlegende Vorgehensweise. Einzelne, konkrete Prompts sollten höchstens als Beispiele aufgeführt werden. ]_

### 6.3 Reflexion
_[Nutzen, Grenzen, Risiken/Qualitätssicherung, ...]_

## 7. Anhang [Optional]
Beispiele:
- **Quellen:** _[verwendete Vorlagen/Assets/Modelle; Lizenz/Urheberrecht; ...]_
- **Testskript & Materialien:** _[Link/Datei]_  
- **Rohdaten/Auswertung:** _[Link/Datei]_  

