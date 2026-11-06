/**
 * REAL FOOTAGE SLOTS
 * Put your filmed clips in remotion/public/footage/ and write the file name here.
 * While a slot is null, the illustrated version of that scene is shown instead.
 * See SHOT_LIST.md for what to film in each clip and the minimum length.
 */
export const FOOTAGE: Record<string, string | null> = {
  mission: null,      // المشرفة تتحدث إلى الكاميرا وتحمل الدفتر الناقص
  st1: null,          // المحطة ١ (الباب): المشهد كما وُجد
  st1_rewind: null,   // المحطة ١: ما فعلته سلمى (لقطة إعادة الشريط)
  st1_wrong: null,    // المحطة ١: نتيجة القرار غير المناسب (انسكاب الشراب)
  st2: null, st2_rewind: null,
  st3: null, st3_rewind: null,
  st4: null, st4_rewind: null,
  st5: null, st5_rewind: null,
  ending: null,       // المختبر مرتب، والمشرفة وسلمى بمعدات الوقاية
};
