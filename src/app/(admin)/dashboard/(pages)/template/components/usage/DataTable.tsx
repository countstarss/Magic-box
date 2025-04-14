"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ChevronLeft, ChevronRight, Eye, Pencil } from "lucide-react";
import { VariableData } from "@/lib/utils/template-variables";

interface DataTableProps {
  data: VariableData[];
  columns: string[];
  onUpdate: (index: number, field: string, value: string) => void;
  onDelete: (index: number) => void;
  onEdit?: (index: number) => void;
  onPreview?: (index: number) => void;
  actions?: (rowIndex: number) => React.ReactNode; // 添加自定义操作的支持
}

export function DataTable({ 
  data, 
  columns, 
  onUpdate, 
  onDelete,
  onEdit,
  onPreview,
  actions
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  // 计算总页数
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  
  // 获取当前页的数据
  const getCurrentPageData = () => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  };
  
  // 翻页控制
  const goToNextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };
  
  const goToPrevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };
  
  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">序号</TableHead>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
              <TableHead className="w-[120px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageData().map((row, rowIndex) => {
              const actualIndex = (currentPage - 1) * rowsPerPage + rowIndex;
              return (
                <TableRow key={actualIndex}>
                  <TableCell className="font-medium">{actualIndex + 1}</TableCell>
                  {columns.map((column) => (
                    <TableCell key={`${actualIndex}-${column}`}>
                      <Input
                        value={row[column] ? String(row[column]) : ''}
                        onChange={(e) => onUpdate(actualIndex, column, e.target.value)}
                        className="h-8"
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    {actions ? (
                      actions(actualIndex)
                    ) : (
                      <div className="flex gap-1">
                        {onPreview && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onPreview(actualIndex)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(actualIndex)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(actualIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            
            {/* 如果当前页数据不足，显示空行 */}
            {getCurrentPageData().length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} className="text-center py-6 text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* 分页控制 */}
      {data.length > rowsPerPage && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 