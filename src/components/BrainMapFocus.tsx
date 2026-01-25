import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getBrainMapData, BrainNode } from '../data/brainMapData';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BrainMapFocus: React.FC = () => {
    const { language, t } = useLanguage();
    const fgRef = useRef<any>();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });
    const [profileImg, setProfileImg] = useState<HTMLImageElement | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Manage expanded nodes. Initially empty or just 'masa'
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['masa']));

    const fullData = getBrainMapData(language);

    // Filter data based on expansion
    // Always include 'masa' and its direct children (Group headers).
    // If a group header is expanded, show its children.
    const getFilteredData = () => {
        const visibleNodes = new Set<string>(['masa']);

        // Add Level 1 nodes (connected directly to masa)
        fullData.links.forEach(link => {
            if (typeof link.source === 'string' && link.source === 'masa') {
                visibleNodes.add(link.target as string);
            } else if (typeof link.target === 'string' && link.target === 'masa') {
                visibleNodes.add(link.source as string);
            }
        });

        // Add Level 2 nodes if parent is expanded
        // This logic simplifies 'expansion' to: if I click a Level 1 node, show its children.
        expandedNodes.forEach(expandedId => {
            fullData.links.forEach(link => {
                const s = typeof link.source === 'object' ? (link.source as any).id : link.source;
                const t = typeof link.target === 'object' ? (link.target as any).id : link.target;

                if (s === expandedId) visibleNodes.add(t);
                if (t === expandedId) visibleNodes.add(s);
            });
        });

        const activeNodes = fullData.nodes.filter(n => visibleNodes.has(n.id));
        const activeLinks = fullData.links.filter(l => {
            const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
            const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
            return visibleNodes.has(s) && visibleNodes.has(t);
        });

        return { nodes: activeNodes, links: activeLinks };
    };

    const [graphData, setGraphData] = useState(getFilteredData());

    useEffect(() => {
        setGraphData(getFilteredData());
    }, [expandedNodes, language]); // Re-calc when expansion changes

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
                    height: mobile ? window.innerHeight * 0.8 : 600 // Taller on mobile
                });
            }
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        if (fgRef.current) {
            fgRef.current.d3Force('charge').strength(isMobile ? -250 : -200); // Stronger repulsion on mobile
            fgRef.current.d3Force('link').distance(isMobile ? 100 : 80); // Longer links on mobile
        }
    }, [containerSize, isMobile]);

    const handleNodeClick = (node: any) => {
        const brainNode = node as BrainNode;

        // Toggle expansion
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(node.id)) {
            newExpanded.delete(node.id); // Collapse
        } else {
            newExpanded.add(node.id); // Expand
        }
        setExpandedNodes(newExpanded);

        // Center on cliick
        fgRef.current?.centerAt(node.x, node.y, 1000);
        fgRef.current?.zoom(2, 1000);

        if (brainNode.link && !newExpanded.has(node.id)) { // Navigate only if essentially leaf or user intent
            // For this demo, navigate if it's a leaf or specific link
            // Let's just allow nav if it has a link and we didn't just expand valid children
            // Simplify: Double click to nav? Or just link icon? 
            // For now: Always navigate if link exists, but maybe we want to expand first?
            // Let's settle on: Click expands. If already expanded or leaf, navigate?
            // Actually, simplest is: Click expands. If has link, show a small popup or just nav after delay?
            // Let's stick to simple nav for now, but expansion creates nodes.
            if (brainNode.link) {
                setTimeout(() => {
                    navigate(brainNode.link!);
                }, 1500);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="brain-map-container"
            style={{
                width: '100%',
                background: '#F5F5F4', // Slightly darker beige/grey
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
                graphData={graphData}
                width={containerSize.width}
                height={containerSize.height}
                backgroundColor="rgba(0,0,0,0)"
                nodeLabel={() => ''}

                nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

                    const isCenter = node.id === 'masa';
                    const scale = globalScale || 1;
                    const val = typeof node.val === 'number' ? node.val : 10;

                    // Larger nodes on mobile
                    const baseRadius = (isCenter ? 14 : Math.sqrt(val) * 2.5);
                    const radius = isMobile ? baseRadius * 1.5 : baseRadius;

                    const color = node.color || '#888888';

                    // 1. Connection lines (Custom drawing if needed, but default is fine)

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
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = 2 / scale;
                        ctx.stroke();
                    } else {
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                        ctx.fillStyle = color;
                        ctx.fill();

                        // Plus mark if expandable and collapsed?
                        // Simple solid circle for now
                    }

                    // 3. Draw Label
                    // Skip label for center node as per user request
                    if (isCenter) return;

                    const name = node.name || '';
                    // Slightly smaller font size
                    const baseFontSize = isMobile ? 12 : 10;
                    const fontSize = baseFontSize / scale;

                    ctx.font = `700 ${fontSize}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = '#333333';
                    const lines = name.split('\n');
                    lines.forEach((line: string, i: number) => {
                        ctx.fillText(line, node.x, node.y + radius + 4 / scale + (i * fontSize * 1.2));
                    });
                }}
                linkColor={() => '#CCCCCC'}
                linkWidth={2}
                onNodeClick={handleNodeClick}
                cooldownTicks={100}
                enableNodeDrag={!isMobile}
            />
            <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', pointerEvents: 'none' }}>
                <div style={{ color: '#555', fontSize: '12px', fontWeight: '600' }}>
                    Design 2: Focus & Depth (Click nodes to expand)
                </div>
            </div>
        </div>
    );
};

export default BrainMapFocus;
