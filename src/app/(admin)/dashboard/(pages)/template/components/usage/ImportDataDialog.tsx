"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Upload, FileUp, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VariableData } from "@/lib/utils/template-variables";

interface ImportDataDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variables: string[];
  onImport: (data: VariableData[]) => void;
}

export function ImportDataDialog({ isOpen, onOpenChange, variables, onImport }: ImportDataDialogProps) {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 检查导入数据是否包含所需的所有列
  const validateData = (headers: string[]) => {
    const missingColumns = variables.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      toast({
        title: "数据格式错误",
        description: `缺少必要的列: ${missingColumns.join(", ")}`,
        variant: "destructive"
      });
      setIsValid(false);
      return false;
    }
    
    setIsValid(true);
    return true;
  };
  
  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt !== 'csv') {
      toast({
        title: "文件格式不支持",
        description: "目前仅支持CSV文件格式",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        
        if (validateData(headers)) {
          const data = [];
          for (let i = 1; i < rows.length; i++) {
            if (rows[i].trim() === '') continue;
            
            const values = rows[i].split(',');
            const row: Record<string, string> = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index]?.trim() || '';
            });
            
            data.push(row);
          }
          
          setPreviewData(data.slice(0, 5)); // 显示前5行数据
          setHeaders(headers);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "解析失败",
          description: "文件解析失败，请确保CSV格式正确",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  // 处理拖放
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt !== 'csv') {
      toast({
        title: "文件格式不支持",
        description: "目前仅支持CSV文件格式",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        
        if (validateData(headers)) {
          const data = [];
          for (let i = 1; i < rows.length; i++) {
            if (rows[i].trim() === '') continue;
            
            const values = rows[i].split(',');
            const row: Record<string, string> = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index]?.trim() || '';
            });
            
            data.push(row);
          }
          
          setPreviewData(data.slice(0, 5)); // 显示前5行数据
          setHeaders(headers);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "解析失败",
          description: "文件解析失败，请确保CSV格式正确",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  // 确认导入
  const handleConfirmImport = () => {
    if (!isValid || previewData.length === 0) {
      toast({
        title: "无法导入",
        description: "没有有效的数据可导入",
        variant: "destructive"
      });
      return;
    }
    
    // 导入所有解析的数据
    onImport(previewData);
    
    // 重置状态
    setPreviewData([]);
    setHeaders([]);
    setIsValid(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>导入数据</DialogTitle>
          <DialogDescription>
            上传CSV文件导入数据。文件需要包含以下变量：{variables.join(", ")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto py-4">
          <div 
            className={cn(
              "border-2 border-dashed rounded-md p-8 text-center flex flex-col items-center justify-center gap-4 cursor-pointer",
              isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/20"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
            />
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                点击或拖拽文件至此处
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                支持CSV文件格式
              </p>
            </div>
            <Button variant="secondary" size="sm" className="mt-2">
              <FileUp className="h-4 w-4 mr-2" />
              浏览文件
            </Button>
          </div>
          
          {previewData.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold">数据预览</h3>
                {isValid ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="h-3 w-3" />
                    <span>格式正确</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>格式不正确</span>
                  </div>
                )}
              </div>
              
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHead key={header} className={cn(
                          variables.includes(header) ? "font-bold" : ""
                        )}>
                          {header}
                          {variables.includes(header) && <span className="text-red-500">*</span>}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        {headers.map((header) => (
                          <TableCell key={`${index}-${header}`}>
                            {String(row[header] || '')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                显示前 {previewData.length} 行数据
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={handleConfirmImport} 
            disabled={!isValid || previewData.length === 0}
          >
            确认导入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 