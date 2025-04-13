/**
 * 模板变量处理工具函数
 */

// 变量数据类型
export interface VariableData {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * 在HTML内容中替换变量
 * @param htmlContent HTML内容
 * @param variables 变量数据对象
 * @returns 替换后的HTML内容
 */
export function replaceVariables(
  htmlContent: string,
  variables: VariableData
): string {
  // 变量替换正则表达式: {{变量名}} 或 {{变量名|默认值}}
  const variableRegex = /\{\{([^|{}]+)(?:\|([^{}]*))?\}\}/g;

  return htmlContent.replace(
    variableRegex,
    (match, variableName, defaultValue) => {
      const trimmedName = variableName.trim();
      // 从变量对象中获取值，如果不存在则使用默认值
      const value = variables[trimmedName];

      // 如果值是undefined、null或空字符串，则使用默认值（如果有提供）
      if (value === undefined || value === null || value === "") {
        return defaultValue !== undefined ? defaultValue : match;
      }

      // 返回变量的值
      return String(value);
    }
  );
}

/**
 * 从HTML内容中提取变量名
 * @param htmlContent HTML内容
 * @returns 变量名数组
 */
export function extractVariables(htmlContent: string): string[] {
  const variableRegex = /\{\{([^|{}]+)(?:\|([^{}]*))?\}\}/g;
  const variables: Set<string> = new Set();

  let match;
  while ((match = variableRegex.exec(htmlContent)) !== null) {
    variables.add(match[1].trim());
  }

  return Array.from(variables);
}

/**
 * 检查预览内容中的变量是否有缺失
 * @param htmlContent HTML内容
 * @param variables 变量数据
 * @returns 缺失的变量名数组
 */
export function getMissingVariables(
  htmlContent: string,
  variables: VariableData
): string[] {
  const templateVariables = extractVariables(htmlContent);
  return templateVariables.filter(
    (varName) =>
      variables[varName] === undefined ||
      variables[varName] === null ||
      variables[varName] === ""
  );
}

/**
 * 使用示例数据生成预览内容
 * @param htmlContent HTML模板内容
 * @param sampleData 示例数据
 * @returns 包含示例数据的预览内容
 */
export function generatePreview(
  htmlContent: string,
  sampleData: VariableData
): string {
  // 查找模板中的所有变量
  const templateVariables = extractVariables(htmlContent);

  // 对于不在示例数据中的变量，使用占位符
  const previewData: VariableData = { ...sampleData };

  templateVariables.forEach((varName) => {
    if (previewData[varName] === undefined) {
      previewData[varName] = `[${varName}]`;
    }
  });

  return replaceVariables(htmlContent, previewData);
}

/**
 * 高亮显示模板中的变量
 * @param htmlContent HTML内容
 * @returns 高亮变量后的HTML内容
 */
export function highlightVariables(htmlContent: string): string {
  // 高亮变量的正则表达式
  const variableRegex = /\{\{([^|{}]+)(?:\|([^{}]*))?\}\}/g;

  return htmlContent.replace(
    variableRegex,
    (match, variableName, defaultValue) => {
      const trimmedName = variableName.trim();
      const defaultPart = defaultValue ? `|${defaultValue}` : "";

      // 使用span元素包裹变量，添加样式
      return `<span class="variable-highlight" data-variable="${trimmedName}">
      {{${trimmedName}${defaultPart}}}
    </span>`;
    }
  );
}

/**
 * 检查变量语法是否正确
 * @param variableName 变量名
 * @returns 是否符合变量名规范
 */
export function isValidVariableName(variableName: string): boolean {
  // 变量名只能包含字母、数字和下划线
  return /^[a-zA-Z0-9_]+$/.test(variableName.trim());
}
