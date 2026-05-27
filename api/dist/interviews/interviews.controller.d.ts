import { InterviewsService, CreateInterviewRoomDto, ScorecardDto } from './interviews.service';
import { InterviewType } from '@prisma/client';
export declare class InterviewsController {
    private readonly interviewsService;
    constructor(interviewsService: InterviewsService);
    createRoom(userId: string, dto: CreateInterviewRoomDto): Promise<{
        room: {
            participants: ({
                candidate: {
                    id: string;
                    email: string;
                    name: string;
                } | null;
                interviewer: {
                    id: string;
                    email: string;
                    name: string;
                } | null;
            } & {
                id: string;
                candidateId: string | null;
                interviewerId: string | null;
                panelRole: string | null;
                joinedAt: Date | null;
                leftAt: Date | null;
                tabSwitches: number;
                focusLossCount: number;
                copyPasteCount: number;
                suspiciousEvents: import("@prisma/client/runtime/library").JsonValue | null;
                roomId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InterviewType;
            title: string;
            integrityScore: number | null;
            scheduledAt: Date | null;
            hasVideo: boolean;
            hasWhiteboard: boolean;
            hasCodeEditor: boolean;
            recordingEnabled: boolean;
            startedAt: Date | null;
            endedAt: Date | null;
            isLive: boolean;
            roomCode: string;
        };
        message: string;
    }>;
    getRooms(isLive?: boolean, type?: InterviewType, page?: number, limit?: number): Promise<{
        rooms: ({
            _count: {
                recordings: number;
                scorecards: number;
            };
            participants: ({
                candidate: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                candidateId: string | null;
                interviewerId: string | null;
                panelRole: string | null;
                joinedAt: Date | null;
                leftAt: Date | null;
                tabSwitches: number;
                focusLossCount: number;
                copyPasteCount: number;
                suspiciousEvents: import("@prisma/client/runtime/library").JsonValue | null;
                roomId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InterviewType;
            title: string;
            integrityScore: number | null;
            scheduledAt: Date | null;
            hasVideo: boolean;
            hasWhiteboard: boolean;
            hasCodeEditor: boolean;
            recordingEnabled: boolean;
            startedAt: Date | null;
            endedAt: Date | null;
            isLive: boolean;
            roomCode: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getRoomById(id: string): Promise<{
        participants: ({
            candidate: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string | null;
            } | null;
            interviewer: {
                id: string;
                email: string;
                name: string;
                avatarUrl: string | null;
            } | null;
        } & {
            id: string;
            candidateId: string | null;
            interviewerId: string | null;
            panelRole: string | null;
            joinedAt: Date | null;
            leftAt: Date | null;
            tabSwitches: number;
            focusLossCount: number;
            copyPasteCount: number;
            suspiciousEvents: import("@prisma/client/runtime/library").JsonValue | null;
            roomId: string;
        })[];
        recordings: {
            id: string;
            createdAt: Date;
            duration: number | null;
            roomId: string;
            videoUrl: string | null;
            audioUrl: string | null;
            transcript: string | null;
        }[];
        scorecards: {
            id: string;
            createdAt: Date;
            communicationScore: number;
            overallScore: number;
            technicalScore: number;
            problemSolving: number;
            cultureFit: number;
            notes: string | null;
            recommendation: string | null;
            roomId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InterviewType;
        title: string;
        integrityScore: number | null;
        scheduledAt: Date | null;
        hasVideo: boolean;
        hasWhiteboard: boolean;
        hasCodeEditor: boolean;
        recordingEnabled: boolean;
        startedAt: Date | null;
        endedAt: Date | null;
        isLive: boolean;
        roomCode: string;
    }>;
    joinRoom(userId: string, roomCode: string): Promise<{
        room: {
            participants: ({
                candidate: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
                interviewer: {
                    id: string;
                    name: string;
                    avatarUrl: string | null;
                } | null;
            } & {
                id: string;
                candidateId: string | null;
                interviewerId: string | null;
                panelRole: string | null;
                joinedAt: Date | null;
                leftAt: Date | null;
                tabSwitches: number;
                focusLossCount: number;
                copyPasteCount: number;
                suspiciousEvents: import("@prisma/client/runtime/library").JsonValue | null;
                roomId: string;
            })[];
            scorecards: {
                id: string;
                createdAt: Date;
                communicationScore: number;
                overallScore: number;
                technicalScore: number;
                problemSolving: number;
                cultureFit: number;
                notes: string | null;
                recommendation: string | null;
                roomId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InterviewType;
            title: string;
            integrityScore: number | null;
            scheduledAt: Date | null;
            hasVideo: boolean;
            hasWhiteboard: boolean;
            hasCodeEditor: boolean;
            recordingEnabled: boolean;
            startedAt: Date | null;
            endedAt: Date | null;
            isLive: boolean;
            roomCode: string;
        };
    }>;
    endRoom(userId: string, id: string): Promise<{
        room: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InterviewType;
            title: string;
            integrityScore: number | null;
            scheduledAt: Date | null;
            hasVideo: boolean;
            hasWhiteboard: boolean;
            hasCodeEditor: boolean;
            recordingEnabled: boolean;
            startedAt: Date | null;
            endedAt: Date | null;
            isLive: boolean;
            roomCode: string;
        };
        message: string;
    }>;
    saveScorecard(id: string, dto: ScorecardDto): Promise<{
        scorecard: {
            id: string;
            createdAt: Date;
            communicationScore: number;
            overallScore: number;
            technicalScore: number;
            problemSolving: number;
            cultureFit: number;
            notes: string | null;
            recommendation: string | null;
            roomId: string;
        };
        message: string;
    }>;
    getRecordings(id: string): Promise<{
        recordings: {
            id: string;
            createdAt: Date;
            duration: number | null;
            roomId: string;
            videoUrl: string | null;
            audioUrl: string | null;
            transcript: string | null;
        }[];
    }>;
}
