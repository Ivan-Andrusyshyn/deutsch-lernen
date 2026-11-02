import type { LearningLanguage, Phrase, ReadingText } from '../../../core/models/vocabulary.model';

export const germanPhrases: Phrase[] = [
  { text: 'Guten Morgen!', translation: 'Доброго ранку!', example: 'Guten Morgen, Frau Müller!' },
  { text: 'Wie geht es Ihnen?', translation: 'Як у Вас справи?', example: 'Guten Tag! Wie geht es Ihnen?' },
  { text: 'Ich hätte gern …', translation: 'Я б хотів / хотіла …', example: 'Ich hätte gern einen Kaffee.' },
  { text: 'Können Sie mir helfen?', translation: 'Чи можете Ви мені допомогти?', example: 'Entschuldigung, können Sie mir helfen?' },
  { text: 'Wie komme ich zum Bahnhof?', translation: 'Як дістатися до вокзалу?', example: 'Entschuldigung, wie komme ich zum Bahnhof?' },
  { text: 'Was kostet das?', translation: 'Скільки це коштує?', example: 'Die Tasche gefällt mir. Was kostet das?' },
  { text: 'Ich verstehe nur Bahnhof.', translation: 'Я нічого не розумію (дослівно: розумію лише вокзал).', example: 'Bitte sprechen Sie langsam. Ich verstehe nur Bahnhof.' },
  { text: 'einen Termin vereinbaren', translation: 'домовитися про зустріч', example: 'Ich möchte einen Termin vereinbaren.' },
  { text: 'eine Fahrkarte kaufen', translation: 'купити квиток', example: 'Am Bahnhof möchte ich eine Fahrkarte kaufen.' },
  { text: 'Guten Appetit!', translation: 'Смачного!', example: 'Das Essen ist fertig. Guten Appetit!' },
  { text: 'Viel Spaß!', translation: 'Бажаю гарно провести час!', example: 'Viel Spaß auf der Party!' },
  { text: 'Bis später!', translation: 'До зустрічі!', example: 'Ich muss jetzt gehen. Bis später!' },
  { text: 'Es tut mir leid.', translation: 'Мені шкода; перепрошую.', example: 'Es tut mir leid, ich bin heute spät.' },
  { text: 'Keine Sorge.', translation: 'Не хвилюйся.', example: 'Keine Sorge, ich helfe dir.' },
  { text: 'Ich bin einverstanden.', translation: 'Я згоден / згодна.', example: 'Der Plan ist gut. Ich bin einverstanden.' },
  { text: 'Das macht nichts.', translation: 'Нічого страшного.', example: 'Du bist fünf Minuten spät? Das macht nichts.' },
  { text: 'einen Spaziergang machen', translation: 'піти на прогулянку', example: 'Nach dem Essen machen wir einen Spaziergang.' },
  { text: 'zu Fuß gehen', translation: 'йти пішки', example: 'Der Park ist nah, wir können zu Fuß gehen.' },
  { text: 'krank sein', translation: 'бути хворим / хворою', example: 'Heute kann ich nicht arbeiten, ich bin krank.' },
  { text: 'Ich freue mich auf …', translation: 'Я з нетерпінням чекаю на …', example: 'Ich freue mich auf den Urlaub.' },
  { text: 'Zeit haben', translation: 'мати час', example: 'Hast du heute Abend Zeit?' },
  { text: 'Bescheid sagen', translation: 'повідомити; дати знати', example: 'Sag mir bitte morgen Bescheid.' },
  { text: 'Wie spät ist es?', translation: 'Котра година?', example: 'Entschuldigung, wie spät ist es?' },
  { text: 'Das klingt gut.', translation: 'Звучить добре.', example: 'Wir treffen uns um sechs? Das klingt gut.' },
];

export const englishPhrases: Phrase[] = [
  { text: 'Good morning!', translation: 'Доброго ранку!', example: 'Good morning, Mrs Miller!' },
  { text: 'How are you?', translation: 'Як справи?', example: 'Hi! How are you today?' },
  { text: 'I would like …', translation: 'Я б хотів / хотіла …', example: 'I would like a coffee, please.' },
  { text: 'Can you help me?', translation: 'Можеш мені допомогти?', example: 'Excuse me, can you help me?' },
  { text: 'How do I get to the station?', translation: 'Як дістатися до вокзалу?', example: 'Excuse me, how do I get to the station?' },
  { text: 'How much is this?', translation: 'Скільки це коштує?', example: 'I like this bag. How much is this?' },
  { text: 'I don’t understand.', translation: 'Я не розумію.', example: 'Please speak slowly. I don’t understand.' },
  { text: 'make an appointment', translation: 'домовитися про зустріч', example: 'I would like to make an appointment.' },
  { text: 'buy a ticket', translation: 'купити квиток', example: 'At the station I want to buy a ticket.' },
  { text: 'Enjoy your meal!', translation: 'Смачного!', example: 'Dinner is ready. Enjoy your meal!' },
  { text: 'Have fun!', translation: 'Бажаю гарно провести час!', example: 'Have fun at the party!' },
  { text: 'See you later!', translation: 'До зустрічі!', example: 'I have to go now. See you later!' },
  { text: 'I am sorry.', translation: 'Мені шкода; перепрошую.', example: 'I am sorry, I am late today.' },
  { text: 'Don’t worry.', translation: 'Не хвилюйся.', example: 'Don’t worry, I will help you.' },
  { text: 'I agree.', translation: 'Я згоден / згодна.', example: 'The plan is good. I agree.' },
  { text: 'That’s okay.', translation: 'Нічого страшного.', example: 'You are five minutes late? That’s okay.' },
  { text: 'go for a walk', translation: 'піти на прогулянку', example: 'After lunch we go for a walk.' },
  { text: 'go on foot', translation: 'йти пішки', example: 'The park is near, we can go on foot.' },
  { text: 'be ill', translation: 'бути хворим / хворою', example: 'I cannot work today, I am ill.' },
  { text: 'I am looking forward to …', translation: 'Я з нетерпінням чекаю на …', example: 'I am looking forward to the holiday.' },
  { text: 'have time', translation: 'мати час', example: 'Do you have time this evening?' },
  { text: 'let someone know', translation: 'повідомити; дати знати', example: 'Please let me know tomorrow.' },
  { text: 'What time is it?', translation: 'Котра година?', example: 'Excuse me, what time is it?' },
  { text: 'That sounds good.', translation: 'Звучить добре.', example: 'Shall we meet at six? That sounds good.' },
];

export const germanReadingTexts: ReadingText[] = [
  {
    title: 'Ein neuer Tag',
    level: 'Щоденне життя',
    body: 'Am Morgen steht Lara um sieben Uhr auf. Sie frühstückt mit ihrem Bruder. Um acht Uhr fährt sie mit dem Bus zur Arbeit. Im Büro schreibt sie E-Mails und spricht mit ihren Kollegen. In der Mittagspause isst Lara eine Suppe. Um fünf Uhr fährt sie nach Hause. Am Abend lernt sie Deutsch und telefoniert mit einer Freundin.',
    translation: 'Вранці Лара прокидається о сьомій. Вона снідає разом із братом. О восьмій вона їде на роботу автобусом. В офісі пише електронні листи й розмовляє з колегами. Під час обідньої перерви Лара їсть суп. О п’ятій вона повертається додому. Увечері вивчає німецьку та телефонує подрузі.',
    questions: [
      { question: 'Чим Лара їде на роботу?', answer: 'Автобусом.' },
      { question: 'Що вона робить увечері?', answer: 'Вивчає німецьку та телефонує подрузі.' },
    ],
  },
  {
    title: 'Ein Wochenende in Berlin',
    level: 'Подорожі',
    body: 'Am Samstag fährt Amir mit dem Zug nach Berlin. Sein Hotel liegt in der Nähe vom Bahnhof. Zuerst besucht er ein Museum. Danach isst er in einem kleinen Restaurant zu Mittag. Das Essen schmeckt sehr gut. Am Nachmittag macht Amir einen Spaziergang im Park und kauft eine Postkarte. Am Sonntag besucht er seine Freundin. Am Abend fährt er wieder nach Hause.',
    translation: 'У суботу Амір їде потягом до Берліна. Його готель розташований неподалік від вокзалу. Спочатку він відвідує музей, а потім обідає в невеликому ресторані. Їжа дуже смачна. Після обіду Амір гуляє в парку та купує листівку. У неділю він навідує подругу, а ввечері повертається додому.',
    questions: [
      { question: 'Чим Амір їде до Берліна?', answer: 'Потягом.' },
      { question: 'Що він купує в парку?', answer: 'Листівку.' },
    ],
  },
  {
    title: 'Ein Termin beim Arzt',
    level: 'Здоров’я',
    body: 'Seit gestern hat Nina starke Kopfschmerzen. Heute ruft sie in der Arztpraxis an und vereinbart einen Termin. Der Arzt fragt: „Haben Sie auch Fieber?“ Nina antwortet: „Nein, aber ich bin sehr müde.“ Der Arzt untersucht sie und gibt ihr ein Medikament. Er sagt, Nina soll viel Wasser trinken und sich ausruhen. In drei Tagen geht es ihr schon besser.',
    translation: 'Від учора в Ніни сильно болить голова. Сьогодні вона телефонує до лікаря й домовляється про прийом. Лікар запитує: «У Вас є температура?» Ніна відповідає: «Ні, але я дуже втомилася». Лікар оглядає її та призначає ліки. Він радить Ніні пити багато води й відпочивати. За три дні їй стає краще.',
    questions: [
      { question: 'Чому Ніна йде до лікаря?', answer: 'У неї сильно болить голова.' },
      { question: 'Що Ніні слід пити?', answer: 'Багато води.' },
    ],
  },
  {
    title: 'Ein Besuch im Geschäft',
    level: 'Одяг і покупки',
    body: 'Am Samstag geht Mila mit ihrer Schwester in ein Geschäft. Sie sucht eine warme Jacke für den Herbst. Die Verkäuferin zeigt ihr zwei Modelle. Mila probiert eine grüne Jacke an. Sie passt gut und kostet achtzig Euro. Mila bezahlt an der Kasse mit Karte und bekommt eine Quittung. Danach trinken die Schwestern einen Tee im Café.',
    translation: 'У суботу Міла йде із сестрою до магазину. Вона шукає теплу куртку на осінь. Продавчиня показує їй дві моделі. Міла приміряє зелену куртку. Вона добре підходить і коштує вісімдесят євро. Міла платить карткою на касі й отримує чек. Потім сестри п’ють чай у кав’ярні.',
    questions: [
      { question: 'Що шукає Міла?', answer: 'Теплу куртку.' },
      { question: 'Як вона платить?', answer: 'Карткою.' },
    ],
  },
  {
    title: 'Ein Tag am See',
    level: 'Природа й довкілля',
    body: 'Bei schönem Wetter fährt Jonas mit dem Fahrrad zum See. Er nimmt eine Flasche Wasser und ein Buch mit. Am Ufer sieht er Enten und viele Blumen. Danach geht er mit seiner Freundin am Wasser spazieren. Sie sammeln ihren Müll in einer Tasche und lassen den Platz sauber. Am Abend fahren sie mit dem Bus nach Hause.',
    translation: 'У гарну погоду Йонас їде велосипедом до озера. Він бере із собою пляшку води та книжку. На березі він бачить качок і багато квітів. Потім він гуляє біля води зі своєю подругою. Вони збирають своє сміття в пакет і залишають місце чистим. Увечері вони їдуть додому автобусом.',
    questions: [
      { question: 'Чим Йонас їде до озера?', answer: 'Велосипедом.' },
      { question: 'Що друзі роблять зі сміттям?', answer: 'Збирають його й забирають із собою.' },
    ],
  },
  {
    title: 'Ein neuer Sprachkurs',
    level: 'Навчання й спілкування',
    body: 'Am Montag beginnt für Olena ein neuer Deutschkurs. Die Lehrerin begrüßt alle freundlich und bittet die Gruppe, sich vorzustellen. Olena erzählt, dass sie aus der Ukraine kommt und gern fotografiert. Im Kurs arbeiten die Teilnehmer zu zweit. Sie lesen einen kurzen Text, lernen neue Wörter und stellen Fragen. Am Ende verabreden sie sich zum gemeinsamen Üben.',
    translation: 'У понеділок для Олени починається новий курс німецької. Учителька привітно вітає всіх і просить групу представитися. Олена розповідає, що вона з України й любить фотографувати. На занятті учасники працюють у парах. Вони читають короткий текст, вивчають нові слова й ставлять запитання. Наприкінці вони домовляються разом практикуватися.',
    questions: [
      { question: 'Що Олена любить робити?', answer: 'Фотографувати.' },
      { question: 'Про що домовляються учасники наприкінці?', answer: 'Разом практикувати німецьку.' },
    ],
  },
  {
    title: 'Ein neues Hobby',
    level: 'Відпочинок і дозвілля',
    body: 'Nach der Arbeit hat David oft wenig Energie. Seine Nachbarin lädt ihn zu einem Spaziergang im Wald ein. Dort fotografieren sie Bäume und Vögel. David findet das sehr entspannend und möchte öfter draußen sein. Am nächsten Wochenende wandern sie auf einen kleinen Berg. David packt Wasser und ein paar Äpfel in seinen Rucksack.',
    translation: 'Після роботи Девід часто має мало сил. Сусідка запрошує його на прогулянку до лісу. Там вони фотографують дерева й птахів. Девід вважає це дуже розслаблювальним і хоче частіше бувати надворі. Наступними вихідними вони йдуть у похід на невелику гору. Девід кладе воду та кілька яблук у рюкзак.',
    questions: [
      { question: 'Куди сусідка запрошує Девіда?', answer: 'На прогулянку до лісу.' },
      { question: 'Що Девід бере в похід?', answer: 'Воду та кілька яблук.' },
    ],
  },
  {
    title: 'Ein Fest in der Nachbarschaft',
    level: 'Люди й події',
    body: 'Am Freitag organisiert die Nachbarschaft ein kleines Fest im Hof. Jede Familie bringt etwas zu essen mit. Frau Keller backt einen Kuchen, und Herr Braun macht einen frischen Salat. Die Kinder spielen und tanzen zur Musik. Neue Nachbarn stellen sich vor und sprechen mit den anderen. Am Ende helfen alle beim Aufräumen.',
    translation: 'У п’ятницю сусіди організовують невелике свято у дворі. Кожна родина приносить щось поїсти. Пані Келлер пече пиріг, а пан Браун готує свіжий салат. Діти граються й танцюють під музику. Нові сусіди представляються та спілкуються з іншими. Наприкінці всі допомагають прибрати.',
    questions: [
      { question: 'Що приносить кожна родина?', answer: 'Щось поїсти.' },
      { question: 'Хто допомагає прибирати наприкінці?', answer: 'Усі гості.' },
    ],
  },
];

export const englishReadingTexts: ReadingText[] = [
  {
    title: 'A New Day',
    level: 'Щоденне життя',
    body: 'In the morning Lara gets up at seven o’clock. She has breakfast with her brother. At eight she takes the bus to work. In the office she writes emails and talks to her colleagues. At lunchtime Lara eats soup. At five she goes home. In the evening she learns English and calls a friend.',
    translation: 'Вранці Лара прокидається о сьомій. Вона снідає разом із братом. О восьмій вона їде на роботу автобусом. В офісі пише електронні листи й розмовляє з колегами. Під час обідньої перерви Лара їсть суп. О п’ятій вона повертається додому. Увечері вивчає англійську та телефонує подрузі.',
    questions: [
      { question: 'Чим Лара їде на роботу?', answer: 'Автобусом.' },
      { question: 'Що вона робить увечері?', answer: 'Вивчає англійську та телефонує подрузі.' },
    ],
  },
  {
    title: 'A Weekend in London',
    level: 'Подорожі',
    body: 'On Saturday Amir takes the train to London. His hotel is near the station. First he visits a museum. Then he has lunch in a small restaurant. The food is very good. In the afternoon Amir walks in the park and buys a postcard. On Sunday he visits his friend. In the evening he goes home again.',
    translation: 'У суботу Амір їде потягом до Лондона. Його готель неподалік від вокзалу. Спочатку він відвідує музей, а потім обідає в невеликому ресторані. Їжа дуже смачна. Після обіду Амір гуляє в парку та купує листівку. У неділю він навідує друга, а ввечері повертається додому.',
    questions: [
      { question: 'Чим Амір їде до Лондона?', answer: 'Потягом.' },
      { question: 'Що він купує в парку?', answer: 'Листівку.' },
    ],
  },
  {
    title: 'A Visit to the Doctor',
    level: 'Здоров’я',
    body: 'Nina has had a bad headache since yesterday. Today she calls the doctor and makes an appointment. The doctor asks, “Do you also have a fever?” Nina answers, “No, but I am very tired.” The doctor examines her and gives her medicine. He says Nina should drink a lot of water and rest. After three days she feels better.',
    translation: 'Від учора в Ніни сильно болить голова. Сьогодні вона телефонує до лікаря й домовляється про прийом. Лікар запитує: «У вас є температура?» Ніна відповідає: «Ні, але я дуже втомилася». Лікар оглядає її та дає ліки. Він радить Ніні пити багато води й відпочивати. За три дні їй стає краще.',
    questions: [
      { question: 'Чому Ніна йде до лікаря?', answer: 'У неї сильно болить голова.' },
      { question: 'Що Ніні слід пити?', answer: 'Багато води.' },
    ],
  },
  {
    title: 'A Trip to the Shop',
    level: 'Одяг і покупки',
    body: 'On Saturday Mila goes to a shop with her sister. She is looking for a warm jacket for autumn. The shop assistant shows her two jackets. Mila tries on a green one. It fits well and costs eighty pounds. Mila pays by card and gets a receipt. After that the sisters drink tea in a café.',
    translation: 'У суботу Міла йде із сестрою до магазину. Вона шукає теплу куртку на осінь. Продавець показує їй дві куртки. Міла приміряє зелену. Вона добре підходить і коштує вісімдесят фунтів. Міла платить карткою й отримує чек. Потім сестри п’ють чай у кав’ярні.',
    questions: [
      { question: 'Що шукає Міла?', answer: 'Теплу куртку.' },
      { question: 'Як вона платить?', answer: 'Карткою.' },
    ],
  },
  {
    title: 'A Day at the Lake',
    level: 'Природа й довкілля',
    body: 'When the weather is nice, Jonas rides his bike to the lake. He takes a bottle of water and a book. On the shore he sees ducks and many flowers. Then he walks by the water with his friend. They put their rubbish in a bag and leave the place clean. In the evening they take the bus home.',
    translation: 'У гарну погоду Йонас їде велосипедом до озера. Він бере пляшку води та книжку. На березі він бачить качок і багато квітів. Потім гуляє біля води з другом. Вони збирають сміття в пакет і залишають місце чистим. Увечері їдуть додому автобусом.',
    questions: [
      { question: 'Чим Йонас їде до озера?', answer: 'Велосипедом.' },
      { question: 'Що друзі роблять зі сміттям?', answer: 'Збирають його й забирають із собою.' },
    ],
  },
  {
    title: 'A New Language Course',
    level: 'Навчання й спілкування',
    body: 'On Monday Olena starts a new English course. The teacher greets everyone and asks the group to introduce themselves. Olena says she is from Ukraine and likes taking photos. In class the students work in pairs. They read a short text, learn new words and ask questions. At the end they agree to practise together.',
    translation: 'У понеділок для Олени починається новий курс англійської. Учителька вітає всіх і просить групу представитися. Олена каже, що вона з України й любить фотографувати. На занятті студенти працюють у парах. Вони читають короткий текст, вчать нові слова й ставлять запитання. Наприкінці домовляються разом практикуватися.',
    questions: [
      { question: 'Що Олена любить робити?', answer: 'Фотографувати.' },
      { question: 'Про що домовляються студенти наприкінці?', answer: 'Разом практикувати англійську.' },
    ],
  },
  {
    title: 'A New Hobby',
    level: 'Відпочинок і дозвілля',
    body: 'After work David often has little energy. His neighbour invites him for a walk in the forest. There they take photos of trees and birds. David finds it very relaxing and wants to be outside more often. Next weekend they hike up a small hill. David puts water and a few apples in his backpack.',
    translation: 'Після роботи Девід часто має мало сил. Сусідка запрошує його на прогулянку до лісу. Там вони фотографують дерева й птахів. Девід вважає це розслаблювальним і хоче частіше бути надворі. Наступними вихідними вони йдуть на невеликий пагорб. Девід кладе воду та кілька яблук у рюкзак.',
    questions: [
      { question: 'Куди сусідка запрошує Девіда?', answer: 'На прогулянку до лісу.' },
      { question: 'Що Девід бере в похід?', answer: 'Воду та кілька яблук.' },
    ],
  },
  {
    title: 'A Neighbourhood Party',
    level: 'Люди й події',
    body: 'On Friday the neighbours organise a small party in the yard. Every family brings something to eat. Mrs Keller bakes a cake, and Mr Brown makes a fresh salad. The children play and dance to the music. New neighbours introduce themselves and talk to the others. At the end everybody helps to clean up.',
    translation: 'У п’ятницю сусіди організовують невелике свято у дворі. Кожна родина приносить щось поїсти. Пані Келлер пече пиріг, а пан Браун готує свіжий салат. Діти граються й танцюють під музику. Нові сусіди представляються та спілкуються з іншими. Наприкінці всі допомагають прибрати.',
    questions: [
      { question: 'Що приносить кожна родина?', answer: 'Щось поїсти.' },
      { question: 'Хто допомагає прибирати наприкінці?', answer: 'Усі гості.' },
    ],
  },
];

export function phrasesFor(language: LearningLanguage): Phrase[] {
  return language === 'en' ? englishPhrases : germanPhrases;
}

export function readingTextsFor(language: LearningLanguage): ReadingText[] {
  return language === 'en' ? englishReadingTexts : germanReadingTexts;
}
