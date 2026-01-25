import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getBrainMapData, BrainNode } from '../data/brainMapData';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BrainMapNatural: React.FC = () => {
    const { language, t } = useLanguage();
    const fgRef = useRef<any>();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });
    const [profileImg, setProfileImg] = useState<HTMLImageElement | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const brainData = getBrainMapData(language);

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
                    height: mobile ? Math.min(window.innerHeight * 0.7, 500) : 600
                });
            }
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        if (fgRef.current) {
            fgRef.current.d3Force('charge').strength(isMobile ? -150 : -400);
            fgRef.current.d3Force('link').distance(isMobile ? 60 : 120);
            setTimeout(() => {
                fgRef.current?.zoomToFit(400, isMobile ? 50 : 100);
            }, 500);
        }
    }, [containerSize, language, isMobile]);

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

    return (
        <div
            ref={containerRef}
            className="brain-map-container"
            style={{
                width: '100%',
                background: '#FAFAF9', // Off-white/Beige
                borderRadius: '1.5rem',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)',
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
                    const radius = (isCenter ? 14 : Math.sqrt(val) * 2.5);
                    const color = node.color || '#888888';

                    // 1. Core Node Halo
                    if (isCenter) {
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius * 1.5, 0, 2 * Math.PI);
                        ctx.fillStyle = 'rgba(212, 175, 55, 0.2)'; // Goldish halo
                        ctx.fill();
                    }

                    // 2. Draw Node
                    if (isCenter && profileImg) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(profileImg, node.x - radius, node.y - radius, radius * 2, radius * 2);
                        ctx.restore();

                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                        ctx.strokeStyle = '#D4AF37';
                        ctx.lineWidth = 1.5 / scale;
                        ctx.stroke();
                    } else {
                        // Soft pastel nodes
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 0.8;
                        ctx.fill();
                        ctx.globalAlpha = 1.0;
                    }

                    // 3. Draw Label (Always visible for cleanliness in this design)
                    const name = node.name || '';
                    const lines = name.split('\n');
                    const labelScaleThreshold = 0.4;

                    if (scale > labelScaleThreshold || isCenter) {
                        const fontSize = (isCenter ? 14 : 10) / scale;
                        ctx.font = `${isCenter ? '700' : 'normal'} ${fontSize}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        ctx.fillStyle = '#444444'; // Dark text for light background

                        lines.forEach((line: string, i: number) => {
                            ctx.fillText(line, node.x, node.y + radius + 4 / scale + (i * fontSize * 1.2));
                        });
                    }
                }}
                linkColor={() => '#E5E5E5'} // Light gray links
                linkWidth={1.5}
                onNodeClick={handleNodeClick}
                cooldownTicks={100}
                enableNodeDrag={!isMobile}
            />
            {/* Overlay */}
            <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', pointerEvents: 'none' }}>
                <div style={{ color: '#555', fontSize: '12px', fontWeight: '600' }}>
                    Design 1: Natural Harmony
                </div>
            </div>
        </div>
    );
};

export default BrainMapNatural;
