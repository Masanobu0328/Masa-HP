/* ============================================================
   JAPANESE GC CLEANING — Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Current Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Navbar Styling & Scroll Reveal
  const navbar = document.getElementById('navbar');
  const reveals = document.querySelectorAll('.reveal');

  const checkScroll = () => {
    // Navbar
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Reveals
    const viewBottom = window.scrollY + window.innerHeight;
    reveals.forEach(el => {
      const elTop = el.offsetTop;
      if (elTop < viewBottom - 100) {
        el.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', checkScroll);
  // Optional: Trigger once on load
  setTimeout(checkScroll, 100);

  // 3. Mobile Navigation
  const btnHam = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const btnClose = document.getElementById('mobile-nav-close');
  const navLinks = mobileNav.querySelectorAll('a');

  const toggleNav = () => {
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  };

  if (btnHam) btnHam.addEventListener('click', toggleNav);
  if (btnClose) btnClose.addEventListener('click', toggleNav);
  navLinks.forEach(link => link.addEventListener('click', toggleNav));


  // ==========================================================
  // 4. BEFORE / AFTER SLIDER
  // ==========================================================
  const slider = document.getElementById('comparison-slider');
  if (slider) {
    const handle = document.getElementById('slider-handle');
    const beforeWrap = document.getElementById('before-wrap');
    const beforeImg = document.getElementById('before-img');

    // Maintain inner image size
    const updateSize = () => {
      beforeImg.style.width = `${slider.offsetWidth}px`;
    };
    window.addEventListener('resize', updateSize);
    updateSize();

    let isSliding = false;
    const startSlide = (e) => { isSliding = true; e.preventDefault(); };
    const stopSlide = () => { isSliding = false; };

    const moveSlide = (e) => {
      if (!isSliding) return;
      const rect = slider.getBoundingClientRect();
      const x = (e.type.includes('mouse') ? e.pageX : e.touches[0].pageX) - rect.left - window.scrollX;
      let pos = (x / rect.width) * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;

      handle.style.left = `${pos}%`;
      beforeWrap.style.width = `${pos}%`;
    };

    handle.addEventListener('mousedown', startSlide);
    window.addEventListener('mouseup', stopSlide);
    window.addEventListener('mousemove', moveSlide);

    handle.addEventListener('touchstart', startSlide, { passive: false });
    window.addEventListener('touchend', stopSlide);
    window.addEventListener('touchmove', moveSlide, { passive: false });
  }


  // ==========================================================
  // 5. PRICING CALCULATOR
  // ==========================================================
  const radioInputs = document.querySelectorAll('input[name="service-type"]');
  const checkboxInputs = document.querySelectorAll('.extra-item input[type="checkbox"]');

  // Elements
  const elBedCount = document.getElementById('bed-count');
  const elBathCount = document.getElementById('bath-count');
  const elBedRate = document.getElementById('bed-rate-label');
  const elBathRate = document.getElementById('bath-rate-label');

  const bdBase = document.getElementById('bd-base');
  const bdBeds = document.getElementById('bd-beds');
  const bdBaths = document.getElementById('bd-baths');
  const bdExtras = document.getElementById('bd-extras');
  const bdTotal = document.getElementById('bd-total');
  const resPrice = document.getElementById('result-price');
  const bdExtrasRow = document.getElementById('bd-extras-row');

  // Multipliers
  let rateBed = 40;
  let rateBath = 30;
  let basePrice = 150;

  // Counts
  let countBeds = 1;
  let countBaths = 1;

  // Render Prices
  const calculateTotal = () => {
    // Get Service Values
    const checkedService = document.querySelector('input[name="service-type"]:checked');
    if (checkedService) {
      basePrice = parseInt(checkedService.dataset.base);
      rateBed = parseInt(checkedService.dataset.bed);
      rateBath = parseInt(checkedService.dataset.bath);
    }

    elBedRate.textContent = `+$${rateBed} each`;
    elBathRate.textContent = `+$${rateBath} each`;

    // Rooms logic
    // Usually a 1B/1B is covered in base, so extra beds are (count - 1)*rate?
    // Based on the docs provided: 
    // "1 Bed / 1 Bath: $150. Extra bed: +$40. Extra bath: +$30"
    // So if 2Bed/2Bath: $150 + 40 + 30 = $220. 
    // Which means multiplier is applied strictly on extra rooms beyond the first.

    let extraBeds = Math.max(0, countBeds - 1);
    let extraBaths = Math.max(0, countBaths - 1);

    let bedCost = extraBeds * rateBed;
    let bathCost = extraBaths * rateBath;

    // Extras logic
    let extraCost = 0;
    checkboxInputs.forEach(cb => {
      if (cb.checked) {
        extraCost += parseInt(cb.dataset.price);
      }
    });

    // Total
    let total = basePrice + bedCost + bathCost + extraCost;

    // Update UI
    resPrice.textContent = total;
    bdBase.textContent = `$${basePrice}`;
    bdBeds.textContent = bedCost > 0 ? `+$${bedCost}` : `$0`;
    bdBaths.textContent = bathCost > 0 ? `+$${bathCost}` : `$0`;

    if (extraCost > 0) {
      bdExtrasRow.style.display = 'flex';
      bdExtras.textContent = `+$${extraCost}`;
    } else {
      bdExtrasRow.style.display = 'none';
      bdExtras.textContent = `$0`;
    }

    bdTotal.textContent = `$${total}+`;
  };

  // Bind Buttons
  const setupCounter = (btnMinus, btnPlus, labelVal, countRef) => {
    document.getElementById(btnMinus).addEventListener('click', () => {
      if (count[countRef] > 1) { count[countRef]--; }
      document.getElementById(labelVal).textContent = count[countRef];
      calculateTotal();
    });
    document.getElementById(btnPlus).addEventListener('click', () => {
      if (count[countRef] < 10) { count[countRef]++; }
      document.getElementById(labelVal).textContent = count[countRef];
      calculateTotal();
    });
  };

  let count = { beds: countBeds, baths: countBaths };
  setupCounter('bed-minus', 'bed-plus', 'bed-count', 'beds');
  setupCounter('bath-minus', 'bath-plus', 'bath-count', 'baths');

  // Change mapping logic to update local variables used in calculateTotal
  document.getElementById('bed-minus').addEventListener('click', () => { if (countBeds > 1) { countBeds--; elBedCount.textContent = countBeds; calculateTotal(); } });
  document.getElementById('bed-plus').addEventListener('click', () => { if (countBeds < 10) { countBeds++; elBedCount.textContent = countBeds; calculateTotal(); } });
  document.getElementById('bath-minus').addEventListener('click', () => { if (countBaths > 1) { countBaths--; elBathCount.textContent = countBaths; calculateTotal(); } });
  document.getElementById('bath-plus').addEventListener('click', () => { if (countBaths < 10) { countBaths++; elBathCount.textContent = countBaths; calculateTotal(); } });


  // Bind Radios & Checkboxes
  radioInputs.forEach(el => el.addEventListener('change', calculateTotal));
  checkboxInputs.forEach(el => el.addEventListener('change', calculateTotal));

  // Initial Init
  calculateTotal();


  // ==========================================================
  // 6. CONTACT FORM SUBMISSION (Formspree)
  // ==========================================================
  const contactForm = document.getElementById('contact-form-el');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      const successBox = document.getElementById('success-box');

      // Simple validation
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const msg = document.getElementById('cf-message').value.trim();

      if (!name || !email || !msg) {
        alert("Please fill in Name, Email and Message.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // Success
          contactForm.style.display = 'none';
          successBox.style.display = 'block';
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        alert("Sorry, an error occurred while sending. Please try again or email us directly at contact@japanesegccleaning.com.");
      }
    });
  }


  // ==========================================================
  // 7. BILINGUAL SUPPORT (Static i18n)
  // ==========================================================
  const translations = {
    en: {
      nav_sub: "Gold Coast, QLD",
      nav_services: "Services",
      nav_results: "Results",
      nav_calculator: "Estimate",
      nav_contact: "Contact",
      nav_cta: "Get a Quote",
      hero_badge: "Gold Coast Wide — Japanese Standard",
      hero_title_1: "Japanese Standard",
      hero_title_2: "Quality Cleaning",
      hero_desc: "Insured, Police Checked, and 100% Satisfaction Guaranteed. Attention to detail. The Japanese way.",
      hero_cta_calc: "Calculate Your Price",
      hero_cta_contact: "Get in Touch",
      trust_police: "Police Checked",
      trust_police_sub: "Verified & Background Checked",
      trust_insured: "Fully Insured",
      trust_insured_sub: "Public Liability Covered",
      trust_bond: "Bond Back Guarantee",
      trust_bond_sub: "100% Confidence on Move-out",
      trust_abn: "ABN Registered",
      about_label: "Why Choose Us",
      about_badge: "Bond Back Guarantee",
      about_title: "The Japanese Way of Cleaning",
      about_desc: "We bring the Japanese philosophy of 'Omotenashi' to every home. It's not just cleaning — it's an attention to detail that goes beyond what the eye can see.",
      value1_title: "Attention to Detail",
      value1_desc: "Skirting boards, door handles, behind appliances — the places others miss are where we shine.",
      value2_title: "Punctual & Reliable",
      value2_desc: "We arrive on time, every time. Before and after photos provided for your peace of mind.",
      value3_title: "Fully Insured & Verified",
      value3_desc: "Police checked, Public Liability Insurance covered. Your home is in safe, trusted hands.",
      services_label: "Our Services",
      services_title: "What We Offer",
      services_desc: "From regular maintenance to full bond cleans — tailored to your needs across Gold Coast.",
      services_popular: "Most Popular",
      services_recommended: "Bond Back Guaranteed",
      services_airbnb: "Airbnb Ready",
      service1_name: "General Clean",
      service1_desc: "Regular maintenance clean to keep your home spotless. Perfect for ongoing hygiene.",
      service2_name: "End of Lease Clean",
      service2_desc: "Professional-grade bond clean with our 100% Bond Back Guarantee.",
      service3_name: "Airbnb / Holiday Home",
      service3_desc: "Fast, reliable turnover cleaning. Trusted by GC hosts for 5-star reviews.",
      from: "From",
      service1_price_suffix: "~ / 1 Bed, 1 Bath",
      service2_price_suffix: "~ / 1 Bed, 1 Bath",
      contact_for_quote: "Contact for Quote",
      results_label: "Our Results",
      results_title: "See the Difference",
      results_desc: "Drag the slider to reveal the before and after. This is the Japanese GC Cleaning standard.",
      before_label: "BEFORE",
      after_label: "AFTER",
      calc_label: "Instant Estimate",
      calc_title: "Calculate Your Price",
      calc_desc: "Select your service and property size for an instant estimate. No obligation.",
      calc_step1: "Step 1: Type of Cleaning",
      svc_general: "General Clean",
      svc_general_desc: "Regular maintenance. +$40/bed, +$30/bath",
      svc_lease: "End of Lease Clean",
      svc_lease_desc: "Bond Back Guarantee. +$80/bed, +$50/bath",
      calc_step2: "Step 2: Property Size",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      calc_step3: "Step 3: Add-On Services (Optional)",
      extra_oven: "Oven Internal Cleaning",
      extra_fridge: "Inside Fridge Cleaning",
      extra_windows: "Window Cleaning (inside, up to 6)",
      extra_balcony: "Balcony Pressure Wash",
      result_heading: "Estimated Price",
      result_disclaimer: "Starting estimate — final price confirmed on-site.",
      breakdown_base: "Base Service",
      breakdown_bedrooms: "Bedrooms",
      breakdown_bathrooms: "Bathrooms",
      breakdown_extras: "Add-ons",
      breakdown_total: "Total Estimate",
      result_cta: "Get Detailed Quote",
      result_note: "No obligation. We'll confirm the final price.",
      contact_label: "Get In Touch",
      contact_title: "Request a Quote",
      contact_desc: "Fill in your details and we'll get back to you within 24 hours.",
      contact_info_title: "We'd Love to Help",
      contact_info_desc: "Whether it's a regular, bond, or Airbnb clean — we'll make it shine.",
      contact_area_label: "Service Area",
      contact_area: "Gold Coast Wide (QLD) — up to 20km from Surfers Paradise",
      contact_response_label: "Response Time",
      contact_response: "Within 24 hours",
      contact_payment_label: "Payment Methods",
      contact_payment: "Bank Transfer / Square",
      form_name: "Full Name *",
      form_email: "Email *",
      form_phone: "Phone",
      form_date: "Preferred Date",
      form_message: "Inquiry Details *",
      form_submit: "Send Message",
      success_title: "Message Sent!",
      success_desc: "Thank you for your inquiry. We'll be in touch within 24 hours.",
      footer_desc: "Bringing Japanese attention to detail to Gold Coast homes. Professional, reliable cleaning.",
      footer_services: "Services",
      footer_contact: "Contact"
    },
    ja: {
      nav_sub: "オーストラリア ゴールドコースト",
      nav_services: "サービス",
      nav_results: "ビフォーアフター",
      nav_calculator: "お見積り",
      nav_contact: "お問い合わせ",
      nav_cta: "お見積り依頼",
      hero_badge: "ゴールドコースト全域 — 安心の日本人品質",
      hero_title_1: "Japanese Standard",
      hero_title_2: "Quality Cleaning",
      hero_desc: "警察証明取得・賠償保険加入済み。細部への徹底したこだわりと時間厳守で、日本人ならではの丁寧な清掃を提供します。",
      hero_cta_calc: "かんたんお見積り",
      hero_cta_contact: "お問い合わせ",
      trust_police: "Police Checked",
      trust_police_sub: "安心の身元証明済み（無犯罪証明）",
      trust_insured: "Fully Insured",
      trust_insured_sub: "万が一の破損も保険でカバー",
      trust_bond: "Bond Back Guarantee",
      trust_bond_sub: "退去清掃のボンド返金100%保証",
      trust_abn: "ABN Registered",
      about_label: "当社の強み",
      about_badge: "ボンド返金保証",
      about_title: "徹底した「日本人クオリティ」",
      about_desc: "「おもてなし」の心をすべての清掃に。目に見える場所だけでなく、普段気づかない細部まで徹底的にクリーニングします。",
      value1_title: "細部へのこだわり (Attention to Detail)",
      value1_desc: "巾木やドアの取手、家電の裏など、ローカル業者が逃しがちな「小さな汚れ」を逃しません。",
      value2_title: "時間厳守と信頼 (Punctual & Reliable)",
      value2_desc: "オーストラリアでも常に時間厳守。作業の前と後の写真を必ずお送りし、安心をお届けします。",
      value3_title: "完全保険・警察証明 (Fully Insured)",
      value3_desc: "賠償責任保険加入、無犯罪証明（Police Check）取得済み。お客様の家を安全にお守りします。",
      services_label: "サービス内容",
      services_title: "提供メニュー",
      services_desc: "日常の定期清掃から、プロ仕様の退去清掃まで。お客様のニーズに合わせ対応します。",
      services_popular: "人気メニュー",
      services_recommended: "返金保証付き",
      services_airbnb: "ホスト向け",
      service1_name: "一般・定期清掃 (General Clean)",
      service1_desc: "日常の汚れを落とし、お家を常に清潔に保ちます。",
      service2_name: "退去清掃 (End of Lease Clean)",
      service2_desc: "不動産屋の厳しいチェックをクリアするプロ仕様。100%ボンド返金保証付きで安心。",
      service3_name: "Airbnb / 短期貸出 (Holiday Home)",
      service3_desc: "素早く確実な清掃で、常に高評価（5つ星）のレビュー獲得をサポートします。",
      from: "基本",
      service1_price_suffix: "〜 / 1 Bed, 1 Bath",
      service2_price_suffix: "〜 / 1 Bed, 1 Bath",
      contact_for_quote: "お問い合わせください",
      results_label: "清掃実績",
      results_title: "Before & After",
      results_desc: "真ん中のバーを左右にスワイプして、圧倒的な違いを体感してください。",
      before_label: "清掃前",
      after_label: "清掃後",
      calc_label: "かんたんシミュレーター",
      calc_title: "概算お見積り(無料)",
      calc_desc: "清掃タイプと部屋数を選ぶだけで、その場で概算金額がわかります。",
      calc_step1: "ステップ1: 清掃の種類",
      svc_general: "一般清掃 (General Clean)",
      svc_general_desc: "日常清掃。1部屋追加+$40, バスルーム+$30",
      svc_lease: "退去清掃 (End of Lease)",
      svc_lease_desc: "ボンド返金保証。1部屋追加+$80, バス追加+$50",
      calc_step2: "ステップ2: お部屋の広さ",
      bedrooms: "ベッドルームの数",
      bathrooms: "バスルーム(トイレ含)の数",
      calc_step3: "ステップ3: 追加オプション",
      extra_oven: "オーブン内側清掃",
      extra_fridge: "冷蔵庫内側清掃",
      extra_windows: "窓掃除 (内側のみ・6枚まで)",
      extra_balcony: "バルコニー高圧洗浄",
      result_heading: "概算お見積り金額",
      result_disclaimer: "※これは概算です。正確な料金は現地の状態により変動します。",
      breakdown_base: "基本料金",
      breakdown_bedrooms: "ベッドルーム追加",
      breakdown_bathrooms: "バスルーム追加",
      breakdown_extras: "オプション追加",
      breakdown_total: "概算合計金額",
      result_cta: "この内容で申し込む",
      result_note: "まだ予約は確定しません。後ほど正確な金額をご提示します。",
      contact_label: "お問い合わせ",
      contact_title: "お見積りご依頼",
      contact_desc: "以下のフォームに必要事項を記入してください。24時間以内に折り返しご連絡いたします。",
      contact_info_title: "お気軽にご相談ください",
      contact_info_desc: "定期清掃、退去清掃、Airbnbなど、ご要望に合わせて柔軟に対応いたします。",
      contact_area_label: "対応エリア",
      contact_area: "ゴールドコースト全域（サーファーズパラダイスから20km圏内）",
      contact_response_label: "返信の目安",
      contact_response: "24時間以内にご返信いたします",
      contact_payment_label: "お支払い方法",
      contact_payment: "銀行振込 (Bank Transfer) / クレジットカード決済 (Square)",
      form_name: "お名前 (フルネーム) *",
      form_email: "メールアドレス *",
      form_phone: "お電話番号",
      form_date: "清掃ご希望日時",
      form_message: "お問い合わせ・ご相談詳細 *",
      form_submit: "メッセージを送信する",
      success_title: "送信完了しました！",
      success_desc: "お問い合わせありがとうございます。内容を確認の上、24時間以内にご返信いたします。",
      footer_desc: "ゴールドコーストに、日本品質の輝きを。細部にまでこだわったプロフェッショナルな清掃サービスを提供します。",
      footer_services: "メニュー",
      footer_contact: "連絡先"
    }
  };

  let currentLang = localStorage.getItem('jgcc_lang') || 'en';

  const applyLang = (lang) => {
    // text replacements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Special logic for HTML replacments (e.g. <br> inside)
    if (lang === 'en') {
      document.querySelector('[data-i18n="hero_title_1"]').innerHTML = "Japanese Standard";
      document.querySelector('[data-i18n="hero_title_2"]').innerHTML = "Quality Cleaning";
      document.getElementById('lang-toggle').textContent = "日本語";
      if (document.getElementById('lang-toggle-mobile')) document.getElementById('lang-toggle-mobile').textContent = "日本語";
    } else {
      document.querySelector('[data-i18n="hero_title_1"]').innerHTML = "Japanese Standard";
      document.querySelector('[data-i18n="hero_title_2"]').innerHTML = "Quality Cleaning";
      document.getElementById('lang-toggle').textContent = "English";
      if (document.getElementById('lang-toggle-mobile')) document.getElementById('lang-toggle-mobile').textContent = "English";
    }

    document.documentElement.lang = lang;
  };

  applyLang(currentLang);

  const toggleLang = () => {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    localStorage.setItem('jgcc_lang', currentLang);
    applyLang(currentLang);
  };

  const btnToggle = document.getElementById('lang-toggle');
  if (btnToggle) btnToggle.addEventListener('click', toggleLang);
  const btnToggleMob = document.getElementById('lang-toggle-mobile');
  if (btnToggleMob) btnToggleMob.addEventListener('click', () => {
    toggleLang();
    toggleNav(); // close mobile menu on switch
  });


});

// Global Function for Calculator Handoff
window.proceedToContact = () => {
  const serviceEl = document.querySelector('input[name="service-type"]:checked');
  const service = serviceEl ? serviceEl.value : 'Unknown';
  const beds = document.getElementById('bed-count').textContent;
  const baths = document.getElementById('bath-count').textContent;
  const total = document.getElementById('result-price').textContent;

  let extras = [];
  document.querySelectorAll('.extra-item input[type="checkbox"]:checked').forEach(cb => {
    extras.push(cb.value);
  });

  const msgBox = document.getElementById('cf-message');
  if (msgBox) {
    let msg = `[Automated Estimate Request]\n`;
    msg += `Service: ${service}\n`;
    msg += `Size: ${beds} Bed(s), ${baths} Bath(s)\n`;
    msg += `Extras: ${extras.length > 0 ? extras.join(', ') : 'None'}\n`;
    msg += `Estimated Total: $${total}\n\n`;
    msg += `Please provide any additional details here...`;

    msgBox.value = msg;

    // Scroll down to contact
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  }
};
