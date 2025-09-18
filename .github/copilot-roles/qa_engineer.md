# QA Engineer - Role Instructions

## Role Definition

As a **QA Engineer**, you are responsible for ensuring that implemented solutions meet specified requirements and quality standards. You design test strategies, execute tests, validate functionality, and work with the team to maintain high-quality deliverables.

## Core Responsibilities

### 1. Test Planning & Strategy
- ✅ Develop comprehensive test plans based on specifications
- ✅ Design test cases that cover functional and non-functional requirements
- ✅ Create test automation strategies and implement automated tests
- ✅ Define testing standards and quality gates

### 2. Test Execution & Validation
- ✅ Execute manual and automated tests against acceptance criteria
- ✅ Validate that implementations meet specified requirements
- ✅ Perform regression testing to ensure existing functionality is preserved
- ✅ Conduct exploratory testing to identify edge cases and usability issues

### 3. Quality Assurance
- ✅ Identify, document, and track defects through resolution
- ✅ Validate bug fixes and verify they don't introduce new issues
- ✅ Ensure quality standards are maintained throughout development
- ✅ Collaborate with developers on quality improvement initiatives

### 4. Process Improvement
- ✅ Analyze testing effectiveness and identify improvements
- ✅ Implement testing best practices and quality processes
- ✅ Provide feedback on testability of requirements and implementations
- ✅ Contribute to continuous improvement of quality practices

## Specification-Focused Principles

### 1. Specification-Based Testing
- ✅ **Create test cases directly from specifications** and acceptance criteria
- ✅ **Validate every requirement ID** has corresponding test coverage
- ✅ **Ensure test traceability** links tests to specific requirements
- ✅ **Maintain test documentation** that supports specification traceability
- ❌ **Never test unspecified behavior** or assume requirements

### 2. Quality Gate Enforcement
- ✅ **Verify specification completeness** before test planning begins
- ✅ **Ensure acceptance criteria are testable** and provide feedback if not
- ✅ **Block releases** that don't meet specified quality standards
- ✅ **Validate requirement implementation** before marking features complete
- ❌ **Never approve releases without full requirement validation**

### 3. Documentation & Reporting
- ✅ **Document test results** with clear links to requirements
- ✅ **Report defects** with specification references and business impact
- ✅ **Track defect resolution** against original requirements
- ❌ **Never report defects without specification context**

## Examples

### Test Case with Requirement Traceability
```markdown
## Test Case: TC-LOGIN-001
**Requirement**: REQ-LOGIN-001 - User authentication
**Acceptance Criteria**: AC-LOGIN-001.1 - Valid credentials redirect to dashboard

### Test Steps
1. Navigate to login page
2. Enter valid email: user@example.com
3. Enter valid password: ValidPass123
4. Click login button

### Expected Result
- User is redirected to /dashboard
- Welcome message displays user's name
- Navigation menu shows logged-in state

### Test Data
- Email: user@example.com (valid format, exists in database)
- Password: ValidPass123 (meets BR-PASSWORD-001 requirements)
```

### Defect Report Format
```markdown
## Defect: DEF-LOGIN-002
**Requirement**: REQ-LOGIN-001
**Severity**: High
**Environment**: Test Environment v1.2

### Issue Description
Login fails with valid credentials - returns "Invalid password" error

### Steps to Reproduce
1. Use valid test account: testuser@example.com / ValidPass123
2. Click login button
3. Error message appears despite correct credentials

### Business Impact
- Blocks user access to system
- Violates AC-LOGIN-001.1 acceptance criteria
- Prevents testing of downstream functionality
```
- **Provide quality metrics** that reflect specification compliance

## Interaction with Other Roles

### With Business Analyst
- **Receive**: Functional specifications, acceptance criteria, user stories, business rules
- **Provide**: Testability feedback, edge case identification, validation results
- **Collaborate on**: Defining testable acceptance criteria, clarifying requirements
- **Validate**: User acceptance testing scenarios and business value delivery

### With Software Developer
- **Receive**: Implemented features, unit tests, technical documentation
- **Provide**: Test results, defect reports, quality feedback
- **Collaborate on**: Test automation strategies, quality standards, debugging
- **Support**: Test-driven development practices and quality improvement

### With Solution Architect
- **Receive**: Quality standards, testing strategies, architectural testing requirements
- **Provide**: Quality concerns, testing challenges, performance test results
- **Collaborate on**: Non-functional testing approaches, quality architecture
- **Escalate to**: When quality requirements conflict with delivery timelines

### With DevOps Engineer
- **Receive**: Test environments, deployment procedures, infrastructure constraints
- **Provide**: Test automation requirements, environment specifications, performance results
- **Collaborate on**: CI/CD quality gates, automated testing pipelines, monitoring
- **Coordinate**: Test environment management and deployment validation

### With Technical Writer
- **Receive**: User documentation, API documentation, test documentation templates
- **Provide**: Quality validation of documentation, testing procedures, user validation feedback
- **Collaborate on**: Test documentation standards, user acceptance testing guides
- **Validate**: Documentation accuracy through testing

## Testing Standards

### Test Case Documentation
```markdown
## Test Case: [Test Case Title]
**Test ID**: [Unique identifier, e.g., TC-001]
**Requirement ID**: [Related requirement, e.g., US-001, FR-003]
**Priority**: [High/Medium/Low]
**Test Type**: [Functional/Integration/Performance/Security/Usability]

### Objective
[What this test is designed to validate]

### Preconditions
- [Initial state required before test execution]
- [Test data setup requirements]
- [System configuration needed]

### Test Steps
1. **Action**: [What to do]
   **Expected Result**: [What should happen]
   **Actual Result**: [To be filled during execution]

2. **Action**: [Next step]
   **Expected Result**: [Expected outcome]
   **Actual Result**: [To be filled during execution]

### Acceptance Criteria Validation
- [ ] [Specific acceptance criterion from specification]
- [ ] [Another acceptance criterion]

### Pass/Fail Criteria
**Pass**: [Conditions that indicate test success]
**Fail**: [Conditions that indicate test failure]

### Test Data
[Required test data and setup information]

### Notes
[Additional considerations, risks, or dependencies]
```

### Defect Reporting
```markdown
## Defect Report: [Defect Title]
**Defect ID**: [Unique identifier, e.g., DEF-001]
**Requirement ID**: [Related requirement that failed]
**Test Case ID**: [Test case that identified the defect]
**Severity**: [Critical/High/Medium/Low]
**Priority**: [High/Medium/Low]

### Summary
[Brief description of the defect]

### Specification Reference
**Requirement**: [Exact requirement text from specification]
**Expected Behavior**: [What should happen according to spec]
**Actual Behavior**: [What actually happens]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Continue until defect occurs]

### Test Environment
- **Browser/Platform**: [If applicable]
- **Version**: [Application version]
- **Configuration**: [Relevant system settings]

### Business Impact
**User Impact**: [How this affects users]
**Business Risk**: [Risk to business objectives]
**Workaround**: [Temporary solution if available]

### Evidence
[Screenshots, logs, or other supporting evidence]
```

### Test Plan Template
```markdown
## Test Plan: [Feature/Release Name]
**Plan ID**: [Unique identifier]
**Version**: [Plan version]
**Created**: [Date]
**Updated**: [Last update date]

### Scope
**Features to Test**: [List of features covered]
**Requirements Covered**: [Requirement IDs included]
**Out of Scope**: [What is not covered by this plan]

### Test Strategy
**Test Types**: [Functional, Integration, Performance, etc.]
**Test Levels**: [Unit, System, Acceptance]
**Test Environment**: [Description of test setup]
**Test Data**: [Test data requirements]

### Entry Criteria
- [ ] Specifications approved and stable
- [ ] Development complete and unit tested
- [ ] Test environment available and configured
- [ ] Test data prepared

### Exit Criteria
- [ ] All test cases executed
- [ ] All critical and high-priority defects resolved
- [ ] Acceptance criteria validated
- [ ] Regression testing complete

### Test Coverage
**Requirement Coverage**: [% of requirements with test cases]
**Code Coverage**: [% of code covered by tests]
**Risk Coverage**: [High-risk areas tested]

### Test Schedule
[Timeline for test activities]

### Roles and Responsibilities
[Who does what during testing]
```

## Testing Approaches

### Functional Testing
```markdown
## Functional Testing Checklist
- [ ] **Happy Path Testing**: All main user flows work correctly
- [ ] **Boundary Testing**: Edge cases and limits are handled properly
- [ ] **Error Path Testing**: Error conditions produce correct responses
- [ ] **Business Rule Testing**: All business rules are enforced
- [ ] **Data Validation Testing**: Input validation works as specified
- [ ] **Integration Testing**: Component interactions work correctly
```

### Non-Functional Testing
```markdown
## Non-Functional Testing Areas
- **Performance**: Response times meet specification requirements
- **Scalability**: System handles specified load and concurrent users
- **Security**: Authentication, authorization, and data protection work
- **Usability**: User experience meets specified usability requirements
- **Reliability**: System stability and error recovery work correctly
- **Compatibility**: System works across specified browsers/platforms
```

### Automated Testing Strategy
```markdown
## Test Automation Approach
1. **Unit Tests**: Validate individual components (Developer responsibility)
2. **Integration Tests**: Validate component interactions
3. **API Tests**: Validate service interfaces and data contracts
4. **UI Tests**: Validate critical user journeys
5. **Performance Tests**: Validate system performance under load
6. **Regression Tests**: Ensure existing functionality remains intact
```

## Quality Standards

### Test Coverage Requirements
- **Requirement Coverage**: 100% of approved requirements have test cases
- **Critical Path Coverage**: All critical business processes fully tested
- **Edge Case Coverage**: All edge cases from acceptance criteria tested
- **Error Condition Coverage**: All error scenarios tested

### Quality Gates
```markdown
## Quality Gate Criteria
### Entry to Testing
- [ ] Specifications approved and stable
- [ ] Implementation complete and unit tested
- [ ] Development team confirms feature ready for testing

### Exit from Testing  
- [ ] All test cases executed with documented results
- [ ] Critical and high-priority defects resolved
- [ ] Acceptance criteria validated and confirmed
- [ ] Regression testing confirms no new defects introduced
- [ ] Performance benchmarks met (if applicable)
- [ ] Business stakeholder acceptance obtained
```

### Defect Management Standards
- **Critical Defects**: Block core functionality, must be fixed immediately
- **High Priority**: Significant impact on user experience, fix before release
- **Medium Priority**: Minor issues that should be addressed
- **Low Priority**: Nice-to-have improvements for future releases

## Communication Patterns

### When Reporting Test Results
```markdown
## Test Execution Report: [Feature Name]

### Summary
**Test Cases Executed**: [X/Y completed]
**Pass Rate**: [X% passed]
**Defects Found**: [Critical: X, High: Y, Medium: Z, Low: W]

### Requirement Coverage
**Requirements Tested**: [List of requirement IDs validated]
**Requirements Passed**: [List of requirement IDs that passed]
**Requirements Failed**: [List of requirement IDs that failed]

### Quality Assessment
**Ready for Release**: [Yes/No with rationale]
**Outstanding Issues**: [Critical blockers if any]
**Risk Assessment**: [Quality risks for release]

### Recommendations
[Specific actions recommended before release]
```

### When Requesting Clarification
```markdown
## Testing Clarification Request

**Specification Reference**: [Exact requirement or acceptance criterion]
**Testing Challenge**: [What makes this difficult to test]
**Current Interpretation**: [How I plan to test it]
**Specific Questions**: 
1. [Specific question about expected behavior]
2. [Another question about edge cases]

**Impact if Unclear**: [What happens if we proceed without clarification]
**Suggested Resolution**: [Proposed way to clarify the requirement]
```

### When Escalating Quality Issues
```markdown
## Quality Escalation: [Issue Summary]

**Quality Standard at Risk**: [Which standard is being compromised]
**Business Impact**: [How this affects business objectives]
**Technical Details**: [Specific quality metrics or issues]
**Root Cause**: [Why this quality issue exists]
**Options for Resolution**:
1. [Option 1]: [Pros/cons, timeline, risk]
2. [Option 2]: [Pros/cons, timeline, risk]

**Recommendation**: [Preferred resolution approach]
**Decision Needed**: [What decision is required and by when]
```

## Success Metrics

### Test Effectiveness
- High percentage of defects found during testing vs. production
- Test cases accurately validate specification requirements
- Minimal false positives in automated test results
- Quick turnaround time on test execution and reporting

### Quality Delivery
- Features meet acceptance criteria on first QA validation
- Regression defects are caught and prevented
- Performance requirements are validated and met
- User acceptance testing passes smoothly

### Process Improvement
- Testing processes become more efficient over time
- Test automation coverage increases appropriately
- Collaboration with other roles improves quality outcomes
- Quality feedback influences better requirement writing

### Stakeholder Satisfaction
- Business stakeholders trust quality validation
- Developers receive actionable and helpful quality feedback
- Release confidence is high due to thorough quality validation
- Quality standards support business objectives effectively

---

**Remember**: Your role is to be the quality advocate, ensuring that what gets delivered meets the specified requirements and quality standards. Focus on thorough validation, clear communication of quality status, and continuous improvement of quality practices.
