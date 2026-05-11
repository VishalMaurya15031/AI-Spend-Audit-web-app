export interface Tool {
  id: string;
  name: string;
  price: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  type: 'cancel' | 'downgrade' | 'switch' | 'evaluate';
}

export interface AuditReport {
  currentSpend: number;
  optimizedSpend: number;
  monthlySavings: number;
  yearlySavings: number;
  recommendations: Recommendation[];
}

export function generateAuditReport(tools: Tool[]): AuditReport {
  let monthlySavings = 0;
  const recommendations: Recommendation[] = [];

  const toolIds = tools.map(t => t.id);
  const currentSpend = tools.reduce((acc, t) => acc + t.price, 0);

  // Rule 1: Redundant LLMs (ChatGPT + Claude)
  const hasChatGPT = toolIds.includes('chatgpt');
  const hasClaude = toolIds.includes('claude');
  
  if (hasChatGPT && hasClaude) {
    const chatGptPrice = tools.find(t => t.id === 'chatgpt')?.price || 20;
    const claudePrice = tools.find(t => t.id === 'claude')?.price || 20;
    const saveAmount = Math.min(chatGptPrice, claudePrice);
    
    recommendations.push({
      id: 'redundant-llm',
      title: 'Consolidate LLM Subscriptions',
      description: 'You are paying for both ChatGPT Plus and Claude Pro. For most workflows, picking one is sufficient. Canceling the redundant one saves money.',
      potentialSavings: saveAmount,
      type: 'cancel'
    });
    monthlySavings += saveAmount;
  }

  // Rule 2: Redundant Dev Tools (Cursor + Copilot)
  const hasCursor = toolIds.includes('cursor');
  const hasCopilot = toolIds.includes('copilot');

  if (hasCursor && hasCopilot) {
    const copilotPrice = tools.find(t => t.id === 'copilot')?.price || 10;
    recommendations.push({
      id: 'redundant-dev',
      title: 'Drop GitHub Copilot',
      description: 'Since you are using Cursor Pro, which has superior built-in AI autocomplete and chat, you can safely cancel your standalone GitHub Copilot subscription.',
      potentialSavings: copilotPrice,
      type: 'cancel'
    });
    monthlySavings += copilotPrice;
  }

  // Rule 3: Expensive Design Tools
  const hasMidjourney = toolIds.includes('midjourney');
  if (hasMidjourney) {
    const mjPrice = tools.find(t => t.id === 'midjourney')?.price || 30;
    if (mjPrice >= 30) {
      recommendations.push({
        id: 'downgrade-midjourney',
        title: 'Downgrade Midjourney',
        description: 'You are on a higher Midjourney tier. Unless you generate images daily, the $10/mo Basic Plan or free alternatives (like DALL-E 3 in ChatGPT) might suffice.',
        potentialSavings: mjPrice - 10,
        type: 'downgrade'
      });
      monthlySavings += (mjPrice - 10);
    }
  }

  // Rule 4: Custom tools evaluation
  const customTools = tools.filter(t => t.id.startsWith('custom-'));
  if (customTools.length > 0) {
    const customSpend = customTools.reduce((acc, t) => acc + t.price, 0);
    recommendations.push({
      id: 'evaluate-custom',
      title: 'Evaluate Niche AI Tools',
      description: `You are spending $${customSpend}/mo on specialized tools. Often, their features can be replicated using custom GPTs or Claude Projects at no extra cost.`,
      potentialSavings: Math.round(customSpend * 0.5), // Estimate 50% savings
      type: 'evaluate'
    });
    monthlySavings += Math.round(customSpend * 0.5);
  }

  // Fallback if no rules hit but they have spend
  if (recommendations.length === 0 && currentSpend > 0) {
    recommendations.push({
      id: 'general-audit',
      title: 'General Stack Review',
      description: 'Your stack looks lean, but regularly reviewing usage metrics can identify unused seats or tools that can be replaced by open-source models.',
      potentialSavings: Math.round(currentSpend * 0.1),
      type: 'evaluate'
    });
    monthlySavings += Math.round(currentSpend * 0.1);
  }

  const optimizedSpend = currentSpend - monthlySavings;

  return {
    currentSpend,
    optimizedSpend: optimizedSpend > 0 ? optimizedSpend : 0,
    monthlySavings,
    yearlySavings: monthlySavings * 12,
    recommendations
  };
}
