"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Smartphone, Tablet, Monitor, Download, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Template } from '../template-data';
import { EmailTemplate } from '@/lib/db/template-db';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface PreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
}

export function PreviewDialog({ isOpen, onOpenChange, template }: PreviewDialogProps) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  // 获取模板的完整内容
  useEffect(() => {
    if (isOpen && template) {
      setIsLoading(true);
      setError(null);
      
      // 从API获取完整的模板内容
      fetch(`/api/templates/${template.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`获取模板内容失败: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.htmlContent) {
            setHtmlContent(data.htmlContent);
          } else {
            setHtmlContent(null);
          }
        })
        .catch(error => {
          console.error('获取模板内容失败:', error);
          setError(error.message || '获取模板内容失败');
          setHtmlContent(null);
          setIsLoading(false);
        });
    }
  }, [isOpen, template]);

  // 监听iframe加载完成事件
  useEffect(() => {
    if (isOpen && template && iframeRef.current) {
      setIsLoading(true);
      
      const handleLoad = () => {
        setIsLoading(false);
      };
      
      const handleError = () => {
        setIsLoading(false);
        setError('模板内容加载失败');
      };
      
      iframeRef.current.addEventListener('load', handleLoad);
      iframeRef.current.addEventListener('error', handleError);
      
      return () => {
        if (iframeRef.current) {
          iframeRef.current.removeEventListener('load', handleLoad);
          iframeRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, [isOpen, template, previewDevice, htmlContent]);

  // 重试加载模板内容
  const handleRetry = () => {
    if (template) {
      setIsLoading(true);
      setError(null);
      
      fetch(`/api/templates/${template.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`获取模板内容失败: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.htmlContent) {
            setHtmlContent(data.htmlContent);
          } else {
            setHtmlContent(null);
          }
        })
        .catch(error => {
          console.error('重试获取模板内容失败:', error);
          setError(error.message || '获取模板内容失败');
          setHtmlContent(null);
          setIsLoading(false);
        });
    }
  };

  // 当模板变化时重置加载状态
  useEffect(() => {
    if (template) {
      setIsLoading(true);
    }
  }, [template]);

  if (!template) return null;

  // 根据设备类型设置预览宽度
  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-[320px] h-[540px]';
      case 'tablet':
        return 'w-[768px] h-[80%]';
      case 'desktop':
      default:
        return 'w-[90%] h-[80%]';
    }
  };

  // 处理编辑按钮点击
  const handleEdit = () => {
    onOpenChange(false);
    router.push(`/dashboard/template/edit?id=${template.id}`);
  };

  // 处理下载按钮点击
  const handleDownload = () => {
    if (!htmlContent) return;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 获取模板内容
  const getTemplateContent = () => {
    // 如果有HTML内容，使用它
    if (htmlContent) {
      // 为unlayer编辑器生成的HTML添加必要的样式和脚本
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${template.name}</title>
          <style>
            /* 确保内容适应iframe */
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            /* 修复unlayer编辑器生成的内容在某些邮件客户端的显示问题 */
            .email-body {
              margin: 0 auto;
              max-width: 100%;
            }
            table {
              border-spacing: 0;
            }
            td {
              padding: 0;
            }
            img {
              border: 0;
              max-width: 100%;
            }
            @media only screen and (max-width: 600px) {
              .email-body {
                width: 100% !important;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
    }
    
    // 没有内容时显示占位符
    return `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${template.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              flex-direction: column;
              text-align: center;
              color: #666;
            }
            h3 {
              margin-bottom: 10px;
            }
            p {
              margin-top: 0;
            }
          </style>
        </head>
        <body>
          <h3>${template.name}</h3>
          <p>此模板暂无预览内容</p>
          <p style="font-size: 14px; margin-top: 10px;">${template.description || ''}</p>
        </body>
      </html>
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle>{template.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={previewDevice === 'mobile' ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPreviewDevice('mobile')}
                title="移动设备预览"
              >
                <Smartphone size={16} />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPreviewDevice('tablet')}
                title="平板设备预览"
              >
                <Tablet size={16} />
              </Button>
              <Button
                variant={previewDevice === 'desktop' ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPreviewDevice('desktop')}
                title="桌面设备预览"
              >
                <Monitor size={16} />
              </Button>
            </div>
          </div>
          <DialogDescription className="line-clamp-1">{template.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gray-50">
          <div className={`
            bg-white overflow-hidden shadow-lg rounded relative
            ${getPreviewWidth()}
          `}>
            {isLoading && (
              <div className="absolute inset-0 bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            
            {error && !isLoading && (
              <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-4">
                <div className="text-destructive mb-2">错误: {error}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="mt-2"
                >
                  重试加载
                </Button>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              srcDoc={getTemplateContent()}
              className="w-full h-full border-0"
              title={`${template.name} 预览`}
              sandbox="allow-same-origin allow-scripts allow-popups"
            />
          </div>
        </div>
        <DialogFooter className="p-4 border-t">
          <div className="flex items-center gap-2 mr-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleDownload}
              disabled={!htmlContent}
            >
              <Download size={16} />
              下载HTML
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => window.open("/api/templates/preview/" + template.id, "_blank")}
            >
              <ExternalLink size={16} />
              在新窗口打开
            </Button>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button onClick={handleEdit}>
            编辑模板
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 