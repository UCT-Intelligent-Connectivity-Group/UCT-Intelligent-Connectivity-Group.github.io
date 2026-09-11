import data from './research.json';
export const researchAreaIds = ['software-networks', 'network-intelligence', 'iot-systems', 'network-security'] as const;
export type ResearchAreaId = typeof researchAreaIds[number];
export interface ResearchDirection { id: ResearchAreaId; number: string; image: string; alt: string; title: string; titleZh: string; description: string; descriptionZh: string; lead: string; sources: { label: string; url: string }[]; }
export const researchDirections: ResearchDirection[] = data.directions.map(d => ({ ...d, id: d.id as ResearchAreaId, titleZh: d.title, descriptionZh: d.description }));
