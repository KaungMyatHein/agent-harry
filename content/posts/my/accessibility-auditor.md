ဒ့ါ အနိမ့်ဆုံး အမြင်တောင်မှ တရားစွဲခံရတဲ့အထိ၊ တိုင်ကြားခံရတဲ့အထိ၊ ဒါမှမဟုတ် အသုံးပြုသူ မဝင်နိုင်တဲ့အထိ တာဝန်ခံသလို ခံစားရတာပဲ။ ♿

✦ ဒါက ဘာလဲ
accessibility-auditor က အဆင်သင့်ဖြစ်နေတဲ့ prototype ဒါမှမဟုတ် live URL ကို WCAG 2.2 AA နဲ့ ကိုက်ညီမှုရှိမရှိ စစ်ဆေးပေးတယ်၊ တကယ့် browser ကို အသုံးပြုပြီး page ထဲမှာပဲ axe-core ကို run ပြီး စစ်ဆေးတာပါ — ဒါဟာ တိုင်းတာတာပါ၊ မှန်းဆတာ မဟုတ်ဘူးနော်။

✦ ဘယ်အချိန် သုံးရမလဲ
prototype ဒါမှမဟုတ် live URL ကို တကယ့်တိုင်းတာမှုအပေါ် အခြေခံပြီး WCAG 2.2 AA audit လုပ်ဖို့လိုရင် သုံးပါ။ ဒါမှမဟုတ် ရှိပြီးသား report ဒါမှမဟုတ် static markup/CSS ကို ပြန် audit လုပ်ဖို့လိုရင်လည်း သုံးလို့ရတယ် (Mode B)။

✦ ဘာလို့ သုံးသင့်တာလဲ
ဒါမရှိရင်တော့ accessibility က ထုတ်လုပ်ရေးမှာ ပျက်ကွက်တဲ့အထိ ကောင်းတယ်လို့ ထင်နေတာပဲ။ opinion ထက် axe-core ကို run ပြီး ရတဲ့ findings က အမြဲတမ်း ပိုကောင်းတာပေါ့။ contrast, alt text, form labels, ARIA မှန်ကန်မှု၊ heading order နဲ့ keyboard reachability တွေကို တသမတ်တည်း ရှာဖွေပေးတယ်။

✦ ဘယ်လို သုံးရမလဲ
Agent Harry ကို ဒီလိုပဲ ပြောလိုက်ရုံ —
"accessibility-auditor agent ကို သုံးပြီး prototype ကို axe-core နဲ့ run ပေးပြီး WCAG 2.2 AA findings တွေကို report လုပ်ပေးပါ"

✦ ဘာတွေ ကောင်းလဲ
- တကယ့် browser နဲ့ page ထဲမှာ axe-core ကို run ပြီး တိုင်းတာထားတဲ့ findings တွေရမယ် — တသမတ်တည်းရှိတယ်။
- WCAG 2.2 AA အကုန်လုံးကို အကျုံးဝင်တယ်: contrast, alt text, labels, ARIA, headings, keyboard.
- Mode B က live page မရှိတဲ့အခါ ရှိပြီးသား report ဒါမှမဟုတ် static markup/CSS ကို ပြန် audit လုပ်ပေးတယ်။

👉 ဒါက Agent Harry မှာရှိတဲ့ accessibility-auditor agent ပဲ။ install လုပ်ပြီး run လိုက်တော့။

#AgentHarry #ClaudeCode #ProductDesign #UX #Accessibility #WCAG #axecore