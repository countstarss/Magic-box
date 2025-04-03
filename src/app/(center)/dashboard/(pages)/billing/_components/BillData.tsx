"use client"

import React, { useState } from "react";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



// 数据示例
const rows = [
  {
    id: 1,
    name: "完整上传服务+React-dropzone",
    category: "React/Next",
    date: "2024-12-06 18:01",
    link: "https://example.com",
  },
  {
    id: 2,
    name: "2023年React面试题",
    category: "React/Next",
    date: "2024-12-06 18:02",
    link: "https://example2.com",
  },
  {
    id: 3,
    name: "Supabase本地开发",
    category: "Supabase",
    date: "2024-12-05 00:08",
    link: "https://example3.com",
  },
  {
    id: 1,
    name: "完整上传服务+React-dropzone",
    category: "React/Next",
    date: "2024-12-06 18:01",
    link: "https://example.com",
  }
  // 更多数据...
];

// 标签选项
const tags = ["All", "React/Next", "Supabase", "Database", "Prisma", "Auth"];

const BillData = () => {
  const [filter, setFilter] = useState(""); // 筛选条件
  const [selectedTag, setSelectedTag] = useState(""); // 当前选择的标签
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });


  // 表格列定义
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "名称", width: 250 },
    { field: "category", headerName: "分类", width: 150 },
    { field: "date", headerName: "创建时间", width: 200 },
    {
      field: "link",
      headerName: "链接",
      width: 250,
      renderCell: (params: any) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
  ];

  // 根据筛选条件过滤数据
  const filteredRows = rows.filter((row) => {
    return (
      (!filter || row.name.toLowerCase().includes(filter.toLowerCase())) &&
      (!selectedTag || row.category === selectedTag)
    );
  });

  return (
    <div className="p-4 space-y-4 h-[calc(100vh-200px)] overflow-y-scroll">
      {/* 筛选部分 */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* 搜索框 */}
        <Input
          className="lg:w-1/4 w-full"
          placeholder="搜索名称"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
        />

        {/* 标签筛选 */}
        <Select
          value={selectedTag}
          onValueChange={(value) => setSelectedTag(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择标签" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"All"}>
            </SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 表格 */}
      </div>
      <div className="h-[calc(100vh-290px)] w-full">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          pageSizeOptions={[5, 10, 15]}
        />
      </div>
    </div>
  );
};

export default BillData;