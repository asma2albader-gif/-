# أوامر Gemini (Veo) لتوليد مشاهد «لغز المختبر»

انسخي كل أمر كما هو إلى Gemini. الأوامر بالإنجليزية لأن Veo يلتزم بها بدقة أكبر.
ثم ضعي المقطع الناتج في `public/footage/` واكتبي اسمه في خانته في `src/footage.ts`.

## قواعد مهمة لكل المقاطع

- **مشهد فقط**: لا عناوين ولا خيارات ولا مؤشر فأرة ولا أي نص داخل الفيديو.
  التطبيق يضيف العناوين والقرائن وأزرار الخيارات بنفسه، والطالبة هي التي تختار.
- **بلا معلمة أو مشرفة** في المقاطع، إلا لقطة المهمة (`mission`) إن رغبتن بها.
- **الشخصية نفسها** في كل المقاطع، لذلك يتكرر وصف «سلمى» في كل أمر حرفيًا.
- **أفقي 16:9**، ونحو ٨ ثوانٍ لكل مقطع.

## وصف الشخصية والمكان (مكرَّر داخل كل أمر)

> **SALMA**: a Saudi female university student, about 20 years old, adult face and proportions,
> wearing a black hijab, a white lab coat over modest dark clothing.
> **LAB**: a modern university chemistry laboratory, white epoxy benches, steel sinks,
> soft daylight, clean and realistic.

---

### `st3`: المحطة ٣ (الكهرباء والماء)، المشهد كما وُجد

```
Photorealistic cinematic shot, 16:9, static camera on a tripod, medium-wide framing.
A modern university chemistry laboratory, white epoxy benches, steel sink, soft daylight.
On the bench right next to the sink: a black electrical extension cord stretched across
the wet bench surface, small puddles and water droplets around it, and a laboratory hot
plate plugged into the cord. Nobody is in the frame. Subtle natural motion only
(a drop of water falling from the faucet). No text, no captions, no on-screen graphics,
no user interface, no cursor, no teacher.
```

### `st3_rewind`: المحطة ٣، إعادة الشريط (ما فعلته سلمى)

```
Photorealistic cinematic shot, 16:9, static camera, same laboratory and same bench as before:
a modern university chemistry lab, white epoxy benches, steel sink, soft daylight.
SALMA, a Saudi female university student about 20 years old with an adult face, wearing a
black hijab and a white lab coat, walks in hurriedly, stretches a black extension cord across
the bench so it lies right beside the sink, plugs a hot plate into it, and walks away quickly
without drying the spilled water. She looks rushed. No teacher, no other people.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

### `st1`: المحطة ١ (الباب)

```
Photorealistic cinematic shot, 16:9, static camera, medium-wide framing.
The entrance door of a modern university chemistry laboratory, a sign reading "LAB" above it,
white lab coats and safety goggles hanging on hooks beside the door.
SALMA, a Saudi female university student about 20 years old with an adult face, wearing a
black hijab, casual modest clothes and open sandals, NO lab coat and NO goggles,
stands at the door holding a paper coffee cup, about to enter. No teacher, no other people.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

### `st1_rewind`: المحطة ١، إعادة الشريط

```
Photorealistic cinematic shot, 16:9, static camera, same laboratory entrance with lab coats and
goggles hanging beside the door. SALMA, a Saudi female university student about 20 years old,
black hijab, casual clothes, open sandals, no lab coat, no goggles, walks quickly toward the
door holding a coffee cup and stops in front of it. She looks rushed. No other people.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

### `st1_wrong`: المحطة ١، نتيجة القرار غير المناسب

```
Photorealistic cinematic shot, 16:9, static camera, inside a modern university chemistry lab
near the entrance. SALMA, a Saudi female university student about 20 years old, black hijab,
casual clothes, no lab coat, no goggles, walks in holding a coffee cup; the cup tips and the
coffee spills onto the lab floor. She stops, surprised. No other people.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

### `st2`: المحطة ٢ (الممر)

```
Photorealistic cinematic shot, 16:9, static camera looking down the aisle between two white lab
benches in a modern university chemistry laboratory. A purple backpack lies on the floor in the
middle of the aisle. At the end of the aisle a green "EXIT" sign is visible, and a red fire
extinguisher on the wall is partly blocked by stacked cardboard boxes. Nobody is in the frame.
No text other than the EXIT sign, no captions, no user interface, no cursor.
```

### `st2_rewind`: المحطة ٢، إعادة الشريط

```
Photorealistic cinematic shot, 16:9, static camera, same lab aisle with the EXIT sign at the end.
SALMA, a Saudi female university student about 20 years old with an adult face, black hijab,
white lab coat, walks in hurriedly, drops her purple backpack on the floor in the middle of the
aisle, and walks away quickly. No other people.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

### `st4`: المحطة ٤ (المادة المنسكبة)

```
Photorealistic cinematic shot, 16:9, static camera, modern university chemistry laboratory.
A small puddle of light-green liquid on the floor next to a sink. On the bench above it stands a
plastic bottle with a small white label showing a red diamond hazard pictogram.
A second female university student, about 20 years old, black hijab, white lab coat, bends
down holding a paper tissue as if about to wipe the puddle. No teacher.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

### `st4_rewind`: المحطة ٤، إعادة الشريط

```
Photorealistic cinematic shot, 16:9, static camera, same lab, same puddle of light-green liquid
by the sink and the labelled bottle on the bench. SALMA, a Saudi female university student about
20 years old, black hijab, white lab coat, notices the puddle and quickly wipes it with a paper
tissue without looking at the bottle's label. She looks rushed. No other people.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

### `st5`: المحطة ٥ (الزجاج المكسور)

```
Photorealistic cinematic shot, 16:9, static camera, modern university chemistry laboratory.
Shards of a broken glass test tube scattered on the floor next to a work bench, near a walkway
marked with yellow floor tape. A second female university student, about 20 years old, black
hijab, white lab coat, reaches down with her bare hand toward the shards. No teacher.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

### `st5_rewind`: المحطة ٥، إعادة الشريط

```
Photorealistic cinematic shot, 16:9, static camera, same lab bench and walkway.
SALMA, a Saudi female university student about 20 years old, black hijab, white lab coat,
accidentally knocks a glass test tube off the bench; it shatters on the floor; she quickly picks
up the pieces with her bare hands and goes back to work. No other people.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

### `ending`: الختام

```
Photorealistic cinematic shot, 16:9, slow gentle dolly-in, a clean and tidy modern university
chemistry laboratory in soft daylight. SALMA, a Saudi female university student about 20 years
old, black hijab, white lab coat, safety goggles, closed shoes, stands confidently by a bench
and smiles at the camera. No other people.
No text, no captions, no on-screen graphics, no user interface, no cursor.
```

## إذا أصرّ Gemini على إضافة نص أو أشخاص

أضيفي في آخر الأمر:
`Strictly no on-screen text or graphics of any kind. Only one person in the shot.`
وإذا ظهرت الطالبة صغيرة السن، فأضيفي:
`She is clearly an adult university student in her early twenties, not a child.`
