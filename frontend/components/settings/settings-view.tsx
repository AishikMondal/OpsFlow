'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export function SettingsView() {
  const [theme, setTheme] = React.useState('dark')

  return (
    <Tabs defaultValue="profile" className="gap-6">
      <TabsList>
        <TabsTrigger value="profile">Company Profile</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card className="glass max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base">Company Profile</CardTitle>
            <CardDescription>Business details used across invoices and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="company-name">Company name</FieldLabel>
                <Input id="company-name" defaultValue="OpsFlow Demo Traders" />
              </Field>
              <Field>
                <FieldLabel htmlFor="company-email">Business email</FieldLabel>
                <Input
                  id="company-email"
                  type="email"
                  defaultValue="ops@demotraders.com"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="company-tax">Tax / GST ID</FieldLabel>
                <Input id="company-tax" defaultValue="GST-4821-3391" />
                <FieldDescription>Shown on generated tax reports.</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success('Profile saved')}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card className="glass max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
            <CardDescription>Theme, language, and currency</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Theme</FieldLabel>
                <ToggleGroup
                  value={[theme]}
                  onValueChange={(v: string[]) => {
                    if (v[0]) setTheme(v[0])
                  }}
                  variant="outline"
                >
                  <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
                  <ToggleGroupItem value="light">Light</ToggleGroupItem>
                  <ToggleGroupItem value="system">System</ToggleGroupItem>
                </ToggleGroup>
                <FieldDescription>
                  Dark is recommended for the OpsFlow AI experience.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="language">Language</FieldLabel>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-full sm:w-64">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency" className="w-full sm:w-64">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="usd">USD — US Dollar</SelectItem>
                      <SelectItem value="inr">INR — Indian Rupee</SelectItem>
                      <SelectItem value="eur">EUR — Euro</SelectItem>
                      <SelectItem value="gbp">GBP — British Pound</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success('Preferences saved')}>Save preferences</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="glass max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base">Notification Preferences</CardTitle>
            <CardDescription>Choose what you want to be alerted about</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {[
                { id: 'overdue', label: 'Overdue invoice alerts', desc: 'When a receivable passes its due date', on: true },
                { id: 'stock', label: 'Low stock warnings', desc: 'When a product drops below its reorder point', on: true },
                { id: 'ai', label: 'AI insights', desc: 'Proactive suggestions from the assistant', on: true },
                { id: 'digest', label: 'Weekly digest email', desc: 'A summary of operations every Monday', on: false },
              ].map((pref) => (
                <Field key={pref.id} orientation="horizontal">
                  <div className="flex flex-col gap-0.5">
                    <FieldLabel htmlFor={pref.id}>{pref.label}</FieldLabel>
                    <FieldDescription>{pref.desc}</FieldDescription>
                  </div>
                  <Switch id={pref.id} defaultChecked={pref.on} />
                </Field>
              ))}
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success('Notification settings saved')}>Save</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
