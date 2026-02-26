---
name: Bilingual Website (i18n)
description: Build Japanese/English bilingual websites with language toggle, SEO-friendly URL structure, and proper font handling. Reusable for any AU-based Japanese business.
---

# Bilingual Website (i18n) Skill

## Overview
This skill enables you to build **Japanese/English bilingual websites** for businesses targeting both Japanese and English-speaking audiences. Designed for Australian-based Japanese businesses (salons, restaurants, clinics, etc.) but applicable to any bilingual site.

## Why Bilingual?
- Australian Japanese businesses serve **both communities**
- Google indexes each language separately → **double the SEO reach**
- Builds trust with both English-speaking locals and Japanese expats

## Architecture Options

### Option A: URL-based Language Switching (Recommended for SEO)
```
yourdomain.com/         → English (default)
yourdomain.com/ja/      → Japanese
```
- Each language has its own URL → Google indexes both
- `hreflang` tags tell Google which version to show
- Best for SEO

### Option B: Client-side Toggle (Simpler)
```
yourdomain.com/         → Toggle EN/JA on same page
```
- Single URL, JavaScript switches content
- Simpler to build but weaker SEO for secondary language
- Good for small sites where SEO isn't critical

### Option C: Subdomain-based
```
en.yourdomain.com/      → English
ja.yourdomain.com/      → Japanese
```
- Clean separation but requires DNS setup
- Overkill for most small business sites

## Recommended: Option A (URL-based)

### Next.js App Router Implementation

#### File Structure
```
app/
├── [lang]/
│   ├── layout.tsx          ← Language-aware layout
│   ├── page.tsx            ← Home page
│   ├── about/
│   │   └── page.tsx
│   └── menu/
│       └── page.tsx
├── dictionaries/
│   ├── en.json             ← English translations
│   └── ja.json             ← Japanese translations
├── lib/
│   └── dictionary.ts       ← Dictionary loader
└── middleware.ts            ← Auto-detect language
```

#### `middleware.ts` - Language Detection & Redirect
```typescript
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ja'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  if (acceptLanguage.includes('ja')) return 'ja';
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip if already has locale or is a static file
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (hasLocale) return;
  if (pathname.startsWith('/_next') || pathname.includes('.')) return;

  // Redirect to detected locale
  const locale = getLocale(request);
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
```

#### `dictionaries/en.json`
```json
{
  "site": {
    "title": "Your Salon Name",
    "description": "Japanese hair salon in Gold Coast"
  },
  "nav": {
    "home": "Home",
    "menu": "Menu",
    "about": "About",
    "booking": "Book Now",
    "access": "Access"
  },
  "hero": {
    "tagline": "Japanese Precision, Australian Style",
    "cta": "Book Your Appointment"
  },
  "menu": {
    "cut": "Cut",
    "color": "Color",
    "perm": "Perm",
    "straight": "Straight",
    "others": "Others",
    "includes_shampoo": "Includes Shampoo",
    "from": "from"
  },
  "booking": {
    "title": "Book an Appointment",
    "subtitle": "Select your service and preferred time"
  },
  "access": {
    "title": "Access",
    "parking": "Parking",
    "hours": "Business Hours"
  },
  "footer": {
    "copyright": "© {year} Your Salon Name. All rights reserved."
  }
}
```

#### `dictionaries/ja.json`
```json
{
  "site": {
    "title": "サロン名",
    "description": "ゴールドコーストの日本人ヘアサロン"
  },
  "nav": {
    "home": "ホーム",
    "menu": "メニュー",
    "about": "こだわり",
    "booking": "予約する",
    "access": "アクセス"
  },
  "hero": {
    "tagline": "日本の技術を、オーストラリアで。",
    "cta": "ご予約はこちら"
  },
  "menu": {
    "cut": "カット",
    "color": "カラー",
    "perm": "パーマ",
    "straight": "ストレート",
    "others": "その他",
    "includes_shampoo": "シャンプー込み",
    "from": "〜"
  },
  "booking": {
    "title": "ご予約",
    "subtitle": "メニューとご希望の日時をお選びください"
  },
  "access": {
    "title": "アクセス",
    "parking": "駐車場",
    "hours": "営業時間"
  },
  "footer": {
    "copyright": "© {year} サロン名. All rights reserved."
  }
}
```

#### `lib/dictionary.ts`
```typescript
const dictionaries = {
  en: () => import('../dictionaries/en.json').then((m) => m.default),
  ja: () => import('../dictionaries/ja.json').then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
```

#### `app/[lang]/layout.tsx`
```tsx
import { Locale } from '@/lib/dictionary';
import { Inter, Noto_Sans_JP, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ja' }];
}

export default function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={lang} className={`${inter.variable} ${notoSansJP.variable} ${playfair.variable}`}>
      <head>
        {/* hreflang tags for SEO */}
        <link rel="alternate" hrefLang="en" href="https://yourdomain.com/en" />
        <link rel="alternate" hrefLang="ja" href="https://yourdomain.com/ja" />
        <link rel="alternate" hrefLang="x-default" href="https://yourdomain.com/en" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Language Toggle Component
```tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';

export function LanguageToggle({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = () => {
    const newLang = currentLang === 'en' ? 'ja' : 'en';
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <button onClick={switchLanguage} className="lang-toggle" aria-label="Switch language">
      {currentLang === 'en' ? '日本語' : 'English'}
    </button>
  );
}
```

### Static HTML (Non-framework) Approach
For simple static sites without Next.js:

```html
<!-- Language toggle button -->
<button onclick="toggleLanguage()" id="lang-toggle">日本語</button>

<script>
  const translations = {
    en: {
      hero_tagline: "Japanese Precision, Australian Style",
      cta: "Book Your Appointment",
      // ... all text
    },
    ja: {
      hero_tagline: "日本の技術を、オーストラリアで。",
      cta: "ご予約はこちら",
      // ... all text
    }
  };

  let currentLang = localStorage.getItem('lang') || 'en';
  applyLanguage(currentLang);

  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    localStorage.setItem('lang', currentLang);
    applyLanguage(currentLang);
  }

  function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[lang][key] || el.textContent;
    });
    document.getElementById('lang-toggle').textContent = lang === 'en' ? '日本語' : 'English';
    document.documentElement.lang = lang;
  }
</script>

<!-- Usage in HTML -->
<h1 data-i18n="hero_tagline">Japanese Precision, Australian Style</h1>
<a data-i18n="cta">Book Your Appointment</a>
```

## Font Strategy for Bilingual Sites

```css
/* Base font stack - handles both languages */
:root {
  --font-heading: 'Playfair Display', 'Noto Serif JP', serif;
  --font-body: 'Inter', 'Noto Sans JP', sans-serif;
}

/* Japanese text often needs slightly different line-height */
:lang(ja) {
  line-height: 1.8;  /* vs 1.6 for English */
  letter-spacing: 0.02em;
}

:lang(en) {
  line-height: 1.6;
  letter-spacing: normal;
}
```

## SEO for Bilingual Sites

### Meta Tags (per language)
```html
<!-- English page -->
<html lang="en">
<head>
  <title>Your Salon - Japanese Hair Salon in Gold Coast</title>
  <meta name="description" content="Professional Japanese hair salon in Southport, Gold Coast." />
  <link rel="alternate" hreflang="ja" href="https://yourdomain.com/ja" />
  <link rel="alternate" hreflang="en" href="https://yourdomain.com/en" />
</head>

<!-- Japanese page -->
<html lang="ja">
<head>
  <title>サロン名 - ゴールドコーストの日本人ヘアサロン</title>
  <meta name="description" content="サウスポート、ゴールドコーストにある日本人美容師のヘアサロン。" />
  <link rel="alternate" hreflang="en" href="https://yourdomain.com/en" />
  <link rel="alternate" hreflang="ja" href="https://yourdomain.com/ja" />
</head>
```

## Implementation Checklist
- [ ] Choose approach: URL-based (Next.js) or client-side toggle (static HTML)
- [ ] Create dictionary/translation files (en.json, ja.json)
- [ ] Implement language toggle UI component
- [ ] Set correct `lang` attribute on `<html>` tag
- [ ] Add `hreflang` tags for SEO
- [ ] Configure fonts for both languages (Latin + Japanese)
- [ ] Adjust line-height/spacing for Japanese text
- [ ] Test: language detection, toggle, persistence, SEO tags

## Usage Instructions for Antigravity

1. **Determine the framework**: Next.js → URL-based routing. Static HTML → client-side toggle.
2. **Create translation files first**: Get all text content in both languages.
3. **Implement the language-aware layout/component**: Use the patterns above.
4. **Always set `lang` attribute**: Critical for accessibility and SEO.
5. **Test both languages**: Ensure no untranslated strings, proper fonts, correct spacing.

---

This skill provides reusable bilingual website patterns for any Japanese business in English-speaking countries.
