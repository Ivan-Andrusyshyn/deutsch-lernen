import type { WordCard } from '../../../core/models/vocabulary.model';

// Curated B1 additions. The compact rows keep the bilingual lemma data easy to audit.
const rows = `
N|Освіта й робота|die Bewerbung|application|заявка; подання
N|Освіта й робота|die Ausbildung|vocational training|професійне навчання
N|Освіта й робота|die Beschäftigung|employment|зайнятість
N|Освіта й робота|die Besprechung|meeting|нарада
N|Освіта й робота|das Bewerbungsgespräch|job interview|співбесіда
N|Освіта й робота|die Fortbildung|further training|підвищення кваліфікації
N|Освіта й робота|die Geschäftsreise|business trip|відрядження
N|Освіта й робота|die Gehaltserhöhung|pay rise|підвищення зарплати
N|Освіта й робота|die Herausforderung|challenge|виклик
N|Освіта й робота|die Karriere|career|кар’єра
N|Освіта й робота|die Konkurrenz|competition|конкуренція
N|Освіта й робота|die Konferenz|conference|конференція
N|Освіта й робота|die Kündigungsfrist|notice period|строк попередження про звільнення
N|Освіта й робота|die Mitarbeit|cooperation|співпраця
N|Освіта й робота|die Präsentation|presentation|презентація
N|Освіта й робота|die Probezeit|probation period|випробувальний термін
N|Освіта й робота|die Qualifikation|qualification|кваліфікація
N|Освіта й робота|die Schicht|shift|зміна
N|Освіта й робота|die Stellenanzeige|job advertisement|оголошення про вакансію
N|Освіта й робота|die Tätigkeit|occupation|діяльність
N|Освіта й робота|die Überstunde|overtime hour|понаднормова година
N|Освіта й робота|die Weiterbildung|continuing education|подальше навчання
N|Освіта й робота|die Werkstatt|workshop|майстерня
N|Освіта й робота|die Zeugnisnote|grade on a certificate|оцінка в табелі
N|Освіта й робота|der Arbeitgeber|employer|роботодавець
N|Освіта й робота|der Arbeitnehmer|employee|працівник
N|Освіта й робота|der Auftrag|assignment|доручення
N|Освіта й робота|der Auszubildende|trainee|учень-практикант
N|Освіта й робота|der Betriebsausflug|company outing|корпоративна поїздка
N|Освіта й робота|der Bewerber|applicant|кандидат
N|Освіта й робота|der Berufseinstieg|career start|початок кар’єри
N|Освіта й робота|der Fachmann|expert|фахівець
N|Освіта й робота|der Feierabend|end of the workday|кінець робочого дня
N|Освіта й робота|der Kollege|colleague|колега
N|Освіта й робота|der Lohn|wage|заробітна плата
N|Освіта й робота|der Praktikant|intern|стажер
N|Освіта й робота|der Prüfungstermin|exam date|дата іспиту
N|Освіта й робота|der Studiengang|degree program|навчальна програма
N|Освіта й робота|der Stundenplan|timetable|розклад занять
N|Освіта й робота|der Vorgesetzte|supervisor|керівник
N|Освіта й робота|der Vortrag|presentation; lecture|доповідь; лекція
N|Освіта й робота|der Wettbewerb|competition|конкурс
N|Освіта й робота|das Arbeitsklima|work atmosphere|робоча атмосфера
N|Освіта й робота|das Arbeitsverhältnis|employment relationship|трудові відносини
N|Освіта й робота|das Fachwissen|specialist knowledge|фахові знання
N|Освіта й робота|das Praktikum|internship|практика; стажування
N|Освіта й робота|das Seminar|seminar|семінар
N|Освіта й робота|das Zeugnis|certificate; report|свідоцтво; характеристика
N|Освіта й робота|das Ziel|goal|мета
N|Суспільство й спілкування|die Absprache|arrangement|домовленість
N|Суспільство й спілкування|die Angehörige|relative|родичка
N|Суспільство й спілкування|die Bekanntschaft|acquaintance|знайомство
N|Суспільство й спілкування|die Beziehung|relationship|стосунки
N|Суспільство й спілкування|die Diskussion|discussion|обговорення
N|Суспільство й спілкування|die Einladung|invitation|запрошення
N|Суспільство й спілкування|die Entscheidung|decision|рішення
N|Суспільство й спілкування|die Enttäuschung|disappointment|розчарування
N|Суспільство й спілкування|die Erwartung|expectation|очікування
N|Суспільство й спілкування|die Feierlichkeit|ceremony|урочистість
N|Суспільство й спілкування|die Freundschaft|friendship|дружба
N|Суспільство й спілкування|die Gesellschaft|society|суспільство
N|Суспільство й спілкування|die Gewohnheit|habit|звичка
N|Суспільство й спілкування|die Hilfeleistung|assistance|допомога
N|Суспільство й спілкування|die Information|information|інформація
N|Суспільство й спілкування|die Kritik|criticism|критика
N|Суспільство й спілкування|die Meinung|opinion|думка
N|Суспільство й спілкування|die Mitteilung|message|повідомлення
N|Суспільство й спілкування|die Nachbarschaft|neighborhood|сусідство
N|Суспільство й спілкування|die Nachricht|message; news|повідомлення; новина
N|Суспільство й спілкування|die Rücksichtnahme|consideration|уважність до інших
N|Суспільство й спілкування|die Schwierigkeit|difficulty|труднощі
N|Суспільство й спілкування|die Sitzung|session|засідання
N|Суспільство й спілкування|die Stimmung|mood|настрій
N|Суспільство й спілкування|die Unterstützung|support|підтримка
N|Суспільство й спілкування|die Veranstaltung|event|захід
N|Суспільство й спілкування|die Vereinbarung|agreement|домовленість
N|Суспільство й спілкування|die Verantwortung|responsibility|відповідальність
N|Суспільство й спілкування|die Voraussetzung|requirement|передумова
N|Суспільство й спілкування|der Anlass|occasion|привід
N|Суспільство й спілкування|der Eindruck|impression|враження
N|Суспільство й спілкування|der Einfluss|influence|вплив
N|Суспільство й спілкування|der Erfolg|success|успіх
N|Суспільство й спілкування|der Gastbeitrag|guest contribution|гостьовий допис
N|Суспільство й спілкування|der Gesprächspartner|conversation partner|співрозмовник
N|Суспільство й спілкування|der Hinweis|note; indication|підказка; вказівка
N|Суспільство й спілкування|der Kompromiss|compromise|компроміс
N|Суспільство й спілкування|der Kontakt|contact|контакт
N|Суспільство й спілкування|der Konflikt|conflict|конфлікт
N|Суспільство й спілкування|der Nachteil|disadvantage|недолік
N|Суспільство й спілкування|der Ratschlag|advice|порада
N|Суспільство й спілкування|der Streit|argument|сварка
N|Суспільство й спілкування|der Vorschlag|suggestion|пропозиція
N|Суспільство й спілкування|der Vorwurf|reproach|докір
N|Суспільство й спілкування|der Zusammenhang|connection|зв’язок
N|Суспільство й спілкування|das Anliegen|concern; request|прохання; питання
N|Суспільство й спілкування|das Ereignis|event|подія
N|Суспільство й спілкування|das Gespräch|conversation|розмова
N|Суспільство й спілкування|das Missverständnis|misunderstanding|непорозуміння
N|Суспільство й спілкування|das Verhältnis|relationship|стосунки
N|Побут і послуги|die Abteilung|department|відділ
N|Побут і послуги|die Anmeldung|registration|реєстрація
N|Побут і послуги|die Anweisung|instruction|вказівка
N|Побут і послуги|die Auskunft|information|довідка
N|Побут і послуги|die Behörde|authority|державна установа
N|Побут і послуги|die Bescheinigung|certificate|довідка; посвідчення
N|Побут і послуги|die Beschwerde|complaint|скарга
N|Побут і послуги|die Bestellung|order|замовлення
N|Побут і послуги|die Erlaubnis|permission|дозвіл
N|Побут і послуги|die Erklärung|explanation|пояснення
N|Побут і послуги|die Gebühr|fee|збір; плата
N|Побут і послуги|die Geduld|patience|терпіння
N|Побут і послуги|die Genehmigung|approval|дозвіл; погодження
N|Побут і послуги|die Lieferung|delivery|доставка
N|Побут і послуги|die Quittung|receipt|квитанція
N|Побут і послуги|die Rechnung|bill; invoice|рахунок
N|Побут і послуги|die Reparatur|repair|ремонт
N|Побут і послуги|die Rückgabe|return|повернення
N|Побут і послуги|die Rückmeldung|feedback|відгук; відповідь
N|Побут і послуги|die Sicherheit|safety; security|безпека
N|Побут і послуги|die Überweisung|bank transfer|банківський переказ
N|Побут і послуги|die Umfrage|survey|опитування
N|Побут і послуги|die Veränderung|change|зміна
N|Побут і послуги|die Verspätung|delay|запізнення
N|Побут і послуги|die Versicherung|insurance|страхування
N|Побут і послуги|die Voraussetzung|condition|умова
N|Побут і послуги|der Absender|sender|відправник
N|Побут і послуги|der Empfänger|recipient|одержувач
N|Побут і послуги|der Eigentümer|owner|власник
N|Побут і послуги|der Haushalt|household|домашнє господарство
N|Побут і послуги|der Mangel|defect; shortage|недолік; нестача
N|Побут і послуги|der Nachweis|proof|підтвердження
N|Побут і послуги|der Notfall|emergency|надзвичайна ситуація
N|Побут і послуги|der Schaden|damage|пошкодження
N|Побут і послуги|der Schalter|counter; switch|віконце; перемикач
N|Побут і послуги|der Umzug|move; relocation|переїзд
N|Побут і послуги|der Vertrag|contract|договір
N|Побут і послуги|der Verbraucher|consumer|споживач
N|Побут і послуги|der Vorteil|advantage|перевага
N|Побут і послуги|das Formular|form|бланк
N|Побут і послуги|das Gerät|device|пристрій
N|Побут і послуги|das Geschäft|shop; business|магазин; справа
N|Побут і послуги|das Gepäck|luggage|багаж
N|Побут і послуги|das Konto|account|рахунок
N|Побут і послуги|das Lebensmittel|food item|продукт харчування
N|Побут і послуги|das Paket|parcel|посилка
N|Побут і послуги|das Problem|problem|проблема
N|Побут і послуги|das Recht|right; law|право; закон
N|Побут і послуги|das Sonderangebot|special offer|спеціальна пропозиція
N|Побут і послуги|das Werkzeug|tool|інструмент
N|Подорожі й місто|die Abfahrt|departure|відправлення
N|Подорожі й місто|die Ankunft|arrival|прибуття
N|Подорожі й місто|die Ausfahrt|exit|виїзд
N|Подорожі й місто|die Fahrkarte|ticket|квиток
N|Подорожі й місто|die Fähre|ferry|пором
N|Подорожі й місто|die Haltestelle|stop|зупинка
N|Подорожі й місто|die Kreuzung|intersection|перехрестя
N|Подорожі й місто|die Landung|landing|посадка
N|Подорожі й місто|die Unterkunft|accommodation|житло
N|Подорожі й місто|die Verspätung|delay|затримка
N|Подорожі й місто|der Anschluss|connection|пересадка; сполучення
N|Подорожі й місто|der Aufenthalt|stay|перебування
N|Подорожі й місто|der Bahnsteig|platform|платформа
N|Подорожі й місто|der Fahrgast|passenger|пасажир
N|Подорожі й місто|der Fahrplan|timetable|розклад руху
N|Подорожі й місто|der Fernverkehr|long-distance transport|міжміське сполучення
N|Подорожі й місто|der Führerschein|driving licence|водійське посвідчення
N|Подорожі й місто|der Gegenverkehr|oncoming traffic|зустрічний рух
N|Подорожі й місто|der Grenzübergang|border crossing|прикордонний перехід
N|Подорожі й місто|der Mietwagen|rental car|орендоване авто
N|Подорожі й місто|der Reiseführer|travel guide|путівник
N|Подорожі й місто|der Rückflug|return flight|зворотний рейс
N|Подорожі й місто|der Stau|traffic jam|затори
N|Подорожі й місто|der Verkehr|traffic|дорожній рух
N|Подорожі й місто|der Verkehrsunfall|traffic accident|дорожня аварія
N|Подорожі й місто|der Zebrastreifen|pedestrian crossing|пішохідний перехід
N|Подорожі й місто|das Ausland|abroad|закордон
N|Подорожі й місто|das Erlebnis|experience|враження; переживання
N|Подорожі й місто|das Reiseziel|destination|місце подорожі
N|Подорожі й місто|das Verkehrsmittel|means of transport|транспортний засіб
N|Здоров’я й харчування|die Behandlung|treatment|лікування
N|Здоров’я й харчування|die Erkältung|cold|застуда
N|Здоров’я й харчування|die Ernährung|nutrition|харчування
N|Здоров’я й харчування|die Erholung|rest; recovery|відпочинок; відновлення
N|Здоров’я й харчування|die Gesundheit|health|здоров’я
N|Здоров’я й харчування|die Gewürzmischung|spice mix|суміш спецій
N|Здоров’я й харчування|die Heilung|recovery|одужання
N|Здоров’я й харчування|die Krankenversicherung|health insurance|медичне страхування
N|Здоров’я й харчування|die Krankheit|illness|хвороба
N|Здоров’я й харчування|die Lebensmittelvergiftung|food poisoning|харчове отруєння
N|Здоров’я й харчування|die Nebenwirkung|side effect|побічна дія
N|Здоров’я й харчування|die Pflege|care|догляд
N|Здоров’я й харчування|die Untersuchung|examination|обстеження
N|Здоров’я й харчування|die Verletzung|injury|травма
N|Здоров’я й харчування|die Vorsorge|preventive care|профілактика
N|Здоров’я й харчування|der Appetit|appetite|апетит
N|Здоров’я й харчування|der Blutdruck|blood pressure|артеріальний тиск
N|Здоров’я й харчування|der Durchfall|diarrhea|діарея
N|Здоров’я й харчування|der Ernährungstipp|nutrition tip|порада щодо харчування
N|Здоров’я й харчування|der Hals|throat; neck|горло; шия
N|Здоров’я й харчування|der Kopfschmerz|headache|головний біль
N|Здоров’я й харчування|der Notarzt|emergency doctor|лікар швидкої допомоги
N|Здоров’я й харчування|der Schmerz|pain|біль
N|Здоров’я й харчування|der Tropfen|drop|крапля
N|Здоров’я й харчування|das Fieber|fever|гарячка
N|Здоров’я й харчування|das Gericht|dish|страва
N|Здоров’я й харчування|das Gewürz|spice|спеція
N|Здоров’я й харчування|das Krankenhaus|hospital|лікарня
N|Здоров’я й харчування|das Medikament|medicine|лікарський засіб
N|Здоров’я й харчування|das Rezept|prescription; recipe|рецепт
N|Природа й довкілля|die Abfalltrennung|waste separation|сортування сміття
N|Природа й довкілля|die Atmosphäre|atmosphere|атмосфера
N|Природа й довкілля|die Bedrohung|threat|загроза
N|Природа й довкілля|die Bevölkerung|population|населення
N|Природа й довкілля|die Dürre|drought|посуха
N|Природа й довкілля|die Erderwärmung|global warming|глобальне потепління
N|Природа й довкілля|die Ernte|harvest|урожай
N|Природа й довкілля|die Flut|flood|повінь
N|Природа й довкілля|die Folge|consequence|наслідок
N|Природа й довкілля|die Gefahr|danger|небезпека
N|Природа й довкілля|die Klimaveränderung|climate change|зміна клімату
N|Природа й довкілля|die Landwirtschaft|agriculture|сільське господарство
N|Природа й довкілля|die Luftverschmutzung|air pollution|забруднення повітря
N|Природа й довкілля|die Naturkatastrophe|natural disaster|стихійне лихо
N|Природа й довкілля|die Pflanze|plant|рослина
N|Природа й довкілля|die Ressource|resource|ресурс
N|Природа й довкілля|die Umwelt|environment|довкілля
N|Природа й довкілля|die Umweltbelastung|environmental impact|навантаження на довкілля
N|Природа й довкілля|die Umweltverschmutzung|environmental pollution|забруднення довкілля
N|Природа й довкілля|die Überschwemmung|flood|затоплення
N|Природа й довкілля|die Wiese|meadow|луг
N|Природа й довкілля|der Abfall|waste|відходи
N|Природа й довкілля|der Ausstoß|emission|викид
N|Природа й довкілля|der Klimaschutz|climate protection|захист клімату
N|Природа й довкілля|der Müll|rubbish|сміття
N|Природа й довкілля|der Naturschutz|nature conservation|охорона природи
N|Природа й довкілля|der Niederschlag|precipitation|опади
N|Природа й довкілля|der Rohstoff|raw material|сировина
N|Природа й довкілля|der Stromverbrauch|electricity consumption|споживання електроенергії
N|Природа й довкілля|der Umweltschutz|environmental protection|захист довкілля
N|Природа й довкілля|das Klima|climate|клімат
N|Природа й довкілля|das Kraftwerk|power station|електростанція
N|Природа й довкілля|das Naturschutzgebiet|nature reserve|заповідна територія
N|Природа й довкілля|das Recycling|recycling|перероблення відходів
N|Природа й довкілля|das Wasserwerk|waterworks|водогінна станція
N|Культура й медіа|die Ausstellung|exhibition|виставка
N|Культура й медіа|die Aufnahme|recording|запис
N|Культура й медіа|die Berichterstattung|reporting|висвітлення подій
N|Культура й медіа|die Buchhandlung|bookshop|книгарня
N|Культура й медіа|die Durchsage|announcement|оголошення
N|Культура й медіа|die Eintrittskarte|admission ticket|вхідний квиток
N|Культура й медіа|die Folge|episode|серія
N|Культура й медіа|die Geschichte|story; history|історія
N|Культура й медіа|die Nachrichtensendung|news broadcast|випуск новин
N|Культура й медіа|die Öffentlichkeit|public|громадськість
N|Культура й медіа|die Rezension|review|рецензія
N|Культура й медіа|die Sendung|broadcast|передача
N|Культура й медіа|die Überschrift|headline|заголовок
N|Культура й медіа|die Vorstellung|performance; idea|вистава; уявлення
N|Культура й медіа|der Bericht|report|звіт; репортаж
N|Культура й медіа|der Besucher|visitor|відвідувач
N|Культура й медіа|der Eintritt|admission|вхід
N|Культура й медіа|der Filmbeitrag|video feature|відеоматеріал
N|Культура й медіа|der Inhalt|content|зміст
N|Культура й медіа|der Künstler|artist|митець
N|Культура й медіа|der Liedtext|song lyrics|текст пісні
N|Культура й медіа|der Regisseur|director|режисер
N|Культура й медіа|der Roman|novel|роман
N|Культура й медіа|der Zuschauer|viewer|глядач
N|Культура й медіа|das Publikum|audience|публіка
N|Культура й медіа|das Theaterstück|play|театральна п’єса
N|Культура й медіа|das Unterhaltungsprogramm|entertainment program|розважальна програма
N|Культура й медіа|das Werk|work; piece|твір
N|Культура й медіа|das Wörterbuch|dictionary|словник
N|Технології й інформація|die Datei|file|файл
N|Технології й інформація|die Datenverarbeitung|data processing|обробка даних
N|Технології й інформація|die Fernbedienung|remote control|пульт дистанційного керування
N|Технології й інформація|die Internetverbindung|internet connection|підключення до інтернету
N|Технології й інформація|die Nachricht|message|повідомлення
N|Технології й інформація|die Plattform|platform|платформа
N|Технології й інформація|die Suchmaschine|search engine|пошукова система
N|Технології й інформація|die Tastatur|keyboard|клавіатура
N|Технології й інформація|der Bildschirm|screen|екран
N|Технології й інформація|der Drucker|printer|принтер
N|Технології й інформація|der Fortschritt|progress|прогрес
N|Технології й інформація|der Lautsprecher|speaker|гучномовець
N|Технології й інформація|der Speicher|storage|пам’ять; накопичувач
N|Технології й інформація|der Zugang|access|доступ
N|Технології й інформація|das Betriebssystem|operating system|операційна система
N|Технології й інформація|das Datenvolumen|data allowance|обсяг мобільних даних
N|Технології й інформація|das Gerät|device|пристрій
N|Технології й інформація|das Netzwerk|network|мережа
N|Технології й інформація|das Passwort|password|пароль
N|Технології й інформація|das Programm|program|програма
N|Технології й інформація|das soziale Netzwerk|social network|соціальна мережа
V|Дії та спілкування|abfahren|to depart|від’їжджати
V|Дії та спілкування|abholen|to pick up|забирати
V|Дії та спілкування|absagen|to cancel|скасовувати
V|Дії та спілкування|abschließen|to complete; lock|завершувати; замикати
V|Дії та спілкування|abstimmen|to vote; coordinate|голосувати; узгоджувати
V|Дії та спілкування|achten auf|to pay attention to|звертати увагу на
V|Дії та спілкування|ändern|to change|змінювати
V|Дії та спілкування|anerkennen|to recognize|визнавати
V|Дії та спілкування|anmelden|to register|реєструвати
V|Дії та спілкування|anrufen|to call|телефонувати
V|Дії та спілкування|annehmen|to accept|приймати
V|Дії та спілкування|antworten|to answer|відповідати
V|Дії та спілкування|anzeigen|to report; display|повідомляти; показувати
V|Дії та спілкування|aufbauen|to build up|будувати; розвивати
V|Дії та спілкування|auffallen|to stand out|впадати в око
V|Дії та спілкування|aufgeben|to give up|здаватися
V|Дії та спілкування|aufklären|to clarify|з’ясовувати; роз’яснювати
V|Дії та спілкування|aufnehmen|to record; take in|записувати; приймати
V|Дії та спілкування|ausfüllen|to fill in|заповнювати
V|Дії та спілкування|ausgeben|to spend|витрачати
V|Дії та спілкування|ausleihen|to borrow|позичати
V|Дії та спілкування|ausreichen|to be sufficient|вистачати
V|Дії та спілкування|aussehen|to look|виглядати
V|Дії та спілкування|aussprechen|to pronounce; express|вимовляти; висловлювати
V|Дії та спілкування|beantragen|to apply for|подавати заяву на
V|Дії та спілкування|beantworten|to answer|відповідати на
V|Дії та спілкування|begegnen|to meet; encounter|зустрічати
V|Дії та спілкування|behalten|to keep|залишати собі
V|Дії та спілкування|bekommen|to receive|отримувати
V|Дії та спілкування|beraten|to advise|консультувати
V|Дії та спілкування|berichten|to report|повідомляти
V|Дії та спілкування|beschließen|to decide|ухвалювати
V|Дії та спілкування|beschreiben|to describe|описувати
V|Дії та спілкування|sich beschweren|to complain|скаржитися
V|Дії та спілкування|bestätigen|to confirm|підтверджувати
V|Дії та спілкування|bestellen|to order|замовляти
V|Дії та спілкування|besuchen|to visit|відвідувати
V|Дії та спілкування|betreuen|to look after|доглядати; опікуватися
V|Дії та спілкування|sich bewerben|to apply|подаватися
V|Дії та спілкування|bezahlen|to pay|платити
V|Дії та спілкування|bitten um|to ask for|просити про
V|Дії та спілкування|bleiben|to stay|залишатися
V|Дії та спілкування|buchen|to book|бронювати
V|Дії та спілкування|diskutieren|to discuss|обговорювати
V|Дії та спілкування|einladen|to invite|запрошувати
V|Дії та спілкування|einrichten|to set up; furnish|облаштовувати; налаштовувати
V|Дії та спілкування|einschalten|to switch on|вмикати
V|Дії та спілкування|empfehlen|to recommend|рекомендувати
V|Дії та спілкування|entdecken|to discover|відкривати
V|Дії та спілкування|entscheiden|to decide|вирішувати
V|Дії та спілкування|entschuldigen|to excuse|вибачати
V|Дії та спілкування|erfahren|to find out|дізнаватися
V|Дії та спілкування|erinnern an|to remind of|нагадувати про
V|Дії та спілкування|erkennen|to recognize|впізнавати
V|Дії та спілкування|erklären|to explain|пояснювати
V|Дії та спілкування|erlauben|to allow|дозволяти
V|Дії та спілкування|erleben|to experience|переживати
V|Дії та спілкування|eröffnen|to open|відкривати
V|Дії та спілкування|erreichen|to reach|досягати
V|Дії та спілкування|ersetzen|to replace|замінювати
V|Дії та спілкування|erwarten|to expect|очікувати
V|Дії та спілкування|erzählen|to tell|розповідати
V|Дії та спілкування|feststellen|to determine|встановлювати
V|Дії та спілкування|fordern|to demand|вимагати
V|Дії та спілкування|fördern|to support|підтримувати
V|Дії та спілкування|funktionieren|to function|працювати; функціонувати
V|Дії та спілкування|gefallen|to please|подобатися
V|Дії та спілкування|gehören zu|to belong to|належати до
V|Дії та спілкування|gelingen|to succeed|вдаватися
V|Дії та спілкування|genießen|to enjoy|насолоджуватися
V|Дії та спілкування|gründen|to found|засновувати
V|Дії та спілкування|herstellen|to produce|виробляти
V|Дії та спілкування|hinweisen auf|to point out|вказувати на
V|Дії та спілкування|informieren|to inform|інформувати
V|Дії та спілкування|kündigen|to resign; terminate|звільнятися; розривати договір
V|Дії та спілкування|liefern|to deliver|доставляти
V|Дії та спілкування|lösen|to solve|розв’язувати
V|Дії та спілкування|meinen|to mean; think|мати на увазі; вважати
V|Дії та спілкування|mitteilen|to inform|повідомляти
V|Дії та спілкування|nachdenken über|to think about|розмірковувати про
V|Дії та спілкування|übernehmen|to take over|брати на себе
V|Дії та спілкування|unterscheiden|to distinguish|розрізняти
V|Дії та спілкування|verändern|to change|змінювати
V|Дії та спілкування|vergleichen|to compare|порівнювати
V|Дії та спілкування|verhindern|to prevent|запобігати
V|Дії та спілкування|vermeiden|to avoid|уникати
V|Дії та спілкування|versprechen|to promise|обіцяти
V|Дії та спілкування|verstehen|to understand|розуміти
V|Дії та спілкування|vorschlagen|to suggest|пропонувати
V|Дії та спілкування|vorbereiten|to prepare|готувати
V|Дії та спілкування|wahrnehmen|to perceive; attend|сприймати; відвідувати
V|Дії та спілкування|wechseln|to change; exchange|змінювати; обмінювати
V|Дії та спілкування|wiederholen|to repeat|повторювати
V|Дії та спілкування|zustimmen|to agree|погоджуватися
A|Опис і думки|abhängig|dependent|залежний
A|Опис і думки|angenehm|pleasant|приємний
A|Опис і думки|anstrengend|tiring|виснажливий
A|Опис і думки|arbeitslos|unemployed|безробітний
A|Опис і думки|aufmerksam|attentive|уважний
A|Опис і думки|ausreichend|sufficient|достатній
A|Опис і думки|begeistert|enthusiastic|у захваті
A|Опис і думки|beruflich|professional|професійний
A|Опис і думки|bekannt|known|відомий
A|Опис і думки|beliebt|popular|популярний
A|Опис і думки|bequem|comfortable|зручний
A|Опис і думки|besonders|special|особливий
A|Опис і думки|bewusst|conscious|свідомий
A|Опис і думки|deutlich|clear|чіткий
A|Опис і думки|dringend|urgent|терміновий
A|Опис і думки|eigenständig|independent|самостійний
A|Опис і думки|einsam|lonely|самотній
A|Опис і думки|eng|narrow; close|вузький; близький
A|Опис і думки|entspannt|relaxed|розслаблений
A|Опис і думки|erfolgreich|successful|успішний
A|Опис і думки|erforderlich|required|необхідний
A|Опис і думки|erstaunlich|amazing|дивовижний
A|Опис і думки|fair|fair|справедливий
A|Опис і думки|finanziell|financial|фінансовий
A|Опис і думки|freundlich|friendly|привітний
A|Опис і думки|gefährlich|dangerous|небезпечний
A|Опис і думки|geeignet|suitable|придатний
A|Опис і думки|gemeinsam|together; shared|спільний
A|Опис і думки|genau|exact|точний
A|Опис і думки|gerecht|just; fair|справедливий
A|Опис і думки|gesundheitlich|health-related|пов’язаний зі здоров’ям
A|Опис і думки|gewöhnlich|usual|звичайний
A|Опис і думки|glücklich|happy|щасливий
A|Опис і думки|höflich|polite|ввічливий
A|Опис і думки|interessiert|interested|зацікавлений
A|Опис і думки|kompliziert|complicated|складний
A|Опис і думки|kostenlos|free of charge|безкоштовний
A|Опис і думки|ländlich|rural|сільський
A|Опис і думки|leise|quiet|тихий
A|Опис і думки|merkwürdig|strange|дивний
A|Опис і думки|möglich|possible|можливий
A|Опис і думки|nützlich|useful|корисний
A|Опис і думки|offen|open|відкритий
A|Опис і думки|öffentlich|public|громадський
A|Опис і думки|persönlich|personal|особистий
A|Опис і думки|praktisch|practical|практичний
A|Опис і думки|pünktlich|punctual|пунктуальний
A|Опис і думки|ruhig|calm|спокійний
A|Опис і думки|selbstständig|self-employed; independent|самозайнятий; самостійний
A|Опис і думки|sinnvoll|meaningful|доцільний
A|Опис і думки|sozial|social|соціальний
A|Опис і думки|spannend|exciting|захопливий
A|Опис і думки|ständig|constant|постійний
A|Опис і думки|stolz|proud|гордий
A|Опис і думки|streng|strict|суворий
A|Опис і думки|tätig|active; employed|діяльний; працевлаштований
A|Опис і думки|technisch|technical|технічний
A|Опис і думки|unbekannt|unknown|невідомий
A|Опис і думки|unterschiedlich|different|різний
A|Опис і думки|unzufrieden|dissatisfied|незадоволений
A|Опис і думки|verantwortlich|responsible|відповідальний
A|Опис і думки|verfügbar|available|доступний
A|Опис і думки|verheiratet|married|одружений
A|Опис і думки|vernünftig|reasonable|розсудливий
A|Опис і думки|verschieden|various|різноманітний
A|Опис і думки|vorsichtig|careful|обережний
A|Опис і думки|wertvoll|valuable|цінний
A|Опис і думки|wirklich|real|справжній
A|Опис і думки|wirtschaftlich|economic|економічний
A|Опис і думки|zufällig|by chance|випадковий
X|Зв’язки й логіка|allerdings|however|однак
X|Зв’язки й логіка|ansonsten|otherwise|інакше
X|Зв’язки й логіка|außerdem|besides|крім того
X|Зв’язки й логіка|daher|therefore|тому
X|Зв’язки й логіка|dennoch|nevertheless|усе ж
X|Зв’язки й логіка|deshalb|therefore|тому
X|Зв’язки й логіка|einerseits|on the one hand|з одного боку
X|Зв’язки й логіка|folglich|consequently|отже
X|Зв’язки й логіка|immerhin|after all|принаймні
X|Зв’язки й логіка|inzwischen|meanwhile|тим часом
X|Зв’язки й логіка|jedenfalls|in any case|у будь-якому разі
X|Зв’язки й логіка|lediglich|only|лише
X|Зв’язки й логіка|mittlerweile|by now|тим часом
X|Зв’язки й логіка|schließlich|finally|зрештою
X|Зв’язки й логіка|somit|thus|отже
X|Зв’язки й логіка|stattdessen|instead|натомість
X|Зв’язки й логіка|trotzdem|nevertheless|попри це
X|Зв’язки й логіка|übrigens|by the way|до речі
X|Зв’язки й логіка|weder noch|neither nor|ані ані
X|Зв’язки й логіка|zunächst|first; initially|спочатку
P|Зв’язки й логіка|innerhalb|within|у межах
X|Зв’язки й логіка|unbedingt|absolutely; necessarily|обов’язково
N|Освіта й робота|die Arbeitslosigkeit|unemployment|безробіття
N|Освіта й робота|die Berufserfahrung|work experience|досвід роботи
N|Освіта й робота|die Bewerbungsmöglichkeit|job opportunity|можливість працевлаштування
N|Освіта й робота|die Gleichberechtigung|equal rights|рівноправ’я
N|Освіта й робота|die Leitung|management; leadership|керівництво
N|Освіта й робота|die Personalabteilung|human resources department|відділ кадрів
N|Освіта й робота|die Selbstständigkeit|self-employment; independence|самозайнятість; самостійність
N|Освіта й робота|die Zusammenarbeit|cooperation|співпраця
N|Освіта й робота|der Arbeitsvertrag|employment contract|трудовий договір
N|Освіта й робота|der Fachbereich|specialist field|фахова галузь
N|Освіта й робота|der Geschäftsführer|managing director|керівний директор
N|Освіта й робота|der Lebenslauf|CV; résumé|резюме
N|Освіта й робота|der Mitarbeiter|employee|працівник
N|Освіта й робота|der Personalchef|personnel manager|керівник відділу кадрів
N|Освіта й робота|der Schulabschluss|school-leaving certificate|документ про закінчення школи
N|Освіта й робота|der Studienplatz|university place|місце в університеті
N|Освіта й робота|das Arbeitsamt|employment office|центр зайнятості
N|Освіта й робота|das Arbeitszeugnis|work reference|характеристика з роботи
N|Освіта й робота|das Bewerbungsschreiben|application letter|мотиваційний лист
N|Освіта й робота|das Einkommen|income|дохід
N|Суспільство й спілкування|die Abhängigkeit|dependence|залежність
N|Суспільство й спілкування|die Annahme|assumption; acceptance|припущення; прийняття
N|Суспільство й спілкування|die Auseinandersetzung|discussion; dispute|дискусія; суперечка
N|Суспільство й спілкування|die Entschuldigung|apology|вибачення
N|Суспільство й спілкування|die Gemeinschaft|community|спільнота
N|Суспільство й спілкування|die Hilfsbereitschaft|willingness to help|готовність допомогти
N|Суспільство й спілкування|die Lebensweise|way of life|спосіб життя
N|Суспільство й спілкування|die Mehrheit|majority|більшість
N|Суспільство й спілкування|die Minderheit|minority|меншість
N|Суспільство й спілкування|die Offenheit|openness|відкритість
N|Суспільство й спілкування|die Persönlichkeit|personality|особистість
N|Суспільство й спілкування|die Rücksicht|consideration|уважність до інших
N|Суспільство й спілкування|die Solidarität|solidarity|солідарність
N|Суспільство й спілкування|der Austausch|exchange|обмін
N|Суспільство й спілкування|der Bürger|citizen|громадянин
N|Суспільство й спілкування|der Einwohner|resident|мешканець
N|Суспільство й спілкування|der Flüchtling|refugee|біженець
N|Суспільство й спілкування|der Jugendliche|young person|підліток
N|Суспільство й спілкування|der Umgang|interaction; handling|поводження; взаємодія
N|Суспільство й спілкування|das Benehmen|manners|поведінка
N|Суспільство й спілкування|das Vertrauen|trust|довіра
N|Побут і послуги|die Anschaffung|purchase|придбання
N|Побут і послуги|die Aufbewahrung|storage|зберігання
N|Побут і послуги|die Ermäßigung|discount|знижка
N|Побут і послуги|die Garantie|guarantee|гарантія
N|Побут і послуги|die Hausordnung|house rules|правила проживання
N|Побут і послуги|die Kostenübernahme|coverage of costs|покриття витрат
N|Побут і послуги|die Mieteinnahme|rental income|дохід від оренди
N|Побут і послуги|die Nebenkosten|additional costs|комунальні та додаткові витрати
N|Побут і послуги|die Rückerstattung|refund|відшкодування
N|Побут і послуги|die Zahlungsfrist|payment deadline|строк оплати
N|Побут і послуги|der Aufzug|elevator|ліфт
N|Побут і послуги|der Hausmeister|caretaker|доглядач будинку
N|Побут і послуги|der Mietvertrag|rental agreement|договір оренди
N|Побут і послуги|der Umtausch|exchange|обмін товару
N|Побут і послуги|das Eigentum|property|власність
N|Побут і послуги|das Ersatzteil|spare part|запасна частина
N|Побут і послуги|das Kleingedruckte|small print|дрібний шрифт договору
N|Подорожі й місто|die Abkürzung|shortcut; abbreviation|коротший шлях; скорочення
N|Подорожі й місто|die Durchfahrt|passage|проїзд
N|Подорожі й місто|die Entfernung|distance|відстань
N|Подорожі й місто|die Fahrgemeinschaft|carpool|спільна поїздка автомобілем
N|Подорожі й місто|die Fluggesellschaft|airline|авіакомпанія
N|Подорожі й місто|die Gepäckaufbewahrung|luggage storage|камера схову багажу
N|Подорожі й місто|die Rundfahrt|tour|оглядова екскурсія
N|Подорожі й місто|der Aufenthaltstitel|residence permit|посвідка на проживання
N|Подорожі й місто|der Fahrkartenautomat|ticket machine|автомат із продажу квитків
N|Подорожі й місто|der Fahrradweg|cycle path|велодоріжка
N|Подорожі й місто|der Fußgänger|pedestrian|пішохід
N|Подорожі й місто|der Gepäckwagen|luggage trolley|візок для багажу
N|Подорожі й місто|der Reisepass|passport|закордонний паспорт
N|Подорожі й місто|der Schienenersatzverkehr|replacement bus service|автобусне сполучення замість поїзда
N|Подорожі й місто|das Parkhaus|parking garage|паркінг
N|Подорожі й місто|das Reisebüro|travel agency|туристична агенція
N|Здоров’я й харчування|die Allergie|allergy|алергія
N|Здоров’я й харчування|die Bewegung|movement; exercise|рух; фізична активність
N|Здоров’я й харчування|die Diagnose|diagnosis|діагноз
N|Здоров’я й харчування|die Entzündung|inflammation|запалення
N|Здоров’я й харчування|die Gewichtsabnahme|weight loss|зниження ваги
N|Здоров’я й харчування|die Heiserkeit|hoarseness|охриплість
N|Здоров’я й харчування|die Impfung|vaccination|щеплення
N|Здоров’я й харчування|die Müdigkeit|tiredness|втома
N|Здоров’я й харчування|die Sprechstunde|consultation hours|години прийому
N|Здоров’я й харчування|die Überlastung|overload|перевантаження
N|Здоров’я й харчування|der Kreislauf|circulation|кровообіг
N|Здоров’я й харчування|der Muskelkater|muscle soreness|крепатура
N|Здоров’я й харчування|der Rettungsdienst|emergency medical service|служба невідкладної допомоги
N|Здоров’я й харчування|das Wohlbefinden|well-being|самопочуття
N|Природа й довкілля|die Artenvielfalt|biodiversity|біорізноманіття
N|Природа й довкілля|die Energiequelle|energy source|джерело енергії
N|Природа й довкілля|die Feinstaubbelastung|particulate pollution|забруднення дрібнодисперсним пилом
N|Природа й довкілля|die Klimaanlage|air conditioning|кондиціонер
N|Природа й довкілля|die Nachhaltigkeit|sustainability|сталий розвиток
N|Природа й довкілля|die Solarenergie|solar energy|сонячна енергія
N|Природа й довкілля|die Tierart|animal species|вид тварин
N|Природа й довкілля|die Wasserversorgung|water supply|водопостачання
N|Природа й довкілля|der Energieverbrauch|energy consumption|споживання енергії
N|Природа й довкілля|der Klimawandel|climate change|зміна клімату
N|Природа й довкілля|der Meeresspiegel|sea level|рівень моря
N|Природа й довкілля|der Naturschutzbund|nature conservation association|спілка охорони природи
N|Природа й довкілля|der Treibhauseffekt|greenhouse effect|парниковий ефект
N|Природа й довкілля|das Artensterben|species extinction|вимирання видів
N|Природа й довкілля|das Hochwasser|floodwater|висока вода; повінь
N|Культура й медіа|die Buchmesse|book fair|книжковий ярмарок
N|Культура й медіа|die Fernsehserie|TV series|телесеріал
N|Культура й медіа|die Hauptfigur|main character|головний персонаж
N|Культура й медіа|die Lesung|reading|літературні читання
N|Культура й медіа|die Liveübertragung|live broadcast|пряма трансляція
N|Культура й медіа|die Schlagzeile|headline|сенсаційний заголовок
N|Культура й медіа|die Werbung|advertising|реклама
N|Культура й медіа|der Dokumentarfilm|documentary|документальний фільм
N|Культура й медіа|der Hintergrund|background|передумови; тло
N|Культура й медіа|der Nachrichtensprecher|news presenter|ведучий новин
N|Культура й медіа|der Schriftsteller|writer|письменник
N|Культура й медіа|der Spielfilm|feature film|художній фільм
N|Культура й медіа|das Drehbuch|screenplay|сценарій
N|Культура й медіа|das Hörbuch|audiobook|аудіокнижка
N|Технології й інформація|die Benutzeroberfläche|user interface|інтерфейс користувача
N|Технології й інформація|die Datenbank|database|база даних
N|Технології й інформація|die Festplatte|hard drive|жорсткий диск
N|Технології й інформація|die Videokonferenz|video conference|відеоконференція
N|Технології й інформація|der Datenschutz|data protection|захист даних
N|Технології й інформація|der Kundendienst|customer service|служба підтримки клієнтів
N|Технології й інформація|der Fortschritt|progress|прогрес
N|Технології й інформація|das Benutzerkonto|user account|обліковий запис
N|Технології й інформація|das Ladegerät|charger|зарядний пристрій
N|Технології й інформація|das Mobilfunknetz|mobile network|мобільна мережа
V|Дії та спілкування|abstürzen|to crash|аварійно завершувати роботу
V|Дії та спілкування|ankündigen|to announce|оголошувати
V|Дії та спілкування|anpassen|to adapt|пристосовувати
V|Дії та спілкування|ausgleichen|to balance; compensate|урівноважувати; компенсувати
V|Дії та спілкування|ausprobieren|to try out|випробовувати
V|Дії та спілкування|ausstellen|to issue; exhibit|видавати; виставляти
V|Дії та спілкування|bedauern|to regret|шкодувати
V|Дії та спілкування|beeinträchtigen|to impair|погіршувати
V|Дії та спілкування|beitragen zu|to contribute to|сприяти
V|Дії та спілкування|benachrichtigen|to notify|повідомляти
V|Дії та спілкування|beobachten|to observe|спостерігати
V|Дії та спілкування|beruhigen|to calm|заспокоювати
V|Дії та спілкування|beschäftigen|to employ; occupy|займати; працевлаштовувати
V|Дії та спілкування|beweisen|to prove|доводити
V|Дії та спілкування|bieten|to offer|пропонувати
V|Дії та спілкування|darstellen|to present; represent|представляти; зображати
V|Дії та спілкування|drucken|to print|друкувати
V|Дії та спілкування|einführen|to introduce|запроваджувати
V|Дії та спілкування|einreichen|to submit|подавати
V|Дії та спілкування|einsparen|to save|заощаджувати
V|Дії та спілкування|entfernen|to remove|видаляти
V|Дії та спілкування|entstehen|to arise|виникати
V|Дії та спілкування|erledigen|to take care of|виконувати; владнувати
V|Дії та спілкування|erstatten|to reimburse|відшкодовувати
V|Дії та спілкування|erwerben|to acquire|здобувати
V|Дії та спілкування|festlegen|to determine|визначати
V|Дії та спілкування|herunterladen|to download|завантажувати
V|Дії та спілкування|herausfinden|to find out|з’ясовувати
V|Дії та спілкування|herstellen|to produce|виробляти
V|Дії та спілкування|hinzufügen|to add|додавати
V|Дії та спілкування|mitwirken|to participate|брати участь
V|Дії та спілкування|nachweisen|to prove|підтверджувати
V|Дії та спілкування|reagieren|to react|реагувати
V|Дії та спілкування|reduzieren|to reduce|скорочувати
V|Дії та спілкування|schätzen|to estimate; appreciate|оцінювати; цінувати
V|Дії та спілкування|sich bemühen|to make an effort|докладати зусиль
V|Дії та спілкування|sich beschweren|to complain|скаржитися
V|Дії та спілкування|sich entscheiden|to decide|вирішувати
V|Дії та спілкування|sich entwickeln|to develop|розвиватися
V|Дії та спілкування|sich gewöhnen an|to get used to|звикати до
V|Дії та спілкування|sich kümmern um|to take care of|піклуватися про
V|Дії та спілкування|überzeugen|to convince|переконувати
V|Дії та спілкування|umtauschen|to exchange|обмінювати
V|Дії та спілкування|untersuchen|to examine|обстежувати
V|Дії та спілкування|verarbeiten|to process|обробляти
V|Дії та спілкування|veröffentlichen|to publish|публікувати
V|Дії та спілкування|verursachen|to cause|спричиняти
V|Дії та спілкування|vorhaben|to plan|мати намір
V|Дії та спілкування|voraussetzen|to require|передбачати
V|Дії та спілкування|vorliegen|to be available|бути наявним
V|Дії та спілкування|weiterleiten|to forward|пересилати
V|Дії та спілкування|zurückgeben|to return|повертати
A|Опис і думки|achtsam|mindful|уважний
A|Опис і думки|anspruchsvoll|demanding|вибагливий
A|Опис і думки|ausführlich|detailed|детальний
A|Опис і думки|befristet|temporary; fixed-term|строковий
A|Опис і думки|begrenzt|limited|обмежений
A|Опис і думки|belastbar|resilient|витривалий
A|Опис і думки|betrunken|drunk|п’яний
A|Опис і думки|chaotisch|chaotic|хаотичний
A|Опис і думки|demokratisch|democratic|демократичний
A|Опис і думки|durchschnittlich|average|середній
A|Опис і думки|eindrucksvoll|impressive|вражаючий
A|Опис і думки|einheitlich|uniform|однаковий
A|Опис і думки|empfindlich|sensitive|чутливий
A|Опис і думки|erforderlich|required|необхідний
A|Опис і думки|erfolglos|unsuccessful|безуспішний
A|Опис і думки|erhältlich|available|наявний у продажу
A|Опис і думки|ernsthaft|serious|серйозний
A|Опис і думки|flexibel|flexible|гнучкий
A|Опис і думки|freiwillig|voluntary|добровільний
A|Опис і думки|günstig|affordable; favorable|вигідний
A|Опис і думки|hilfreich|helpful|корисний
A|Опис і думки|knapp|scarce; brief|обмежений; короткий
A|Опис і думки|lebendig|lively|жвавий
A|Опис і думки|leistungsfähig|capable; efficient|продуктивний
A|Опис і думки|locker|loose; relaxed|вільний; невимушений
A|Опис і думки|nervös|nervous|нервовий
A|Опис і думки|ordentlich|tidy; proper|охайний; належний
A|Опис і думки|regelmäßig|regular|регулярний
A|Опис і думки|schädlich|harmful|шкідливий
A|Опис і думки|schwierig|difficult|складний
A|Опис і думки|überrascht|surprised|здивований
A|Опис і думки|unabhängig|independent|незалежний
A|Опис і думки|unauffällig|inconspicuous|непомітний
A|Опис і думки|unverändert|unchanged|незмінний
A|Опис і думки|verbindlich|binding|обов’язковий
A|Опис і думки|vertraulich|confidential|конфіденційний
A|Опис і думки|vollständig|complete|повний
A|Опис і думки|wahrscheinlich|probable|ймовірний
A|Опис і думки|wesentlich|essential|суттєвий
A|Опис і думки|zufriedenstellend|satisfactory|задовільний
X|Зв’язки й логіка|abgesehen davon|apart from that|не кажучи про це
X|Зв’язки й логіка|auf diese Weise|in this way|таким чином
X|Зв’язки й логіка|beispielsweise|for example|наприклад
X|Зв’язки й логіка|dagegen|in contrast|натомість
X|Зв’язки й логіка|demnach|accordingly|відповідно
X|Зв’язки й логіка|einerseits ... andererseits|on the one hand ... on the other|з одного боку ... з іншого
X|Зв’язки й логіка|genauso|in the same way|так само
X|Зв’язки й логіка|hingegen|whereas|натомість
X|Зв’язки й логіка|insgesamt|overall|загалом
X|Зв’язки й логіка|nach wie vor|still; as before|як і раніше
X|Зв’язки й логіка|schrittweise|step by step|крок за кроком
X|Зв’язки й логіка|sogar|even|навіть
X|Зв’язки й логіка|sonst|otherwise|інакше
X|Зв’язки й логіка|überwiegend|predominantly|переважно
X|Зв’язки й логіка|vor allem|especially|насамперед
X|Зв’язки й логіка|während|while|тоді як
X|Зв’язки й логіка|zwar ... aber|although ... but|хоча ... але
`;

const kindByCode = { N: 'noun', V: 'verb', A: 'adjective', X: 'adverb', P: 'preposition' } as const;
const conjunctions = new Set([
  'einerseits ... andererseits', 'während', 'weder noch', 'zwar ... aber',
]);

export const b1Expansion: WordCard[] = rows
  .trim()
  .split('\n')
  .map((line, index) => {
    const [kindCode, category, word, translationEnglish, translation] = line.split('|');
    return {
      id: `b1-extra-${index + 1}`,
      word,
      translation,
      translationEnglish,
      category,
      kind: conjunctions.has(word) ? 'conjunction' : kindByCode[kindCode as keyof typeof kindByCode],
      phrase: `das Wort „${word}“`,
      example: `Ich möchte wissen, was „${word}“ bedeutet.`,
      level: 'B1' as const,
    };
  });
