/**
 * REAL FOOTAGE SLOTS
 * Put your filmed clips in remotion/public/footage/ and write the file name here.
 * While a slot is null, the illustrated version of that scene is shown instead.
 * See SHOT_LIST.md for what to film in each clip and the minimum length.
 */
export const FOOTAGE: Record<string, string | null> = {
  mission: 'real_mission.mp4', // طالبة تبحث في المختبر (Mixkit #21457)
  st1: null,          // المحطة ١ (الباب): المشهد كما وُجد
  st1_rewind: null,   // المحطة ١: ما فعلته سلمى (لقطة إعادة الشريط)
  st1_wrong: null,    // المحطة ١: نتيجة القرار غير المناسب (انسكاب الشراب)
  st2: null, st2_rewind: null,
  st3: null, st3_rewind: null,
  st4: null, st4_rewind: null,
  st5: null, st5_rewind: null,
  // خلفيات المحطات ونتائج الأخطاء (لقطات حقيقية)
  bg_st2: 'real_bg_st2.mp4', // الطالبة نفسها في المختبر (#21461)
  glass: 'real_glass.mp4',   // زجاج يسقط وينكسر على الأرض (#28860)
  coffee: 'real_coffee.mp4', // كوب قهوة (#236)
  gem_coffee: 'gem_coffee.mp4', // من Gemini: تشرب قهوة في المختبر والنظارة فوق رأسها
  gem_glass: 'gem_glass.mp4',   // من Gemini: تشرب ثم ترى زجاجًا مكسورًا وتلتقطه بيدها
  ending: 'real_ending.mp4',   // تنظر من المجهر ثم تبتسم (Mixkit #21459)
  // لقطات حقيقية للتصرف الآمن تظهر بعد كل قرار صحيح.
  // كل اللقطات الحقيقية للممثلة نفسها (سلسلة Mixkit 21452–21461) لتكون «سلمى» شخصية واحدة.
  st1_right: 'real_st1_right.mp4', // تفحص الأنبوب بالقفازات (#21454)
  st2_right: 'real_st2_right.mp4', // تعمل بهدوء على المجهر (#21452)
  st3_right: 'real_st3_right.mp4', // يدان جافتان بقفازات (#21460)
  st4_right: 'real_st4_right.mp4', // تفحص العيّنة عن قرب (#21455)
  st5_right: 'real_st5_right.mp4', // تتعامل مع الأنابيب بحذر (#21453)
};
