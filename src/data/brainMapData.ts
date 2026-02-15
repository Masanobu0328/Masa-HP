export interface BrainNode {
    id: string;
    name: string;
    val: number;
    color: string;
    group: string;
    link?: string;
    description?: string;
}

export interface BrainLink {
    source: string;
    target: string;
}

export interface BrainData {
    nodes: BrainNode[];
    links: BrainLink[];
}

const COLORS = {
    CORE: '#333333', // Ink Black
    AI: '#7C9082',   // Olive Sage
    PHYSIO: '#9BA8A0', // Lighter Sage
    BUSINESS: '#5C6B61', // Darker Sage
    LIFE: '#D1CEC7',    // Sand Beige
};

export const getBrainMapData = (lang: 'ja' | 'en'): BrainData => {
    const isEn = lang === 'en';
    const noteUrl = 'https://note.com/masa_aus_physio';

    return {
        nodes: [
            // Core
            {
                id: 'masa',
                name: isEn ? 'Masanobu Itoi' : '糸井 真伸\nMasanobu Itoi',
                val: 40,
                color: COLORS.CORE,
                group: 'core',
                description: isEn ? 'Physiotherapist / Entrepreneur / AI Specialist' : '理学療法士 / 起業家 / AI活用コンサルタント'
            },

            // AI & Technology
            { id: 'ai', name: isEn ? 'AI & Technology' : 'AI・テクノロジー', val: 18, color: COLORS.AI, group: 'ai', link: noteUrl },
            { id: 'ai-dev', name: isEn ? 'Development' : '技術開発', val: 12, color: COLORS.AI, group: 'ai', link: noteUrl },
            { id: 'ai-usage', name: isEn ? 'AI Usage' : 'AI活用術', val: 10, color: COLORS.AI, group: 'ai', link: noteUrl },
            { id: 'posture-tech', name: isEn ? 'Posture Estimation' : '姿勢推定', val: 10, color: COLORS.AI, group: 'ai', link: noteUrl },
            { id: 'ai-literacy', name: isEn ? 'AI Literacy' : 'AIリテラシー', val: 8, color: COLORS.AI, group: 'ai', link: noteUrl },

            // Physio & Health
            { id: 'physio', name: isEn ? 'Physio & Health' : '理学療法・健康', val: 18, color: COLORS.PHYSIO, group: 'physio', link: noteUrl },
            { id: 'gait-analysis', name: isEn ? 'Gait Analysis' : '歩行解析', val: 12, color: COLORS.PHYSIO, group: 'physio', link: noteUrl },
            { id: 'insole-tech', name: isEn ? 'Insole Tech' : 'インソール', val: 12, color: COLORS.PHYSIO, group: 'physio', link: noteUrl },
            { id: 'massage-therapy', name: isEn ? 'Massage' : 'マッサージ', val: 10, color: COLORS.PHYSIO, group: 'physio', link: noteUrl },
            { id: 'education', name: isEn ? 'Therapist Education' : 'セラピスト教育', val: 10, color: COLORS.PHYSIO, group: 'physio', link: noteUrl },

            // Business
            { id: 'business', name: isEn ? 'Business' : 'ビジネス・起業', val: 15, color: COLORS.BUSINESS, group: 'business', link: noteUrl },
            { id: 'entrepreneurship', name: isEn ? 'Entrepreneurship' : '起業・経営', val: 10, color: COLORS.BUSINESS, group: 'business', link: noteUrl },
            { id: 'consulting', name: isEn ? 'Consulting' : 'コンサルティング', val: 10, color: COLORS.BUSINESS, group: 'business', link: noteUrl },
            { id: 'marketing', name: isEn ? 'Marketing' : 'マーケティング', val: 8, color: COLORS.BUSINESS, group: 'business', link: noteUrl },

            // Lifestyle
            { id: 'lifestyle', name: isEn ? 'Mindset & Life' : 'マインドセット・生活', val: 15, color: COLORS.LIFE, group: 'life', link: noteUrl },
            { id: 'australia', name: isEn ? 'Life in Australia' : '海外生活', val: 10, color: COLORS.LIFE, group: 'life', link: noteUrl },
            { id: 'nature', name: isEn ? 'Nature & Outdoor' : '自然・アウトドア', val: 8, color: COLORS.LIFE, group: 'life', link: noteUrl },
            { id: 'mindset', name: isEn ? 'Mindset' : 'マインドセット', val: 10, color: COLORS.LIFE, group: 'life', link: noteUrl },
        ],
        links: [
            { source: 'masa', target: 'ai' },
            { source: 'masa', target: 'physio' },
            { source: 'masa', target: 'business' },
            { source: 'masa', target: 'lifestyle' },
            { source: 'ai', target: 'ai-dev' },
            { source: 'ai', target: 'ai-usage' },
            { source: 'ai', target: 'posture-tech' },
            { source: 'ai', target: 'ai-literacy' },
            { source: 'physio', target: 'gait-analysis' },
            { source: 'physio', target: 'insole-tech' },
            { source: 'physio', target: 'massage-therapy' },
            { source: 'physio', target: 'education' },
            { source: 'business', target: 'entrepreneurship' },
            { source: 'business', target: 'consulting' },
            { source: 'business', target: 'marketing' },
            { source: 'lifestyle', target: 'australia' },
            { source: 'lifestyle', target: 'nature' },
            { source: 'lifestyle', target: 'mindset' },
            { source: 'ai-dev', target: 'insole-tech' },
            { source: 'posture-tech', target: 'gait-analysis' },
            { source: 'education', target: 'business' },
            { source: 'australia', target: 'entrepreneurship' },
        ]
    };
};
