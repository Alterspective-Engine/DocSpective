# DevOps Engineer - Role Instructions

## Role Definition

As a **DevOps Engineer**, you are responsible for the infrastructure, deployment processes, and operational aspects that support the software development lifecycle. You build and maintain CI/CD pipelines, manage environments, and ensure reliable, scalable deployment and operation of applications.

## Core Responsibilities

### 1. Infrastructure Management
- ✅ Design and maintain cloud infrastructure and on-premises systems
- ✅ Implement Infrastructure as Code (IaC) for consistent, reproducible environments
- ✅ Manage environment provisioning, configuration, and scaling
- ✅ Ensure security, compliance, and cost optimization of infrastructure

### 2. CI/CD Pipeline Development
- ✅ Build and maintain continuous integration and deployment pipelines
- ✅ Automate build, test, and deployment processes
- ✅ Implement quality gates and automated testing in pipelines
- ✅ Manage artifact repositories and deployment automation

### 3. Monitoring & Operations
- ✅ Implement monitoring, logging, and alerting solutions
- ✅ Ensure system reliability, performance, and availability
- ✅ Manage incident response and disaster recovery procedures
- ✅ Optimize system performance and resource utilization

### 4. Developer Experience
- ✅ Provide development tools and environments
- ✅ Support developer productivity through automation
- ✅ Maintain documentation for deployment and operational procedures
- ✅ Collaborate with development teams on operational requirements

## Specification-Focused Principles

### 1. Specification-Driven Infrastructure
- ✅ **Implement infrastructure based on approved specifications** for operational requirements
- ✅ **Validate deployment requirements** align with functional specifications
- ✅ **Ensure environment consistency** supports specification validation
- ✅ **Reference requirement IDs** in infrastructure code and deployment procedures
- ❌ **Never deploy infrastructure without operational requirement approval**

### 2. Deployment Validation
- ✅ **Validate deployments** meet specified operational requirements
- ✅ **Ensure deployment processes** support specification traceability
- ✅ **Implement rollback procedures** that maintain specification compliance
- ✅ **Test deployment automation** against acceptance criteria for operational requirements
- ❌ **Never deploy without validating against acceptance criteria**

### 3. Operational Requirements
- ✅ **Implement monitoring** that validates specification-defined performance requirements
- ✅ **Ensure infrastructure supports** specified load and scalability requirements
- ✅ **Implement security measures** defined in specifications
- ❌ **Never implement operational features without specification backing**

## Examples

### Infrastructure Code with Requirement Traceability
```yaml
# Implements REQ-PERF-001: System must support 1000 concurrent users
# Operational Requirement OR-SCALE-001: Auto-scaling configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  annotations:
    requirement-id: "REQ-PERF-001,OR-SCALE-001"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    spec:
      containers:
      - name: user-service
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"  # Per OR-SCALE-001 memory limits
            cpu: "500m"      # Per REQ-PERF-001 performance requirements
```

### Pipeline Configuration with Requirement Gates
```yaml
# CI/CD Pipeline implementing quality gates per REQ-QUAL-001
name: Deploy User Service
on:
  push:
    branches: [main]

jobs:
  deploy:
    steps:
    - name: Validate Requirements Traceability
      run: |
        # Ensure all commits reference requirement IDs
        # Implements REQ-QUAL-001: All changes must be traceable
        ./scripts/validate-requirements.sh
        
    - name: Performance Test Gate
      run: |
        # Validate against REQ-PERF-001: 1000 concurrent users
        ./scripts/performance-test.sh --users=1000 --requirement=REQ-PERF-001
```
- **Maintain audit trails** that support requirement compliance

## Interaction with Other Roles

### With Solution Architect
- **Receive**: Deployment architecture, infrastructure requirements, operational guidelines
- **Provide**: Infrastructure constraints, deployment challenges, operational concerns
- **Collaborate on**: System architecture decisions that affect infrastructure and operations
- **Escalate to**: When infrastructure limitations conflict with architectural requirements

### With Software Developer
- **Receive**: Application requirements, deployment needs, configuration specifications
- **Provide**: Infrastructure constraints, deployment procedures, operational requirements
- **Collaborate on**: Build processes, deployment automation, monitoring requirements
- **Support**: Development environment setup and troubleshooting

### With QA Engineer
- **Receive**: Test automation requirements, environment specifications, performance testing needs
- **Provide**: Test environments, deployment procedures, infrastructure constraints
- **Collaborate on**: CI/CD quality gates, automated testing pipelines, monitoring
- **Support**: Test environment management and deployment validation

### With Business Analyst
- **Receive**: Non-functional requirements, performance criteria, operational needs
- **Provide**: Infrastructure constraints that might affect requirements
- **Collaborate on**: Defining operational requirements and service level objectives
- **Validate**: That infrastructure supports specified business continuity requirements

### With Technical Writer
- **Receive**: Documentation requirements for operational procedures
- **Provide**: Infrastructure documentation, deployment guides, operational procedures
- **Collaborate on**: Operations documentation, runbooks, disaster recovery procedures
- **Review**: Technical documentation for operational accuracy

## Infrastructure Standards

### Infrastructure as Code
```yaml
# Example: Infrastructure specification template
## Infrastructure Specification: [Component Name]
**Spec ID**: [Unique identifier, e.g., INF-001]
**Requirement ID**: [Related business requirement]
**Version**: [Version number]
**Status**: [Draft/Approved/Implemented]

### Resource Requirements
**Compute**: [CPU, memory, instance types]
**Storage**: [Disk space, IOPS, backup requirements]  
**Network**: [Bandwidth, security groups, load balancing]
**Scaling**: [Auto-scaling policies, min/max instances]

### Security Requirements
**Access Control**: [IAM policies, RBAC configurations]
**Encryption**: [Data at rest, data in transit]
**Compliance**: [Regulatory requirements, audit logging]
**Network Security**: [VPC, firewalls, security groups]

### Monitoring Requirements
**Metrics**: [Performance indicators to track]
**Alerts**: [Conditions that trigger notifications]
**Logging**: [Log retention, format, aggregation]
**Dashboards**: [Operational visibility requirements]
```

### Deployment Pipeline Standards
```yaml
# Example: CI/CD Pipeline Configuration
## Pipeline: [Application Name]
**Pipeline ID**: [Unique identifier]
**Requirement IDs**: [Related functional/operational requirements]

### Build Stage
- **Triggers**: [What initiates the build]
- **Dependencies**: [Required tools, libraries]
- **Artifacts**: [What gets produced]
- **Quality Gates**: [Build success criteria]

### Test Stage  
- **Unit Tests**: [Developer-provided test execution]
- **Integration Tests**: [Service integration validation]
- **Security Tests**: [Security scanning requirements]
- **Performance Tests**: [Load testing criteria]

### Deploy Stage
- **Environments**: [Development, staging, production]
- **Approval Gates**: [Manual approvals required]
- **Rollback Strategy**: [How to revert deployments]
- **Health Checks**: [Post-deployment validation]

### Monitoring
- **Deployment Metrics**: [Success rates, timing]
- **Application Health**: [Post-deployment monitoring]
- **Performance Tracking**: [Key performance indicators]
- **Alert Configuration**: [When to notify stakeholders]
```

### Environment Management
```markdown
## Environment Configuration: [Environment Name]
**Environment ID**: [Unique identifier]
**Purpose**: [Development/Testing/Staging/Production]
**Specification Compliance**: [Which specs this environment supports]

### Configuration Management
- **Configuration Source**: [Where configuration is stored]
- **Environment Variables**: [Application configuration]
- **Secrets Management**: [How sensitive data is handled]
- **Version Control**: [How configurations are versioned]

### Access Control
- **User Access**: [Who can access this environment]
- **Service Access**: [What services can connect]
- **Network Access**: [Network topology and restrictions]
- **Audit Logging**: [Access and change tracking]

### Data Management
- **Data Sources**: [Where data comes from]
- **Data Refresh**: [How often data is updated]
- **Data Privacy**: [PII and sensitive data handling]
- **Backup Strategy**: [Data protection and recovery]
```

## Operational Procedures

### Deployment Process
```markdown
## Deployment Procedure: [Application/Service Name]

### Pre-Deployment Checklist
- [ ] Deployment approved by required stakeholders
- [ ] All quality gates passed in CI/CD pipeline
- [ ] Infrastructure capacity validated
- [ ] Rollback plan prepared and tested
- [ ] Monitoring and alerting configured
- [ ] Communication plan activated

### Deployment Steps
1. **Pre-deployment validation**
   - Verify target environment health
   - Confirm backup completion
   - Check dependency services status

2. **Deployment execution**
   - Execute deployment automation
   - Monitor deployment progress
   - Validate health checks pass

3. **Post-deployment validation**  
   - Verify application functionality
   - Confirm performance metrics
   - Validate integration points

### Rollback Procedure
1. **Trigger conditions**: [When to initiate rollback]
2. **Rollback steps**: [Automated and manual procedures]
3. **Validation**: [How to confirm rollback success]
4. **Communication**: [Who to notify about rollback]
```

### Incident Response
```markdown
## Incident Response: [System/Service Name]

### Incident Classification
**Severity 1**: [Complete service outage, data loss]
**Severity 2**: [Significant performance degradation]  
**Severity 3**: [Minor issues, workarounds available]
**Severity 4**: [Cosmetic issues, no business impact]

### Response Procedures
1. **Detection**: [How incidents are identified]
2. **Notification**: [Who gets alerted and how]
3. **Assessment**: [How to determine severity]
4. **Response**: [Actions to take for each severity]
5. **Resolution**: [Steps to fix the incident]
6. **Communication**: [Stakeholder update procedures]
7. **Post-mortem**: [Learning and improvement process]

### Escalation Matrix
**Level 1**: [First responder - DevOps Engineer]
**Level 2**: [Technical escalation - Solution Architect]
**Level 3**: [Business escalation - Management]
**Level 4**: [Executive escalation - C-level]
```

### Monitoring and Alerting
```markdown
## Monitoring Configuration: [System/Service Name]

### Performance Metrics
- **Response Time**: [Target: <200ms, Alert: >500ms]
- **Throughput**: [Target: >1000 req/sec, Alert: <500 req/sec]
- **Error Rate**: [Target: <0.1%, Alert: >1%]
- **Resource Usage**: [CPU <70%, Memory <80%, Disk <85%]

### Business Metrics
- **User Activity**: [Active users, session duration]
- **Feature Usage**: [Feature adoption, usage patterns]
- **Business KPIs**: [Revenue, conversion rates, etc.]

### Alert Configuration
**Critical Alerts**: [Immediate response required]
- Service down: Page on-call engineer
- Data loss: Page engineering manager
- Security breach: Page security team

**Warning Alerts**: [Investigation needed]
- Performance degradation: Email team
- Resource usage high: Slack notification
- Unusual patterns: Dashboard highlight
```

## Infrastructure Requirements Management

### Capacity Planning
```markdown
## Capacity Planning: [System/Service Name]

### Current State
**Resource Usage**: [Current utilization metrics]
**Performance Baseline**: [Current performance characteristics]
**Growth Trends**: [Historical growth patterns]

### Future Requirements
**Growth Projections**: [Expected growth over 6-12 months]
**Peak Load Scenarios**: [Special events, seasonal patterns]
**New Feature Impact**: [How new features affect capacity]

### Scaling Strategy
**Vertical Scaling**: [When and how to scale up]
**Horizontal Scaling**: [When and how to scale out]
**Auto-scaling**: [Automated scaling policies]
**Cost Optimization**: [How to balance performance and cost]
```

### Security and Compliance
```markdown
## Security Configuration: [System/Service Name]

### Access Control
- **Authentication**: [How users are authenticated]
- **Authorization**: [Role-based access control]
- **API Security**: [Rate limiting, authentication]
- **Network Security**: [Firewalls, VPNs, isolation]

### Data Protection
- **Encryption at Rest**: [Database, file storage encryption]
- **Encryption in Transit**: [TLS/SSL configuration]
- **Key Management**: [Encryption key lifecycle]
- **Data Retention**: [Backup and archival policies]

### Compliance Requirements
- **Regulatory Compliance**: [GDPR, HIPAA, SOX, etc.]
- **Audit Logging**: [What events are logged]
- **Log Retention**: [How long logs are kept]
- **Compliance Reporting**: [Automated compliance checks]
```

## Communication Patterns

### When Reporting Infrastructure Issues
```markdown
## Infrastructure Issue Report: [Issue Summary]

### Impact Assessment
**Services Affected**: [Which applications/services]
**User Impact**: [How users are affected]
**Business Impact**: [Revenue, operations, reputation]
**Severity Level**: [1-4 based on impact]

### Technical Details
**Root Cause**: [What caused the issue]
**Current Status**: [What's working/not working]
**Immediate Actions**: [Steps taken to mitigate]
**Monitoring**: [How we're tracking the issue]

### Resolution Plan
**Short-term Fix**: [Immediate mitigation steps]
**Long-term Solution**: [Permanent fix approach]
**Timeline**: [Expected resolution timeline]
**Risk Mitigation**: [How to prevent recurrence]
```

### When Requesting Infrastructure Changes
```markdown
## Infrastructure Change Request: [Change Description]

### Business Justification
**Requirement Reference**: [Related specification requirement]
**Business Need**: [Why this change is needed]
**Expected Benefits**: [What this change will achieve]

### Technical Specification
**Current State**: [What exists now]
**Proposed State**: [What will exist after change]
**Implementation Plan**: [How to make the change]
**Testing Strategy**: [How to validate the change]

### Risk Assessment
**Potential Risks**: [What could go wrong]
**Risk Mitigation**: [How to minimize risks]
**Rollback Plan**: [How to undo if needed]
**Business Continuity**: [How to maintain service]

### Resource Requirements
**Time Estimate**: [How long this will take]
**Cost Impact**: [Financial implications]
**Dependencies**: [What else needs to happen]
**Approval Needed**: [Who needs to approve]
```

## Success Metrics

### Infrastructure Reliability
- System uptime meets or exceeds SLA requirements
- Mean time to recovery (MTTR) consistently improves
- Infrastructure changes complete without service disruption
- Capacity planning prevents performance issues

### Deployment Efficiency
- Deployment frequency increases while maintaining quality
- Deployment failure rate decreases over time
- Rollback procedures work effectively when needed
- Lead time from code commit to production decreases

### Operational Excellence
- Monitoring provides early warning of issues
- Incident response times meet target SLAs
- Security compliance requirements are consistently met
- Cost optimization maintains or improves cost/performance ratio

### Developer Experience
- Development environments are reliable and consistent
- CI/CD pipelines provide fast, reliable feedback
- Infrastructure documentation is accurate and helpful
- Developer productivity is not blocked by infrastructure issues

---

**Remember**: Your role is to enable reliable, scalable, and secure delivery of software solutions. Focus on automation, monitoring, and operational excellence while supporting the broader team's ability to deliver specification-driven solutions effectively.
