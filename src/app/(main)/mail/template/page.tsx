"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTemplate } from '@/hooks/use-template';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Save, Trash, Edit, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const TemplatePage = () => {
  const {
    templates,
    selectedTemplate,
    isEditing,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    selectTemplate,
    setEditing
  } = useTemplate();

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: ''
  });

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.subject && newTemplate.content) {
      addTemplate(newTemplate);
      setNewTemplate({ name: '', subject: '', content: '' });
    }
  };

  const handleUpdateTemplate = () => {
    if (selectedTemplate && isEditing) {
      updateTemplate(selectedTemplate.id, newTemplate);
      setEditing(false);
    }
  };

  const handleEditClick = (template: any) => {
    setNewTemplate({
      name: template.name,
      subject: template.subject,
      content: template.content
    });
    selectTemplate(template.id);
    setEditing(true);
  };

  return (
    <div className="flex h-screen">
      {/* Template List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Email Templates</h2>
          <Button
            onClick={() => {
              selectTemplate(null);
              setNewTemplate({ name: '', subject: '', content: '' });
              setEditing(false);
            }}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-4 space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer hover:bg-accent",
                  selectedTemplate?.id === template.id && "bg-muted"
                )}
                onClick={() => selectTemplate(template.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{template.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(template);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTemplate(template.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {template.subject}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Template Editor */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Name</label>
            <Input
              value={newTemplate.name}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter template name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={newTemplate.subject}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter email subject"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={newTemplate.content}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter email content"
              className="min-h-[300px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleUpdateTemplate}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Template
                </Button>
              </>
            ) : (
              <Button onClick={handleAddTemplate}>
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;