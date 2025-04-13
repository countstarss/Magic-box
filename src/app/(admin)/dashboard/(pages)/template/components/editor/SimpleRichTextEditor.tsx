"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { highlightVariables } from '@/lib/utils/template-variables';
import { EditorToolbar } from './EditorToolbar';
import { Variable, predefinedVariables } from './VariableManager';

interface SimpleRichTextEditorProps {
  initialHtml?: string;
  onChange: (html: string) => void;
  height?: string;
  customVariables?: Variable[];
}

export function SimpleRichTextEditor({
  initialHtml = '',
  onChange,
  height = '400px',
  customVariables = []
}: SimpleRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // 初始化编辑器
  useEffect(() => {
    if (editorRef.current) {
      // 设置编辑器为可编辑
      editorRef.current.contentEditable = 'true';
      
      // 添加初始内容
      editorRef.current.innerHTML = initialHtml;
      
      // 高亮显示变量
      highlightEditorVariables();
      
      // 标记编辑器准备完成
      setIsEditorReady(true);
      
      // 监听内容变更
      const handleInput = () => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      };
      
      editorRef.current.addEventListener('input', handleInput);
      
      // 清理函数
      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener('input', handleInput);
        }
      };
    }
  }, [initialHtml, onChange]);
  
  // 高亮编辑器中的变量
  const highlightEditorVariables = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const highlightedHtml = highlightVariables(html);
      
      // 暂存光标位置
      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      
      // 更新内容
      editorRef.current.innerHTML = highlightedHtml;
      
      // 恢复光标位置（简化版，可能不完全精确）
      if (range && selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };
  
  // 格式化文本
  const handleFormatText = (format: string, value?: string) => {
    if (!document.execCommand) {
      console.error('document.execCommand is not supported');
      return;
    }
    
    try {
      document.execCommand(format, false, value);
      
      // 高亮变量
      highlightEditorVariables();
      
      // 触发内容变更
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    } catch (error) {
      console.error('执行格式化命令失败:', error);
    }
  };
  
  // 插入变量
  const handleInsertVariable = (variable: string) => {
    if (!document.execCommand) {
      console.error('document.execCommand is not supported');
      return;
    }
    
    try {
      // 插入变量
      document.execCommand('insertHTML', false, variable);
      
      // 高亮变量
      highlightEditorVariables();
      
      // 触发内容变更
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    } catch (error) {
      console.error('插入变量失败:', error);
      
      // 备选方案：使用选区API
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const variableNode = document.createElement('span');
        variableNode.className = 'variable-highlight';
        variableNode.setAttribute('data-variable', variable.replace(/[{}]/g, ''));
        variableNode.innerHTML = variable;
        
        range.deleteContents();
        range.insertNode(variableNode);
        
        // 光标移动到插入的变量后面
        range.setStartAfter(variableNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // 触发内容变更
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }
    }
  };
  
  // 处理字体大小选择
  const handleSelectFontSize = (size: string) => {
    handleFormatText('fontSize', size);
  };
  
  return (
    <div className="flex flex-col border rounded-md overflow-hidden">
      {isEditorReady && (
        <EditorToolbar
          onFormatText={handleFormatText}
          onInsertVariable={handleInsertVariable}
          onSelectFontSize={handleSelectFontSize}
          customVariables={customVariables}
        />
      )}
      <div
        ref={editorRef}
        className="p-4 overflow-auto"
        style={{ height, minHeight: '200px' }}
      />
      <style jsx global>{`
        .variable-highlight {
          background-color: rgba(59, 130, 246, 0.1);
          border-radius: 3px;
          padding: 0 3px;
          border: 1px dashed #3b82f6;
          font-family: monospace;
          white-space: nowrap;
          display: inline-block;
          margin: 0 2px;
        }
      `}</style>
    </div>
  );
} 