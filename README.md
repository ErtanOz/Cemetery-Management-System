# DigiFried-Management-Melaten

Interaktive Arbeitsversion auf Basis der vom Nutzer bereitgestellten Datei melaten_friedhof.png (800 × 888 Pixel).

## Funktionen

* Interaktive Karte mit 157 schematisch nachgezeichneten Flurflächen, Auswahl, Suche, Statusfilter, Zoom und Verschieben.
* Umschalten zwischen Arbeitskarte, vektorisierter Vorlage und Original.
* Prüfstatus und Notizen je Fläche.
* Grabregister mit Erstellen, Bearbeiten, Löschen, Flächenzuordnung, Grabart, Status und Nutzungsende.
* Aufgaben mit Priorität, Frist und Erledigungsstatus.
* Lokale Speicherung im Browser, JSON-Sicherung und validierter Wiederimport, CSV-Export des Grabregisters.
* Responsive Oberfläche mit Tastaturbedienung der Flächen.

## Start

Die Dateien unter dist bilden eine eigenständige statische Website ohne externe Bibliotheken oder Netzabrufe. dist/index.html kann lokal geöffnet oder auf einem statischen Webserver bereitgestellt werden. Lokale Dateiadressen können je nach Browser eingeschränkte Speicherung haben. Auf derselben HTTPS-Adresse sind Browserdaten an diese Adresse und das jeweilige Browserprofil gebunden.

## Vektordaten

* melaten-vektor.svg: Konturen aus drei Farbklassen der Rastervorlage als echte SVG-Pfade. Beschriftungen sind Pfade, kein OCR-Text. Kein eingebettetes Rasterbild. Antialiasing, feine Linien und kleine Zeichen können von der Vorlage abweichen.
* melaten-flaechen.svg: 157 semantische Flurflächen als einzeln benannte Polygone mit Textlabels.
* plan-data.json: Arbeitsgeometrien in Bildkoordinaten, Ursprung links oben, Y nach unten.
* flaechen-lokal.csv: WKT-Polygone in lokalen Pixelkoordinaten, Y nach oben gespiegelt (Y = 888 - Bild-Y). Keine Meterwerte und kein EPSG-Raumbezug. In QGIS als getrennte Textdatei mit WKT-Geometrie öffnen und als lokales, nicht georeferenziertes Datenmaterial behandeln. Kein EPSG:25832 oder EPSG:4326 zuweisen, ohne echte Georeferenzierung.

Das Flächenmodell ist keine amtliche Bestandsgeometrie. Rand- und Wegekennungen sind teilweise nicht als Flurflächen modelliert. Kleine Flächen und schräge Grenzen sind vereinfacht. Die Vorlage enthält keine verlässlichen Einzelgrabgrenzen oder Belegungsdaten. Deshalb ist das Register zu Beginn leer. Jeder Datensatz ist nur einer Fläche zugeordnet, ohne behauptete genaue Grabposition.

## Datenhaltung

Keine zentrale Datenbank, kein Mehrbenutzerbetrieb und keine Benutzerrollen. Der private Websitezugang ist von der lokalen Datenspeicherung getrennt. Verschiedene Browser oder Geräte teilen keine Einträge. Browserdaten löschen entfernt diese Daten. Regelmäßig JSON sichern. Import ersetzt alle aktuellen lokalen Verwaltungsdaten nach Bestätigung. CSV ist ein Registerexport, keine vollständige Sicherung. Die Erfassungsformulare sind keine amtliche Fachverfahrenslösung.

## Prüfung

SVG vollständig gerendert und visuell mit der Vorlage verglichen. Schematische Polygonüberlagerung visuell kontrolliert, Kennungen auf Eindeutigkeit und Koordinaten auf Bildgrenzen geprüft. JavaScript-Syntax und lokale Assetreferenzen geprüft. Kein vollständiger Browser-End-to-End-Test in dieser Umgebung.

## Reproduzierbarkeit

vectorize.py erstellt Konturen aus source.png (Python, Pillow, NumPy). build_data.py erstellt das schematische Flächenmodell (Python-Standardbibliothek). Änderungen an den Geometrien erfolgen dort.

Für eine spätere Fachanwendung: Georeferenzierung mit geprüften Passpunkten, Abgleich der Flurflächen, Einzelgraberfassung, zentrale Datenbank, Benutzerrollen und Änderungenhistorie.


## Version 1.1: Funktionen aus der Referenz-App

Übernommen und an echte lokale Datensätze angebunden:

* Themenkarten für Belegung, Nutzungsende und manuell erfasste Schutzmerkmale.
* Grabübersicht je Fläche als anklickbare Kacheln. Keine räumliche Einzelgrabposition.
* Analyse mit Statusverteilung, Fristenliste, fehlenden Datumsangaben und überfälligen Aufgaben.
* Optionale Geburts-, Sterbe- und Beisetzungsdaten sowie Denkmal-, Ehren- oder Kriegsgrabmerkmale mit Quellenfeld.
* Aufgaben mit Zuständigkeit und den Zuständen Offen, In Arbeit und Erledigt.
* Druckbare Flächenauszüge und Gesamtübersicht, über den Browser als PDF speicherbar.
* Einklappbare Detailansicht und direkter Kartenfokus auf die nördliche Erweiterung.

Alle Zahlen basieren auf tatsächlich erfassten Datensätzen. Belegungsanteil bedeutet Belegt / (Frei + Belegt + Reserviert), nicht Kapazitätsauslastung. Nutzungsenden werden als Datum behandelt: vor heute überschritten, heute bis einschließlich 90 Tagen bevorstehend. Aufgelöste Gräber sind von Fristen ausgeschlossen. Ein überschrittenes Datum ändert keinen Grabstatus automatisch.

Der Speichername und das Sicherungsschema bleiben erhalten. Die neuen Attribute sind optional, alte Sicherungen sind weiterhin importierbar. Datumseingaben werden validiert. CSV enthält auch die neuen Grabattribute.

Nicht übernommen: unbestätigte Prominenten-Dossiers, fest eingetragene Bestandszahlen, zufällige Grabraster, erfundene Infrastrukturstandorte, simulierte Behördenmeldungen, automatische Ruhezeiten und feste Routen mit behaupteten Entfernungen. Dafür fehlt eine fachlich verifizierte Datenbasis.

Validierung: `node tests/management.test.cjs` prüft Fristgrenzen, gültige Kalenderdaten, Nenner der Belegung, Kompatibilität alter Sicherungen, neue JSON-Rundläufe und unzulässige Eingaben. Zusätzlich Syntax- und Assetprüfung. Kein vollständiger Browser-End-to-End-Test.


## Repository

Projektname: **DigiFried-Management-Melaten**. Repository: https://github.com/ErtanOz/Cemetery-Management-System

Die Website liegt unter `dist/`. Zum Starten `dist/index.html` im Browser öffnen oder den Ordner `dist` auf einem statischen Webserver bereitstellen. Zum Prüfen der Berechnungen `node tests/management.test.cjs` ausführen. Python wird nur zur erneuten Vektorisierung benötigt (`pip install -r requirements.txt`).
