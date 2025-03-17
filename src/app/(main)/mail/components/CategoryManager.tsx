"use client"

import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { userCategoriesAtom, CategoryRule, addCategory, updateCategory, removeCategory } from '@/lib/user-categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash, Edit, Settings } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

// 支持的图标列表
const availableIcons = [
  'Users2', 'AlertCircle', 'MessagesSquare', 'ShoppingCart', 'Archive',
  'Star', 'Heart', 'Flag', 'Clock', 'Bookmark', 'Book', 'Code', 'Coffee',
  'FileText', 'Gift', 'Globe', 'Home', 'Image', 'Link', 'Mail',
  'Map', 'Mic', 'Music', 'Package', 'Phone', 'Settings', 'Tag',
  'Video', 'Zap', 'Award'
]

const CategoryManager: React.FC = () => {
  const [userCategories, setUserCategories] = useAtom(userCategoriesAtom)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<CategoryRule | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // 用于表单内容的状态
  const [formState, setFormState] = useState<Partial<CategoryRule>>({
    name: '',
    icon: 'Tag',
    description: '',
    conditions: [{ type: 'subject', value: '', operation: 'contains' }]
  })

  const resetForm = () => {
    setFormState({
      name: '',
      icon: 'Tag',
      description: '',
      conditions: [{ type: 'subject', value: '', operation: 'contains' }]
    })
    setCurrentCategory(null)
    setIsEditing(false)
  }

  const handleOpenDialog = (category?: CategoryRule) => {
    if (category) {
      setFormState({ ...category })
      setCurrentCategory(category)
      setIsEditing(true)
    } else {
      resetForm()
      setIsEditing(false)
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    resetForm()
    setIsDialogOpen(false)
  }

  const handleAddCondition = () => {
    setFormState(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), { type: 'subject', value: '', operation: 'contains' }]
    }))
  }

  const handleRemoveCondition = (index: number) => {
    setFormState(prev => ({
      ...prev,
      conditions: (prev.conditions || []).filter((_, i) => i !== index)
    }))
  }

  const handleConditionChange = (index: number, field: string, value: string) => {
    setFormState(prev => {
      const newConditions = [...(prev.conditions || [])]
      newConditions[index] = { ...newConditions[index], [field]: value }
      return { ...prev, conditions: newConditions }
    })
  }

  const handleSaveCategory = () => {
    if (!formState.name || !formState.icon || !(formState.conditions && formState.conditions.length > 0)) {
      // 表单验证失败
      alert('Please fill in all required fields.')
      return
    }

    const categoryToSave: CategoryRule = {
      id: isEditing && currentCategory ? currentCategory.id : uuidv4(),
      name: formState.name || '',
      icon: formState.icon || 'Tag',
      description: formState.description || '',
      conditions: formState.conditions || []
    }

    if (isEditing && currentCategory) {
      setUserCategories(updateCategory(categoryToSave))
    } else {
      setUserCategories(addCategory(categoryToSave))
    }

    handleCloseDialog()
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setUserCategories(removeCategory(categoryId))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Email Categories</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <span>{category.name}</span>
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium mb-2">Conditions:</p>
                <ul className="list-disc list-inside space-y-1">
                  {category.conditions.map((condition, index) => (
                    <li key={index} className="text-xs">
                      {condition.type} {condition.operation} "{condition.value}"
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              Define rules for automatically categorizing your emails.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formState.name || ''}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Work, Family, Bills"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formState.icon}
                    onValueChange={(value) => setFormState(prev => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Icons</SelectLabel>
                        {availableIcons.map(icon => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formState.description || ''}
                  onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this category is for"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="conditions" className="py-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add one or more conditions to define when emails should be assigned to this category.
                </p>

                {formState.conditions?.map((condition, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 items-center">
                    <Select
                      value={condition.type}
                      onValueChange={(value) => handleConditionChange(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sender">Sender</SelectItem>
                        <SelectItem value="subject">Subject</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="label">Label</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={condition.operation}
                      onValueChange={(value) => handleConditionChange(index, 'operation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="startsWith">Starts with</SelectItem>
                        <SelectItem value="endsWith">Ends with</SelectItem>
                        <SelectItem value="regex">Regex</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      value={condition.value}
                      onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                      placeholder="Value to match"
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCondition(index)}
                      disabled={formState.conditions?.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" onClick={handleAddCondition}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Condition
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              {isEditing ? 'Update' : 'Create'} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoryManager 