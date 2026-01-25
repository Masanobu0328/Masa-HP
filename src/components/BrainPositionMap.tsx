import React, { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Cpu, Heart, Briefcase, Plane, Brain, Zap, Activity, Globe, MessageCircle } from 'lucide-react';
import { getBrainMapData } from '../data/brainMapData';

interface BrainPositionMapProps {
    category: string;
    tags: string[];
}

const BrainPositionMap: React.FC<BrainPositionMapProps> = ({ category, tags }) => {
    const { language } = useLanguage();
    const [pathNodes, setPathNodes] = useState<any[]>([]);

    const brainData = useMemo(() => getBrainMapData('ja'), []); // Always use Japanese for internal matching or consistent display

    useEffect(() => {
        // 1. Identify Main Category Node
        let mainNodeId = '';
        if (category.includes('AI') || category.includes('テクノロジー')) mainNodeId = 'ai';
        else if (category.includes('理学療法') || category.includes('健康')) mainNodeId = 'physio';
        else if (category.includes('ビジネス') || category.includes('起業')) mainNodeId = 'business';
        else if (category.includes('マインドセット') || category.includes('生活')) mainNodeId = 'lifestyle';

        if (!mainNodeId) return;

        // 2. Identify Sub Node from Tags
        // Find a node in brainData that (a) belongs to the main group and (b) matches one of the tags
        let subNodeId = '';
        const groupNodes = brainData.nodes.filter(n => n.group === mainNodeId);

        // Try to find a tag that matches a node name partially
        for (const tag of tags || []) {
            const match = groupNodes.find(n => n.name.includes(tag) || tag.includes(n.name));
            if (match) {
                subNodeId = match.id;
                break;
            }
        }

        // If no direct tag match, pick the first child node as fallback or generic "Others"
        if (!subNodeId && groupNodes.length > 0) {
            // Priority filtering for better defaults
            if (mainNodeId === 'ai') subNodeId = 'ai-usage';
            else if (mainNodeId === 'physio') subNodeId = 'education';
            else if (mainNodeId === 'business') subNodeId = 'marketing';
            else if (mainNodeId === 'lifestyle') subNodeId = 'mindset';
        }

        // 3. Construct Path Data
        const center = { id: 'masa', label: 'Masa', x: 50, y: 60, color: '#333', level: 0 };
        const main = {
            id: mainNodeId,
            label: getMainLabel(mainNodeId),
            x: 180,
            y: 60,
            color: getMainColor(mainNodeId),
            level: 1,
            icon: getMainIcon(mainNodeId)
        };

        const subNodeData = brainData.nodes.find(n => n.id === subNodeId);
        const sub = {
            id: subNodeId,
            label: subNodeData ? subNodeData.name.replace('\n', '') : 'Details',
            x: 310,
            y: 60,
            color: getMainColor(mainNodeId), // Inherit color
            level: 2
        };

        setPathNodes([center, main, sub]);

    }, [category, tags, brainData]);

    const getMainColor = (id: string) => {
        switch (id) {
            case 'ai': return '#7C9082';
            case 'physio': return '#9BA8A0';
            case 'business': return '#5C6B61';
            case 'lifestyle': return '#D1CEC7';
            default: return '#888';
        }
    };

    const getMainLabel = (id: string) => {
        switch (id) {
            case 'ai': return 'AI & Tech';
            case 'physio': return 'Physio & Health';
            case 'business': return 'Business';
            case 'lifestyle': return 'Life & Mind';
            default: return '';
        }
    };

    const getMainIcon = (id: string) => {
        switch (id) {
            case 'ai': return <Cpu size={20} color="white" />;
            case 'physio': return <Heart size={20} color="white" />;
            case 'business': return <Briefcase size={20} color="white" />;
            case 'lifestyle': return <Plane size={20} color="white" />;
            default: return <Activity size={20} color="white" />;
        }
    };

    if (pathNodes.length < 3) return null;

    return (
        <div className="brain-position-map fade-in" style={{
            marginTop: '2rem',
            marginBottom: '3rem',
            padding: '2rem',
            backgroundColor: '#FAFAF9',
            borderRadius: '16px',
            border: '1px solid #F0F0F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{
                fontSize: '0.8rem',
                color: '#888',
                marginBottom: '1.5rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <Brain size={14} />
                <span>Brain Context Path</span>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '120px' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 120" style={{ overflow: 'visible' }}>

                    {/* Connecting Lines */}
                    <line x1={pathNodes[0].x} y1={pathNodes[0].y} x2={pathNodes[1].x} y2={pathNodes[1].y} stroke="#DDD" strokeWidth="2" strokeDasharray="4,4" />
                    <line x1={pathNodes[1].x} y1={pathNodes[1].y} x2={pathNodes[2].x} y2={pathNodes[2].y} stroke={pathNodes[1].color} strokeWidth="3" />

                    {/* Nodes */}
                    {pathNodes.map((node, i) => (
                        <g key={node.id}>
                            {/* Pulse for Leaf Node */}
                            {i === 2 && (
                                <circle cx={node.x} cy={node.y} r={28} fill={node.color} opacity="0.2">
                                    <animate attributeName="r" from="28" to="40" dur="1.5s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                            )}

                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={i === 0 ? 24 : (i === 1 ? 28 : 6)}
                                fill={i === 2 ? node.color : 'white'}
                                stroke={node.color}
                                strokeWidth={2}
                            />

                            {/* Center Image */}
                            {i === 0 && (
                                <image
                                    href="/profile.jpg"
                                    x={node.x - 24}
                                    y={node.y - 24}
                                    height="48"
                                    width="48"
                                    style={{ clipPath: 'circle(50%)' }}
                                />
                            )}

                            {/* Main Icon */}
                            {i === 1 && (
                                <g transform={`translate(${node.x - 10}, ${node.y - 10})`}>
                                    {node.icon}
                                </g>
                            )}

                            {/* Sub Node Dot */}
                            {i === 2 && (
                                <circle cx={node.x} cy={node.y} r={6} fill="white" />
                            )}

                            {/* Labels */}
                            <text
                                x={node.x}
                                y={node.y - (i === 2 ? 20 : 35)}
                                textAnchor="middle"
                                fill="#555"
                                style={{
                                    fontSize: i === 2 ? '14px' : '11px',
                                    fontWeight: i === 2 ? 700 : 500,
                                    fontFamily: 'var(--font-heading)'
                                }}
                            >
                                {node.label}
                            </text>

                            {/* Level Indicator for Sub Node */}
                            {i === 2 && (
                                <text
                                    x={node.x}
                                    y={node.y + 25}
                                    textAnchor="middle"
                                    fill={node.color}
                                    style={{
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        letterSpacing: '0.1em'
                                    }}
                                >
                                    CURRENT TOPIC
                                </text>
                            )}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default BrainPositionMap;
