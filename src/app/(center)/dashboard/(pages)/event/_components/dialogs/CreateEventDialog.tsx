"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Check,
  CalendarDays,
  Clock,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";
import { format, addDays, addHours } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useEvents, EmailTemplate, TargetAudience, EventType } from "../context/EventContext";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { templates, audiences, createEvent } = useEvents();
  
  // 事件表单状态
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("promotion");
  
  // 模板选择状态
  const [searchTemplateQuery, setSearchTemplateQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  
  // 受众选择状态
  const [searchAudienceQuery, setSearchAudienceQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<TargetAudience | null>(null);
  
  // 发送时间状态
  const [scheduleType, setScheduleType] = useState<"now" | "later">("later");
  const [scheduledDate, setScheduledDate] = useState<Date>(addDays(new Date(), 1));
  
  // 表单步骤
  const [activeTab, setActiveTab] = useState("basic");
  
  // 处理表单提交
  const handleSubmit = () => {
    if (!name || !selectedTemplate || !selectedAudience) {
      alert("请填写所有必填字段");
      return;
    }
    
    // 创建事件
    createEvent({
      name,
      description,
      type: eventType,
      status: scheduleType === "now" ? "sending" : "scheduled",
      template: selectedTemplate,
      audience: selectedAudience,
      scheduledDate: scheduleType === "now" ? new Date() : scheduledDate,
    });
    
    // 重置表单并关闭对话框
    resetForm();
    onClose();
  };
  
  // 重置表单
  const resetForm = () => {
    setName("");
    setDescription("");
    setEventType("promotion");
    setSearchTemplateQuery("");
    setSelectedTemplate(null);
    setSearchAudienceQuery("");
    setSelectedAudience(null);
    setScheduleType("later");
    setScheduledDate(addDays(new Date(), 1));
    setActiveTab("basic");
  };
  
  // 筛选模板
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTemplateQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTemplateQuery.toLowerCase())
  );
  
  // 筛选受众
  const filteredAudiences = audiences.filter(audience =>
    audience.name.toLowerCase().includes(searchAudienceQuery.toLowerCase()) ||
    audience.description?.toLowerCase().includes(searchAudienceQuery.toLowerCase())
  );
  
  // 获取事件类型标签
  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case "promotion":
        return "促销活动";
      case "newsletter":
        return "新闻通讯";
      case "announcement":
        return "公告";
      case "welcome":
        return "欢迎邮件";
      case "reminder":
        return "提醒邮件";
      default:
        return "其他";
    }
  };
  
  // 计算表单是否完成
  const basicInfoComplete = name.trim().length > 0 && eventType;
  const templateSelected = !!selectedTemplate;
  const audienceSelected = !!selectedAudience;
  const allComplete = basicInfoComplete && templateSelected && audienceSelected;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建新事件</DialogTitle>
          <DialogDescription>
            通过选择目标受众和邮件模板，创建一个新的营销事件
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`h-5 w-5 p-0 flex items-center justify-center rounded-full ${
                  basicInfoComplete ? "bg-green-100 border-green-500 text-green-700" : ""
                }`}
              >
                {basicInfoComplete ? <Check className="h-3 w-3" /> : "1"}
              </Badge>
              基本信息
            </TabsTrigger>
            <TabsTrigger value="template" className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`h-5 w-5 p-0 flex items-center justify-center rounded-full ${
                  templateSelected ? "bg-green-100 border-green-500 text-green-700" : ""
                }`}
              >
                {templateSelected ? <Check className="h-3 w-3" /> : "2"}
              </Badge>
              选择模板
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`h-5 w-5 p-0 flex items-center justify-center rounded-full ${
                  audienceSelected ? "bg-green-100 border-green-500 text-green-700" : ""
                }`}
              >
                {audienceSelected ? <Check className="h-3 w-3" /> : "3"}
              </Badge>
              选择受众
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                4
              </Badge>
              计划发送
            </TabsTrigger>
          </TabsList>
          
          {/* 基本信息 */}
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">事件名称 *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：夏季促销活动"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">事件描述</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="简要描述此次事件的目的和内容"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">事件类型 *</Label>
                <Select value={eventType} onValueChange={(value) => setEventType(value as EventType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择事件类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotion">促销活动</SelectItem>
                    <SelectItem value="newsletter">新闻通讯</SelectItem>
                    <SelectItem value="announcement">公告</SelectItem>
                    <SelectItem value="welcome">欢迎邮件</SelectItem>
                    <SelectItem value="reminder">提醒邮件</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant={basicInfoComplete ? "default" : "outline"} 
                  onClick={() => setActiveTab("template")}
                  disabled={!basicInfoComplete}
                >
                  下一步：选择模板
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* 选择模板 */}
          <TabsContent value="template" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索模板..."
                  value={searchTemplateQuery}
                  onChange={(e) => setSearchTemplateQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" onClick={() => setSearchTemplateQuery("")}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pb-4 pr-2">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow ${
                      selectedTemplate?.id === template.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                          <img 
                            src={template.thumbnail} 
                            alt={template.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
                  没有找到匹配的模板
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                返回
              </Button>
              <Button 
                variant={templateSelected ? "default" : "outline"} 
                onClick={() => setActiveTab("audience")}
                disabled={!templateSelected}
              >
                下一步：选择受众
              </Button>
            </div>
          </TabsContent>
          
          {/* 选择受众 */}
          <TabsContent value="audience" className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索受众..."
                  value={searchAudienceQuery}
                  onChange={(e) => setSearchAudienceQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" onClick={() => setSearchAudienceQuery("")}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pb-4 pr-2">
              {filteredAudiences.length > 0 ? (
                filteredAudiences.map((audience) => (
                  <Card 
                    key={audience.id}
                    className={`cursor-pointer transition-all hover:shadow ${
                      selectedAudience?.id === audience.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedAudience(audience)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{audience.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {audience.description}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {audience.count.toLocaleString()}人
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  没有找到匹配的受众
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab("template")}>
                返回
              </Button>
              <Button 
                variant={audienceSelected ? "default" : "outline"} 
                onClick={() => setActiveTab("schedule")}
                disabled={!audienceSelected}
              >
                下一步：计划发送
              </Button>
            </div>
          </TabsContent>
          
          {/* 计划发送 */}
          <TabsContent value="schedule" className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>发送时间</Label>
                <div className="flex gap-3">
                  <Card
                    className={`flex-1 cursor-pointer transition-all ${
                      scheduleType === "now" ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setScheduleType("now")}
                  >
                    <CardContent className="p-3 flex gap-3 items-center">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <div>
                        <h4 className="font-medium">立即发送</h4>
                        <p className="text-xs text-muted-foreground">
                          创建后立即发送给选定的受众
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card
                    className={`flex-1 cursor-pointer transition-all ${
                      scheduleType === "later" ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setScheduleType("later")}
                  >
                    <CardContent className="p-3 flex gap-3 items-center">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">计划发送</h4>
                        <p className="text-xs text-muted-foreground">
                          选择特定的日期和时间发送
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {scheduleType === "later" && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
                      <Label>选择发送日期和时间</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm mb-1">日期：</p>
                        <Input
                          type="date"
                          value={format(scheduledDate, 'yyyy-MM-dd')}
                          onChange={(e) => {
                            const newDate = new Date(e.target.value);
                            if (!isNaN(newDate.getTime())) {
                              newDate.setHours(scheduledDate.getHours());
                              newDate.setMinutes(scheduledDate.getMinutes());
                              setScheduledDate(newDate);
                            }
                          }}
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm mb-1">时间：</p>
                        <Input
                          type="time"
                          value={format(scheduledDate, 'HH:mm')}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':').map(Number);
                            const newDate = new Date(scheduledDate);
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);
                            setScheduledDate(newDate);
                          }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      计划发送时间：{format(scheduledDate, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3 pt-4">
              <h3 className="font-medium">事件摘要</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">事件名称：</span>
                  <span className="font-medium">{name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">事件类型：</span>
                  <span className="font-medium">{getEventTypeLabel(eventType)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">使用模板：</span>
                  <span className="font-medium">{selectedTemplate?.name || "未选择"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">目标受众：</span>
                  <span className="font-medium">
                    {selectedAudience ? `${selectedAudience.name} (${selectedAudience.count.toLocaleString()}人)` : "未选择"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">发送时间：</span>
                  <span className="font-medium">
                    {scheduleType === "now" ? "立即发送" : format(scheduledDate, 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab("audience")}>
                返回
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!allComplete}
              >
                创建事件
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog; 