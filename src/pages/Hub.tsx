import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Instagram,
    Linkedin,
    Facebook,
    Twitter,
    MessageSquare,
    BookOpen,
    ArrowRight,
    Activity,
    Lightbulb,
    MapPin,
    Briefcase,
    GraduationCap,
    Globe,
    Cpu,
    Heart,
    Plane,
    Store,
    Newspaper,
    ExternalLink,
    Brain,
    Languages
} from 'lucide-react';
import BrainMap from '../components/BrainMap';
import { useLanguage } from '../contexts/LanguageContext';

const Hub: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();

    // 経歴データ (Translated)
    const career = t('career.items');

    // 翻訳データを取得
    const trans = {
        hero: t('hero'),
        brainMap: t('brainMap'),
        careerTitle: t('career.title'),
        store: t('store'),
        media: t('media'),
        projects: t('projects'),
        categories: t('categories'),
        footer: t('footer')
    };

    // ビジネス・サービスリンク
    const businessLinks = [
        {
            title: trans.projects.blog.title,
            subtitle: trans.projects.blog.subtitle,
            icon: <BookOpen size={20} strokeWidth={1.5} />,
            internal: true,
            url: "/blog",
            description: trans.projects.blog.description
        },
        {
            title: trans.projects.takumi.title,
            subtitle: trans.projects.takumi.subtitle,
            icon: <Activity size={20} strokeWidth={1.5} />,
            internal: false,
            url: "https://takumiwalk.example.com",
            description: trans.projects.takumi.description
        },
        {
            title: trans.projects.physio.title,
            subtitle: trans.projects.physio.subtitle,
            icon: <Lightbulb size={20} strokeWidth={1.5} />,
            internal: false,
            url: "https://physiogolazo.example.com",
            description: trans.projects.physio.description
        },
        {
            title: trans.projects.contact.title,
            subtitle: trans.projects.contact.subtitle,
            icon: <MessageSquare size={20} strokeWidth={1.5} />,
            internal: false,
            url: "mailto:contact@example.com",
            description: trans.projects.contact.description
        }
    ];

    // 店舗情報
    const stores = [
        {
            name: trans.store.name,
            type: trans.store.type,
            location: trans.store.location,
            url: "https://itoino-chiisana-yobou.com/%E6%97%A5%E6%9C%AC%E4%BA%BA%E3%81%AE%E6%96%B9%E3%81%B8/",
            description: trans.store.description
        }
    ];

    // メディア掲載
    const mediaFeatures = trans.media.items.map((item: any, index: number) => ({
        ...item,
        url: index === 0
            ? "https://gold-coast-journey.com/readjust-japanese-health-miami-gc/"
            : "https://gold-coast-journey.com/therapist-masa-goldcoast/",
        image: index === 0 ? "/media_store.png" : "/media_person.png"
    }));

    // カテゴリ
    const categories = [
        { name: trans.categories.ai, icon: <Cpu size={16} />, slug: "ai" },
        { name: trans.categories.physio, icon: <Heart size={16} />, slug: "physio" },
        { name: trans.categories.business, icon: <Briefcase size={16} />, slug: "business" },
        { name: trans.categories.australia, icon: <Plane size={16} />, slug: "australia" },
    ];

    return (
        <>
            {/* Language Toggle Floating Button */}
            <div style={{
                position: 'fixed',
                top: '1.5rem',
                right: '1.5rem',
                zIndex: 1000,
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                padding: '4px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)'
            }}>
                <button
                    onClick={() => setLanguage('ja')}
                    style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: language === 'ja' ? 'var(--color-accent)' : 'transparent',
                        color: language === 'ja' ? 'white' : 'var(--color-text-tertiary)'
                    }}
                >
                    JP
                </button>
                <button
                    onClick={() => setLanguage('en')}
                    style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: language === 'en' ? 'var(--color-accent)' : 'transparent',
                        color: language === 'en' ? 'white' : 'var(--color-text-tertiary)'
                    }}
                >
                    EN
                </button>
            </div>

            {/* SEO: Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": trans.hero.name,
                    "jobTitle": ["Physiotherapist", "Entrepreneur", "AI Specialist"],
                    "url": "https://masa.example.com",
                    "sameAs": [
                        "https://instagram.com/masa",
                        "https://facebook.com/masa",
                        "https://linkedin.com/in/masa"
                    ],
                    "knowsAbout": ["Physiotherapy", "AI", "Gait Analysis", "Entrepreneurship"],
                    "nationality": "Japanese",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Gold Coast",
                        "addressCountry": "Australia"
                    }
                })
            }} />

            <div className="container" style={{ minHeight: '100vh', paddingTop: '4rem', paddingBottom: '3rem' }}>

                {/* ===== HERO SECTION ===== */}
                <header className="text-center fade-in" style={{ marginBottom: 'var(--space-10)' }}>

                    {/* Profile Photo */}
                    <div className="profile-frame" style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="profile-blob" aria-hidden="true"></div>
                        <div className="profile-photo" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                src="/profile.jpg"
                                alt={trans.hero.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Name & Title */}
                    <h1 className="hero-name">{trans.hero.name}</h1>
                    <p className="hero-tagline" role="doc-subtitle">
                        {trans.hero.tagline}
                    </p>

                    {/* Location */}
                    <div className="hero-location">
                        <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
                        <span>{trans.hero.location}</span>
                    </div>

                    {/* SNS Links */}
                    <nav className="social-links" aria-label="Social media links" style={{ marginBottom: 'var(--space-8)' }}>
                        <a href="https://instagram.com/masa" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                            <Instagram size={18} strokeWidth={1.5} />
                        </a>
                        <a href="https://facebook.com/masa" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                            <Facebook size={18} strokeWidth={1.5} />
                        </a>
                        <a href="https://linkedin.com/in/masa" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                            <Linkedin size={18} strokeWidth={1.5} />
                        </a>
                        <a href="https://twitter.com/masa" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X (Twitter)">
                            <Twitter size={18} strokeWidth={1.5} />
                        </a>
                    </nav>

                    {/* Bio */}
                    <p className="hero-bio" style={{ whiteSpace: 'pre-line' }}>
                        {trans.hero.bio}
                    </p>
                </header>

                {/* ===== BRAIN MAP SECTION ===== */}
                <section className="fade-in fade-in-delay-1" style={{ marginBottom: 'var(--space-12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                        <Brain size={18} style={{ color: 'var(--color-accent)' }} />
                        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                            {trans.brainMap.title}
                        </h2>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                        {trans.brainMap.description}
                    </p>
                    <BrainMap />
                </section>

                {/* ===== CAREER SECTION ===== */}
                <section className="fade-in fade-in-delay-1" style={{ marginBottom: 'var(--space-12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        <GraduationCap size={18} style={{ color: 'var(--color-accent)' }} />
                        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                            {trans.careerTitle}
                        </h2>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-4)',
                        paddingLeft: 'var(--space-4)',
                        borderLeft: '2px solid var(--color-border)'
                    }}>
                        {career.map((item: any, index: number) => (
                            <div key={index} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                                <span style={{
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 700,
                                    color: 'var(--color-accent)',
                                    minWidth: '80px',
                                    flexShrink: 0
                                }}>
                                    {item.year}
                                </span>
                                <div>
                                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                                        {item.title}
                                    </p>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                        {item.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== STORE SECTION ===== */}
                <section className="fade-in fade-in-delay-1" style={{ marginBottom: 'var(--space-12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        <Store size={18} style={{ color: 'var(--color-accent)' }} />
                        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                            {trans.store.title}
                        </h2>
                    </div>
                    {stores.map((store, index) => (
                        <a
                            key={index}
                            href={store.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-card"
                            style={{ background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-accent-bg) 100%)' }}
                        >
                            <div className="link-card-inner">
                                <div className="link-card-icon">
                                    <Globe size={20} strokeWidth={1.5} />
                                </div>
                                <div className="link-card-content">
                                    <div className="link-card-header">
                                        <h3 className="link-card-title">{store.name}</h3>
                                        <ArrowRight size={16} className="link-card-arrow" aria-hidden="true" />
                                    </div>
                                    <p className="link-card-subtitle">{store.type} — {store.location}</p>
                                    <p className="link-card-description">{store.description}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </section>

                {/* ===== MEDIA FEATURES ===== */}
                <section className="fade-in fade-in-delay-2" style={{ marginBottom: 'var(--space-12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        <Newspaper size={18} style={{ color: 'var(--color-accent)' }} />
                        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                            {trans.media.title}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {mediaFeatures.map((media: any, index: number) => (
                            <a
                                key={index}
                                href={media.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'block',
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-xl)',
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                    transition: 'all var(--transition-base)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '16 / 9',
                                    background: 'var(--color-surface-alt)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={media.image}
                                        alt={media.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        top: 'var(--space-3)',
                                        left: 'var(--space-3)',
                                        padding: '4px 10px',
                                        background: 'rgba(255,255,255,0.95)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        color: 'var(--color-accent)',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        {media.type}
                                    </span>
                                </div>
                                <div style={{ padding: 'var(--space-5)' }}>
                                    <p style={{
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 700,
                                        color: 'var(--color-text-primary)',
                                        lineHeight: 1.4,
                                        marginBottom: 'var(--space-2)'
                                    }}>
                                        {media.title}
                                    </p>
                                    <p style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--color-text-tertiary)',
                                        lineHeight: 1.6,
                                        marginBottom: 'var(--space-3)'
                                    }}>
                                        {media.description}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-text-muted)',
                                            fontWeight: 500
                                        }}>
                                            {media.source}
                                        </span>
                                        <ExternalLink size={14} style={{ color: 'var(--color-accent)' }} />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* ===== PROJECTS & SERVICES ===== */}
                <section className="fade-in fade-in-delay-2" style={{ marginBottom: 'var(--space-12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        <Briefcase size={18} style={{ color: 'var(--color-accent)' }} />
                        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                            {trans.projects.title}
                        </h2>
                    </div>
                    <nav>
                        {businessLinks.map((link, index) => (
                            <React.Fragment key={index}>
                                {link.internal ? (
                                    <Link to={link.url} className="link-card">
                                        <div className="link-card-inner">
                                            <div className="link-card-icon">{link.icon}</div>
                                            <div className="link-card-content">
                                                <div className="link-card-header">
                                                    <h3 className="link-card-title">{link.title}</h3>
                                                    <ArrowRight size={16} className="link-card-arrow" />
                                                </div>
                                                <p className="link-card-subtitle">{link.subtitle}</p>
                                                <p className="link-card-description">{link.description}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-card">
                                        <div className="link-card-inner">
                                            <div className="link-card-icon">{link.icon}</div>
                                            <div className="link-card-content">
                                                <div className="link-card-header">
                                                    <h3 className="link-card-title">{link.title}</h3>
                                                    <ArrowRight size={16} className="link-card-arrow" />
                                                </div>
                                                <p className="link-card-subtitle">{link.subtitle}</p>
                                                <p className="link-card-description">{link.description}</p>
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {/* Blogカテゴリナビ */}
                                {link.title === trans.projects.blog.title && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: 'var(--space-2)',
                                        marginLeft: 'calc(48px + var(--space-5))',
                                        marginBottom: 'var(--space-4)',
                                        marginTop: 'calc(-1 * var(--space-2))'
                                    }}>
                                        {categories.map((cat, catIndex) => (
                                            <Link
                                                key={catIndex}
                                                to={`/blog?category=${cat.slug}`}
                                                className="category-link-mini"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-2)',
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    background: 'var(--color-surface-alt)',
                                                    border: '1px solid var(--color-border-light)',
                                                    borderRadius: 'var(--radius-md)',
                                                    color: 'var(--color-text-tertiary)',
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 500,
                                                    transition: 'all var(--transition-base)',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <span style={{ color: 'var(--color-accent)', display: 'flex' }}>{cat.icon}</span>
                                                <span>{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </section>

                {/* ===== FOOTER ===== */}
                <footer className="footer fade-in fade-in-delay-4">
                    <div className="divider" style={{ marginBottom: 'var(--space-8)' }}></div>
                    <p className="footer-copyright">
                        {trans.footer.copyright}
                    </p>
                </footer>

                <div className="guide-line" aria-hidden="true"></div>
            </div>
        </>
    );
};

export default Hub;
