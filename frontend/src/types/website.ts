import { Guide } from "./guide";

export type Website = {
    id: number;
    name: string;
    status?: string;
    fields?: string[];
    lastTestedAt?: Date | null;
    estimatedCaptchaCost?: number | null;
    estimatedProxyCost?: number | null;
    handledBy: string;
    guide?: Guide;
}