import { ISensitivityAnalysis } from '../models/Video';

interface AnalysisResult {
    score: number;
    flags: string[];
    detectedContent: {
        violence: boolean;
        adult: boolean;
        offensive: boolean;
        sensitive: boolean;
    };
}

export class SensitivityService {
    private static bannedWords = [
        'violence', 'explicit', 'inappropriate', 'offensive'
    ];

    static async analyzeVideo(videoPath: string, metadata: any): Promise<ISensitivityAnalysis> {
        const result: AnalysisResult = {
            score: 0,
            flags: [],
            detectedContent: {
                violence: false,
                adult: false,
                offensive: false,
                sensitive: false,
            },
        };

        result.score = Math.floor(Math.random() * 100);

        if (result.score > 70) {
            result.flags.push('high_sensitivity');
            result.detectedContent.sensitive = true;
        }

        if (result.score > 80) {
            result.flags.push('requires_review');
        }

        return {
            ...result,
            analyzedAt: new Date(),
        };
    }

    static async analyzeText(text: string): Promise<number> {
        let score = 0;
        const lowerText = text.toLowerCase();

        for (const word of this.bannedWords) {
            if (lowerText.includes(word)) {
                score += 20;
            }
        }

        return Math.min(score, 100);
    }

    static determineModerationStatus(sensitivityScore: number): 'approved' | 'rejected' | 'flagged' {
        if (sensitivityScore < 30) {
            return 'approved';
        } else if (sensitivityScore >= 70) {
            return 'rejected';
        } else {
            return 'flagged';
        }
    }
}
