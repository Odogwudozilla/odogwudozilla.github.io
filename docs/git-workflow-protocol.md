# Git Workflow Protocol

## Overview
This document defines the standardized Git workflow protocol for the portfolio project. When triggered with specific commands, this protocol ensures consistent branch management, proper synchronization with remote, and meaningful commit practices.

## Protocol Triggers
The Git workflow protocol is activated when any of these phrases are used:
- "start git protocol"
- "begin git protocol" 
- "initiate git workflow"
- "execute git protocol"
- "run git workflow"
- "git protocol"

## Automated Git Workflow Steps

When the protocol is triggered, the following sequence will be executed automatically:

### 1. **Checkout Master Branch**
```bash
git checkout master
```
- Switches to the main development branch
- Ensures we're starting from the stable base

### 2. **Fetch Remote Changes**
```bash
git fetch origin
```
- Downloads latest changes from remote repository
- Updates remote tracking branches without merging

### 3. **Update Master with Remote**
```bash
git pull origin master
```
- Merges any remote changes into local master
- Ensures local master is synchronized with remote
- Handles fast-forward merges automatically

### 4. **Create Feature Branch**
```bash
git checkout -b feature/[descriptive-name]
```
- Creates and switches to a new feature branch
- Branch naming follows convention: `feature/brief-description`
- Examples:
  - `feature/navigation-mobile-fixes`
  - `feature/hero-section-improvements`
  - `feature/portfolio-card-updates`
  - `feature/contact-form-validation`

### 5. **Stage Changed Files**
```bash
git add [files-in-changelist]
```
- Stages only the files that were modified during the current work session
- Avoids staging unintended changes
- Uses selective staging based on actual modifications

### 6. **Create Commit with Descriptive Message**
```bash
git commit -m "[type]: [concise description]

[optional detailed explanation]

- [specific change 1]
- [specific change 2]
- [specific change 3]"
```

## Commit Message Convention

### Format Structure
```
[type]: [concise description under 50 characters]

[optional body with detailed explanation]

- [bullet point of specific changes]
- [another specific change]
- [etc.]
```

### Commit Types
- **feat**: New feature implementation
- **fix**: Bug fixes and issue resolution
- **style**: UI/styling improvements and updates
- **refactor**: Code restructuring without functionality changes
- **docs**: Documentation updates and additions
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks and dependency updates

### Example Commit Messages

**Feature Implementation:**
```
feat: implement mobile navigation with collapsible menu

Add responsive navigation functionality for mobile devices
with hamburger menu toggle and backdrop interaction.

- Create collapsible sidebar navigation for mobile screens
- Add hamburger menu toggle button with proper ARIA labels
- Implement backdrop overlay for menu dismissal
- Add smooth animations and transitions
- Ensure proper touch targets for mobile usability
```

**Bug Fix:**
```
fix: resolve navigation highlighting and mobile responsiveness

Fix scroll-triggered navigation highlighting and mobile
menu functionality that was broken after refactoring.

- Restore JavaScript for scroll-based section highlighting
- Fix empty navigation.html partial loading
- Implement proper mobile toggle functionality
- Add component loader for dynamic HTML loading
- Update navigation CSS for responsive behavior
```

**Styling Update:**
```
style: improve hero section visual design and spacing

Enhance hero section with better background contrast,
improved text readability, and optimized spacing.

- Adjust background image opacity for better text contrast
- Reduce excessive spacing between sections
- Improve profile image positioning and sizing
- Add glassmorphism effects to navigation sidebar
- Optimize responsive spacing for different screen sizes
```

## Branch Naming Conventions

### Feature Branches
- `feature/navigation-improvements`
- `feature/blog-functionality`
- `feature/portfolio-grid-redesign`
- `feature/contact-form-validation`

### Bug Fix Branches
- `fix/mobile-navigation-toggle`
- `fix/scroll-highlighting-broken`
- `fix/responsive-layout-issues`
- `fix/form-validation-errors`

### Style/UI Branches
- `style/hero-section-redesign`
- `style/color-scheme-updates`
- `style/typography-improvements`
- `style/component-styling-fixes`

### Documentation Branches
- `docs/readme-updates`
- `docs/api-documentation`
- `docs/deployment-guide`
- `docs/component-library-docs`

## Protocol Implementation Notes

### Automatic Branch Naming
The AI assistant will automatically generate appropriate branch names based on:
- The type of work being performed
- The files being modified
- The scope of changes made
- The feature or fix being implemented

### Change Detection
The protocol will identify modified files by:
- Checking git status for unstaged changes
- Analyzing the working directory for modifications
- Identifying new files that need to be tracked
- Excluding files that should not be committed (build artifacts, logs, etc.)

### Error Handling
If any step in the protocol fails:
- Stop execution and report the specific error
- Provide clear guidance on manual resolution
- Suggest alternative approaches if needed
- Ensure no partial commits or corrupted state

### Safety Checks
Before executing the protocol:
- Verify we're in the correct repository
- Check for uncommitted changes that might be lost
- Confirm remote connectivity
- Validate branch naming conventions

## Manual Override Options

### Custom Branch Names
If a specific branch name is preferred:
```
"start git protocol with branch feature/custom-branch-name"
```

### Selective File Staging
If only specific files should be committed:
```
"start git protocol staging only [file1, file2, file3]"
```

### Custom Commit Message
If a specific commit message is provided:
```
"start git protocol with message 'custom commit message here'"
```

## Integration with Development Workflow

### When to Trigger Protocol
- After completing a feature or fix
- Before switching to work on different functionality
- At natural stopping points in development
- Before major refactoring or architectural changes

### Pre-Protocol Checklist
- [ ] All intended changes are complete
- [ ] Code has been tested locally
- [ ] No console errors or warnings
- [ ] Files are properly organized and cleaned up
- [ ] Ready to share work with others

### Post-Protocol Actions
After the protocol completes:
- Branch is ready for continued development
- Changes are safely committed and tracked
- Ready to push to remote when appropriate
- Can switch contexts or start new features

## Best Practices

### Commit Frequency
- Make commits at logical completion points
- Don't commit broken or incomplete functionality
- Prefer smaller, focused commits over large ones
- Each commit should represent a cohesive change

### Branch Management
- Keep feature branches focused on single features
- Don't let branches live too long without merging
- Regularly sync with master to avoid conflicts
- Delete merged branches to keep repository clean

### Collaboration
- Use descriptive commit messages for team clarity
- Include context and reasoning in commit descriptions
- Reference issues or tickets when applicable
- Consider the next developer who will read your commits

This protocol ensures consistent, professional Git practices while automating the repetitive aspects of branch management and commit creation.
