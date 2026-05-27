import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    careerPlan(body: {
        targetRole: string;
        targetCompany: string;
        weakSkills: string[];
        currentScore: number;
    }): Promise<any>;
    dailyMissions(req: any, body: {
        weakSkills: string[];
        streak: number;
    }): Promise<any>;
    schedule(body: {
        freeTime: string;
        collegeTime: string;
        sleepTime: string;
        targetRole: string;
    }): Promise<any>;
    lessonPlan(body: {
        topic: string;
        duration: string;
        audience: string;
    }): Promise<any>;
    generateQuestions(body: {
        topic: string;
        difficulty: string;
        type: string;
        count: number;
    }): Promise<any>;
    companyPrep(body: {
        company: string;
        role: string;
        currentSkills: string[];
    }): Promise<any>;
    salaryInsights(body: {
        role: string;
        skills: string[];
        yearsOfExp: number;
    }): Promise<any>;
}
