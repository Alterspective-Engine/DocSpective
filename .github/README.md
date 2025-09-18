# GitHub Copilot Instructions Framework

This repository includes a comprehensive instruction framework for GitHub Copilot that enables role-based, disciplined development practices following Spec-Driven Development (SDD) principles.

## Quick Start

1. **Read the main instructions**: Start with `.github/copilot-instructions.md`
2. **Configure required MCP servers** (see below)
3. **Begin any conversation by letting Copilot propose the appropriate role**

## Required MCP Server Configuration

To fully utilize this instruction framework, configure these MCP servers in VS Code:

### GitHub MCP Server

Required for issue management, repository operations, and workflow automation.

**How to install:**
1. Visit the [GitHub MCP Registry](https://github.com/mcp)
2. Find "GitHub MCP Server" in the available servers
3. Follow the installation instructions in the repository
4. Configure in your VS Code MCP settings

**Configuration:**
- The server uses GitHub's authentication
- May require GitHub personal access token with appropriate permissions

### Microsoft Playwright MCP

Required for browser automation and testing capabilities.

**How to install:**
1. Visit the [GitHub MCP Registry](https://github.com/mcp)
2. Find "Playwright MCP" in the available servers
3. Follow the installation instructions in the repository
4. Configure in your VS Code MCP settings

**Configuration:**
- Optional: Configure browser options via inputs when prompted
- Can be used with isolated browser contexts for testing

## Instruction Framework Structure

```
.github/
├── copilot-instructions.md          # Main framework and role coordination
├── copilot-roles/                   # Role-specific instructions
│   ├── software_architect.md        # System design and architecture
│   ├── business_analyst.md          # Requirements and specifications
│   ├── software_developer.md        # Implementation and coding
│   ├── qa_engineer.md              # Testing and quality assurance
│   ├── devops_engineer.md          # Deployment and infrastructure
│   ├── technical_writer.md         # Documentation
│   └── solution_architect.md       # Cross-role coordination
├── copilot-tech/                   # Technology-specific instructions
│   ├── github.md                   # GitHub workflows and best practices
│   ├── supabase.md                 # Database and backend operations
│   ├── postman.md                  # API testing and collection management
│   └── docker.md                   # Container operations
└── README.md                       # This file
```

## How It Works

### Role-Based Operation

1. **Start any conversation** by describing what you want to work on
2. **Copilot analyzes your request** and proposes the most appropriate role
3. **Confirm the role** and Copilot will operate within that role's guidelines
4. **Switch roles** when needed for different types of work

### Core Principles

- **Spec-First Development**: No implementation without approved specifications
- **Explicit Communication**: Clear assumptions and requirements gathering
- **Human-in-the-Loop**: All actions require user confirmation
- **Incremental Work**: Small, reviewable changes with proper tracking
- **Branch Discipline**: Always work on feature branches, never directly on main

### GitHub Integration

The framework includes comprehensive GitHub workflow management:

- **Automated issue creation** for tracking future work
- **Branch scope management** with automatic suggestions for scope changes
- **Proper commit message conventions** and PR workflows
- **Instruction change management** with isolated branching strategy

## Instruction Management

Changes to the instruction framework itself follow a special protocol:

1. **Use dedicated instruction branches**: `copilot-instructions-YYYY-MM-DD`
2. **Isolate instruction changes** from feature development
3. **Cherry-pick ready commits** for easy integration
4. **PR-based merging** for review and approval

See `.github/copilot-tech/github.md` for detailed instruction management protocols.

## Getting Started

1. **Configure MCP servers** (GitHub and Playwright minimum)
2. **Read the main instructions**: `.github/copilot-instructions.md`
3. **Start a conversation** with a description of your work
4. **Confirm the proposed role** when Copilot suggests one
5. **Follow the role-specific guidelines** for disciplined development

## Support

- **Main instructions**: `.github/copilot-instructions.md`
- **Role-specific help**: See files in `.github/copilot-roles/`
- **Technology help**: See files in `.github/copilot-tech/`
- **GitHub workflows**: `.github/copilot-tech/github.md`

---

**Ready to begin!** Describe what you'd like to work on, and Copilot will propose the most appropriate role for your request.