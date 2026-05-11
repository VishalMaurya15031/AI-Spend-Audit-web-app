import { describe, it, expect } from 'vitest';
import { generateAuditReport, Tool } from './audit-engine';

describe('generateAuditReport', () => {
  it('should recommend canceling one LLM if both ChatGPT and Claude are present', () => {
    const tools: Tool[] = [
      { id: 'chatgpt', name: 'ChatGPT Plus', price: 20 },
      { id: 'claude', name: 'Claude Pro', price: 20 },
    ];

    const report = generateAuditReport(tools);

    expect(report.currentSpend).toBe(40);
    expect(report.monthlySavings).toBe(20);
    expect(report.optimizedSpend).toBe(20);
    expect(report.recommendations.length).toBe(1);
    expect(report.recommendations[0].type).toBe('cancel');
    expect(report.recommendations[0].id).toBe('redundant-llm');
  });

  it('should recommend dropping Copilot if Cursor is present', () => {
    const tools: Tool[] = [
      { id: 'cursor', name: 'Cursor Pro', price: 20 },
      { id: 'copilot', name: 'GitHub Copilot', price: 10 },
    ];

    const report = generateAuditReport(tools);

    expect(report.currentSpend).toBe(30);
    expect(report.monthlySavings).toBe(10);
    expect(report.optimizedSpend).toBe(20);
    expect(report.recommendations[0].id).toBe('redundant-dev');
  });

  it('should handle custom tools evaluation', () => {
    const tools: Tool[] = [
      { id: 'custom-123', name: 'Jasper', price: 50 },
    ];

    const report = generateAuditReport(tools);

    expect(report.currentSpend).toBe(50);
    expect(report.monthlySavings).toBe(25); // 50%
    expect(report.recommendations[0].id).toBe('evaluate-custom');
  });
});
