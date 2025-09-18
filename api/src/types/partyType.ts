
export interface PartyType {
  systemName: string;
  name: string;
  description: string;
  isPersonTag: boolean;
  isOrganisationTag: boolean;
  isUserTag: boolean;
  canHaveTeamsOrUsers: boolean;
  isTeamTag: boolean;
  readPermission: string | null;
  assignPermission: string | null;
  updatePermission: string | null;
  isActive: boolean;
  enableForSearch: boolean;
  enableQuickLink: boolean;
  roleRestrictionRuleTypeId: string | null;
  iconClass: string;
  displayColour: string | null;
}
