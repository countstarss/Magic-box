"use client"

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getInitials } from '@/lib/utils'
import { Mail } from '@/lib/data'
import { formatDistanceToNow } from 'date-fns'
import { Loader2, FileText, AlertCircle, Archive, Trash2, Reply } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getBadgeVariantFromLabel } from './badgeHighlight'
import { useMail } from '@/hooks/use-mail'
import { AIMailAnalysisResult } from '@/lib/ai-mail-analysis'

interface MailDetailProps {
  mail: Mail
}

const MailDetail: React.FC<MailDetailProps> = ({ mail }) => {
  const { analyzeEmail, getMailAnalysis } = useMail()
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AIMailAnalysisResult | null>(null)
  
  // 初始化时检查是否有缓存的分析结果
  useEffect(() => {
    const cachedAnalysis = getMailAnalysis(mail.id)
    if (cachedAnalysis) {
      setAnalysis(cachedAnalysis)
    }
  }, [mail.id, getMailAnalysis])
  
  // 处理分析请求
  const handleAnalyzeEmail = async () => {
    setAnalyzing(true)
    try {
      const result = await analyzeEmail(mail.id)
      if (result) {
        setAnalysis(result)
      }
    } catch (error) {
      console.error("Error analyzing email:", error)
    } finally {
      setAnalyzing(false)
    }
  }
  
  // 获取情感分析的颜色
  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'text-green-500'
      case 'negative': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }
  
  // 获取优先级的颜色
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-bold">{mail.subject}</h2>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(mail.date), { addSuffix: true })}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="content" className="flex-1 overflow-hidden">
        <TabsList className="px-4 pt-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analysis">
            Analysis
            {analyzing && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="flex-1 overflow-auto p-4">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${mail.name}&background=random`} />
              <AvatarFallback>{getInitials(mail.name)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <div className="font-semibold">{mail.name}</div>
              <div className="text-sm text-muted-foreground">{mail.email}</div>
            </div>
          </div>
          
          <div className="mb-4">
            {mail.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {mail.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {/* 如果邮件内容是HTML，可以用dangerouslySetInnerHTML */}
            <p className="whitespace-pre-line">{mail.text}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="flex-1 overflow-auto p-4">
          {!analysis && !analyzing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No analysis available</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Analyze this email to get insights about sentiment, priority, and key information.
              </p>
              <Button onClick={handleAnalyzeEmail}>
                Analyze Email
              </Button>
            </div>
          ) : analyzing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-lg font-medium">Analyzing email...</h3>
              <p className="text-sm text-muted-foreground text-center">
                Our AI is processing the content to extract insights.
              </p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Sentiment</p>
                      <p className={`text-base font-medium capitalize ${getSentimentColor(analysis.sentiment)}`}>
                        {analysis.sentiment}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Priority</p>
                      <p className={`text-base font-medium capitalize ${getPriorityColor(analysis.priority)}`}>
                        {analysis.priority}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                      <p className="text-base font-medium capitalize">{analysis.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Important</p>
                      <p className="text-base font-medium">{analysis.important ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {analysis.summary && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-2">Summary</h3>
                    <p className="text-sm">{analysis.summary}</p>
                  </CardContent>
                </Card>
              )}
              
              {analysis.autoLabels.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-2">Suggested Labels</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.autoLabels.map(label => (
                        <Badge key={label} variant="outline">{label}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {analysis.keywords.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-2">Key Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map(keyword => (
                        <Badge key={keyword} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {analysis.actionItems && analysis.actionItems.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-2">Action Items</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {analysis.actionItems.map((item, index) => (
                        <li key={index} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              {analysis.spam && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <h3 className="text-lg font-medium text-red-500">Possible Spam</h3>
                    </div>
                    <p className="text-sm mt-2">
                      This email has been identified as potential spam. Please review carefully.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MailDetail 