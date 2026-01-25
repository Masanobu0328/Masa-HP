import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Share2, ArrowRight, Check } from 'lucide-react';
import { posts } from '../data/posts';
import { useLanguage } from '../contexts/LanguageContext';
import BrainPositionMap from '../components/BrainPositionMap';

const BlogPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useLanguage();

    // Fetch the current post
    const post = useMemo(() => posts.find(p => p.id === id), [id]);

    // Fetch related posts based on manual IDs
    const relatedPosts = useMemo(() => {
        if (!post || !post.relatedIds) return [];
        return posts.filter(p => post.relatedIds?.includes(p.id));
    }, [post]);

    if (!post) {
        return (
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <h2>Post not found</h2>
                <Link to="/blog" className="button" style={{ marginTop: '1rem' }}>Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '6rem' }}>

            {/* Back Navigation */}
            <Link to="/blog" className="blog-back-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
                <ArrowLeft size={16} strokeWidth={1.5} />
                <span>{t('blog.back')}</span>
            </Link>

            <article className="blog-post-container fade-in">
                {/* Header */}
                <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <span className="post-category" style={{ fontSize: '0.875rem' }}>{post.category}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
                            <Clock size={14} />
                            <time>{post.date}</time>
                        </div>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.3,
                        marginBottom: '1.5rem',
                        color: 'var(--color-text-primary)'
                    }}>
                        {post.title}
                    </h1>

                    {/* Tags */}
                    {post.tags && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {post.tags.map(tag => (
                                <span key={tag} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: 'var(--color-surface-alt)',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-secondary)',
                                    fontWeight: 500
                                }}>
                                    <Tag size={12} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Brain Position Map */}
                <BrainPositionMap category={post.category} tags={post.tags} />

                {/* Key Summary Block */}
                <div className="blog-summary">
                    <div className="blog-summary-title">この記事の要約</div>
                    <ul>
                        <li style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                            {post.excerpt}
                        </li>
                    </ul>
                </div>

                {/* Targets - Restored */}
                {post.targets && post.targets.length > 0 && (
                    <div className="post-targets fade-in fade-in-delay-2" style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        margin: '2rem 0',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                    }}>
                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#333'
                        }}>
                            <span style={{ color: '#4A90E2' }}>●</span> こんな人におすすめ
                        </h3>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'grid',
                            gap: '0.8rem'
                        }}>
                            {post.targets.map((target, index) => (
                                <li key={index} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '0.8rem',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                    color: '#555'
                                }}>
                                    <Check size={18} color="#4A90E2" style={{ marginTop: '3px', flexShrink: 0 }} />
                                    <span>{target}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Content Body */}
                <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                    style={{
                        fontSize: '1.0625rem',
                        lineHeight: 1.8,
                        color: 'var(--color-text-secondary)'
                    }}
                />

                {/* Share / Footer */}
                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)'
                    }}
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: post.title,
                                    url: window.location.href
                                });
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('URL copied to clipboard');
                            }
                        }}
                    >
                        <Share2 size={16} />
                        Share this article
                    </button>
                </div>
            </article>

            {/* Related Articles Section */}
            {relatedPosts.length > 0 && (
                <section style={{ marginTop: '6rem', maxWidth: '800px', margin: '6rem auto 0' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: 'var(--color-text-primary)'
                    }}>
                        <span style={{
                            width: '4px',
                            height: '24px',
                            backgroundColor: 'var(--color-accent)',
                            borderRadius: '2px',
                            display: 'block'
                        }}></span>
                        {t('blog.related') || 'Related Articles'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {relatedPosts.map(related => (
                            <Link
                                key={related.id}
                                to={`/blog/${related.id}`}
                                className="related-post-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column', // Stack on mobile
                                    gap: '1rem',
                                    padding: '1.5rem',
                                    backgroundColor: 'white',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '1rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                <div>
                                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                                        {related.title}
                                    </h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
                                        {related.excerpt}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.875rem' }}>
                                        Read More <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogPost;
