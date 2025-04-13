"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Upload,
  FileSpreadsheet,
  Trash,
  Download,
  Check,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { extractVariables, VariableData, getMissingVariables } from "@/lib/utils/template-variables";
import { Variable } from "../editor/VariableManager";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface DataImporterProps {
  htmlContent: string;
  variables: Variable[];
  onDataImported: (data: VariableData[]) => void;
}

export function DataImporter({
  htmlContent,
  variables,
  onDataImported,
}: DataImporterProps) {
  const { toast } = useToast();
  const [importedData, setImportedData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // 从HTML内容中提取变量
  const templateVariables = extractVariables(htmlContent);

  // 处理文件上传
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsProcessing(true);
      setProgress(10);

      try {
        // 判断文件类型
        const isCSV = file.name.endsWith(".csv");
        const isExcel =
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls");

        if (!isCSV && !isExcel) {
          throw new Error("请上传CSV或Excel文件");
        }

        // 读取文件
        const data = await readFile(file);
        setProgress(50);

        // 处理数据
        let headers: string[] = [];
        let rows: any[] = [];

        if (isCSV) {
          // 处理CSV
          const result = parseCSV(data as string);
          headers = result.headers;
          rows = result.rows;
        } else {
          // 处理Excel
          const result = parseExcel(data as ArrayBuffer);
          headers = result.headers;
          rows = result.rows;
        }

        // 设置数据和列
        setImportedData(rows);
        setColumns(headers);

        // 初始化列映射（尝试自动匹配）
        const initialMap: Record<string, string> = {};
        templateVariables.forEach((varName) => {
          // 尝试找到完全匹配的列名
          const exactMatch = headers.find(
            (h) => h.toLowerCase() === varName.toLowerCase()
          );
          if (exactMatch) {
            initialMap[varName] = exactMatch;
            return;
          }

          // 尝试部分匹配
          const partialMatch = headers.find((h) =>
            h.toLowerCase().includes(varName.toLowerCase())
          );
          if (partialMatch) {
            initialMap[varName] = partialMatch;
          }
        });

        setColumnMap(initialMap);
        setProgress(100);

        // 预验证数据
        validateData(rows, headers, initialMap);

        toast({
          title: "数据导入成功",
          description: `已导入 ${rows.length} 条记录`,
        });
      } catch (error) {
        toast({
          title: "导入失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "destructive",
        });
        console.error("Import error:", error);
      } finally {
        setIsProcessing(false);
        // 重置文件输入
        event.target.value = "";
      }
    },
    [htmlContent, toast, templateVariables]
  );

  // 读取文件内容
  const readFile = (file: File): Promise<string | ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result);
        } else {
          reject(new Error("文件读取失败"));
        }
      };
      reader.onerror = (e) => reject(e);

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file); // 读取为文本
      } else {
        reader.readAsArrayBuffer(file); // 读取为二进制
      }
    });
  };

  // 解析CSV数据
  const parseCSV = (csvData: string) => {
    // 简单的CSV解析
    const lines = csvData.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",");
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || "";
      });

      rows.push(row);
    }

    return { headers, rows };
  };

  // 解析Excel数据
  const parseExcel = (data: ArrayBuffer) => {
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 转换为JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // 提取表头和数据行
    const headers = jsonData[0] as string[];
    const rows = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const rowData = jsonData[i] as any[];
      const row: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        row[header] = rowData[index] !== undefined ? rowData[index] : "";
      });
      
      rows.push(row);
    }
    
    return { headers, rows };
  };

  // 验证导入的数据
  const validateData = (data: any[], headers: string[], mapping: Record<string, string>) => {
    const errors: string[] = [];

    // 检查必要的变量是否都有映射
    templateVariables.forEach((varName) => {
      if (!mapping[varName]) {
        errors.push(`变量 "${varName}" 没有对应的数据列`);
      }
    });

    // 检查数据行是否有空值
    if (data.length > 0) {
      // 获取需要映射的列
      const mappedColumns = Object.values(mapping);
      
      data.forEach((row, index) => {
        mappedColumns.forEach((column) => {
          if (!column) return; // 跳过未映射的变量
          
          if (!row[column] && row[column] !== 0) {
            errors.push(`第 ${index + 1} 行的 "${column}" 列缺少值`);
          }
        });
      });
    }

    // 限制错误数量以避免界面过载
    if (errors.length > 10) {
      errors.splice(10, errors.length - 10, "还有更多错误...");
    }

    setValidationErrors(errors);
  };

  // 处理映射变更
  const handleMappingChange = (variable: string, column: string) => {
    const newMapping = { ...columnMap, [variable]: column };
    setColumnMap(newMapping);
    
    // 验证新的映射
    validateData(importedData, columns, newMapping);
  };

  // 完成映射并处理数据
  const handleProcessData = () => {
    if (importedData.length === 0) {
      toast({
        title: "无法处理",
        description: "没有导入数据",
        variant: "destructive",
      });
      return;
    }

    if (validationErrors.length > 0) {
      toast({
        title: "数据有错误",
        description: "请先修复数据验证错误",
        variant: "destructive",
      });
      return;
    }

    // 转换数据
    const processedData = importedData.map(row => {
      const dataItem: VariableData = {};
      
      // 填充变量值
      Object.entries(columnMap).forEach(([variable, column]) => {
        dataItem[variable] = row[column];
      });
      
      return dataItem;
    });

    // 调用回调函数
    onDataImported(processedData);
    
    toast({
      title: "数据处理完成",
      description: `已准备 ${processedData.length} 条记录用于发送`,
    });
  };

  // 清除导入的数据
  const handleClearData = () => {
    setImportedData([]);
    setColumns([]);
    setColumnMap({});
    setValidationErrors([]);
    
    toast({
      title: "数据已清除",
      description: "所有导入的数据已被清除",
    });
  };

  // 下载示例文件
  const handleDownloadTemplate = () => {
    // 创建表头行
    const headers = templateVariables;
    
    // 创建示例数据行
    const sampleData: any = {};
    templateVariables.forEach(variable => {
      // 尝试从变量定义获取示例值
      const varDef = variables.find(v => v.name === variable);
      sampleData[variable] = varDef?.example || `[${variable}]`;
    });
    
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet([sampleData], { header: headers });
    
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    
    // 下载
    XLSX.writeFile(wb, "template_data_sample.xlsx");
    
    toast({
      title: "示例文件已下载",
      description: "您可以根据示例文件准备导入数据",
    });
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">导入收件人数据</h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              disabled={isProcessing}
            >
              <Download className="mr-2 h-4 w-4" />
              下载模板
            </Button>
          </div>
          
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                正在处理数据...
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>数据验证错误</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {importedData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  已导入 {importedData.length} 条数据，请映射列与变量的对应关系
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearData}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  清除数据
                </Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>模板变量</TableHead>
                      <TableHead>对应数据列</TableHead>
                      <TableHead>预览</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templateVariables.map((variable) => (
                      <TableRow key={variable}>
                        <TableCell className="font-mono">
                          {`{{${variable}}}`}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={columnMap[variable] || ""}
                            onValueChange={(value) =>
                              handleMappingChange(variable, value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder="选择对应的数据列"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">
                                - 未选择 -
                              </SelectItem>
                              {columns.map((column) => (
                                <SelectItem
                                  key={column}
                                  value={column}
                                >
                                  {column}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {columnMap[variable] && importedData[0]
                            ? importedData[0][columnMap[variable]]
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleProcessData}
                  disabled={
                    validationErrors.length > 0 ||
                    Object.keys(columnMap).length === 0
                  }
                >
                  <Check className="mr-2 h-4 w-4" />
                  确认并使用数据
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {importedData.length > 0 && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">数据预览</h3>
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {importedData.slice(0, 10).map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column}>
                        {row[column] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {importedData.length > 10 && (
              <div className="text-center p-2 text-sm text-muted-foreground">
                显示前10条记录，共 {importedData.length} 条
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 