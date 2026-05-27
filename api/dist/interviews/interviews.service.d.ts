import { PrismaService } from '../prisma/prisma.service';
import { InterviewType } from '@prisma/client';
export declare class CreateInterviewRoomDto {
    title: string;
    type: InterviewType;
    scheduledAt?: string;
    hasVideo?: boolean;
    hasWhiteboard?: boolean;
    hasCodeEditor?: boolean;
    recordingEnabled?: boolean;
    candidateId?: string;
    interviewerId?: string;
}
export declare class ScorecardDto {
    technicalScore: number;
    communicationScore: number;
    problemSolving: number;
    cultureFit: number;
    notes?: string;
    recommendation?: string;
}
export declare class InterviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    createRoom(creatorId: string, dto: CreateInterviewRoomDto): Promise<{
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
    endRoom(userId: string, roomId: string): Promise<{
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
    saveScorecard(roomId: string, dto: ScorecardDto): Promise<{
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
    getRecordings(roomId: string): Promise<{
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
    getRooms(filters: {
        isLive?: boolean;
        type?: InterviewType;
        page?: number;
        limit?: number;
    }): Promise<{
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
}
