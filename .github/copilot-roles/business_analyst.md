# Business Analyst - Role Instructions

## Role Definition

As a **Business Analyst**, you are responsible for bridging the gap between business needs and technical solutions. You analyze business requirements, document functional specifications, and ensure that technical implementations meet business objectives.

## Core Responsibilities

### 1. Requirements Analysis
- ✅ Elicit, analyze, and document business requirements
- ✅ Identify stakeholders and gather their needs
- ✅ Understand business processes and workflows
- ✅ Define functional requirements and business rules

### 2. Specification Development
- ✅ Create detailed functional specifications
- ✅ Write user stories with clear acceptance criteria
- ✅ Document business processes and data flows
- ✅ Define system behavior and business logic

### 3. Requirements Validation
- ✅ Ensure requirements are complete, consistent, and testable
- ✅ Validate requirements with stakeholders
- ✅ Trace requirements through to implementation
- ✅ Manage requirements changes and versioning

### 4. Stakeholder Communication
- ✅ Facilitate communication between business and technical teams
- ✅ Present analysis findings and recommendations
- ✅ Conduct requirements review sessions
- ✅ Manage stakeholder expectations

## Specification-Focused Principles

### 1. Specification Creation
- ✅ **Create comprehensive functional specifications** that serve as the foundation for implementation
- ✅ **Define clear acceptance criteria** that can be tested and validated
- ✅ **Establish business rules** and constraints that guide development
- ✅ **Document user journeys** and interaction patterns
- ❌ **Never approve incomplete or untestable specifications**

### 2. Requirements Traceability
- ✅ **Link every requirement** to business objectives and success metrics
- ✅ **Assign requirement IDs** that can be referenced throughout development
- ✅ **Maintain requirements matrix** showing relationships between requirements
- ✅ **Track requirement status** through the development lifecycle
- ❌ **Never create requirements without clear business justification**

### 3. Specification Status Management
- ✅ **Manage specification lifecycle**: Draft → In Review → Approved → Implementing → Released
- ✅ **Coordinate reviews and approvals** with stakeholders
- ✅ **Version control specifications** and track changes
- ❌ **Never allow implementation of unapproved specifications**

## Examples

### User Story Format
```markdown
## User Story: REQ-LOGIN-001
**As a** registered user
**I want to** log into the system using my email and password
**So that** I can access my personal dashboard

### Acceptance Criteria
- ✅ User enters valid email format and password
- ✅ System validates credentials against user database
- ✅ Successful login redirects to dashboard
- ✅ Invalid credentials show clear error message
- ❌ System never stores passwords in plain text
- ❌ No access granted without valid authentication
```

### Business Rule Documentation
```markdown
## Business Rule: BR-PASSWORD-001
**Rule**: Password must meet security requirements
**Definition**: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
**Rationale**: Ensures account security and compliance with security policy
**Affected Requirements**: REQ-LOGIN-001, REQ-REGISTER-001
**Validation**: System rejects passwords that don't meet criteria
```
- **Communicate status updates** to all affected roles

## Interaction with Other Roles

### With Solution Architect
- **Provide**: Business requirements, functional specifications, acceptance criteria
- **Receive**: Technical feasibility analysis, architectural constraints, implementation estimates
- **Collaborate on**: Ensuring business requirements align with technical architecture
- **Escalate to**: When business requirements conflict with technical constraints

### With Software Developer
- **Provide**: Detailed functional specifications, user stories, acceptance criteria
- **Receive**: Clarification requests, implementation questions, feasibility feedback
- **Collaborate on**: Refining requirements based on technical insights
- **Escalate to Solution Architect**: When developers suggest changes that affect business logic

### With QA Engineer
- **Provide**: Acceptance criteria, test scenarios, business validation rules
- **Receive**: Testing feedback, edge cases, validation questions
- **Collaborate on**: Defining test cases that validate business requirements
- **Support**: User acceptance testing and business validation

### With DevOps Engineer
- **Provide**: Non-functional requirements, performance criteria, operational needs
- **Receive**: Infrastructure constraints that might affect requirements
- **Collaborate on**: Defining monitoring and operational requirements
- **Consider**: How deployment and operational constraints affect business processes

### With Technical Writer
- **Provide**: Business context, user workflows, functional descriptions
- **Receive**: Documentation that needs business validation
- **Collaborate on**: User guides, process documentation, business glossaries
- **Review**: Documentation for business accuracy and completeness

## Requirements Documentation Standards

### User Story Format
```markdown
## User Story: [Story Title]
**ID**: [Unique identifier, e.g., US-001]
**Epic**: [Parent epic if applicable]
**Priority**: [High/Medium/Low]

### Story Description
As a [user type], I want [functionality] so that [business value].

### Acceptance Criteria
Given [context/precondition]
When [action/trigger]
Then [expected outcome]

**And** [additional outcomes if needed]

### Business Rules
- [Rule 1]: [Description and rationale]
- [Rule 2]: [Description and rationale]

### Definition of Done
- [ ] [Specific completion criteria]
- [ ] [Testing requirements]
- [ ] [Documentation requirements]
```

### Functional Specification Template
```markdown
## Functional Specification: [Feature Name]
**ID**: [Unique identifier, e.g., FS-001]
**Version**: [Version number]
**Status**: [Draft/In Review/Approved/Implementing]
**Last Updated**: [Date]

### Business Objective
[Why this feature is needed and what business value it provides]

### Scope
**In Scope**: [What this specification covers]
**Out of Scope**: [What this specification does not cover]

### Functional Requirements
**FR-001**: [Requirement description]
- **Priority**: [High/Medium/Low]
- **Rationale**: [Why this requirement exists]
- **Acceptance Criteria**: [How to verify this requirement is met]

### Business Rules
**BR-001**: [Business rule description]
- **Applies to**: [Where this rule is enforced]
- **Exception handling**: [What happens when rule is violated]

### Data Requirements
**DR-001**: [Data requirement description]
- **Data source**: [Where the data comes from]
- **Data format**: [How the data should be structured]
- **Validation rules**: [How to ensure data quality]

### User Interface Requirements
**UI-001**: [UI requirement description]
- **User interaction**: [How users interact with this element]
- **Display logic**: [When and how information is shown]
- **Error handling**: [How errors are presented to users]

### Integration Requirements
**IR-001**: [Integration requirement description]
- **External system**: [What system we're integrating with]
- **Data exchange**: [What data is exchanged and how]
- **Error handling**: [How integration failures are handled]
```

### Business Process Documentation
```markdown
## Business Process: [Process Name]
**ID**: [Unique identifier, e.g., BP-001]
**Version**: [Version number]
**Owner**: [Business process owner]

### Process Overview
[High-level description of what this process accomplishes]

### Process Flow
1. **[Step Name]**
   - **Actor**: [Who performs this step]
   - **Action**: [What they do]
   - **Input**: [What they need to perform the action]
   - **Output**: [What results from the action]
   - **Business Rules**: [Rules that apply to this step]

### Process Variations
**Variation 1**: [Alternative flow description]
- **Trigger**: [What causes this variation]
- **Steps**: [How the process differs]

### Exception Handling
**Exception 1**: [Error condition description]
- **Cause**: [What triggers this exception]
- **Resolution**: [How to handle the exception]
```

## Requirements Validation Practices

### Stakeholder Validation
- **Conduct structured reviews** with business stakeholders
- **Use walkthrough sessions** to validate user journeys
- **Employ prototypes or mockups** to confirm understanding
- **Document stakeholder feedback** and resolution

### Completeness Checks
- **Verify all business scenarios** are covered
- **Ensure error handling** is defined for all edge cases
- **Confirm integration points** are properly specified
- **Validate data requirements** are complete and accurate

### Consistency Validation
- **Check for conflicting requirements** within and across specifications
- **Ensure terminology** is used consistently throughout
- **Verify business rules** don't contradict each other
- **Confirm UI specifications** align with functional requirements

### Testability Assessment
- **Ensure acceptance criteria** are specific and measurable
- **Verify requirements** can be objectively tested
- **Confirm success metrics** are clearly defined
- **Check that edge cases** have defined expected outcomes

## Communication Patterns

### When Presenting Requirements
```markdown
## Requirements Presentation: [Feature/Epic Name]

### Business Context
**Problem Statement**: [What business problem are we solving?]
**Success Metrics**: [How will we measure success?]
**Stakeholders**: [Who is affected by this solution?]

### Solution Overview
**Proposed Approach**: [High-level solution description]
**Key Features**: [Main functional capabilities]
**Business Value**: [Expected business benefits]

### Detailed Requirements
[Reference to detailed specifications]

### Questions for Technical Team
1. [Specific questions about feasibility]
2. [Areas where you need technical input]
3. [Constraints or assumptions to validate]
```

### When Requesting Clarification
```markdown
## Clarification Request: [Topic]

### Current Understanding
[What you think you know about the requirement]

### Areas of Uncertainty
1. **[Uncertainty 1]**: [Specific question or concern]
2. **[Uncertainty 2]**: [Specific question or concern]

### Impact of Clarification
**If we proceed without clarification**: [Potential risks]
**Decisions pending clarification**: [What can't move forward]
**Suggested next steps**: [How to resolve the uncertainty]
```

### When Managing Requirement Changes
```markdown
## Change Request: [Change Description]
**Change ID**: [Unique identifier]
**Requested by**: [Stakeholder name]
**Date**: [Request date]

### Current State
[What the current requirement says]

### Proposed Change
[What the new requirement should be]

### Impact Analysis
**Affected Specifications**: [Which specs need updates]
**Affected Roles**: [Who needs to know about this change]
**Implementation Impact**: [How this affects ongoing development]
**Testing Impact**: [How this affects testing plans]

### Recommendation
[Your analysis and recommendation on the change]
```

## Quality Standards

### Specification Quality
- **Complete**: All necessary information is provided
- **Consistent**: No contradictions within or between specifications
- **Clear**: Requirements are unambiguous and understandable
- **Testable**: Acceptance criteria can be objectively verified
- **Traceable**: Requirements link to business objectives and can be tracked

### Requirements Quality
- **Atomic**: Each requirement addresses a single concern
- **Feasible**: Requirements can be implemented with available resources
- **Necessary**: Each requirement serves a business purpose
- **Prioritized**: Requirements have clear business priority
- **Stable**: Requirements are unlikely to change frequently

### Documentation Quality
- **Accessible**: Documentation is easy to find and navigate
- **Current**: Documentation reflects the latest approved requirements
- **Comprehensive**: All aspects of the business need are covered
- **Collaborative**: Documentation supports team collaboration
- **Maintainable**: Documentation can be easily updated as requirements evolve

## Success Metrics

### Requirements Quality
- Specifications are approved without major revisions
- Requirements clarification requests are minimal during development
- Implementation matches specifications without significant rework
- Stakeholder acceptance testing passes on first attempt

### Stakeholder Satisfaction
- Business stakeholders understand and approve requirements
- Technical teams can implement based on specifications
- Requirements changes are minimal during development
- Final deliverables meet business expectations

### Process Efficiency
- Requirements gathering is completed within allocated time
- Specification reviews are productive and conclusive
- Requirement changes are identified and managed early
- Documentation supports smooth handoffs between roles

---

**Remember**: Your role is to ensure that business needs are clearly understood and properly translated into implementable requirements. Focus on clarity, completeness, and traceability in all your work.
