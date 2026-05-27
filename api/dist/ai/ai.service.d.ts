export declare class AiService {
    private openai;
    constructor();
    private chat;
    generateCareerPlan(targetRole: string, targetCompany: string, weakSkills: string[], currentScore: number): Promise<any>;
    generateDailyMissions(role: string, weakSkills: string[], streak: number): Promise<any>;
    generateSchedule(freeTime: string, collegeTime: string, sleepTime: string, targetRole: string): Promise<any>;
    generateLessonPlan(topic: string, duration: string, audience: string): Promise<any>;
    generateQuestions(topic: string, difficulty: string, type: string, count: number): Promise<any>;
    companyPreparationPlan(company: string, role: string, currentSkills: string[]): Promise<any>;
    analyzeSalaryTrends(role: string, skills: string[], yearsOfExp: number): Promise<any>;
}
