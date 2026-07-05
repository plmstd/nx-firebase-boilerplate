'use client';

import { useState } from 'react';
import { SettingsIcon } from '@myapp/icons';
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Chip,
  Collapsible,
  ConfirmDialog,
  DataGrid,
  Dialog,
  Drawer,
  EmptyState,
  FormField,
  IconButton,
  Input,
  KPI,
  List,
  MenuDropdown,
  Modal,
  Navbar,
  PageHeader,
  Pagination,
  Popover,
  Progress,
  Radio,
  SearchBar,
  Select,
  Sidebar,
  Skeleton,
  Slider,
  Spinner,
  Stat,
  Switch,
  Table,
  Tabs,
  Tag,
  Textarea,
  Timeline,
  Toast,
  Tooltip,
} from '@myapp/ui';

const demoRows = [
  { name: 'Anna Becker', plan: 'Pro', status: 'Active' },
  { name: 'Mika Schmidt', plan: 'Starter', status: 'Pending' },
];

const demoColumns = [
  { key: 'name', header: 'Name' },
  { key: 'plan', header: 'Plan' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <Badge tone={value === 'Active' ? 'success' : 'warning'}>{value}</Badge>
    ),
  },
];

function Label({ children }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
      {children}
    </p>
  );
}

export default function StylesheetPage() {
  const [page, setPage] = useState(1);
  const [switchOn, setSwitchOn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background p-6 text-text md:p-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <PageHeader
          title="UI Stylesheet"
          subtitle="Reference page for all shared components from @myapp/ui."
          actions={
            <Button onClick={() => setModalOpen(true)}>Quick Preview</Button>
          }
        />

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-text">1. Foundations</h2>
          <Card className="space-y-4">
            <p className="text-sm text-text">
              Typography and token-based colors.
            </p>
            <Label>Badges</Label>
            <div className="flex items-center gap-2">
              <Badge>Badge</Badge>
              <Chip>Chip</Chip>
              <Tag>Tag</Tag>
            </div>
            <Label>Color Surfaces</Label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-border bg-surface p-4">
                Surface
              </div>
              <div className="rounded-lg border border-border bg-surface-elevated p-4">
                Surface Elevated
              </div>
              <div className="rounded-lg border border-border bg-primary p-4 text-text-inverted">
                Primary
              </div>
              <div className="rounded-lg border border-border bg-error p-4 text-text-inverted">
                Error
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-text">2. Primitives</h2>
          <Card className="space-y-4">
            <Label>Buttons</Label>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <IconButton aria-label="Settings">
                <SettingsIcon />
              </IconButton>
              <a
                href="#"
                className="text-primary underline-offset-2 hover:underline"
              >
                Inline Link
              </a>
            </div>
            <Label>Avatar & Image</Label>
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <p className="text-sm text-text-muted">Avatar</p>
                <Avatar src="https://i.pravatar.cc/80?img=12" alt="Avatar" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-text-muted">Image</p>
                <img
                  src="https://picsum.photos/120/80"
                  alt="Random"
                  className="h-16 w-24 rounded-lg object-cover"
                />
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-text">3. Forms</h2>
          <Card className="space-y-4">
            <Label>Field Inputs</Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Email" hint="We never share your email.">
                <Input placeholder="name@example.com" />
              </FormField>
              <FormField label="Plan">
                <Select defaultValue="pro">
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                </Select>
              </FormField>
            </div>
            <FormField label="Message">
              <Textarea placeholder="Type something..." />
            </FormField>
            <Label>Checks, Switches & Slider</Label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox defaultChecked />
                Accept terms
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Radio name="role" defaultChecked />
                Admin
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Radio name="role" />
                Editor
              </label>
              <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
              <span className="text-sm text-text-muted">
                Switch: {switchOn ? 'On' : 'Off'}
              </span>
            </div>
            <Slider defaultValue={45} />
            <Label>SearchBar</Label>
            <SearchBar onSubmit={() => {}} />
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-text">4. Feedback</h2>
          <Card className="space-y-4">
            <Label>Alerts</Label>
            <div className="flex flex-col gap-4">
              <Alert>Default alert</Alert>
              <Alert tone="success">Success alert</Alert>
              <Alert tone="warning">Warning alert</Alert>
              <Alert tone="error">Error alert</Alert>
            </div>
            <Label>Banner, Spinner, Progress, Toast, Skeleton</Label>
            <Banner>Informational banner message.</Banner>
            <div className="flex items-center gap-4">
              <Spinner />
              <Progress value={64} className="max-w-sm" />
              <Toast>Toast preview</Toast>
            </div>
            <Skeleton className="h-10 w-full max-w-md" />
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-text">5. Navigation</h2>
          <Card className="space-y-4">
            <Label>Navbar & Breadcrumb</Label>
            <Navbar className="">Navbar</Navbar>
            <Breadcrumb
              items={[
                { label: 'Home', href: '#' },
                { label: 'Settings', href: '#' },
                { label: 'Profile' },
              ]}
            />
            <Label>Tabs, Pagination & Menu</Label>
            <Tabs
              items={[
                {
                  label: 'Overview',
                  value: 'overview',
                  content: (
                    <p className="text-sm text-text">Overview content</p>
                  ),
                },
                {
                  label: 'Details',
                  value: 'details',
                  content: <p className="text-sm text-text">Details content</p>,
                },
              ]}
            />
            <div className="flex items-center gap-3">
              <Pagination
                page={page}
                totalPages={5}
                onPageChange={(next) => setPage(Math.max(1, Math.min(5, next)))}
              />
              <MenuDropdown
                label="Menu"
                items={[{ label: 'Profile' }, { label: 'Billing' }]}
              />
            </div>
            <Label>Accordion, Collapsible & Sidebar</Label>
            <Accordion title="Accordion Item">Accordion content</Accordion>
            <Collapsible trigger="Toggle Collapsible">
              Collapsible content
            </Collapsible>
            <Sidebar className="h-28 rounded-lg">Sidebar</Sidebar>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-text">6. Data Display</h2>
          <Card className="space-y-4">
            <Label>Stats / KPI</Label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Stat label="Visitors" value="12,842" helper="+8.2% this week" />
              <KPI label="Conversion" value="4.8%" helper="+0.5%" />
              <Card>Nested Card</Card>
            </div>
            <Label>DataGrid & Table</Label>
            <DataGrid rows={demoRows} columns={demoColumns} />
            <Table>
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-3 py-2">Digital Card</td>
                  <td className="px-3 py-2">Live</td>
                </tr>
              </tbody>
            </Table>
            <Label>List, Timeline & Empty State</Label>
            <List>
              <li>List item one</li>
              <li>List item two</li>
            </List>
            <Timeline
              items={[
                {
                  title: 'Account created',
                  description: 'Initial setup completed.',
                },
                {
                  title: 'Card published',
                  description: 'Public profile is now live.',
                },
              ]}
            />
            <EmptyState
              title="No contacts yet"
              description="Add your first contact to start building your network."
              action={<Button variant="secondary">Add Contact</Button>}
            />
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-text">7. Overlay</h2>
          <Card className="space-y-4">
            <Label>Modal, Dialog, Drawer, Confirm, Popover, Tooltip</Label>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                Open Dialog
              </Button>
              <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
                Open Drawer
              </Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                Open Confirm
              </Button>
              <Popover trigger={<Button variant="secondary">Popover</Button>}>
                <p className="text-sm text-text">Popover content</p>
              </Popover>
              <Tooltip content="Helpful tooltip">
                <Button variant="ghost">Hover me</Button>
              </Tooltip>
            </div>
          </Card>
        </section>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modal">
        Modal preview content.
      </Modal>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Dialog"
      >
        Dialog preview content.
      </Dialog>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <h3 className="text-lg font-semibold text-text">Drawer</h3>
        <p className="mt-2 text-sm text-text">Drawer preview content.</p>
      </Drawer>
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </main>
  );
}
