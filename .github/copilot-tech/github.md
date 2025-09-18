# GitHub Instructions

Technology-specific instructions for working with GitHub repositories, workflows, and integrations.

## Prerequisites

### GitHub MCP Server Setup
Before using GitHub-specific features, ensure the GitHub MCP server is available:

1. **Check for GitHub MCP availability**: Verify GitHub MCP tools are accessible
2. **If not available**: 
   - Alert user: "GitHub MCP server is required for issue management but not currently available"
   - Suggest: "Please install the GitHub MCP server following the instructions in `.github/README.md`"
   - Wait for confirmation before proceeding
3. **Alternative approaches**: If MCP not available, provide manual GitHub workflow instructions

### Required MCP Servers
For full functionality, users should have configured:
- **GitHub MCP Server**: For issue management and repository operations
- **Microsoft Playwright MCP**: For browser automation and testing

See `.github/README.md` for detailed installation instructions.

### Required Permissions
- Repository access for the target GitHub repository
- Issue creation and management permissions
- Branch creation and PR permissions

## Instruction Management Protocol

When updating copilot instructions or role definitions:

### Branch Management
1. **Check for existing instruction branches**: Look for open instruction branches:
   - `copilot-instructions-YYYY-MM-DD` (for any instruction changes)

2. **Branch selection**:
   - If an existing instruction branch is open (not yet merged), use it
   - If no open branch exists, create a new one with the current date:
     - `copilot-instructions-2025-09-18`

### Commit Protocol
1. **Isolate instruction changes**: Never mix instruction changes with feature code
2. **Descriptive commit messages**: Use conventional commit format to indicate the type:
   ```
   fix: brief description of instruction fix
   feat: brief description of new instruction feature
   docs: brief description of documentation improvement
   
   - Bullet point explaining the change
   - Why it was needed
   - What behavior it addresses
   ```

3. **Immediate commit**: Commit instruction changes as soon as they're made
4. **Cherry-pick ready**: Structure commits so they can be easily cherry-picked to other branches

### Example Workflow
```bash
# Check for existing open instruction branches
git branch | grep copilot-instructions

# Create new branch if none exists (using date of creation)
git checkout -b copilot-instructions-2025-09-18

# Make changes, then commit immediately with appropriate type
git add .github/copilot-instructions.md
git commit -m "fix: add explicit wait instruction for role selection protocol"

# Continue adding commits to same branch across multiple days
# until ready to merge via PR

# Return to main work
git checkout main
```

### Integration Strategy
- Instruction branches should be merged via PR for review
- Can be cherry-picked to feature branches when needed
- Keep instruction history separate from feature development
- Branch date reflects creation date, not commit dates
- Use commit message prefixes (fix:, feat:, docs:) to categorize changes

## Repository Management

### Branch Management (General)
- **Feature branches**: Use descriptive names like `feature/api-integration`
- **Bug fixes**: Use `fix/description-of-fix`
- **Always create a new branch** for any changes - never work directly on `main`
- **Branch scope management**: If work extends beyond the branch name's scope, suggest creating a new branch and wait for user confirmation before proceeding

### Branch Scope Protocol
When work begins to extend beyond the original branch scope:

1. **Alert the user**: "The current work is extending beyond the scope of this branch (`branch-name`)"
2. **Explain the scope drift**: Briefly describe what makes it out of scope
3. **Suggest new branch**: Propose a new branch name that better fits the expanded work
4. **Wait for explicit confirmation**: Do not proceed until user decides:
   - Continue on current branch
   - Create new branch for expanded scope
   - Split work into separate tasks

**Example:**
```
The current work is extending beyond the scope of this branch (fix/login-validation).
We started with login validation fixes but now we're adding new authentication features.
I suggest creating a new branch: feature/authentication-enhancements

Should I:
1. Create the new branch for this expanded work?
2. Continue on the current branch?
3. Split this into separate tasks?
```

### Commit Standards
- Use conventional commit format: `type: description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Keep commits focused and atomic
- Reference issues when applicable: `fixes #123`

## Pull Request Workflows

### PR Creation
- Use descriptive titles and detailed descriptions
- Link related issues
- Ensure all checks pass before requesting review
- Self-review your changes before submitting

### Code Review
- Review promptly and constructively
- Test locally when possible
- Ask questions for clarity, not criticism
- Approve only when confident in the changes

## Issue Management

### Creating Issues for Future Work
When work identifies tasks that should be addressed later:

1. **Propose GitHub issue creation** and wait for user confirmation before creating
2. **Use descriptive titles** that clearly indicate the work needed
3. **Include detailed descriptions** with:
   - Context of why the issue was identified
   - Specific requirements or acceptance criteria
   - Any relevant code snippets or file paths
   - Links to related issues or PRs

### Issue Creation Protocol
1. **Identify future work**: "I've identified work that should be tracked: [description]"
2. **Check GitHub MCP availability**: Ensure GitHub MCP server is accessible
3. **Propose issue creation**: "Should I create a GitHub issue for this?"
4. **Wait for confirmation**: Do not create until user approves
5. **Create with user approval**: 
   - If GitHub MCP available: Use GitHub MCP server
   - If GitHub MCP not available: Provide manual issue creation instructions with suggested title/description

### Issue Classification
- **bug**: For defects or problems that need fixing
- **enhancement**: For new features or improvements
- **documentation**: For documentation updates or additions
- **refactor**: For code improvements without functional changes
- **technical debt**: For items that should be addressed to improve maintainability

### Issue Workflow
```bash
# When identifying future work during current task:
1. Propose issue creation and wait for user confirmation
2. Create issue with GitHub MCP only after approval
3. Reference the issue in current work if relevant
4. Add appropriate labels and assignees
5. Link to current PR/branch in issue description
```

### Issue Linking
- Link commits to issues using keywords: `fixes`, `closes`, `resolves`
- Reference issues in PR descriptions
- Update issue status as work progresses

---

*This file contains GitHub-specific instructions for the DocSpective project.*