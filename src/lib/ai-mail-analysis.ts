import { Mail } from './data';

export interface AIMailAnalysisResult {
  autoLabels: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  priority: 'high' | 'medium' | 'low';
  category: string;
  summary: string;
  actionItems?: string[];
  important: boolean;
  spam: boolean;
  keywords: string[];
}

// AI分析层级结构
export type AnalysisLevel = 'basic' | 'standard' | 'advanced';

// AI分析选项
export interface AIAnalysisOptions {
  level: AnalysisLevel;
  includeSummary: boolean;
  includeActionItems: boolean;
  customInstructions?: string;
  useLocalFallback: boolean;
}

// 默认选项
const defaultOptions: AIAnalysisOptions = {
  level: 'standard',
  includeSummary: true,
  includeActionItems: true,
  useLocalFallback: true
};

// 开放式AI API分析邮件
export async function analyzeMailWithOpenAI(
  mail: Mail, 
  options: Partial<AIAnalysisOptions> = {}
): Promise<AIMailAnalysisResult> {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // 如果有API_KEY，则使用OpenAI API
    if (process.env.OPENAI_API_KEY) {
      // 这里将来加入真实的OpenAI API调用
      console.log('Using OpenAI API for mail analysis');
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 为了演示，我们先使用本地分析作为结果
      return localMailAnalysis(mail, mergedOptions);
    } else {
      // 没有API密钥，回退到本地分析
      console.log('No OpenAI API key found, using local fallback');
      return localMailAnalysis(mail, mergedOptions);
    }
  } catch (error) {
    console.error('Error analyzing mail with OpenAI:', error);
    // 出错时也回退到本地分析
    return localMailAnalysis(mail, mergedOptions);
  }
}

// 本地邮件分析逻辑（作为fallback）
export function localMailAnalysis(
  mail: Mail, 
  options: AIAnalysisOptions
): AIMailAnalysisResult {
  const { level, includeSummary, includeActionItems } = options;
  
  // 分析结果初始化
  const result: AIMailAnalysisResult = {
    autoLabels: [],
    sentiment: 'neutral',
    priority: 'medium',
    category: 'general',
    summary: '',
    important: false,
    spam: false,
    keywords: [],
  };
  
  // 基础分析 - 所有级别都会执行
  basicAnalysis(mail, result);
  
  // 根据分析级别执行不同深度的分析
  if (level === 'standard' || level === 'advanced') {
    standardAnalysis(mail, result);
  }
  
  if (level === 'advanced') {
    advancedAnalysis(mail, result);
  }
  
  // 是否包含摘要
  if (includeSummary) {
    result.summary = generateSummary(mail);
  }
  
  // 是否包含行动项
  if (includeActionItems) {
    result.actionItems = extractActionItems(mail);
  }
  
  return result;
}

// 基础分析
function basicAnalysis(mail: Mail, result: AIMailAnalysisResult): void {
  const { subject, text } = mail;
  const fullText = `${subject} ${text}`.toLowerCase();
  
  // 检测垃圾邮件特征
  if (
    fullText.includes('unsubscribe') ||
    fullText.includes('click here') ||
    fullText.includes('limited time') ||
    fullText.includes('special offer') ||
    fullText.includes('buy now')
  ) {
    result.autoLabels.push('promotional');
    result.spam = Math.random() > 0.7; // 简单概率模拟
  }
  
  // 基础情感分析
  const positiveWords = ['thank', 'good', 'great', 'excellent', 'appreciate', 'happy'];
  const negativeWords = ['sorry', 'issue', 'problem', 'complaint', 'concern', 'wrong', 'bad'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (fullText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (fullText.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) {
    result.sentiment = 'positive';
  } else if (negativeScore > positiveScore) {
    result.sentiment = 'negative';
  }
  
  // 基础分类
  if (fullText.includes('invoice') || fullText.includes('payment') || fullText.includes('receipt')) {
    result.category = 'finance';
    result.autoLabels.push('finance');
  } else if (fullText.includes('meeting') || fullText.includes('schedule') || fullText.includes('calendar')) {
    result.category = 'scheduling';
    result.autoLabels.push('meeting');
  }
  
  // 提取简单关键词
  const words = fullText.split(/\s+/);
  const wordFreq: Record<string, number> = {};
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 4) { // 只考虑长度大于4的词
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });
  
  // 按频率排序并取前5个作为关键词
  result.keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

// 标准分析
function standardAnalysis(mail: Mail, result: AIMailAnalysisResult): void {
  const { subject, text, name } = mail;
  const fullText = `${subject} ${text}`.toLowerCase();
  
  // 优先级判断
  if (
    fullText.includes('urgent') ||
    fullText.includes('asap') ||
    fullText.includes('important') ||
    fullText.includes('deadline')
  ) {
    result.priority = 'high';
    result.important = true;
    result.autoLabels.push('urgent');
  }
  
  // 更多的分类标签
  if (fullText.includes('newsletter') || fullText.includes('update')) {
    result.autoLabels.push('newsletter');
  }
  
  if (fullText.includes('team') || fullText.includes('project')) {
    result.autoLabels.push('work');
  }
  
  // 更详细的分类
  if (fullText.includes('order') || fullText.includes('shipping') || fullText.includes('delivery')) {
    result.category = 'shopping';
    result.autoLabels.push('order');
  } else if (name.includes('linkedin') || name.includes('facebook') || name.includes('twitter')) {
    result.category = 'social';
    result.autoLabels.push('social');
  }
}

// 高级分析
function advancedAnalysis(mail: Mail, result: AIMailAnalysisResult): void {
  const { subject, text } = mail;
  const fullText = `${subject} ${text}`.toLowerCase();
  
  // 更复杂的分析可以添加在这里
  // 例如，时间敏感性判断
  const timeWords = ['today', 'tomorrow', 'asap', 'soon', 'week', 'month'];
  
  timeWords.some(word => {
    if (fullText.includes(word)) {
      result.autoLabels.push('time-sensitive');
      return true;
    }
    return false;
  });
  
  // 检测请求或问题
  if (
    fullText.includes('can you') ||
    fullText.includes('could you') ||
    fullText.includes('please') ||
    fullText.includes('help') ||
    fullText.includes('need') ||
    fullText.match(/\?/)
  ) {
    result.autoLabels.push('request');
  }
  
  // ... 可以添加更多高级分析逻辑
}

// 生成摘要
function generateSummary(mail: Mail): string {
  // 实际实现中，这里应该有更复杂的摘要生成算法
  // 现在我们简单地返回前100个字符作为摘要
  const text = mail.text.trim();
  return text.length > 100 ? `${text.substring(0, 100)}...` : text;
}

// 提取行动项
function extractActionItems(mail: Mail): string[] {
  const actionItems: string[] = [];
  const lines = mail.text.split('\n');
  
  lines.forEach(line => {
    // 很简单的行动项识别逻辑
    if (
      line.toLowerCase().includes('please') ||
      line.toLowerCase().includes('could you') ||
      line.toLowerCase().includes('need to') ||
      line.match(/^[•\-\*] /)  // 检测列表项
    ) {
      actionItems.push(line.trim());
    }
  });
  
  return actionItems.slice(0, 3); // 最多返回3个行动项
} 