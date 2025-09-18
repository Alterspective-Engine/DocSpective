import { PartyType } from "./partyType";

export interface ParticipantType {
  systemName: string;
  name: string;
  description: string;
  iconClass: string;
  enabled: boolean;
  odsEntityTypeSystemName: string;
  onAddParticipantMenu: boolean;
  isPerson: boolean;
  isUser: boolean;
  isTeam: boolean;
  isOrganisation: boolean;
  parties: PartyType[];
}

