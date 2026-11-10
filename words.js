// English word | Hebrew | example sentence
const TOPICS = {
"basics": {he:"בסיס", icon:"👋", w:`
hello|שלום|Hello, how are you today?
goodbye|להתראות|Goodbye, see you tomorrow.
please|בבקשה|Can you help me, please?
thank you|תודה|Thank you for your help.
sorry|סליחה / מצטער|I'm sorry I'm late.
yes|כן|Yes, I agree with you.
no|לא|No, I don't want coffee.
maybe|אולי|Maybe we can meet on Sunday.
excuse me|סלח לי|Excuse me, where is the bus stop?
welcome|ברוך הבא|Welcome to our home!
name|שם|My name is David.
friend|חבר|She is my best friend.
people|אנשים|Many people live in this city.
man|גבר|The man is reading a newspaper.
woman|אישה|The woman works at the bank.
child|ילד|The child is playing outside.
question|שאלה|Can I ask you a question?
answer|תשובה|I don't know the answer.
problem|בעיה|We have a small problem.
idea|רעיון|That's a great idea!
thing|דבר|I need to buy a few things.
place|מקום|This is my favorite place.
way|דרך|What is the best way to learn?
word|מילה|What does this word mean?
language|שפה|English is an international language.
`},
"family": {he:"משפחה", icon:"👨‍👩‍👧", w:`
mother|אמא|My mother is a teacher.
father|אבא|My father likes football.
parents|הורים|My parents live in Haifa.
brother|אח|I have one older brother.
sister|אחות|My sister is twelve years old.
son|בן|Their son is a doctor.
daughter|בת|Their daughter studies music.
grandmother|סבתא|My grandmother makes great soup.
grandfather|סבא|My grandfather was a soldier.
uncle|דוד|My uncle lives in America.
aunt|דודה|My aunt has three cats.
cousin|בן/בת דוד|My cousin is coming to visit.
husband|בעל|Her husband is very kind.
wife|אשה (רעיה)|His wife works in a hospital.
baby|תינוק|The baby is sleeping.
family|משפחה|I love spending time with my family.
married|נשוי|They have been married for ten years.
single|רווק|He is still single.
neighbor|שכן|Our neighbor is very friendly.
relative|קרוב משפחה|Many relatives came to the wedding.
`},
"numbers_time": {he:"מספרים וזמן", icon:"🕒", w:`
one|אחד|I have one dog.
two|שתיים|We need two tickets.
three|שלוש|She has three children.
ten|עשר|The store opens at ten.
hundred|מאה|It costs one hundred shekels.
thousand|אלף|There were a thousand people there.
first|ראשון|This is my first time in London.
second|שני / שנייה|Wait a second, please.
last|אחרון|This is the last bus tonight.
time|זמן|What time is it?
hour|שעה|The meeting is one hour long.
minute|דקה|I'll be there in five minutes.
day|יום|Have a nice day!
week|שבוע|I work five days a week.
month|חודש|Next month I'm going on vacation.
year|שנה|Happy new year!
today|היום|Today is a beautiful day.
tomorrow|מחר|See you tomorrow.
yesterday|אתמול|I saw him yesterday.
morning|בוקר|I drink coffee every morning.
afternoon|אחר הצהריים|Let's meet in the afternoon.
evening|ערב|We watch TV in the evening.
night|לילה|Good night, sleep well.
weekend|סוף שבוע|What are you doing this weekend?
early|מוקדם|I wake up early.
late|מאוחר|Sorry, I'm late again.
always|תמיד|She is always happy.
never|אף פעם|I never eat meat.
sometimes|לפעמים|Sometimes I walk to work.
often|לעתים קרובות|We often go to the beach.
`},
"food": {he:"אוכל ושתייה", icon:"🍎", w:`
food|אוכל|The food here is delicious.
water|מים|Can I have a glass of water?
bread|לחם|I buy fresh bread every day.
egg|ביצה|I eat an egg for breakfast.
cheese|גבינה|Do you like cheese?
milk|חלב|Put some milk in my coffee.
meat|בשר|He doesn't eat meat.
chicken|עוף|We are having chicken for dinner.
fish|דג|The fish is very fresh.
rice|אורז|Rice is cheap and healthy.
vegetables|ירקות|Eat more vegetables.
fruit|פרי|I love tropical fruit.
apple|תפוח|An apple a day keeps the doctor away.
banana|בננה|Bananas are yellow.
orange|תפוז|I drink orange juice.
tomato|עגבנייה|Add tomatoes to the salad.
potato|תפוח אדמה|French fries are made from potatoes.
salt|מלח|Pass me the salt, please.
sugar|סוכר|No sugar in my tea, thanks.
breakfast|ארוחת בוקר|Breakfast is ready!
lunch|ארוחת צהריים|Let's have lunch together.
dinner|ארוחת ערב|Dinner is at eight.
hungry|רעב|I'm so hungry!
thirsty|צמא|Are you thirsty?
delicious|טעים|This cake is delicious.
cook|לבשל|My father loves to cook.
restaurant|מסעדה|Let's go to a restaurant.
menu|תפריט|Can I see the menu, please?
bill|חשבון|Can we have the bill, please?
order|להזמין|I'd like to order a pizza.
spicy|חריף|This soup is too spicy.
sweet|מתוק|I don't like sweet drinks.
`},
"home": {he:"בית", icon:"🏠", w:`
house|בית|They live in a big house.
apartment|דירה|I rent a small apartment.
room|חדר|My room is on the second floor.
kitchen|מטבח|Mom is in the kitchen.
bedroom|חדר שינה|The bedroom has a big window.
bathroom|חדר אמבטיה|Where is the bathroom?
living room|סלון|We watch TV in the living room.
door|דלת|Please close the door.
window|חלון|Open the window, it's hot.
table|שולחן|The keys are on the table.
chair|כיסא|Sit on this chair.
bed|מיטה|I go to bed at eleven.
floor|רצפה / קומה|The floor is wet.
wall|קיר|There is a picture on the wall.
key|מפתח|I lost my key.
light|אור|Turn off the light, please.
stairs|מדרגות|Take the stairs, the elevator is broken.
garden|גינה|We have flowers in the garden.
clean|לנקות / נקי|I clean the house on Fridays.
dirty|מלוכלך|Your shoes are dirty.
furniture|רהיטים|We bought new furniture.
rent|שכר דירה|The rent is very expensive.
`},
"body_health": {he:"גוף ובריאות", icon:"💪", w:`
head|ראש|My head hurts.
eye|עין|She has blue eyes.
ear|אוזן|I have an ear infection.
nose|אף|He broke his nose.
mouth|פה|Open your mouth, please.
tooth|שן|I need to see a dentist about my tooth.
hand|יד (כף יד)|Wash your hands before eating.
arm|זרוע|He hurt his arm playing football.
leg|רגל|My legs are tired.
foot|כף רגל|My foot is cold.
back|גב|I have back pain.
heart|לב|Exercise is good for your heart.
sick|חולה|I feel sick today.
healthy|בריא|Eating fruit is healthy.
pain|כאב|Where is the pain?
doctor|רופא|You should see a doctor.
medicine|תרופה|Take this medicine twice a day.
hospital|בית חולים|She works at the hospital.
fever|חום|The child has a fever.
cold|הצטננות / קר|I caught a cold.
tired|עייף|I'm too tired to go out.
sleep|לישון|I sleep eight hours a night.
rest|מנוחה / לנוח|You need to rest.
exercise|להתעמל / אימון|I exercise three times a week.
`},
"clothes": {he:"בגדים", icon:"👕", w:`
clothes|בגדים|I need new clothes.
shirt|חולצה|He's wearing a white shirt.
pants|מכנסיים|These pants are too long.
dress|שמלה|She bought a red dress.
shoes|נעליים|Take off your shoes.
jacket|מעיל קל / ז'קט|Take a jacket, it's cold.
coat|מעיל|I wear a coat in winter.
hat|כובע|Wear a hat in the sun.
socks|גרביים|I can't find my socks.
bag|תיק|My bag is very heavy.
wear|ללבוש|What should I wear tonight?
size|מידה|What size do you wear?
try on|למדוד (בגד)|Can I try on these shoes?
fit|מתאים (במידה)|This shirt doesn't fit me.
`},
"city_travel": {he:"עיר ונסיעות", icon:"✈️", w:`
city|עיר|Tel Aviv is a busy city.
street|רחוב|I live on this street.
road|כביש / דרך|The road is closed.
car|מכונית|He drives an old car.
bus|אוטובוס|I take the bus to work.
train|רכבת|The train is late.
taxi|מונית|Let's take a taxi.
airport|שדה תעופה|How do I get to the airport?
flight|טיסה|My flight leaves at six.
ticket|כרטיס|I bought a ticket online.
passport|דרכון|Don't forget your passport!
hotel|מלון|We stayed at a nice hotel.
station|תחנה|Where is the train station?
map|מפה|Can you show me on the map?
left|שמאלה|Turn left at the corner.
right|ימינה / נכון|Turn right after the bank.
straight|ישר|Go straight for two blocks.
near|קרוב|Is there a pharmacy near here?
far|רחוק|The beach is not far.
corner|פינה|The café is on the corner.
traffic|פקקים / תנועה|There's a lot of traffic today.
trip|טיול / נסיעה|How was your trip?
travel|לטייל / לנסוע|I love to travel.
luggage|מזוודות|My luggage is lost.
arrive|להגיע|What time does the bus arrive?
leave|לעזוב / לצאת|We leave at nine.
visit|לבקר|I want to visit Paris.
abroad|בחו"ל|She studies abroad.
`},
"shopping_money": {he:"קניות וכסף", icon:"🛒", w:`
money|כסף|I don't have enough money.
price|מחיר|What's the price of this?
cheap|זול|This phone is cheap.
expensive|יקר|That car is too expensive.
buy|לקנות|I want to buy a gift.
sell|למכור|They sell fresh fruit.
pay|לשלם|Can I pay by card?
cash|מזומן|Do you take cash?
credit card|כרטיס אשראי|I'll pay with my credit card.
store|חנות|The store closes at nine.
market|שוק|We buy vegetables at the market.
discount|הנחה|Is there a discount?
change|עודף / שינוי|Keep the change.
receipt|קבלה|Can I have a receipt?
cost|לעלות (מחיר)|How much does it cost?
spend|לבזבז / להוציא|I spend too much money on clothes.
save|לחסוך / לשמור|I'm saving money for a car.
free|חינם / חופשי|The museum is free on Mondays.
customer|לקוח|The customer is always right.
`},
"work_school": {he:"עבודה ולימודים", icon:"💼", w:`
work|עבודה / לעבוד|I work in an office.
job|משרה / עבודה|She got a new job.
office|משרד|The office is on the fifth floor.
boss|בוס / מנהל|My boss is very nice.
meeting|פגישה|I have a meeting at ten.
salary|משכורת|The salary is good.
company|חברה (עסק)|He works for a big company.
interview|ראיון|I have a job interview tomorrow.
experience|ניסיון|Do you have experience?
skill|מיומנות|Communication is an important skill.
team|צוות|We work as a team.
email|אימייל|I'll send you an email.
school|בית ספר|The kids are at school.
teacher|מורה|Our teacher is very patient.
student|תלמיד / סטודנט|He is a university student.
lesson|שיעור|Today's lesson is about verbs.
homework|שיעורי בית|I finished my homework.
exam|מבחן|I have an exam on Monday.
learn|ללמוד|I want to learn English.
study|ללמוד (לעיין)|I study every evening.
understand|להבין|I don't understand.
remember|לזכור|Do you remember me?
forget|לשכוח|Don't forget to call me.
mistake|טעות|Everyone makes mistakes.
practice|תרגול / לתרגל|Practice makes perfect.
`},
"verbs1": {he:"פעלים בסיסיים", icon:"🏃", w:`
be|להיות|I want to be a pilot.
have|שיש לי / להחזיק|I have two sisters.
do|לעשות|What do you do?
make|ליצור / להכין|Let's make a cake.
go|ללכת / לנסוע|I go to the gym every day.
come|לבוא|Come here, please.
get|לקבל / להשיג|I got a letter today.
take|לקחת|Take an umbrella.
give|לתת|Give me the book, please.
see|לראות|I can see the sea from here.
look|להסתכל|Look at this picture.
watch|לצפות|We watched a movie.
hear|לשמוע|Can you hear me?
listen|להקשיב|Listen to the teacher.
say|לומר|What did he say?
tell|לספר / להגיד ל-|Tell me a story.
speak|לדבר (שפה)|Do you speak English?
talk|לדבר / לשוחח|We need to talk.
ask|לשאול / לבקש|Can I ask something?
know|לדעת / להכיר|I know the answer.
think|לחשוב|I think you're right.
want|לרצות|I want some water.
need|להזדקק|I need help.
like|לאהוב / לחבב|I like pizza.
love|לאהוב|I love my family.
feel|להרגיש|How do you feel?
try|לנסות|Try again!
use|להשתמש|Can I use your phone?
find|למצוא|I can't find my keys.
open|לפתוח|Open the door.
close|לסגור|Close your eyes.
start|להתחיל|Let's start the lesson.
finish|לסיים|I finished my work.
wait|לחכות|Wait for me!
help|לעזור|Can you help me?
call|להתקשר / לקרוא|I'll call you later.
write|לכתוב|Write your name here.
read|לקרוא|I read a book every month.
`},
"verbs2": {he:"פעלים נוספים", icon:"🔄", w:`
walk|ללכת ברגל|I walk to work.
run|לרוץ|He runs every morning.
sit|לשבת|Please sit down.
stand|לעמוד|Stand up, please.
eat|לאכול|What do you want to eat?
drink|לשתות|I drink a lot of water.
play|לשחק / לנגן|The kids play in the park.
drive|לנהוג|Can you drive?
fly|לטוס / לעוף|We fly to Rome next week.
swim|לשחות|I can't swim.
sing|לשיר|She sings beautifully.
dance|לרקוד|Let's dance!
bring|להביא|Bring your friends.
send|לשלוח|Send me a message.
carry|לסחוב / לשאת|Can you carry this box?
put|לשים|Put it on the table.
move|לזוז / לעבור דירה|We moved to a new apartment.
live|לגור / לחיות|Where do you live?
stay|להישאר|Stay with me.
return|לחזור / להחזיר|I'll return the book tomorrow.
change|לשנות / להחליף|I want to change my plans.
choose|לבחור|Choose one color.
decide|להחליט|I can't decide.
explain|להסביר|Can you explain that again?
agree|להסכים|I agree with you.
believe|להאמין|I believe you.
hope|לקוות|I hope you feel better.
plan|לתכנן / תוכנית|We planned a trip.
win|לנצח / לזכות|Our team won the game.
lose|להפסיד / לאבד|I lost my wallet.
break|לשבור / הפסקה|Don't break the glass.
fix|לתקן|Can you fix my bike?
build|לבנות|They are building a new mall.
grow|לגדול / לגדל|Plants grow fast in summer.
pick up|להרים / לאסוף|I'll pick you up at seven.
turn on|להדליק|Turn on the TV.
turn off|לכבות|Turn off your phone.
look for|לחפש|I'm looking for my glasses.
give up|לוותר|Don't give up!
find out|לגלות / לברר|I found out the truth.
`},
"adjectives": {he:"תארים", icon:"🎨", w:`
big|גדול|They have a big dog.
small|קטן|I live in a small town.
good|טוב|That's a good idea.
bad|רע|The weather is bad today.
new|חדש|I bought a new phone.
old|ישן / זקן|This is an old building.
young|צעיר|He is young and strong.
hot|חם|It's very hot outside.
cold|קר|The water is cold.
happy|שמח|I'm happy to see you.
sad|עצוב|Why are you sad?
easy|קל|This exercise is easy.
difficult|קשה|English grammar is difficult.
fast|מהיר|He is a fast runner.
slow|איטי|The internet is slow.
beautiful|יפה|What a beautiful day!
ugly|מכוער|That building is ugly.
long|ארוך|It was a long day.
short|קצר / נמוך|She has short hair.
tall|גבוה|My brother is very tall.
strong|חזק|You are strong.
weak|חלש|I feel weak today.
important|חשוב|This is very important.
interesting|מעניין|What an interesting book!
boring|משעמם|The movie was boring.
busy|עסוק|I'm busy right now.
quiet|שקט|The library is quiet.
loud|רועש|The music is too loud.
full|מלא|The bus is full.
empty|ריק|The fridge is empty.
right|נכון|You are right.
wrong|שגוי / לא נכון|That answer is wrong.
same|אותו / זהה|We have the same phone.
different|שונה|They are very different.
ready|מוכן|Are you ready?
sure|בטוח|Are you sure?
possible|אפשרי|Is it possible to change the date?
dangerous|מסוכן|Swimming here is dangerous.
safe|בטוח (מוגן)|This area is safe.
famous|מפורסם|He is a famous singer.
`},
"feelings": {he:"רגשות", icon:"😊", w:`
angry|כועס|Don't be angry with me.
afraid|מפחד|I'm afraid of dogs.
worried|מודאג|She looks worried.
excited|נרגש|I'm so excited about the trip!
nervous|לחוץ / עצבני|I'm nervous before exams.
surprised|מופתע|I was surprised to see him.
proud|גאה|I'm proud of you.
bored|משועמם|I'm bored, let's do something.
lonely|בודד|He feels lonely sometimes.
calm|רגוע|Stay calm.
embarrassed|נבוך|I was so embarrassed.
jealous|מקנא|Are you jealous?
confused|מבולבל|I'm confused, can you explain?
relaxed|רגוע / משוחרר|I feel relaxed on vacation.
grateful|אסיר תודה|I'm grateful for your help.
upset|נסער / מוטרד|She was upset about the news.
disappointed|מאוכזב|I'm disappointed with the result.
`},
"nature_weather": {he:"טבע ומזג אוויר", icon:"🌤️", w:`
weather|מזג אוויר|How is the weather?
sun|שמש|The sun is shining.
rain|גשם|It's going to rain.
wind|רוח|The wind is strong today.
cloud|ענן|There are no clouds.
snow|שלג|It snowed on Mount Hermon.
sky|שמיים|The sky is blue.
sea|ים|Let's swim in the sea.
beach|חוף|We spent the day at the beach.
mountain|הר|We climbed the mountain.
river|נהר|The river is very long.
tree|עץ|There's a big tree in the park.
flower|פרח|She gave me a flower.
animal|חיה|What's your favorite animal?
dog|כלב|My dog loves to play.
cat|חתול|The cat is sleeping.
bird|ציפור|A bird is singing.
summer|קיץ|Summer in Israel is hot.
winter|חורף|I love winter.
spring|אביב|Flowers bloom in spring.
autumn|סתיו|Leaves fall in autumn.
warm|חמים|It's warm today.
season|עונה|Which season do you like?
`},
"tech": {he:"טכנולוגיה", icon:"📱", w:`
phone|טלפון|My phone is dead.
computer|מחשב|I work on a computer.
internet|אינטרנט|The internet is down.
password|סיסמה|I forgot my password.
download|להוריד|Download the app.
screen|מסך|The screen is broken.
message|הודעה|I sent you a message.
charge|להטעין|I need to charge my phone.
battery|סוללה|My battery is low.
app|אפליקציה|This app is very useful.
website|אתר|Check our website.
search|לחפש (ברשת)|Search it on Google.
video|סרטון|Watch this video.
photo|תמונה|Take a photo of us.
online|מקוון / ברשת|I'm online now.
update|עדכון / לעדכן|Update your software.
`},
"conversation": {he:"ביטויים לשיחה", icon:"💬", w:`
How are you?|מה שלומך?|Hi Dan! How are you?
I'm fine, thanks.|אני בסדר, תודה.|I'm fine, thanks. And you?
Nice to meet you.|נעים להכיר.|Hi, I'm Sara. Nice to meet you.
What do you do?|במה אתה עובד?|So, what do you do?
Where are you from?|מאיפה אתה?|Where are you from? I'm from Israel.
Can you repeat that?|אתה יכול לחזור על זה?|Sorry, can you repeat that?
Could you speak slowly?|תוכל לדבר לאט?|Could you speak slowly, please?
What does it mean?|מה זה אומר?|"Awesome"? What does it mean?
I don't understand.|אני לא מבין.|Sorry, I don't understand.
How do you say...?|איך אומרים...?|How do you say "שולחן" in English?
No problem.|אין בעיה.|Thanks! — No problem.
You're welcome.|בבקשה (על לא דבר).|Thank you! — You're welcome.
Of course.|כמובן.|Can I sit here? — Of course.
I think so.|אני חושב שכן.|Is it open? — I think so.
Never mind.|לא חשוב / עזוב.|Never mind, I found it.
Good luck!|בהצלחה!|Good luck on your exam!
Take care.|שמור על עצמך.|Bye, take care!
See you later.|נתראה אחר כך.|See you later!
What's up?|מה קורה?|Hey, what's up?
Let's go!|יאללה, בוא נלך!|Are you ready? Let's go!
I'm not sure.|אני לא בטוח.|I'm not sure what time it is.
That sounds great.|נשמע מעולה.|Dinner at eight? That sounds great.
How much is it?|כמה זה עולה?|How much is it?
I'd like...|הייתי רוצה...|I'd like a coffee, please.
Can I help you?|אפשר לעזור לך?|Can I help you, sir?
Just a moment.|רק רגע.|Just a moment, please.
Are you kidding?|אתה צוחק?|You won the lottery? Are you kidding?
It depends.|זה תלוי.|Will you come? — It depends.
By the way|דרך אגב|By the way, I saw your brother.
in my opinion|לדעתי|In my opinion, it's a good movie.
`},
"connectors": {he:"מילות קישור", icon:"🔗", w:`
and|ו-|I like tea and coffee.
but|אבל|I'm tired but happy.
or|או|Tea or coffee?
because|כי / בגלל ש-|I'm late because of traffic.
so|אז / לכן|It was raining, so I stayed home.
if|אם|If you want, we can go.
when|מתי / כאשר|Call me when you arrive.
while|בזמן ש-|I listen to music while I work.
before|לפני|Wash your hands before dinner.
after|אחרי|Let's talk after the meeting.
also|גם|I also speak French.
too|גם / מדי|It's too hot.
very|מאוד|Thank you very much.
really|באמת|I really like it.
already|כבר|I already ate.
still|עדיין|Are you still at work?
yet|עדיין (בשלילה)|I haven't finished yet.
again|שוב|Please say it again.
almost|כמעט|I'm almost ready.
only|רק|I only have five shekels.
however|עם זאת|It's expensive. However, it's worth it.
although|למרות ש-|Although it was cold, we went out.
maybe|אולי|Maybe tomorrow.
probably|כנראה|He's probably at home.
together|ביחד|Let's do it together.
`},
"intermediate": {he:"מתקדמים יותר", icon:"🚀", w:`
achieve|להשיג|You can achieve your goals.
improve|לשפר / להשתפר|My English is improving.
develop|לפתח|They developed a new app.
suggest|להציע|I suggest we leave early.
recommend|להמליץ|Can you recommend a good restaurant?
avoid|להימנע|Avoid sugar if you can.
prefer|להעדיף|I prefer tea to coffee.
manage|להסתדר / לנהל|Don't worry, I'll manage.
afford|להרשות לעצמי (כספית)|I can't afford a new car.
compare|להשוות|Compare the prices first.
consider|לשקול|Consider all the options.
expect|לצפות (לציפייה)|I didn't expect that.
include|לכלול|Breakfast is included.
increase|לעלות / להגדיל|Prices increased this year.
reduce|להפחית|Reduce your screen time.
require|לדרוש|This job requires experience.
solve|לפתור|We solved the problem.
support|לתמוך / תמיכה|My family supports me.
opportunity|הזדמנות|This is a great opportunity.
advantage|יתרון|Speaking English is an advantage.
challenge|אתגר|Learning a language is a challenge.
goal|מטרה|What is your goal?
decision|החלטה|It was a hard decision.
experience|חוויה / ניסיון|It was an amazing experience.
environment|סביבה|We must protect the environment.
knowledge|ידע|Knowledge is power.
success|הצלחה|Congratulations on your success!
reason|סיבה|What's the reason?
result|תוצאה|The results are ready.
situation|מצב|It's a difficult situation.
common|נפוץ|It's a common mistake.
available|זמין|Are you available tomorrow?
necessary|הכרחי|Is it necessary?
obvious|ברור / מובן מאליו|The answer is obvious.
reliable|אמין|He is a reliable worker.
patient|סבלני|Be patient with yourself.
honest|כן / ישר|Please be honest with me.
generous|נדיב|She is very generous.
curious|סקרן|Children are curious.
confident|בטוח בעצמו|She feels confident before the test.
actually|בעצם / למעשה|Actually, I don't like it.
especially|במיוחד|I love fruit, especially mangoes.
immediately|מיד|Call me immediately.
eventually|בסופו של דבר|Eventually, he found a job.
recently|לאחרונה|I recently moved here.
`},
};
