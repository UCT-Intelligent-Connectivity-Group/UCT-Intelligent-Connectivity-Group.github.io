export interface AlumniMember {
  name: string;
  nameZh?: string;
  formerRole: string;
  formerRoleZh: string;
  year?: string;
  destination?: string;
  destinationZh?: string;
  homepage?: string;
}

export const alumni: AlumniMember[] = [];
