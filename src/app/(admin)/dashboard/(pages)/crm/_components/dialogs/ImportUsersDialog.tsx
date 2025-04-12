'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCrmStore, User, UserSource } from '../../store/useCrmStore';
import { Upload, FileText, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// 示例数据格式
const SAMPLE_CSV = `fullName,email,phone,company,position,source,status,totalSpent
John Doe,john@example.com,+1234567890,Acme Inc,CEO,import,active,1500
Jane Smith,jane@example.com,+1987654321,Globex,CTO,import,active,850
`;

// 示例JSON数据格式
const SAMPLE_JSON = `[
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Inc",
    "position": "CEO",
    "source": "import",
    "status": "active",
    "totalSpent": 1500
  },
  {
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1987654321",
    "company": "Globex",
    "position": "CTO",
    "source": "import",
    "status": "active",
    "totalSpent": 850
  }
]`;

const ImportUsersDialog: React.FC = () => {
  const { isImportingUsers, setIsImportingUsers, importUsers } = useCrmStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>('file');
  const [csvData, setCsvData] = useState<string>('');
  const [jsonData, setJsonData] = useState<string>('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // 检查文件类型
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'csv' && fileType !== 'json') {
      setError('请上传CSV或JSON格式的文件');
      return;
    }
    
    // 模拟上传进度
    setIsUploading(true);
    setUploadProgress(0);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        if (fileType === 'csv') {
          setCsvData(content);
          setActiveTab('csv');
          parseCSV(content);
        } else {
          setJsonData(content);
          setActiveTab('json');
          parseJSON(content);
        }
        
        // 模拟上传完成
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(100);
        }, 1000);
      } catch (err) {
        setError('文件解析失败，请检查文件格式');
        setIsUploading(false);
      }
    };
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };
    
    reader.onerror = () => {
      setError('文件读取失败');
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  };
  
  // 解析CSV数据
  const parseCSV = (data: string) => {
    try {
      const lines = data.trim().split('\n');
      const headers = lines[0].split(',');
      
      const result = [];
      
      for (let i = 1; i < lines.length; i++) {
        const obj: Record<string, any> = {};
        const currentLine = lines[i].split(',');
        
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentLine[j];
        }
        
        result.push(obj);
      }
      
      setPreviewData(result);
      setError(null);
    } catch (err) {
      setError('CSV解析失败，请检查格式');
      setPreviewData([]);
    }
  };
  
  // 解析JSON数据
  const parseJSON = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      if (Array.isArray(parsedData)) {
        setPreviewData(parsedData);
        setError(null);
      } else {
        setError('JSON数据必须是数组格式');
        setPreviewData([]);
      }
    } catch (err) {
      setError('JSON解析失败，请检查格式');
      setPreviewData([]);
    }
  };
  
  // 处理CSV文本输入变化
  const handleCsvInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCsvData(value);
    parseCSV(value);
  };
  
  // 处理JSON文本输入变化
  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonData(value);
    parseJSON(value);
  };
  
  // 处理导入
  const handleImport = () => {
    try {
      if (previewData.length === 0) {
        setError('没有可导入的数据');
        return;
      }
      
      // 处理数据，确保格式正确
      const processedData = previewData.map(item => {
        const user: Partial<User> = {
          fullName: String(item.fullName || '未命名用户'),
          email: String(item.email || `unknown-${Math.random().toString(36).substring(2, 9)}@example.com`),
          phone: item.phone ? String(item.phone) : undefined,
          company: item.company ? String(item.company) : undefined,
          position: item.position ? String(item.position) : undefined,
          source: (item.source as UserSource) || 'import',
          status: item.status || 'active',
          tags: [], 
          totalSpent: Number(item.totalSpent || 0),
          lastLoginAt: new Date(), 
        };
        
        return user;
      });
      
      // 导入用户
      importUsers(processedData as any);
      
      // 显示成功
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsImportingUsers(false);
        // 重置状态
        setCsvData('');
        setJsonData('');
        setPreviewData([]);
        setActiveTab('file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (err) {
      setError('导入失败，请检查数据格式');
    }
  };
  
  // 关闭对话框
  const handleClose = () => {
    setIsImportingUsers(false);
    setCsvData('');
    setJsonData('');
    setPreviewData([]);
    setError(null);
    setSuccess(false);
    setActiveTab('file');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Dialog open={isImportingUsers} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>导入用户</DialogTitle>
          <DialogDescription>
            通过上传CSV或JSON文件批量导入用户数据
          </DialogDescription>
        </DialogHeader>
        
        {success ? (
          <div className="py-8">
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>导入成功</AlertTitle>
              <AlertDescription>
                已成功导入 {previewData.length} 位用户
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file">文件上传</TabsTrigger>
              <TabsTrigger value="csv">CSV</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="file" className="pt-4">
              <div className="py-6">
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <Upload className="h-8 w-8 mb-2 mx-auto text-muted-foreground" />
                  <div className="text-lg mb-2">上传CSV或JSON文件</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    拖放文件到此处或点击选择文件
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    选择文件
                  </Button>
                </div>
                
                {isUploading && (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <Label>上传进度</Label>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="csv" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Label>CSV数据 (一行一条记录，逗号分隔)</Label>
                </div>
                <Textarea
                  value={csvData}
                  onChange={handleCsvInputChange}
                  placeholder={SAMPLE_CSV}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  必须包含 fullName、email 字段，其他字段可选
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <Label>JSON数据 (用户对象数组)</Label>
                </div>
                <Textarea
                  value={jsonData}
                  onChange={handleJsonInputChange}
                  placeholder={SAMPLE_JSON}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  JSON必须是对象数组格式，每个对象代表一个用户
                </p>
              </div>
            </TabsContent>
            
            {/* 数据预览 */}
            {previewData.length > 0 && (
              <div className="mt-4 border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">预览数据 ({previewData.length} 条记录)</h3>
                <div className="max-h-[200px] overflow-auto">
                  <pre className="text-xs text-muted-foreground">
                    {JSON.stringify(previewData.slice(0, 3), null, 2)}
                    {previewData.length > 3 && '\n...'}
                  </pre>
                </div>
              </div>
            )}
            
            {/* 错误提示 */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>发生错误</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </Tabs>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button 
            onClick={handleImport}
            disabled={isUploading || previewData.length === 0 || success}
          >
            导入 {previewData.length} 位用户
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportUsersDialog; 