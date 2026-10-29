import type { WordCard } from '../../../core/models/vocabulary.model';

const nounForms = `
der Zeh|die Zehen|toe|toes|палець ноги|пальці ніг|Здоров’я
die Stirn|die Stirnen|forehead|foreheads|лоб|лоби|Здоров’я
die Wange|die Wangen|cheek|cheeks|щока|щоки|Здоров’я
das Kinn|die Kinne|chin|chins|підборіддя|підборіддя|Здоров’я
die Lippe|die Lippen|lip|lips|губа|губи|Здоров’я
die Wimper|die Wimpern|eyelash|eyelashes|вія|вії|Здоров’я
die Augenbraue|die Augenbrauen|eyebrow|eyebrows|брова|брови|Здоров’я
der Ellbogen|die Ellbogen|elbow|elbows|лікоть|лікті|Здоров’я
das Handgelenk|die Handgelenke|wrist|wrists|зап’ястя|зап’ястя|Здоров’я
der Knöchel|die Knöchel|ankle|ankles|щиколотка|щиколотки|Здоров’я
die Ferse|die Fersen|heel|heels|п’ята|п’яти|Здоров’я
die Schulter|die Schultern|shoulder|shoulders|плече|плечі|Здоров’я
die Hüfte|die Hüften|hip|hips|стегно|стегна|Здоров’я
die Lunge|die Lungen|lung|lungs|легеня|легені|Здоров’я
die Leber|die Lebern|liver|livers|печінка|печінки|Здоров’я
die Niere|die Nieren|kidney|kidneys|нирка|нирки|Здоров’я
der Muskel|die Muskeln|muscle|muscles|м’яз|м’язи|Здоров’я
die Ader|die Adern|vein|veins|вена|вени|Здоров’я
die Wunde|die Wunden|wound|wounds|рана|рани|Здоров’я
der Ausschlag|die Ausschläge|rash|rashes|висип|висипи|Здоров’я
die Spritze|die Spritzen|injection|injections|ін’єкція|ін’єкції|Здоров’я
die Salbe|die Salben|ointment|ointments|мазь|мазі|Здоров’я
die Tablette|die Tabletten|tablet|tablets|таблетка|таблетки|Здоров’я
der Verband|die Verbände|bandage|bandages|пов’язка|пов’язки|Здоров’я
die Untersuchung|die Untersuchungen|examination|examinations|обстеження|обстеження|Здоров’я
das Kissen|die Kissen|pillow|pillows|подушка|подушки|Побут
die Decke|die Decken|blanket|blankets|ковдра|ковдри|Побут
die Matratze|die Matratzen|mattress|mattresses|матрац|матраци|Побут
der Vorhang|die Vorhänge|curtain|curtains|штора|штори|Побут
der Teppich|die Teppiche|carpet|carpets|килим|килими|Побут
die Kommode|die Kommoden|chest of drawers|chests of drawers|комод|комоди|Побут
der Sessel|die Sessel|armchair|armchairs|крісло|крісла|Побут
der Hocker|die Hocker|stool|stools|табурет|табурети|Побут
die Schublade|die Schubladen|drawer|drawers|шухляда|шухляди|Побут
der Vorraum|die Vorräume|hallway|hallways|передпокій|передпокої|Побут
die Treppe|die Treppen|staircase|staircases|сходи|сходи|Побут
das Dach|die Dächer|roof|roofs|дах|дахи|Побут
der Schornstein|die Schornsteine|chimney|chimneys|димар|димарі|Побут
der Wasserhahn|die Wasserhähne|tap|taps|кран|крани|Побут
das Waschbecken|die Waschbecken|washbasin|washbasins|умивальник|умивальники|Побут
die Badewanne|die Badewannen|bathtub|bathtubs|ванна|ванни|Побут
der Besen|die Besen|broom|brooms|мітла|мітли|Побут
der Eimer|die Eimer|bucket|buckets|відро|відра|Побут
der Schwamm|die Schwämme|sponge|sponges|губка|губки|Побут
der Staubsauger|die Staubsauger|vacuum cleaner|vacuum cleaners|пилосос|пилососи|Побут
das Bügeleisen|die Bügeleisen|iron|irons|праска|праски|Побут
der Wecker|die Wecker|alarm clock|alarm clocks|будильник|будильники|Побут
der Mülleimer|die Mülleimer|trash can|trash cans|смітник|смітники|Побут
die Steckdose|die Steckdosen|socket|sockets|розетка|розетки|Побут
der Stecker|die Stecker|plug|plugs|штекер|штекери|Побут
das Kabel|die Kabel|cable|cables|кабель|кабелі|Технології
die Batterie|die Batterien|battery|batteries|батарейка|батарейки|Технології
der Akku|die Akkus|rechargeable battery|rechargeable batteries|акумулятор|акумулятори|Технології
der Bildschirm|die Bildschirme|screen|screens|екран|екрани|Технології
die Tastatur|die Tastaturen|keyboard|keyboards|клавіатура|клавіатури|Технології
die Maus|die Mäuse|computer mouse|computer mice|миша|миші|Технології
der Drucker|die Drucker|printer|printers|принтер|принтери|Технології
der Lautsprecher|die Lautsprecher|speaker|speakers|гучномовець|гучномовці|Технології
das Mikrofon|die Mikrofone|microphone|microphones|мікрофон|мікрофони|Технології
der Kopfhörer|die Kopfhörer|headphone|headphones|навушник|навушники|Технології
die Kamera|die Kameras|camera|cameras|камера|камери|Технології
das Ladegerät|die Ladegeräte|charger|chargers|зарядний пристрій|зарядні пристрої|Технології
die Fernbedienung|die Fernbedienungen|remote control|remote controls|пульт|пульти|Технології
der Router|die Router|router|routers|роутер|роутери|Технології
die Webseite|die Webseiten|website|websites|вебсайт|вебсайти|Технології
die Datei|die Dateien|file|files|файл|файли|Технології
der Ordner|die Ordner|folder|folders|папка|папки|Технології
das Passwort|die Passwörter|password|passwords|пароль|паролі|Технології
die App|die Apps|app|apps|застосунок|застосунки|Технології
das Gerät|die Geräte|device|devices|пристрій|пристрої|Технології
der Knopf|die Knöpfe|button|buttons|кнопка|кнопки|Технології
die Taste|die Tasten|key|keys|клавіша|клавіші|Технології
der Anschluss|die Anschlüsse|connection|connections|підключення|підключення|Технології
die Verbindung|die Verbindungen|link|links|з’єднання|з’єднання|Технології
die Zutat|die Zutaten|ingredient|ingredients|інгредієнт|інгредієнти|Їжа
das Gewürz|die Gewürze|spice|spices|спеція|спеції|Їжа
der Pfeffer|die Pfeffer|pepper|peppers|перець|перці|Їжа
der Honig|die Honige|honey|honeys|мед|меди|Їжа
die Marmelade|die Marmeladen|jam|jams|варення|варення|Їжа
die Sahne|die Sahnen|cream|creams|вершки|вершки|Їжа
der Quark|die Quarke|quark|quarks|сир кисломолочний|кисломолочні сири|Їжа
die Wurst|die Würste|sausage|sausages|ковбаса|ковбаси|Їжа
der Schinken|die Schinken|ham|hams|шинка|шинки|Їжа
die Bohne|die Bohnen|bean|beans|квасолина|квасолини|Їжа
die Linse|die Linsen|lentil|lentils|сочевиця|сочевиці|Їжа
die Erbse|die Erbsen|pea|peas|горошина|горошини|Їжа
der Mais|die Maissorten|corn|corn varieties|кукурудза|сорти кукурудзи|Їжа
der Pilz|die Pilze|mushroom|mushrooms|гриб|гриби|Їжа
die Paprika|die Paprikas|bell pepper|bell peppers|солодкий перець|солодкі перці|Їжа
die Aubergine|die Auberginen|eggplant|eggplants|баклажан|баклажани|Їжа
der Kürbis|die Kürbisse|pumpkin|pumpkins|гарбуз|гарбузи|Їжа
die Zitrone|die Zitronen|lemon|lemons|лимон|лимони|Їжа
die Kirsche|die Kirschen|cherry|cherries|вишня|вишні|Їжа
die Erdbeere|die Erdbeeren|strawberry|strawberries|полуниця|полуниці|Їжа
die Himbeere|die Himbeeren|raspberry|raspberries|малина|малини|Їжа
die Birne|die Birnen|pear|pears|груша|груші|Їжа
die Pflaume|die Pflaumen|plum|plums|слива|сливи|Їжа
die Melone|die Melonen|melon|melons|диня|дині|Їжа
die Nuss|die Nüsse|nut|nuts|горіх|горіхи|Їжа
die Mandel|die Mandeln|almond|almonds|мигдаль|мигдалі|Їжа
die Rosine|die Rosinen|raisin|raisins|родзинка|родзинки|Їжа
der Teig|die Teige|dough|doughs|тісто|тіста|Їжа
die Scheibe|die Scheiben|slice|slices|скибка|скибки|Їжа
die Portion|die Portionen|portion|portions|порція|порції|Їжа
der Topf|die Töpfe|pot|pots|каструля|каструлі|Їжа
die Pfanne|die Pfannen|pan|pans|пательня|пательні|Їжа
das Brett|die Bretter|board|boards|дошка|дошки|Їжа
der Schneebesen|die Schneebesen|whisk|whisks|вінчик|вінчики|Їжа
die Schüssel|die Schüsseln|bowl|bowls|миска|миски|Їжа
der Krug|die Krüge|jug|jugs|глечик|глечики|Їжа
die Dose|die Dosen|can|cans|бляшанка|бляшанки|Їжа
das Rezept|die Rezepte|recipe|recipes|рецепт|рецепти|Їжа
der Nachtisch|die Nachtische|dessert|desserts|десерт|десерти|Їжа
die Mahlzeit|die Mahlzeiten|meal|meals|прийом їжі|прийоми їжі|Їжа
die Beere|die Beeren|berry|berries|ягода|ягоди|Їжа
die Tanne|die Tannen|fir tree|fir trees|ялина|ялини|Природа
die Eiche|die Eichen|oak tree|oak trees|дуб|дуби|Природа
die Birke|die Birken|birch tree|birch trees|береза|берези|Природа
der Busch|die Büsche|bush|bushes|кущ|кущі|Природа
die Wurzel|die Wurzeln|root|roots|корінь|корені|Природа
der Zweig|die Zweige|branch|branches|гілка|гілки|Природа
die Rinde|die Rinden|bark|barks|кора|кори|Природа
der Felsen|die Felsen|rock|rocks|скеля|скелі|Природа
das Tal|die Täler|valley|valleys|долина|долини|Природа
die Höhle|die Höhlen|cave|caves|печера|печери|Природа
der Wasserfall|die Wasserfälle|waterfall|waterfalls|водоспад|водоспади|Природа
die Quelle|die Quellen|spring|springs|джерело|джерела|Природа
der Teich|die Teiche|pond|ponds|ставок|ставки|Природа
der Bach|die Bäche|stream|streams|струмок|струмки|Природа
das Ufer|die Ufer|shore|shores|берег|береги|Природа
die Küste|die Küsten|coast|coasts|узбережжя|узбережжя|Природа
die Welle|die Wellen|wave|waves|хвиля|хвилі|Природа
die Düne|die Dünen|dune|dunes|дюна|дюни|Природа
der Hügel|die Hügel|hill|hills|пагорб|пагорби|Природа
die Landschaft|die Landschaften|landscape|landscapes|краєвид|краєвиди|Природа
der Horizont|die Horizonte|horizon|horizons|горизонт|горизонти|Природа
der Schatten|die Schatten|shadow|shadows|тінь|тіні|Природа
der Nebel|die Nebel|fog|fogs|туман|тумани|Природа
der Blitz|die Blitze|flash of lightning|flashes of lightning|блискавка|блискавки|Природа
der Donner|die Donner|thunderclap|thunderclaps|грім|громи|Природа
der Sturm|die Stürme|storm|storms|буря|бурі|Природа
der Hagel|die Hagelschauer|hailstorm|hailstorms|град|градини|Природа
der Frost|die Fröste|frost|frosts|мороз|морози|Природа
die Überschwemmung|die Überschwemmungen|flood|floods|повінь|повені|Природа
das Erdbeben|die Erdbeben|earthquake|earthquakes|землетрус|землетруси|Природа
der Vulkan|die Vulkane|volcano|volcanoes|вулкан|вулкани|Природа
die Wüste|die Wüsten|desert|deserts|пустеля|пустелі|Природа
der Dschungel|die Dschungel|jungle|jungles|джунглі|джунглі|Природа
das Feld|die Felder|field|fields|поле|поля|Природа
der Bauernhof|die Bauernhöfe|farm|farms|ферма|ферми|Природа
die Scheune|die Scheunen|barn|barns|стодола|стодоли|Природа
der Zaun|die Zäune|fence|fences|паркан|паркани|Природа
die Hecke|die Hecken|hedge|hedges|жива огорожа|живі огорожі|Природа
der Gartenzaun|die Gartenzäune|garden fence|garden fences|садовий паркан|садові паркани|Природа
der Schmetterling|die Schmetterlinge|butterfly|butterflies|метелик|метелики|Тварини
die Biene|die Bienen|bee|bees|бджола|бджоли|Тварини
die Wespe|die Wespen|wasp|wasps|оса|оси|Тварини
die Ameise|die Ameisen|ant|ants|мураха|мурахи|Тварини
die Spinne|die Spinnen|spider|spiders|павук|павуки|Тварини
der Käfer|die Käfer|beetle|beetles|жук|жуки|Тварини
die Fliege|die Fliegen|fly|flies|муха|мухи|Тварини
die Mücke|die Mücken|mosquito|mosquitoes|комар|комарі|Тварини
der Fuchs|die Füchse|fox|foxes|лисиця|лисиці|Тварини
der Wolf|die Wölfe|wolf|wolves|вовк|вовки|Тварини
der Bär|die Bären|bear|bears|ведмідь|ведмеді|Тварини
der Hirsch|die Hirsche|a deer|deer|олень|олені|Тварини
das Reh|die Rehe|a roe deer|roe deer|косуля|косулі|Тварини
der Igel|die Igel|hedgehog|hedgehogs|їжак|їжаки|Тварини
das Eichhörnchen|die Eichhörnchen|squirrel|squirrels|білка|білки|Тварини
der Maulwurf|die Maulwürfe|mole|moles|кріт|кроти|Тварини
der Frosch|die Frösche|frog|frogs|жаба|жаби|Тварини
die Schildkröte|die Schildkröten|turtle|turtles|черепаха|черепахи|Тварини
die Eidechse|die Eidechsen|lizard|lizards|ящірка|ящірки|Тварини
die Schlange|die Schlangen|snake|snakes|змія|змії|Тварини
der Adler|die Adler|eagle|eagles|орел|орли|Тварини
die Eule|die Eulen|owl|owls|сова|сови|Тварини
der Specht|die Spechte|woodpecker|woodpeckers|дятел|дятли|Тварини
die Möwe|die Möwen|seagull|seagulls|чайка|чайки|Тварини
der Schwan|die Schwäne|swan|swans|лебідь|лебеді|Тварини
der Kranich|die Kraniche|crane|cranes|журавель|журавлі|Тварини
der Storch|die Störche|stork|storks|лелека|лелеки|Тварини
die Ente|die Enten|duck|ducks|качка|качки|Тварини
die Gans|die Gänse|goose|geese|гуска|гуски|Тварини
der Truthahn|die Truthähne|turkey|turkeys|індик|індики|Тварини
die Ziege|die Ziegen|goat|goats|коза|кози|Тварини
das Schaf|die Schafe|a sheep|sheep|вівця|вівці|Тварини
der Esel|die Esel|donkey|donkeys|віслюк|віслюки|Тварини
das Schwein|die Schweine|pig|pigs|свиня|свині|Тварини
das Kalb|die Kälber|calf|calves|теля|телята|Тварини
der Hengst|die Hengste|stallion|stallions|жеребець|жеребці|Тварини
die Stute|die Stuten|mare|mares|кобила|кобили|Тварини
das Fohlen|die Fohlen|foal|foals|лоша|лошата|Тварини
der Hamster|die Hamster|hamster|hamsters|хом’як|хом’яки|Тварини
das Meerschweinchen|die Meerschweinchen|guinea pig|guinea pigs|морська свинка|морські свинки|Тварини
der Papagei|die Papageien|parrot|parrots|папуга|папуги|Тварини
der Goldfisch|die Goldfische|a goldfish|goldfish|золота рибка|золоті рибки|Тварини
der Karpfen|die Karpfen|a carp|carp|короп|коропи|Тварини
der Aal|die Aale|eel|eels|вугор|вугрі|Тварини
die Forelle|die Forellen|a trout|trout|форель|форелі|Тварини
der Hering|die Heringe|herring|herrings|оселедець|оселедці|Тварини
die Garnele|die Garnelen|a shrimp|shrimp|креветка|креветки|Тварини
die Muschel|die Muscheln|mussel|mussels|мідія|мідії|Тварини
der Tintenfisch|die Tintenfische|a squid|squid|кальмар|кальмари|Тварини
der Seestern|die Seesterne|a starfish|starfish|морська зірка|морські зірки|Тварини
die Qualle|die Quallen|a jellyfish|jellyfish|медуза|медузи|Тварини
der Ausflug|die Ausflüge|excursion|excursions|екскурсія|екскурсії|Подорожі
die Wanderung|die Wanderungen|hike|hikes|похід|походи|Подорожі
der Wanderstock|die Wanderstöcke|walking stick|walking sticks|палиця для ходьби|палиці для ходьби|Подорожі
die Landkarte|die Landkarten|map|maps|географічна мапа|географічні мапи|Подорожі
der Reiseführer|die Reiseführer|travel guide|travel guides|путівник|путівники|Подорожі
die Broschüre|die Broschüren|brochure|brochures|брошура|брошури|Подорожі
der Schalter|die Schalter|counter|counters|стійка|стійки|Подорожі
die Gepäckausgabe|die Gepäckausgaben|baggage claim|baggage claims|видача багажу|видачі багажу|Подорожі
der Kofferraum|die Kofferräume|trunk|trunks|багажник|багажники|Подорожі
die Fähre|die Fähren|ferry|ferries|пором|пороми|Подорожі
das Segelboot|die Segelboote|sailboat|sailboats|вітрильник|вітрильники|Подорожі
das U-Boot|die U-Boote|submarine|submarines|підводний човен|підводні човни|Подорожі
der Anhänger|die Anhänger|trailer|trailers|причіп|причепи|Подорожі
die Kreuzung|die Kreuzungen|intersection|intersections|перехрестя|перехрестя|Подорожі
der Kreisverkehr|die Kreisverkehre|roundabout|roundabouts|кільцева розв’язка|кільцеві розв’язки|Подорожі
die Fahrspur|die Fahrspuren|lane|lanes|смуга руху|смуги руху|Подорожі
der Zebrastreifen|die Zebrastreifen|pedestrian crossing|pedestrian crossings|пішохідний перехід|пішохідні переходи|Подорожі
die Unterführung|die Unterführungen|underpass|underpasses|підземний перехід|підземні переходи|Подорожі
die Überführung|die Überführungen|overpass|overpasses|шляхопровід|шляхопроводи|Подорожі
der Gehweg|die Gehwege|pavement|pavements|тротуар|тротуари|Подорожі
der Radweg|die Radwege|cycle path|cycle paths|велодоріжка|велодоріжки|Подорожі
der Stau|die Staus|traffic jam|traffic jams|затори|затори|Подорожі
die Baustelle|die Baustellen|construction site|construction sites|будівельний майданчик|будівельні майданчики|Подорожі
die Tankstelle|die Tankstellen|gas station|gas stations|автозаправка|автозаправки|Подорожі
die Werkstatt|die Werkstätten|workshop|workshops|майстерня|майстерні|Подорожі
der Reifen|die Reifen|tire|tires|шина|шини|Подорожі
die Bremse|die Bremsen|brake|brakes|гальмо|гальма|Подорожі
der Motor|die Motoren|engine|engines|двигун|двигуни|Подорожі
das Lenkrad|die Lenkräder|steering wheel|steering wheels|кермо|керма|Подорожі
der Führerschein|die Führerscheine|driver’s license|driver’s licenses|водійське посвідчення|водійські посвідчення|Подорожі
die Maut|die Mauten|toll|tolls|плата за проїзд|плати за проїзд|Подорожі
die Fahrgemeinschaft|die Fahrgemeinschaften|carpool|carpools|спільна поїздка|спільні поїздки|Подорожі
die Abteilung|die Abteilungen|department|departments|відділ|відділи|Робота
die Bewerbung|die Bewerbungen|application|applications|заявка|заявки|Робота
der Lebenslauf|die Lebensläufe|résumé|résumés|резюме|резюме|Робота
das Vorstellungsgespräch|die Vorstellungsgespräche|job interview|job interviews|співбесіда|співбесіди|Робота
der Vertrag|die Verträge|contract|contracts|договір|договори|Робота
das Gehalt|die Gehälter|salary|salaries|заробітна плата|заробітні плати|Робота
der Lohn|die Löhne|wage|wages|заробіток|заробітки|Робота
die Beförderung|die Beförderungen|promotion|promotions|підвищення|підвищення|Робота
die Kündigung|die Kündigungen|resignation|resignations|звільнення|звільнення|Робота
der Ruhestand|die Ruhestände|retirement|retirements|пенсійний вік|пенсійні періоди|Робота
die Schicht|die Schichten|shift|shifts|зміна|зміни|Робота
die Überstunde|die Überstunden|overtime hour|overtime hours|понаднормова година|понаднормові години|Робота
der Auftrag|die Aufträge|assignment|assignments|доручення|доручення|Робота
`;

export const vocabularyExpansion: WordCard[] = nounForms
  .trim()
  .split('\n')
  .map((row, index) => {
    const [word, plural, english, englishPlural, translation, translationPlural, category] = row.split('|');
    const baseId = `noun-expansion-${index + 1}`;
    const createCard = (id: string, wordForm: string, englishForm: string, ukrainianForm: string): WordCard => ({
      id,
      word: wordForm,
      translation: ukrainianForm,
      translationEnglish: englishForm,
      category,
      kind: 'noun',
      phrase: wordForm,
      example: `Ich lerne das Wort "${wordForm}".`,
    });

    return [
      createCard(`${baseId}-singular`, word, english, translation),
      createCard(`${baseId}-plural`, plural, englishPlural, translationPlural),
    ];
  })
  .flat();
