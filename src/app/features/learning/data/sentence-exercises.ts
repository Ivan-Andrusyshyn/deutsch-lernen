import type { LearningLanguage, LearningLevel } from '../../../core/models/vocabulary.model';

export interface SentenceExercise {
  id: string;
  language: LearningLanguage;
  level: LearningLevel;
  text: string;
  translation: string;
}

export interface SentenceQuizQuestion {
  id: string;
  kind: 'translate' | 'reverse' | 'gap' | 'gap-second';
  prompt: string;
  answer: string;
  options: string[];
}

const sentenceRows = `
en|A2|I work in a small office near the station.|Я працюю в невеликому офісі біля вокзалу.
en|A2|My sister studies German every evening.|Моя сестра вивчає німецьку щовечора.
en|A2|We usually have breakfast at seven o’clock.|Зазвичай ми снідаємо о сьомій.
en|A2|There is a quiet park behind our house.|За нашим будинком є тихий парк.
en|A2|I need to buy some bread and fresh fruit.|Мені потрібно купити хліб і свіжі фрукти.
en|A2|The bus was late, so I walked to work.|Автобус запізнився, тому я пішов на роботу пішки.
en|A2|Could you show me where the nearest pharmacy is?|Не могли б ви показати, де найближча аптека?
en|A2|My parents are visiting us this weekend.|Цими вихідними до нас приїдуть батьки.
en|A2|She bought a warm coat because it was cold.|Вона купила тепле пальто, бо було холодно.
en|A2|We watched a funny film after dinner.|Після вечері ми подивилися кумедний фільм.
en|A2|I have lived in this city for two years.|Я живу в цьому місті вже два роки.
en|A2|Please turn off the light before you leave.|Будь ласка, вимкни світло перед виходом.
en|A2|He is learning to cook simple meals.|Він вчиться готувати прості страви.
en|A2|The supermarket closes at nine in the evening.|Супермаркет зачиняється о дев’ятій вечора.
en|A2|I would like a cup of tea without sugar.|Я хотів би чашку чаю без цукру.
en|A2|They are waiting for their friends outside the cinema.|Вони чекають на друзів біля кінотеатру.
en|A2|We travelled to the coast by train last summer.|Минулого літа ми поїхали до узбережжя потягом.
en|A2|My phone battery is almost empty.|У моєму телефоні майже розрядився акумулятор.
en|A2|The children are playing in the garden.|Діти граються в саду.
en|A2|I forgot my umbrella at home this morning.|Сьогодні вранці я забув удома парасольку.
en|A2|This room is brighter than the one upstairs.|Ця кімната світліша за ту, що нагорі.
en|A2|How often do you exercise during the week?|Як часто ти тренуєшся протягом тижня?
en|A2|We need two tickets for the evening show.|Нам потрібні два квитки на вечірню виставу.
en|A2|She speaks slowly when she meets new people.|Вона говорить повільно, коли знайомиться з новими людьми.
en|A2|I usually take a sandwich to work.|Зазвичай я беру на роботу бутерброд.
en|A2|The doctor told him to drink more water.|Лікар порадив йому пити більше води.
en|A2|Our neighbours have a very friendly dog.|У наших сусідів дуже привітний собака.
en|A2|Can I pay by card, please?|Чи можу я розрахуватися карткою?
en|A2|The meeting starts in fifteen minutes.|Зустріч починається за п’ятнадцять хвилин.
en|A2|I like this café because it is not too noisy.|Мені подобається це кафе, бо там не надто шумно.
en|A2|He left his keys on the kitchen table.|Він залишив ключі на кухонному столі.
en|A2|We are going to visit the museum tomorrow.|Завтра ми збираємося відвідати музей.
en|A2|It takes about twenty minutes to get there.|Дорога туди займає приблизно двадцять хвилин.
en|A2|My brother can repair a bicycle by himself.|Мій брат може сам полагодити велосипед.
en|A2|The shop sells local cheese and honey.|У магазині продають місцевий сир і мед.
en|A2|I felt tired, so I went to bed early.|Я втомився, тому ліг спати рано.
en|A2|Please write your name at the top of the page.|Напиши своє ім’я у верхній частині сторінки.
en|A2|There are three clean towels in the bathroom.|У ванній є три чисті рушники.
en|A2|She chose the blue dress for the party.|На вечірку вона вибрала синю сукню.
en|A2|We often cook dinner together on Fridays.|Щоп’ятниці ми часто готуємо вечерю разом.
en|A2|The train leaves from platform number four.|Потяг відправляється з четвертої платформи.
en|A2|I cannot come today because I have a cold.|Я не можу прийти сьогодні, бо застудився.
en|A2|He always checks the weather before a trip.|Перед поїздкою він завжди перевіряє прогноз погоди.
en|A2|Would you like to sit by the window?|Хочеш сісти біля вікна?
en|A2|My aunt works at a hospital in the city centre.|Моя тітка працює в лікарні в центрі міста.
en|A2|We have enough time to catch the next bus.|У нас достатньо часу, щоб встигнути на наступний автобус.
en|A2|The coffee is too hot to drink right now.|Кава зараз надто гаряча, щоб її пити.
en|A2|I am looking for a cheaper pair of shoes.|Я шукаю дешевшу пару взуття.
en|A2|They moved to a bigger flat last month.|Минулого місяця вони переїхали у більшу квартиру.
en|A2|Please call me when you arrive at the station.|Зателефонуй мені, коли приїдеш на вокзал.
en|B1|Although the journey was long, everyone arrived in a good mood.|Хоча дорога була довгою, усі прибули в гарному настрої.
en|B1|She applied for the position after completing her training.|Вона подала заявку на посаду після завершення навчання.
en|B1|The company offers flexible hours to help parents balance work and family life.|Компанія пропонує гнучкий графік, щоб батьки могли поєднувати роботу й сімейне життя.
en|B1|I would have called you earlier if I had known about the change.|Я зателефонував би тобі раніше, якби знав про зміну.
en|B1|The report explains how traffic affects air quality in the city.|У звіті пояснюється, як транспорт впливає на якість повітря в місті.
en|B1|He postponed the meeting because several participants were ill.|Він переніс зустріч, бо кілька учасників захворіли.
en|B1|Instead of buying a new device, we decided to repair the old one.|Замість купувати новий пристрій, ми вирішили полагодити старий.
en|B1|The landlord agreed to fix the heating before winter.|Орендодавець погодився відремонтувати опалення до зими.
en|B1|As soon as the application is complete, send it to the office.|Щойно заява буде готова, надішли її до офісу.
en|B1|Many residents took part in the discussion about the new park.|Багато мешканців долучилися до обговорення нового парку.
en|B1|The course was useful because it included practical examples.|Курс був корисним, бо містив практичні приклади.
en|B1|She managed to solve the problem without asking for extra help.|Їй вдалося розв’язати проблему, не просячи додаткової допомоги.
en|B1|We were surprised by how quickly the situation improved.|Ми здивувалися, як швидко ситуація покращилася.
en|B1|The hotel is cheaper than the one we stayed in last year.|Цей готель дешевший за той, у якому ми зупинялися торік.
en|B1|He explained the delay clearly and offered another appointment.|Він чітко пояснив затримку й запропонував інший час зустрічі.
en|B1|If you have any questions, please contact the customer service team.|Якщо маєш запитання, звернися до служби підтримки клієнтів.
en|B1|The new rules apply to everyone who uses the shared kitchen.|Нові правила стосуються всіх, хто користується спільною кухнею.
en|B1|Although the rent increased, the flat is still affordable for us.|Хоча орендна плата зросла, ця квартира нам іще по кишені.
en|B1|She has been working at the clinic since she finished university.|Вона працює в клініці відтоді, як закінчила університет.
en|B1|We should compare several offers before making a final decision.|Перш ніж ухвалювати остаточне рішення, варто порівняти кілька пропозицій.
en|B1|The manager encouraged the team to share their ideas openly.|Керівник заохотив команду відкрито ділитися ідеями.
en|B1|The museum remains open late on the first Thursday of each month.|Музей працює допізна в перший четвер кожного місяця.
en|B1|Because the instructions were unclear, we asked for an explanation.|Оскільки інструкції були незрозумілими, ми попросили пояснення.
en|B1|He saved money for several months so that he could buy a bicycle.|Він кілька місяців заощаджував, щоб купити велосипед.
en|B1|The survey showed that most people prefer public transport.|Опитування показало, що більшість людей надає перевагу громадському транспорту.
en|B1|I turned off notifications so I could concentrate on the assignment.|Я вимкнув сповіщення, щоб зосередитися на завданні.
en|B1|Even though she was nervous, she gave a confident presentation.|Хоча вона нервувала, презентація в неї вийшла впевненою.
en|B1|The doctor recommended regular exercise and a balanced diet.|Лікар порадив регулярно займатися спортом і збалансовано харчуватися.
en|B1|We missed the connection because our first train was delayed.|Ми не встигли на пересадку, бо перший потяг затримався.
en|B1|The local council plans to plant more trees along the main road.|Міська рада планує висадити більше дерев уздовж головної дороги.
en|B1|She returned the product after noticing a small defect.|Вона повернула товар, помітивши невеликий дефект.
en|B1|The event was cancelled due to severe weather conditions.|Захід скасували через складні погодні умови.
en|B1|I appreciate your advice, although I may choose a different solution.|Я ціную твою пораду, хоча можу вибрати інше рішення.
en|B1|The article describes the challenges faced by young families.|У статті описано труднощі, з якими стикаються молоді родини.
en|B1|Please keep the receipt in case you need to exchange the item.|Збережи чек, якщо доведеться обміняти товар.
en|B1|They reached an agreement after discussing each point carefully.|Вони домовилися після того, як ретельно обговорили кожен пункт.
en|B1|The village has changed considerably since the new road was built.|Село помітно змінилося після будівництва нової дороги.
en|B1|To reduce waste, the café now serves drinks in reusable cups.|Щоб зменшити кількість відходів, кафе тепер подає напої у багаторазових горнятках.
en|B1|He found accommodation through a website recommended by a colleague.|Він знайшов житло через сайт, який порадив колега.
en|B1|The workshop was postponed until more participants could attend.|Майстер-клас перенесли, щоб у ньому змогло взяти участь більше людей.
en|B1|While the children were playing outside, their parents prepared dinner.|Поки діти гралися надворі, батьки готували вечерю.
en|B1|The instructions explain what to do if the machine stops working.|В інструкції пояснено, що робити, якщо пристрій перестане працювати.
en|B1|She accepted the offer because it matched her experience and goals.|Вона прийняла пропозицію, бо та відповідала її досвіду й цілям.
en|B1|The train is usually reliable, even during the busy holiday season.|Потяг зазвичай ходить надійно навіть під час насиченого святкового сезону.
en|B1|After the storm, volunteers helped residents clean the streets.|Після бурі волонтери допомогли мешканцям прибрати вулиці.
en|B1|He is responsible for organising the schedule and informing the group.|Він відповідає за складання розкладу й інформування групи.
en|B1|The website allows customers to track their orders online.|Сайт дає змогу покупцям відстежувати замовлення онлайн.
en|B1|I chose the evening course because I work during the day.|Я вибрав вечірній курс, бо вдень працюю.
en|B1|The neighbours reached a compromise about the use of the garden.|Сусіди дійшли компромісу щодо користування садом.
en|B1|Unless we leave soon, we will miss the beginning of the performance.|Якщо ми скоро не вийдемо, то пропустимо початок вистави.
de|A2|Ich wohne mit meiner Familie in einer ruhigen Straße.|Я живу з родиною на тихій вулиці.
de|A2|Meine Schwester lernt jeden Abend Deutsch.|Моя сестра вивчає німецьку щовечора.
de|A2|Wir frühstücken normalerweise um sieben Uhr.|Зазвичай ми снідаємо о сьомій.
de|A2|Hinter unserem Haus gibt es einen kleinen Park.|За нашим будинком є невеликий парк.
de|A2|Ich muss noch Brot und frisches Obst kaufen.|Мені ще потрібно купити хліб і свіжі фрукти.
de|A2|Der Bus hatte Verspätung, deshalb bin ich zu Fuß gegangen.|Автобус запізнився, тому я пішов пішки.
de|A2|Können Sie mir zeigen, wo die nächste Apotheke ist?|Не могли б ви показати, де найближча аптека?
de|A2|Meine Eltern besuchen uns an diesem Wochenende.|Мої батьки приїдуть до нас цими вихідними.
de|A2|Sie hat einen warmen Mantel gekauft, weil es kalt war.|Вона купила тепле пальто, бо було холодно.
de|A2|Nach dem Abendessen haben wir einen lustigen Film gesehen.|Після вечері ми подивилися кумедний фільм.
de|A2|Ich wohne seit zwei Jahren in dieser Stadt.|Я живу в цьому місті вже два роки.
de|A2|Mach bitte das Licht aus, bevor du gehst.|Будь ласка, вимкни світло перед виходом.
de|A2|Er lernt, einfache Gerichte zu kochen.|Він вчиться готувати прості страви.
de|A2|Der Supermarkt schließt um neun Uhr abends.|Супермаркет зачиняється о дев’ятій вечора.
de|A2|Ich möchte gern eine Tasse Tee ohne Zucker.|Я хотів би чашку чаю без цукру.
de|A2|Sie warten vor dem Kino auf ihre Freunde.|Вони чекають на друзів перед кінотеатром.
de|A2|Letzten Sommer sind wir mit dem Zug an die Küste gefahren.|Минулого літа ми поїхали до узбережжя потягом.
de|A2|Der Akku meines Handys ist fast leer.|У моєму телефоні майже розрядився акумулятор.
de|A2|Die Kinder spielen im Garten.|Діти граються в саду.
de|A2|Heute Morgen habe ich meinen Regenschirm zu Hause vergessen.|Сьогодні вранці я забув удома парасольку.
de|A2|Dieses Zimmer ist heller als das Zimmer oben.|Ця кімната світліша за ту, що нагорі.
de|A2|Wie oft machst du in der Woche Sport?|Як часто ти займаєшся спортом протягом тижня?
de|A2|Wir brauchen zwei Karten für die Vorstellung am Abend.|Нам потрібні два квитки на вечірню виставу.
de|A2|Wenn sie neue Leute trifft, spricht sie langsam.|Коли вона знайомиться з новими людьми, то говорить повільно.
de|A2|Normalerweise nehme ich ein belegtes Brot mit zur Arbeit.|Зазвичай я беру на роботу бутерброд.
de|A2|Der Arzt hat ihm gesagt, dass er mehr Wasser trinken soll.|Лікар сказав йому пити більше води.
de|A2|Unsere Nachbarn haben einen sehr freundlichen Hund.|У наших сусідів дуже привітний собака.
de|A2|Kann ich bitte mit Karte bezahlen?|Чи можу я розрахуватися карткою?
de|A2|Die Besprechung beginnt in fünfzehn Minuten.|Нарада починається за п’ятнадцять хвилин.
de|A2|Ich mag dieses Café, weil es dort nicht zu laut ist.|Мені подобається це кафе, бо там не надто шумно.
de|A2|Er hat seine Schlüssel auf dem Küchentisch liegen lassen.|Він залишив ключі на кухонному столі.
de|A2|Morgen wollen wir das Museum besuchen.|Завтра ми збираємося відвідати музей.
de|A2|Die Fahrt dorthin dauert ungefähr zwanzig Minuten.|Дорога туди займає приблизно двадцять хвилин.
de|A2|Mein Bruder kann sein Fahrrad selbst reparieren.|Мій брат може сам полагодити велосипед.
de|A2|In dem Laden gibt es Käse und Honig aus der Region.|У магазині продають місцевий сир і мед.
de|A2|Ich war müde und bin deshalb früh ins Bett gegangen.|Я втомився, тому ліг спати рано.
de|A2|Schreib bitte deinen Namen oben auf die Seite.|Напиши своє ім’я у верхній частині сторінки.
de|A2|Im Badezimmer liegen drei saubere Handtücher.|У ванній лежать три чисті рушники.
de|A2|Für die Feier hat sie das blaue Kleid ausgesucht.|На вечірку вона вибрала синю сукню.
de|A2|Freitags kochen wir oft zusammen das Abendessen.|Щоп’ятниці ми часто готуємо вечерю разом.
de|A2|Der Zug fährt von Gleis vier ab.|Потяг відправляється з четвертої колії.
de|A2|Heute kann ich nicht kommen, weil ich erkältet bin.|Я не можу прийти сьогодні, бо застудився.
de|A2|Vor einer Reise prüft er immer das Wetter.|Перед поїздкою він завжди перевіряє погоду.
de|A2|Möchtest du am Fenster sitzen?|Хочеш сісти біля вікна?
de|A2|Meine Tante arbeitet in einem Krankenhaus im Stadtzentrum.|Моя тітка працює в лікарні в центрі міста.
de|A2|Wir haben genug Zeit, um den nächsten Bus zu erreichen.|У нас достатньо часу, щоб встигнути на наступний автобус.
de|A2|Der Kaffee ist jetzt zu heiß zum Trinken.|Кава зараз надто гаряча, щоб її пити.
de|A2|Ich suche ein günstigeres Paar Schuhe.|Я шукаю дешевшу пару взуття.
de|A2|Letzten Monat sind sie in eine größere Wohnung gezogen.|Минулого місяця вони переїхали у більшу квартиру.
de|A2|Ruf mich bitte an, wenn du am Bahnhof ankommst.|Зателефонуй мені, коли приїдеш на вокзал.
de|B1|Obwohl die Reise lang war, kamen alle gut gelaunt an.|Хоча подорож була довгою, усі прибули в гарному настрої.
de|B1|Nach ihrer Ausbildung bewarb sie sich um die Stelle.|Після навчання вона подала заявку на цю посаду.
de|B1|Das Unternehmen bietet flexible Arbeitszeiten, damit Eltern Beruf und Familie vereinbaren können.|Компанія пропонує гнучкий графік, щоб батьки могли поєднувати роботу й сім’ю.
de|B1|Ich hätte dich früher angerufen, wenn ich von der Änderung gewusst hätte.|Я зателефонував би тобі раніше, якби знав про зміну.
de|B1|Der Bericht erklärt, wie der Verkehr die Luftqualität in der Stadt beeinflusst.|У звіті пояснюється, як транспорт впливає на якість повітря в місті.
de|B1|Er verschob die Besprechung, weil mehrere Teilnehmende krank waren.|Він переніс нараду, бо кілька учасників захворіли.
de|B1|Statt ein neues Gerät zu kaufen, beschlossen wir, das alte zu reparieren.|Замість купувати новий пристрій, ми вирішили полагодити старий.
de|B1|Der Vermieter erklärte sich bereit, die Heizung vor dem Winter zu reparieren.|Орендодавець погодився відремонтувати опалення до зими.
de|B1|Sobald der Antrag vollständig ist, schick ihn bitte an das Büro.|Щойно заява буде готова, надішли її до офісу.
de|B1|Viele Einwohner beteiligten sich an der Diskussion über den neuen Park.|Багато мешканців долучилися до обговорення нового парку.
de|B1|Der Kurs war hilfreich, weil er praktische Beispiele enthielt.|Курс був корисним, бо містив практичні приклади.
de|B1|Sie konnte das Problem lösen, ohne zusätzliche Hilfe zu brauchen.|Їй вдалося розв’язати проблему, не потребуючи додаткової допомоги.
de|B1|Wir waren überrascht, wie schnell sich die Situation verbesserte.|Ми здивувалися, як швидко ситуація покращилася.
de|B1|Dieses Hotel ist günstiger als das, in dem wir letztes Jahr übernachtet haben.|Цей готель дешевший за той, у якому ми зупинялися торік.
de|B1|Er erklärte die Verspätung verständlich und schlug einen anderen Termin vor.|Він зрозуміло пояснив затримку й запропонував інший час зустрічі.
de|B1|Wenn du Fragen hast, wende dich bitte an den Kundenservice.|Якщо маєш запитання, звернися до служби підтримки клієнтів.
de|B1|Die neuen Regeln gelten für alle, die die Gemeinschaftsküche benutzen.|Нові правила стосуються всіх, хто користується спільною кухнею.
de|B1|Obwohl die Miete gestiegen ist, können wir uns die Wohnung noch leisten.|Хоча орендна плата зросла, ця квартира нам іще по кишені.
de|B1|Sie arbeitet in der Klinik, seit sie ihr Studium abgeschlossen hat.|Вона працює в клініці відтоді, як закінчила університет.
de|B1|Vor einer endgültigen Entscheidung sollten wir mehrere Angebote vergleichen.|Перш ніж ухвалювати остаточне рішення, варто порівняти кілька пропозицій.
de|B1|Der Leiter ermutigte das Team, offen über seine Ideen zu sprechen.|Керівник заохотив команду відкрито ділитися ідеями.
de|B1|Am ersten Donnerstag jedes Monats bleibt das Museum länger geöffnet.|Музей працює допізна в перший четвер кожного місяця.
de|B1|Weil die Anweisungen unklar waren, baten wir um eine Erklärung.|Оскільки інструкції були незрозумілими, ми попросили пояснення.
de|B1|Er sparte mehrere Monate, damit er sich ein Fahrrad kaufen konnte.|Він кілька місяців заощаджував, щоб купити велосипед.
de|B1|Die Umfrage ergab, dass die meisten Menschen öffentliche Verkehrsmittel bevorzugen.|Опитування показало, що більшість людей надає перевагу громадському транспорту.
de|B1|Ich schaltete die Benachrichtigungen aus, um mich auf die Aufgabe zu konzentrieren.|Я вимкнув сповіщення, щоб зосередитися на завданні.
de|B1|Obwohl sie nervös war, hielt sie eine überzeugende Präsentation.|Хоча вона нервувала, презентація в неї вийшла переконливою.
de|B1|Der Arzt empfahl regelmäßige Bewegung und eine ausgewogene Ernährung.|Лікар порадив регулярно займатися спортом і збалансовано харчуватися.
de|B1|Wir verpassten den Anschluss, weil unser erster Zug Verspätung hatte.|Ми не встигли на пересадку, бо перший потяг затримався.
de|B1|Die Gemeinde plant, mehr Bäume entlang der Hauptstraße zu pflanzen.|Міська рада планує висадити більше дерев уздовж головної дороги.
de|B1|Sie gab die Ware zurück, nachdem sie einen kleinen Mangel entdeckt hatte.|Вона повернула товар, помітивши невеликий дефект.
de|B1|Die Veranstaltung wurde wegen des schlechten Wetters abgesagt.|Захід скасували через складні погодні умови.
de|B1|Ich schätze deinen Rat, auch wenn ich vielleicht eine andere Lösung wähle.|Я ціную твою пораду, хоча можу вибрати інше рішення.
de|B1|Der Artikel beschreibt die Schwierigkeiten, mit denen junge Familien zu tun haben.|У статті описано труднощі, з якими стикаються молоді родини.
de|B1|Bewahre die Quittung auf, falls du den Artikel umtauschen musst.|Збережи чек, якщо доведеться обміняти товар.
de|B1|Sie einigten sich, nachdem sie jeden Punkt sorgfältig besprochen hatten.|Вони домовилися після того, як ретельно обговорили кожен пункт.
de|B1|Das Dorf hat sich stark verändert, seit die neue Straße gebaut wurde.|Село помітно змінилося після будівництва нової дороги.
de|B1|Um Abfall zu vermeiden, serviert das Café Getränke jetzt in Mehrwegbechern.|Щоб зменшити кількість відходів, кафе тепер подає напої у багаторазових горнятках.
de|B1|Er fand eine Unterkunft über eine Webseite, die ihm ein Kollege empfohlen hatte.|Він знайшов житло через сайт, який порадив колега.
de|B1|Der Workshop wurde verschoben, damit mehr Teilnehmende kommen konnten.|Майстер-клас перенесли, щоб у ньому змогло взяти участь більше людей.
de|B1|Während die Kinder draußen spielten, bereiteten ihre Eltern das Abendessen vor.|Поки діти гралися надворі, батьки готували вечерю.
de|B1|In der Anleitung steht, was man tun soll, wenn das Gerät nicht mehr funktioniert.|В інструкції пояснено, що робити, якщо пристрій перестане працювати.
de|B1|Sie nahm das Angebot an, weil es zu ihrer Erfahrung und ihren Zielen passte.|Вона прийняла пропозицію, бо та відповідала її досвіду й цілям.
de|B1|Der Zug ist normalerweise zuverlässig, auch während der Ferienzeit.|Потяг зазвичай ходить надійно навіть під час святкового сезону.
de|B1|Nach dem Sturm halfen Freiwillige den Einwohnern, die Straßen aufzuräumen.|Після бурі волонтери допомогли мешканцям прибрати вулиці.
de|B1|Er ist dafür verantwortlich, den Plan zu erstellen und die Gruppe zu informieren.|Він відповідає за складання розкладу й інформування групи.
de|B1|Auf der Webseite können Kunden ihre Bestellungen online verfolgen.|Сайт дає змогу покупцям відстежувати замовлення онлайн.
de|B1|Ich wählte den Abendkurs, weil ich tagsüber arbeite.|Я вибрав вечірній курс, бо вдень працюю.
de|B1|Die Nachbarn fanden einen Kompromiss für die Nutzung des Gartens.|Сусіди дійшли компромісу щодо користування садом.
de|B1|Wenn wir nicht bald losgehen, verpassen wir den Anfang der Vorstellung.|Якщо ми скоро не вийдемо, то пропустимо початок вистави.
`;

export const sentenceExercises: SentenceExercise[] = sentenceRows
  .trim()
  .split('\n')
  .map((row, index) => {
    const [language, level, text, translation] = row.split('|');
    return {
      id: `sentence-${language}-${level}-${index + 1}`,
      language: language as LearningLanguage,
      level: level as LearningLevel,
      text,
      translation,
    };
  });

export function sentencesFor(language: LearningLanguage, level: LearningLevel): SentenceExercise[] {
  return sentenceExercises.filter((sentence) => sentence.language === language && sentence.level === level);
}

/** Four distinct question formats per sentence create a 200-question level deck. */
export function quizQuestionsFor(language: LearningLanguage, level: LearningLevel): SentenceQuizQuestion[] {
  const sentences = sentencesFor(language, level);
  const questions: SentenceQuizQuestion[] = [];
  const uniqueOptions = (answer: string, candidates: string[], seed: number): string[] => {
    const options = [answer];
    const normalize = (value: string) => value.trim().toLocaleLowerCase();
    for (let offset = 0; offset < candidates.length && options.length < 4; offset += 1) {
      const candidate = candidates[(seed + offset) % candidates.length];
      if (candidate && !options.some((option) => normalize(option) === normalize(candidate))) options.push(candidate);
    }
    const position = (seed * 7) % options.length;
    [options[0], options[position]] = [options[position], options[0]];
    return options;
  };

  sentences.forEach((sentence, index) => {
    const others = sentences.filter((_, otherIndex) => otherIndex !== index);
    const distractorTranslations = others.map((item) => item.translation);
    const distractorSentences = others.map((item) => item.text);
    const words = sentence.text.match(/[\p{L}’'-]+/gu) ?? [];
    const wordIndex = Math.min(Math.max(1, Math.floor(words.length / 2)), words.length - 1);
    const gapAt = (targetIndex: number) => {
      const missingWord = words[targetIndex] ?? words[0] ?? '';
      let wordPosition = -1;
      const gapPrompt = sentence.text.replace(/[\p{L}’'-]+/gu, (word) => {
        wordPosition += 1;
        return wordPosition === targetIndex ? '_____' : word;
      });
      const wordDistractors = others
        .map((item) => item.text.match(/[\p{L}’'-]+/gu)?.[targetIndex] ?? '')
        .filter((word) => word && word.toLocaleLowerCase() !== missingWord.toLocaleLowerCase());
      return {
        answer: missingWord,
        prompt: gapPrompt,
        options: uniqueOptions(missingWord, wordDistractors, index + targetIndex),
      };
    };
    const secondWordIndex = Math.min(Math.max(wordIndex + 2, Math.floor(words.length * 0.72)), words.length - 1);
    const firstGap = gapAt(wordIndex);
    const secondGap = gapAt(secondWordIndex);

    const variants: Omit<SentenceQuizQuestion, 'id'>[] = [
      { kind: 'translate', prompt: sentence.text, answer: sentence.translation, options: uniqueOptions(sentence.translation, distractorTranslations, index) },
      { kind: 'reverse', prompt: sentence.translation, answer: sentence.text, options: uniqueOptions(sentence.text, distractorSentences, index + 7) },
      { kind: 'gap', prompt: firstGap.prompt, answer: firstGap.answer, options: firstGap.options },
      { kind: 'gap-second', prompt: secondGap.prompt, answer: secondGap.answer, options: secondGap.options },
    ];
    variants.forEach((variant) => questions.push({ ...variant, id: `${sentence.id}-quiz-${variant.kind}` }));
  });
  return questions;
}
