"use client"

import React from 'react'
import { Separator } from '@/components/ui/separator'
import CategoryManager from '../../mail/components/CategoryManager'

export const metadata = {
  title: 'Email Categories | WizMail',
  description: 'Manage your email categories and filtering rules',
}

export default function CategoriesSettingsPage() {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Email Categories</h2>
        <p className="text-muted-foreground">
          Manage how your emails are automatically categorized
        </p>
      </div>
      <Separator className="my-6" />
      
      <div className="grid gap-6">
        <CategoryManager />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">About Categories</h3>
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="mb-2">
              <strong>How categories work:</strong> Categories help you organize emails based on rules.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create a category with a name and icon</li>
              <li>Define rules based on sender, subject, or content</li>
              <li>Your emails will be automatically categorized</li>
              <li>Filter your inbox by clicking on a category in the sidebar</li>
            </ul>
            <p className="mt-2">
              Categories help you prioritize important emails and keep your inbox organized.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 