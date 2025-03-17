import { atom, useAtom } from "jotai"
import { Mail } from "@/lib/data"

type Template = {
  id: string
  name: string
  subject: string
  content: string
}

type TemplateState = {
  templates: Template[]
  selectedId: string | null
  isEditing: boolean
}

const templateAtom = atom<TemplateState>({
  templates: [],
  selectedId: null,
  isEditing: false
})

export function useTemplate() {
  const [state, setState] = useAtom(templateAtom)

  const addTemplate = (template: Omit<Template, "id">) => {
    setState(prev => ({
      ...prev,
      templates: [...prev.templates, {
        ...template,
        id: crypto.randomUUID()
      }]
    }))
  }

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    setState(prev => ({
      ...prev,
      templates: prev.templates.map(template =>
        template.id === id ? { ...template, ...updates } : template
      )
    }))
  }

  const deleteTemplate = (id: string) => {
    setState(prev => ({
      ...prev,
      templates: prev.templates.filter(template => template.id !== id),
      selectedId: prev.selectedId === id ? null : prev.selectedId
    }))
  }

  const selectTemplate = (id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedId: id,
      isEditing: false
    }))
  }

  const setEditing = (editing: boolean) => {
    setState(prev => ({
      ...prev,
      isEditing: editing
    }))
  }

  return {
    templates: state.templates,
    selectedTemplate: state.templates.find(t => t.id === state.selectedId),
    isEditing: state.isEditing,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    selectTemplate,
    setEditing
  }
} 