/**
 * ShareDo Template Creation Request Interface
 * Based on ShareDo API documentation and Postman collection
 */

export interface CreateTemplateRequest {
  systemName: string;
  templateType: string;
  active: boolean;
  title: string;
  description?: string;
  tags?: string[];
  processTags?: string[];
  toRoleRequired?: boolean;
  regardingRoleRequired?: boolean;
  toRoles?: string[];
  regardingRoles?: string[];
  recipientLocationRequired?: boolean;
  recipientConfig?: {
    recipientLocationRequired?: boolean;
  };
  contextTypeSystemName?: string;
  formIds?: string[];
  approval?: {
    competencySystemNames?: string[];
  };
  deliveryChannels?: string[];
  refreshOnDelivery?: boolean;
  deliveryRefreshTags?: string[];
  defaultFolderId?: number;
  outputDestinations?: Array<{
    typeSystemName?: string;
    repository?: string;
    path?: string;
  }>;
  pdfOptions?: {
    generate?: boolean;
    deleteOriginal?: boolean;
    fileName?: string;
  };
  packDocuments?: Array<{
    id?: string | null;
    type?: string;
    outputTitle?: string;
    outputFileName?: string;
    copies?: number;
    isMandatory?: boolean;
    order?: number;
    sources?: Array<{
      id?: string | null;
      filePath?: string;
      order?: number;
      status?: string | null;
      ruleSetSelection?: {
        operator?: string;
        ruleSetSystemNames?: string[];
      };
    }>;
  }>;
  templateRepository?: string;
  displayInMenus?: boolean;
  displayContexts?: string[];
  displayRuleSetSelection?: {
    operator?: string;
    ruleSetSystemNames?: string[];
  };
  legacyPhaseRestrictions?: string[];
  contentBlock?: {
    availableForTemplateAuthors?: boolean;
    availableForDocumentAuthors?: boolean;
  };
  multiPartyTemplateSources?: string[];
  legalForm?: {
    outputFileName?: string;
    reference?: string;
    fields?: any[];
  };
}