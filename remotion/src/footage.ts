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
  ending: 'real_ending.mp4',   // طالبة بمعدات الوقاية في مختبر مرتب (Mixkit #4773)
  // لقطات حقيقية للتصرف الآمن تظهر بعد كل قرار صحيح (Mixkit)
  st1_right: 'real_st1_right.mp4', // نظارة واقية عن قرب (#4712)
  st2_right: 'real_st2_right.mp4', // عمل آمن بنظارة وقفازات (#23903)
  st3_right: 'real_st3_right.mp4', // يدان جافتان بقفازات (#21460)
  st4_right: 'real_st4_right.mp4', // فحص العبوة عن قرب (#21454)
  st5_right: 'real_st5_right.mp4', // عمل حذر بالقفازات (#23140)
};
