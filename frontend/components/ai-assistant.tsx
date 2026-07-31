'use client'

import * as React from 'react'
import { ArrowUp, Sparkles, TrendingUp } from 'lucide-react'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller'
import { Message, MessageContent } from '@/components/ui/message'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { chatWithAssistant } from '@/lib/api'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      "Hi! I'm your OpsFlow assistant. I can analyze your cashflow, track overdue invoices, suggest reorders, and surface business insights. What would you like to know?",
  },
]

const aiSuggestions = [
  'Summarize my invoices',
  'Which products need reordering?',
  'What tasks are open?',
  'Show me unread notifications',
]

export function AiAssistant({ showInsights = true }: { showInsights?: boolean }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = React.useState('')
  const [isThinking, setIsThinking] = React.useState(false)

  const sendMessage = React.useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isThinking) return
      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
      }
      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsThinking(true)
      try {
        const { response } = await chatWithAssistant(trimmed)
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', content: response },
        ])
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', content: 'Sorry, I couldn\'t reach the backend. Is the server running?' },
        ])
      } finally {
        setIsThinking(false)
      }
    },
    [isThinking],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {showInsights && (
        <div className="flex flex-col gap-2 border-b border-border p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <TrendingUp className="size-3.5" />
            Business Insights
          </div>
          <p className="text-xs text-muted-foreground">
            Ask me about your invoices, inventory, tasks, or notifications for real-time insights.
          </p>
        </div>
      )}

      <MessageScrollerProvider>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-4">
              {messages.map((message) => (
                <MessageScrollerItem key={message.id}>
                  <Message align={message.role === 'user' ? 'end' : 'start'}>
                    <MessageContent>
                      <Bubble
                        variant={message.role === 'user' ? 'default' : 'secondary'}
                        align={message.role === 'user' ? 'end' : 'start'}
                      >
                        <BubbleContent>{message.content}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
              {isThinking && (
                <MessageScrollerItem>
                  <Message align="start">
                    <MessageContent>
                      <Bubble variant="secondary" align="start">
                        <BubbleContent>
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Spinner className="size-3.5" />
                            Analyzing your data…
                          </span>
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <div className="flex flex-col gap-3 border-t border-border p-4">
        <div className="flex flex-wrap gap-1.5">
          {aiSuggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => sendMessage(suggestion)}
            >
              <Sparkles className="size-3" />
              {suggestion}
            </Badge>
          ))}
        </div>
        <InputGroup>
          <InputGroupTextarea
            placeholder="Ask about your business…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <InputGroupAddon align="inline-end">
            <Button
              size="icon-sm"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isThinking}
              aria-label="Send message"
            >
              <ArrowUp />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  )
}
