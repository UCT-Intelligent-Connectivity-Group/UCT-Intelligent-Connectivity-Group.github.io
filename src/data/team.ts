export interface TeamMember {
  slug: string;
  order: number;
  group: string;
  orcid?: string;
  name: string;
  nameZh?: string;
  publicationNames?: string[];
  role: string;
  roleZh: string;
  img: string;
  desc: string;
  descZh: string;
  email?: string;
  github?: string;
  x?: string;
  scholar?: string;
  homepage?: string;
  huggingface?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  wechat?: string;
  weibo?: string;
  bilibili?: string;
  honors: string[];
  honorsZh: string[];
  personal: string;
  personalZh: string;
}

const records = import.meta.glob('./members/*.json', { eager: true, import: 'default' });
export const team: TeamMember[] = Object.values(records)
  .map((record) => { const m = record as TeamMember & { draft?: boolean }; return { ...m, img: m.img || '/assets/logo/icg-icon.svg', roleZh: m.role, descZh: m.desc, honors: m.honors ?? [], honorsZh: m.honors ?? [], personal: m.personal ?? '', personalZh: m.personal ?? '' }; })
  .filter(m => !m.draft)
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
