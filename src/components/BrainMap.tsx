import React, { useState, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getBrainMapData, BrainNode } from '../data/brainMapData';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Brain, Grid3x3, Cpu, Heart, Briefcase, Plane } from 'lucide-react';

const BrainMap: React.FC = () => {
    const { language, t } = useLanguage();
    const [viewMode, setViewMode] = useState<'grid' | 'mindmap'>('grid');
    const fgRef = useRef<any>();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });
    const [profileImg, setProfileImg] = useState<HTMLImageElement | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const brainData = getBrainMapData(language);

    // Categories for grid view
    const categories = [
        {
            id: 'ai',
            icon: <Cpu size={24} />,
            title: language === 'ja' ? 'AI・テクノロジー' : 'AI & Technology',
            description: language === 'ja' ? 'AI活用術、技術開発、姿勢推定' : 'AI Usage, Development, Posture Estimation',
            color: '#7C9082',
            link: '/blog?category=AI・テクノロジー'
        },
        {
            id: 'physio',
            icon: <Heart size={24} />,
            title: language === 'ja' ? '理学療法・健康' : 'Physio & Health',
            description: language === 'ja' ? '歩行解析、マッサージ、セラピスト教育' : 'Gait Analysis, Massage, Therapist Education',
            color: '#9BA8A0',
            link: '/blog?category=理学療法・健康'
        },
        {
            id: 'business',
            icon: <Briefcase size={24} />,
            title: language === 'ja' ? 'ビジネス・起業' : 'Business',
            description: language === 'ja' ? 'マーケティング、コンサルティング、起業' : 'Marketing, Consulting, Entrepreneurship',
            color: '#5C6B61',
            link: '/blog?category=ビジネス・起業'
        },
        {
            id: 'lifestyle',
            icon: <Plane size={24} />,
            title: language === 'ja' ? 'マインドセット・生活' : 'Mindset & Life',
            description: language === 'ja' ? '海外生活、自然・アウトドア、マインドセット' : 'Overseas Life, Nature & Outdoor, Mindset',
            color: '#D1CEC7',
            link: '/blog?category=マインドセット・生活'
        }
    ];

    useEffect(() => {
        const img = new Image();
        img.src = '/profile.jpg';
        img.onload = () => setProfileImg(img);
    }, []);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth;
                const mobile = width < 768;
                setIsMobile(mobile);
                setContainerSize({
                    width: width,
                    height: mobile ? window.innerHeight * 0.8 : 600
                });
            }
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        if (fgRef.current && viewMode === 'mindmap') {
            fgRef.current.d3Force('charge').strength(isMobile ? -250 : -300);
            fgRef.current.d3Force('link').distance(isMobile ? 100 : 120);
            setTimeout(() => {
                fgRef.current?.zoomToFit(400, isMobile ? 50 : 100);
            }, 500);
        }
    }, [containerSize, isMobile, viewMode]);

    const handleNodeClick = (node: any) => {
        const brainNode = node as BrainNode;
        if (!brainNode.link) return;

        fgRef.current?.centerAt(node.x, node.y, 1000);
        fgRef.current?.zoom(isMobile ? 3 : 2, 1000);

        setTimeout(() => {
            if (brainNode.link?.startsWith('http')) {
                window.open(brainNode.link, '_blank');
            } else {
                navigate(brainNode.link!);
            }
        }, 800);
    };

    const handleCategoryClick = (link: string) => {
        navigate(link);
    };

    // Grid View
    if (viewMode === 'grid') {
        return (
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    background: '#FAFAF9',
                    borderRadius: '1.5rem',
                    padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
                    border: '1px solid #E5E5E5',
                    position: 'relative'
                }}
            >
                {/* Grid of Categories */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: isMobile ? '1rem' : '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.link)}
                            style={{
                                background: 'white',
                                border: '1px solid #E5E5E5',
                                borderRadius: '1rem',
                                padding: isMobile ? '1.5rem' : '2rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = cat.color;
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E5E5E5';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{
                                color: cat.color,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                {cat.icon}
                                <h3 style={{
                                    fontSize: isMobile ? '1rem' : '1.125rem',
                                    fontWeight: 700,
                                    color: '#333',
                                    margin: 0
                                }}>
                                    {cat.title}
                                </h3>
                            </div>
                            <p style={{
                                fontSize: isMobile ? '0.875rem' : '0.9375rem',
                                color: '#666',
                                margin: 0,
                                lineHeight: 1.6
                            }}>
                                {cat.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Switch to Mindmap Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => setViewMode('mindmap')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
                            background: 'linear-gradient(135deg, #7C9082 0%, #5C6B61 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '999px',
                            fontSize: isMobile ? '0.875rem' : '0.9375rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(124, 144, 130, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 144, 130, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 144, 130, 0.3)';
                        }}
                    >
                        <Brain size={18} />
                        <span>{language === 'ja' ? '脳内マップを見る' : 'View Mind Map'}</span>
                    </button>
                </div>
            </div>
        );
    }

    // Mindmap View
    return (
        <div
            ref={containerRef}
            className="brain-map-container"
            style={{
                width: '100%',
                background: '#F5F5F4',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)',
                aspectRatio: isMobile ? 'unset' : '16/9',
                height: isMobile ? containerSize.height : 'auto',
                touchAction: 'none',
                border: '1px solid #E5E5E5'
            }}
        >
            <ForceGraph2D
                ref={fgRef}
                graphData={brainData}
                width={containerSize.width}
                height={containerSize.height}
                backgroundColor="rgba(0,0,0,0)"
                nodeLabel={() => ''}

                nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

                    const isCenter = node.id === 'masa';
                    const scale = globalScale || 1;
                    const val = typeof node.val === 'number' ? node.val : 10;

                    const baseRadius = (isCenter ? 14 : Math.sqrt(val) * 2.5);
                    const radius = isMobile ? baseRadius * 1.5 : baseRadius;

                    const color = node.color || '#888888';

                    // Draw Node
                    if (isCenter && profileImg) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(profileImg, node.x - radius, node.y - radius, radius * 2, radius * 2);
                        ctx.restore();
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = 2 / scale;
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                        ctx.fillStyle = color;
                        ctx.fill();
                    }

                    // Draw Label (skip for center)
                    if (isCenter) return;

                    const name = node.name || '';
                    const baseFontSize = isMobile ? 12 : 10;
                    const fontSize = baseFontSize / scale;
                    const lineHeight = fontSize * 1.2;

                    ctx.font = `700 ${fontSize}px sans-serif`;
                    ctx.fillStyle = '#333333';
                    const lines = name.split('\n');

                    // Determine position based on angle from center (0,0)
                    // Angle in radians: -PI to PI
                    // Use a slightly larger offset to clear the node
                    const angle = Math.atan2(node.y, node.x);
                    const PI = Math.PI;
                    const offset = radius + 6 / scale;
                    const totalHeight = lines.length * lineHeight;

                    let startX = node.x;
                    let startY = node.y;

                    // Text styling based on quadrant to push text away from center
                    if (angle > -PI / 4 && angle <= PI / 4) {
                        // Right Quadrant: Text to the Right
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'top';
                        startX = node.x + offset;
                        startY = node.y - totalHeight / 2;
                    } else if (angle > PI / 4 && angle <= 3 * PI / 4) {
                        // Bottom Quadrant: Text Below
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        startX = node.x;
                        startY = node.y + offset;
                    } else if (angle > -3 * PI / 4 && angle <= -PI / 4) {
                        // Top Quadrant: Text Above
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        startX = node.x;
                        startY = node.y - offset - totalHeight;
                    } else {
                        // Left Quadrant: Text to the Left
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'top';
                        startX = node.x - offset;
                        startY = node.y - totalHeight / 2;
                    }

                    lines.forEach((line: string, i: number) => {
                        ctx.fillText(line, startX, startY + (i * lineHeight));
                    });
                }}
                linkColor={() => '#CCCCCC'}
                linkWidth={2}
                onNodeClick={handleNodeClick}
                cooldownTicks={100}
                enableNodeDrag={!isMobile}
            />

            {/* Back to Grid Button */}
            <div style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                zIndex: 10
            }}>
                <button
                    onClick={() => setViewMode('grid')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: isMobile ? '0.5rem 1rem' : '0.625rem 1.25rem',
                        background: 'white',
                        color: '#333',
                        border: '1px solid #E5E5E5',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F5F5F4';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                    }}
                >
                    <Grid3x3 size={14} />
                    <span>{language === 'ja' ? 'グリッドに戻る' : 'Back to Grid'}</span>
                </button>
            </div>
        </div>
    );
};

export default BrainMap;
