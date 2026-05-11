# Testing Strategy & Results

## Testing Philosophy
For the MVP phase, our primary concern is the accuracy of the **Audit Engine**. Financial calculations and cost-saving recommendations must be deterministic and bug-free. UI testing is currently handled manually, but unit tests are strictly enforced for business logic.

## Tools Used
- **Vitest**: Chosen over Jest for its native TypeScript support and extreme speed, particularly in Next.js/Vite environments.

## Test Cases Implemented

Located in `src/lib/audit-engine.test.ts`:

1. **Redundant LLMs**:
   - *Scenario*: User selects both ChatGPT Plus ($20) and Claude Pro ($20).
   - *Expectation*: The engine must recommend canceling one, adding $20 to monthly savings.
2. **Redundant Developer Tools**:
   - *Scenario*: User selects Cursor Pro ($20) and GitHub Copilot ($10).
   - *Expectation*: The engine must recommend dropping Copilot, adding $10 to monthly savings.
3. **Custom Tool Evaluation**:
   - *Scenario*: User adds a custom tool "Jasper" for $50/mo.
   - *Expectation*: The engine flags custom tools for evaluation and estimates a 50% potential savings metric.

## Running the Tests
Execute the following command in the terminal:
```bash
npm test
```

## Future Scope (Post-MVP)
- **E2E Testing**: Implement Playwright to test the full user journey: Landing -> Input Form -> Audit Generation -> Lead Capture -> Shared URL.
- **Component Testing**: Test React components using React Testing Library to ensure correct state updates when adding/removing tools.
