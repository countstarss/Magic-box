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
import { useTemplates } from '@/contexts/TemplateContext';

// 缓存已加载的模板HTML内容
const htmlContentCache = new Map<number, string>();

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
  const { templates } = useTemplates();

  // 获取完整的模板内容（优先使用缓存，然后尝试从上下文中获取）
  useEffect(() => {
    const loadTemplateContent = async () => {
      if (!isOpen || !template) return;
      
      setIsLoading(true);
      setError(null);
      console.log(`开始加载模板(ID:${template.id})内容`);
      
      try {
        // 1. 检查缓存是否有数据
        if (htmlContentCache.has(template.id)) {
          console.log(`使用缓存的模板内容(ID:${template.id})`);
          setHtmlContent(htmlContentCache.get(template.id) || null);
          setIsLoading(false);
          return;
        }
        
        // 2. 从上下文中查找完整数据
        console.log(`从上下文中查找模板(ID:${template.id})，当前templates长度:`, templates.length);
        const fullTemplate = templates.find(t => t.id === template.id);
        
        if (fullTemplate && fullTemplate.htmlContent) {
          console.log(`找到模板内容(ID:${template.id})`);
          // 存入缓存
          htmlContentCache.set(template.id, fullTemplate.htmlContent);
          setHtmlContent(fullTemplate.htmlContent);
          setIsLoading(false);
        } else {
          console.warn(`未找到模板内容(ID:${template.id})或内容为空`);
          // 3. 尝试直接从IndexedDB获取单个模板（直接访问window.indexedDB）
          try {
            const db = await window.indexedDB.open("TemplateDatabase");
            db.onsuccess = (event) => {
              const dbInstance = (event.target as IDBOpenDBRequest).result;
              const transaction = dbInstance.transaction("templates", "readonly");
              const store = transaction.objectStore("templates");
              const request = store.get(template.id);
              
              request.onsuccess = () => {
                const data = request.result;
                if (data && data.htmlContent) {
                  console.log(`从IndexedDB直接获取到模板内容(ID:${template.id})`);
                  htmlContentCache.set(template.id, data.htmlContent);
                  setHtmlContent(data.htmlContent);
                } else {
                  console.error(`IndexedDB中未找到模板内容(ID:${template.id})`);
                  setHtmlContent(null);
                }
                setIsLoading(false);
              };
              
              request.onerror = (error) => {
                console.error(`IndexedDB获取模板失败(ID:${template.id}):`, error);
                setHtmlContent(null);
                setIsLoading(false);
                setError('从数据库获取模板内容失败');
              };
            };
            
            db.onerror = (error) => {
              console.error(`打开IndexedDB失败:`, error);
              setHtmlContent(null);
              setIsLoading(false);
              setError('无法打开数据库');
            };
          } catch (err) {
            console.error(`IndexedDB操作出错:`, err);
            setHtmlContent(null);
            setIsLoading(false);
            setError('读取数据库失败');
          }
        }
      } catch (error) {
        console.error('获取模板内容失败:', error);
        setError('获取模板内容失败: ' + (error instanceof Error ? error.message : String(error)));
        setHtmlContent(null);
        setIsLoading(false);
      }
    };
    
    loadTemplateContent();
    
    // 当对话框关闭时，重置加载状态
    return () => {
      if (!isOpen) {
        setIsLoading(true); // 为下次打开做准备
      }
    };
  }, [isOpen, template, templates]);

  // 处理iframe加载完成事件 - 修改这个useEffect
  useEffect(() => {
    // 如果htmlContent已经设置，立即为iframe添加事件监听器
    if (iframeRef.current) {
      const handleLoad = () => {
        setIsLoading(false);
        console.log(`iframe载入完成(ID:${template?.id})`);
      };
      
      const handleError = () => {
        setIsLoading(false);
        setError('模板内容加载失败');
        console.error(`iframe载入失败(ID:${template?.id})`);
      };
      
      // 移除旧的事件监听器，确保不会重复添加
      iframeRef.current.removeEventListener('load', handleLoad);
      iframeRef.current.removeEventListener('error', handleError);
      
      // 添加新的事件监听器
      iframeRef.current.addEventListener('load', handleLoad);
      iframeRef.current.addEventListener('error', handleError);
      
      // 如果iframe已经加载完成但事件未触发，手动设置状态
      if (iframeRef.current.contentDocument?.readyState === 'complete') {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
      
      return () => {
        if (iframeRef.current) {
          iframeRef.current.removeEventListener('load', handleLoad);
          iframeRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, [isOpen, template, previewDevice, htmlContent, iframeRef.current]);

  // 重试加载模板内容
  const handleRetry = () => {
    if (!template) return;
    
    setIsLoading(true);
    setError(null);
    console.log(`重试加载模板(ID:${template.id})内容`);
    
    try {
      // 清除可能存在问题的缓存
      htmlContentCache.delete(template.id);
      
      // 重新从上下文中查找完整的模板数据
      const fullTemplate = templates.find(t => t.id === template.id);
      
      if (fullTemplate && fullTemplate.htmlContent) {
        console.log(`重试成功：找到模板内容(ID:${template.id})`);
        htmlContentCache.set(template.id, fullTemplate.htmlContent);
        setHtmlContent(fullTemplate.htmlContent);
        setIsLoading(false);
      } else {
        console.warn(`重试失败：未找到模板内容(ID:${template.id})或内容为空`);
        setHtmlContent(null);
        setIsLoading(false);
        setError('未找到模板HTML内容，请尝试刷新页面');
      }
    } catch (error) {
      console.error('重试获取模板内容失败:', error);
      setError('获取模板内容失败: ' + (error instanceof Error ? error.message : String(error)));
      setHtmlContent(null);
      setIsLoading(false);
    }
  };

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

  // 在新窗口中打开
  const handleOpenInNewWindow = () => {
    if (!htmlContent) return;
    
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${template.name} - 预览</title>
        <style>
          /* 确保内容适应窗口 */
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
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(fullHtml);
      newWindow.document.close();
    } else {
      // 如果弹出窗口被浏览器阻止
      toast({
        title: "无法打开新窗口",
        description: "浏览器可能阻止了弹出窗口，请检查您的浏览器设置。",
        variant: "destructive"
      });
    }
  };

  // 获取模板内容
  const getTemplateContent = () => {
    // 如果有HTML内容，使用它
    if (htmlContent) {
      // 添加一个唯一的key来避免浏览器缓存问题
      const cacheKey = `${template.id}-${previewDevice}-${Date.now()}`;
      
      // 为unlayer编辑器生成的HTML添加必要的样式和脚本
      return `
        <!DOCTYPE html>
        <html data-cache-key="${cacheKey}">
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
              onClick={handleOpenInNewWindow}
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