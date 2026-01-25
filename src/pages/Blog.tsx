import React, { useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { posts } from '../data/posts';
import { useLanguage } from '../contexts/LanguageContext';

const Blog: React.FC = () => {
    const { language, t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    // 翻訳データを取得
    const blogTrans = t('blog');
    const catKeys = blogTrans.categories;

    const categoryMapping = useMemo(() => [
        { label: catKeys.all, value: "All" },
        { label: catKeys.ai, value: "AI・テクノロジー" },
        { label: catKeys.physio, value: "理学療法・健康" },
        { label: catKeys.business, value: "ビジネス・起業" },
        { label: catKeys.australia, value: "マインドセット・生活" }
    ], [catKeys]);

    const [activeCategory, setActiveCategory] = React.useState("All");
    const [activeTag, setActiveTag] = React.useState<string | null>(null);

    // Initial load from URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const catParam = params.get('category');
        const tagParam = params.get('tag');

        if (catParam) {
            // Find the category label if value matches, or loosely match
            // Here we assume exact value match from BrainMap links first
            const matchedCat = categoryMapping.find(c => c.value === catParam || c.label === catParam);
            if (matchedCat) {
                setActiveCategory(matchedCat.value);
            } else {
                setActiveCategory(catParam); // Fallback
            }
            setActiveTag(null);
        } else if (tagParam) {
            setActiveCategory("All");
            setActiveTag(tagParam);
        } else {
            // Reset if no params
            setActiveCategory("All");
            setActiveTag(null);
        }
    }, [location.search, categoryMapping]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            // Category Filter
            const matchCategory = activeCategory === "All" || post.category === activeCategory;

            // Tag Filter (Checks tags array, title, or targets just in case)
            // Using partial match for broader results if exact tag missing
            const matchTag = activeTag
                ? (post.tags?.some(tag => tag.includes(activeTag)) ||
                    post.title.includes(activeTag) ||
                    post.category.includes(activeTag))
                : true;

            return matchCategory && matchTag;
        });
    }, [activeCategory, activeTag]);

    const handleCategoryClick = (catValue: string) => {
        setActiveCategory(catValue);
        setActiveTag(null);
        navigate('/blog', { replace: true }); // Clear params
    };

    const clearTag = () => {
        setActiveTag(null);
        navigate('/blog', { replace: true });
    };

    return (
        <>
            {/* SEO: Structured Data for Blog */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Blog",
                    "name": "Masa's Blog",
                    "description": blogTrans.subtitle,
                    "author": {
                        "@type": "Person",
                        "name": "Masa"
                    },
                    "blogPost": posts.map(post => ({
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "datePublished": post.date,
                        "description": post.excerpt,
                        "author": { "@type": "Person", "name": "Masa" }
                    }))
                })
            }} />

            <div className="container" style={{ minHeight: '100vh', paddingTop: '4rem', paddingBottom: '4rem' }}>

                {/* Header */}
                <header className="blog-header fade-in">
                    <Link to="/" className="blog-back-link">
                        <ArrowLeft size={16} strokeWidth={1.5} />
                        <span>{blogTrans.back}</span>
                    </Link>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <h1 className="blog-title">{blogTrans.title}</h1>
                        <p className="blog-subtitle">
                            {blogTrans.subtitle}
                        </p>
                    </div>
                </header>

                {/* Categories */}
                <nav className="category-nav fade-in fade-in-delay-1" aria-label="Blog categories" style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>

                    {categoryMapping.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => handleCategoryClick(cat.value)}
                            className={`category-pill ${activeCategory === cat.value ? 'active' : ''}`}
                            aria-pressed={activeCategory === cat.value}
                        >
                            {cat.label}
                        </button>
                    ))}
                </nav>

                {/* Active Tag Indicator */}
                {activeTag && (
                    <div className="fade-in fade-in-delay-1" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            Filtered by:
                        </span>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: 'var(--color-text-primary)',
                            color: 'white',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}>
                            {activeTag}
                            <button
                                onClick={clearTag}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Post List */}
                <main className="fade-in fade-in-delay-2" role="feed" aria-label="Blog posts">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <article key={post.id} className="post-item">
                                <Link to={`/blog/${post.id}`} className="post-inner" aria-labelledby={`post-title-${post.id}`}>
                                    <time className="post-date" dateTime={post.date.replace(/\./g, '-')}>
                                        {post.date}
                                    </time>
                                    <div className="post-content">
                                        <span className="post-category">{post.category}</span>
                                        <h2 className="post-title" id={`post-title-${post.id}`}>{post.title}</h2>
                                        <p className="post-excerpt">{post.excerpt}</p>

                                        {/* Show matched tag if active */}
                                        {activeTag && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    background: 'var(--color-accent-bg)',
                                                    color: 'var(--color-accent)',
                                                    padding: '0.1rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontWeight: 600
                                                }}>
                                                    #{activeTag}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </article>
                        ))
                    ) : (
                        <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                            No posts found matching your criteria.
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="footer fade-in fade-in-delay-3">
                    <p className="footer-copyright">
                        {blogTrans.footer}
                    </p>
                </footer>
            </div>
        </>
    );
};

export default Blog;
