import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getBrainMapData, BrainNode } from '../data/brainMapData';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BrainMapTypo: React.FC = () => {
    const { language, t } = useLanguage();
    const fgRef = useRef<any>();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });
    const [isMobile, setIsMobile] = useState(false);

    const brainData = getBrainMapData(language);

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
            fgRef.current.d3Force('charge').strength(-300);
            fgRef.current.d3Force('link').distance(150);
            setTimeout(() => {
                fgRef.current?.zoomToFit(400, 100);
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
                background: '#FFFFFF',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'none',
                border: '1px solid #F1EFED',
                aspectRatio: isMobile ? 'unset' : '16/9',
                height: isMobile ? containerSize.height : 'auto',
                touchAction: 'none'
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

                    // Tiny dots
                    const radius = isCenter ? 3 : 2;

                    ctx.beginPath();
                    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                    ctx.fillStyle = isCenter ? '#D4AF37' : '#E5E5E5';
                    ctx.fill();

                    // Typography
                    const name = node.name || '';
                    const lines = name.split('\n');

                    // Large, elegant Serif font
                    const fontSize = (isCenter ? 24 : 12) / scale;
                    const fontWeight = isCenter ? 700 : 400;
                    ctx.font = `${fontWeight} ${fontSize}px "Playfair Display", serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = isCenter ? '#1A1A1A' : '#52525B';

                    // Draw text slightly offset from dot
                    const textY = node.y + (isCenter ? -10 : 8) / scale;

                    lines.forEach((line: string, i: number) => {
                        ctx.fillText(line, node.x, textY + (i * fontSize * 1.2));
                    });
                }}
                linkColor={() => '#F5F5F4'} // Very faint lines
                linkWidth={1}
                onNodeClick={handleNodeClick}
                cooldownTicks={100}
                enableNodeDrag={!isMobile}
            />
            <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', pointerEvents: 'none' }}>
                <div style={{ color: '#555', fontSize: '12px', fontWeight: '600' }}>
                    Design 3: Elegant Typography
                </div>
            </div>
        </div>
    );
};

export default BrainMapTypo;
