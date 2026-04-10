import './style.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Home,
  Files,
  Clock,
  Wrench,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  List,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  FolderOpen,
  ShieldCheck,
  MessageSquare,
  Check,
  Loader2,
  X,
  Share,
  Copy,
  Info,
  Trash2,
  Crown,
  Search,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Camera,
  Pen,
  Highlighter,
  Eraser,
  Undo2,
  Redo2,
  Palette,
  Presentation,
  Text,
  Star,
  CheckSquare,
  Square
} from 'lucide-react';

const FileIcon = ({ type }: { type: FileItem['type'] }) => {
  let iconComponent;
  let bgColor;
  switch (type) {
    case 'pdf':
      iconComponent = <FileText size={18} color="#fff" />;
      bgColor = '#D4463C';
      break;
    case 'doc':
      iconComponent = <FileText size={18} color="#fff" />;
      bgColor = '#2563EB';
      break;
    case 'xls':
      iconComponent = <FileSpreadsheet size={18} color="#fff" />;
      bgColor = '#16A34A';
      break;
    default:
      iconComponent = <FileText size={18} color="#fff" />;
      bgColor = '#6B7280';
  }

  return (
    <div className="pc-file-icon" style={{ backgroundColor: bgColor }}>
      {iconComponent}
    </div>
  );
};

type TabKey = 'home' | 'files' | 'recent' | 'tools';
type ScreenKey = 'settings' | 'language' | 'processing' | 'privacy' | 'feedback' | 'preview';

type FileItem = {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls';
  time: string;
  size?: string;
};

type ToolItem = {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
  icon: React.ReactNode;
};

type PreviewFile = {
  name: string;
  type: FileItem['type'];
  objectUrl?: string;
};

const DEMO_FILES: FileItem[] = [
  { id: 'f1', name: 'Q3_Financial_Report_Final_v2.pdf', type: 'pdf', time: '10:34 AM', size: '1.2MB' },
  { id: 'f2', name: 'Marketing_Strategy_2026.doc', type: 'doc', time: '10:34 AM', size: '860KB' },
  { id: 'f3', name: 'Employee_Onboarding_Handbook.pdf', type: 'pdf', time: '10:34 AM', size: '2.1MB' },
  { id: 'f4', name: 'Invoice_002931.xls', type: 'xls', time: '10:34 AM', size: '450KB' },
  { id: 'f5', name: 'Product_Design_Specs.doc', type: 'doc', time: '10:34 AM', size: '720KB' },
  { id: 'f6', name: 'Meeting_Notes_Mar_29.pdf', type: 'pdf', time: '10:34 AM', size: '510KB' },
  { id: 'f7', name: 'Annual_Budget_2026.xlsx', type: 'xls', time: 'Yesterday', size: '1.5MB' },
  { id: 'f8', name: 'Client_Contract_Signed.pdf', type: 'pdf', time: 'Yesterday', size: '3.4MB' },
  { id: 'f9', name: 'Project_Timeline.doc', type: 'doc', time: 'Mar 30', size: '420KB' },
  { id: 'f10', name: 'Design_Assets.pdf', type: 'pdf', time: 'Mar 29', size: '5.6MB' },
  { id: 'f11', name: 'Q2_Performance_Review.pdf', type: 'pdf', time: 'Mar 28', size: '1.8MB' },
  { id: 'f12', name: 'Vendor_List.xls', type: 'xls', time: 'Mar 25', size: '310KB' }
];

const usePullRefresh = (onRefresh: () => Promise<void> | void) => {
  const [state, setState] = useState<'idle' | 'pulling' | 'refreshing'>('idle');
  const startYRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;

    // Only trigger pull-to-refresh if at the top of the container
    if (container.scrollTop <= 0) {
      startYRef.current = e.touches[0].clientY;
      setState('pulling');
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (state !== 'pulling' && state !== 'refreshing') return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    
    if (diff > 0 && state === 'pulling') {
      e.preventDefault();
    }
  }, [state]);

  const handleTouchEnd = useCallback(async () => {
    if (state !== 'pulling') return;

    const container = containerRef.current;
    if (!container) return;

    setState('refreshing');
    
    try {
      await onRefresh();
    } finally {
      setTimeout(() => {
        setState('idle');
      }, 500);
    }
  }, [state, onRefresh]);

  return {
    state,
    containerRef,
    eventHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
};

const ToolGlyph = ({
  color,
  icon
}: {
  color: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="pc-glyph" style={{ backgroundColor: color }}>
      <div className="pc-glyph-icon">{icon}</div>
    </div>
  );
};

const Sheet = ({
  title,
  items,
  onClose
}: {
  title?: string;
  items: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    destructive?: boolean;
    onPress: () => void;
  }>;
  onClose: () => void;
}) => {
  return (
    <div className="pc-sheet-overlay" onClick={onClose}>
      <div className="pc-sheet pc-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="pc-sheet-group">
          {title ? (
            <div className="pc-sheet-header">
              <div className="pc-sheet-title">{title}</div>
            </div>
          ) : null}
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`pc-sheet-item ${item.destructive ? 'destructive' : ''}`}
              onClick={item.onPress}
            >
              <span className="pc-sheet-item-left">
                {item.icon ? <span className="pc-sheet-icon">{item.icon}</span> : null}
                <span className="pc-sheet-label">{item.label}</span>
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="pc-sheet-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const Paywall = ({
  onClose
}: {
  onClose: () => void;
}) => {
  const planState = useState<'weekly' | 'yearly'>('yearly');
  const plan = planState[0];
  const setPlan = planState[1];

  return (
    <div className="pc-paywall-overlay pc-fade-in">
      <div className="pc-paywall pc-slide-up">
        <button type="button" className="pc-paywall-close" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>

        <div className="pc-paywall-hero">
          <div className="pc-paywall-pill">
            <Crown size={14} />
            <span>Premium</span>
          </div>
          <h2 className="pc-paywall-title">Unlock everything</h2>
          <p className="pc-paywall-subtitle">Unlimited conversions, OCR, and cloud sync.</p>
        </div>

        <div className="pc-paywall-benefits">
          <div className="pc-paywall-benefit">Unlimited conversions</div>
          <div className="pc-paywall-benefit">OCR for scanned PDFs</div>
          <div className="pc-paywall-benefit">Cloud storage & sync</div>
          <div className="pc-paywall-benefit">No ads</div>
        </div>

        <div className="pc-paywall-plans">
          <button
            type="button"
            className={`pc-plan ${plan === 'weekly' ? 'active' : ''}`}
            onClick={() => setPlan('weekly')}
          >
            <div className="pc-plan-left">
              <div className="pc-plan-name">Weekly</div>
              <div className="pc-plan-price">$3.99 / week</div>
            </div>
            <div className="pc-plan-radio">
              <div className="pc-plan-dot" />
            </div>
          </button>

          <button
            type="button"
            className={`pc-plan ${plan === 'yearly' ? 'active' : ''}`}
            onClick={() => setPlan('yearly')}
          >
            <div className="pc-plan-badge">Best value</div>
            <div className="pc-plan-left">
              <div className="pc-plan-name">Yearly</div>
              <div className="pc-plan-price-row">
                <div className="pc-plan-price">$9.99 / year</div>
                <div className="pc-plan-save">Save 65%</div>
              </div>
            </div>
            <div className="pc-plan-radio">
              <div className="pc-plan-dot" />
            </div>
          </button>
        </div>

        <button
          type="button"
          className="pc-paywall-cta"
          onClick={() => console.log('Purchasing:', plan)}
        >
          Continue
        </button>

        <div className="pc-paywall-foot">
          <div className="pc-paywall-links">
            <span>Restore Purchase</span>
            <span className="pc-dot" />
            <span>Terms</span>
            <span className="pc-dot" />
            <span>Privacy</span>
          </div>
          <div className="pc-paywall-legal">
            Payment will be charged to your iTunes account at confirmation of purchase. Subscription renews unless
            auto-renew is turned off at least 24 hours before the end of the current period.
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeView = ({
  onPremium,
  onOpenFile,
  onMore,
  onPickPdf,
  isFavorited
}: {
  onPremium: () => void;
  onOpenFile: (file: { name: string; type: FileItem['type'] }) => void;
  onMore: (fileName: string) => void;
  onPickPdf: () => void;
  isFavorited: (fileName: string) => boolean;
}) => {
  const viewState = useState<'list' | 'grid'>('list');
  const fileView = viewState[0];
  const setFileView = viewState[1];

  const refreshFiles = useCallback(async () => {
    // Simulate fetching new data
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Files refreshed');
  }, []);

  const { state: refreshState, containerRef, eventHandlers } = usePullRefresh(refreshFiles);

const tools: ToolItem[] = [
  { id: 'img', title: 'Image to PDF', color: '#1A1A1A', icon: <ImageIcon size={18} color="#fff" /> },
  { id: 'word', title: 'Word to PDF', color: '#2563EB', icon: <span className="pc-tool-letter">W</span> },
  { id: 'excel', title: 'Excel to PDF', color: '#16A34A', icon: <span className="pc-tool-letter">E</span> },
  { id: 'ppt', title: 'PPT to PDF', color: '#EA580C', icon: <span className="pc-tool-letter">P</span> },
  { id: 'text', title: 'Text to PDF', color: '#6B7280', icon: <span className="pc-tool-letter pc-tool-letter--sm">TXT</span> },
  { id: 'url', title: 'URL to PDF', color: '#D4463C', icon: <span className="pc-tool-letter pc-tool-letter--sm">URL</span> }
  ];

  const files = DEMO_FILES;

  return (
    <div 
      className={`pc-pull-refresh ${refreshState}`}
      ref={containerRef}
      {...eventHandlers}
    >
      <div className="pc-pull-refresh-indicator">
        <div className="pc-pull-refresh-spinner" />
      </div>
      <div className="pc-page pc-home-page">
        <div className="pc-top pc-px">
          <div className="pc-title">Home</div>
          <button type="button" className="pc-premium" onClick={onPremium}>
            Premium
          </button>
        </div>

      <div className="pc-section">
        <div className="pc-section-title pc-px">Recent Tools</div>
        <div className="pc-tools pc-px">
          {tools.map((t) => (
            <button
              key={t.id}
              type="button"
              className="pc-tool"
              onClick={() => console.log('Tool', t.id)}
            >
              <ToolGlyph color={t.color} icon={t.icon} />
              <div className="pc-tool-name">{t.title}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pc-section">
        <div className="pc-section-row pc-px">
          <div className="pc-section-title">Recent files</div>
          <button
            type="button"
            className="pc-mini-btn"
            aria-label={fileView === 'list' ? 'Switch to grid preview' : 'Switch to list view'}
            onClick={() => setFileView(fileView === 'list' ? 'grid' : 'list')}
          >
            {fileView === 'list' ? <LayoutGrid size={18} /> : <List size={18} />}
          </button>
        </div>
        {fileView === 'list' ? (
          <div className="pc-home-files-list">
            {files.map((f) => (
              <div
                key={f.id}
                className="pc-home-file-row"
                onClick={() => onOpenFile({ name: f.name, type: f.type })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenFile({ name: f.name, type: f.type });
                  }
                }}
              >
                <div className="pc-home-file-thumb">
                  <FileIcon type={f.type} />
                </div>
                <div className="pc-home-file-main">
                  <div className="pc-home-file-title">{f.name}</div>
                  <div className="pc-home-file-sub">
                    {f.size ? <span>{f.size}</span> : null}
                    {f.size ? <span className="pc-dot" /> : null}
                    <span>{f.time}</span>
                  </div>
                </div>
                <div className="pc-home-file-right">
                  {isFavorited(f.name) ? (
                    <span className="pc-star" aria-label="Favorited">
                      <Star size={16} fill="currentColor" stroke="currentColor" />
                    </span>
                  ) : null}
                  <button
                    type="button"
                    className="pc-more-btn pc-more-btn--inline"
                    aria-label="More actions"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMore(f.name);
                    }}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pc-files-grid">
            {files.map((f) => (
              <div
                key={f.id}
                className="pc-file-card"
                onClick={() => onOpenFile({ name: f.name, type: f.type })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenFile({ name: f.name, type: f.type });
                  }
                }}
              >
                <div className="pc-file-thumb">
                  <FileIcon type={f.type} />
                </div>
                <div className="pc-file-name">{f.name}</div>
                <div className="pc-file-meta">
                  <div className="pc-file-time">{f.time}</div>
                  <div className="pc-file-actions">
                    {isFavorited(f.name) ? (
                      <span className="pc-star" aria-label="Favorited">
                        <Star size={16} fill="currentColor" stroke="currentColor" />
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className="pc-more-btn pc-more-btn--inline"
                      aria-label="More actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMore(f.name);
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

const FilesView = ({
  onMore,
  onOpenFile,
  isFavorited
}: {
  onMore: (fileName: string) => void;
  onOpenFile: (file: { name: string; type: FileItem['type'] }) => void;
  isFavorited: (fileName: string) => boolean;
}) => {
  const queryState = useState('');
  const query = queryState[0];
  const setQuery = queryState[1];

  const files = DEMO_FILES;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, query]);

  return (
    <div className="pc-page">
      <div className="pc-top pc-top-compact pc-px">
        <div className="pc-title">Files</div>
      </div>

      <div className="pc-search">
        <Search size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files"
        />
      </div>

      <div className="pc-list">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="pc-row"
            role="button"
            tabIndex={0}
            onClick={() => onOpenFile({ name: f.name, type: f.type })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenFile({ name: f.name, type: f.type });
              }
            }}
          >
            <div className="pc-row-thumb">
              <FileIcon type={f.type} />
            </div>
            <div className="pc-row-main">
              <div className="pc-row-title">{f.name}</div>
              <div className="pc-row-sub">{f.time}</div>
            </div>
            {isFavorited(f.name) ? (
              <span className="pc-star" aria-label="Favorited">
                <Star size={16} fill="currentColor" stroke="currentColor" />
              </span>
            ) : null}
            <button
              type="button"
              className="pc-more-btn"
              aria-label="More actions"
              onClick={(e) => {
                e.stopPropagation();
                onMore(f.name);
              }}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentView = ({
  onOpenFile,
  onMore,
  isFavorited
}: {
  onOpenFile: (file: { name: string; type: FileItem['type'] }) => void;
  onMore: (fileName: string) => void;
  isFavorited: (fileName: string) => boolean;
}) => {
  const files = DEMO_FILES;
  return (
    <div className="pc-page">
      <div className="pc-top pc-top-compact pc-px">
        <div className="pc-title">Recent</div>
      </div>
      <div className="pc-section">
        <div className="pc-section-row pc-px">
          <div className="pc-section-title">Recent files</div>
        </div>
        <div className="pc-home-files-list">
          {files.slice(0, 12).map((f) => (
            <div
              key={f.id}
              className="pc-home-file-row"
              onClick={() => onOpenFile({ name: f.name, type: f.type })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenFile({ name: f.name, type: f.type });
                }
              }}
            >
              <div className="pc-home-file-thumb">
                <FileIcon type={f.type} />
              </div>
              <div className="pc-home-file-main">
                <div className="pc-home-file-title">{f.name}</div>
                <div className="pc-home-file-sub">
                  <span>{f.size}</span>
                  <span className="pc-dot" />
                  <span>{f.time}</span>
                </div>
              </div>
              <div className="pc-home-file-right">
                {isFavorited(f.name) ? (
                  <span className="pc-star" aria-label="Favorited">
                    <Star size={16} fill="currentColor" stroke="currentColor" />
                  </span>
                ) : null}
                <button
                  type="button"
                  className="pc-more-btn pc-more-btn--inline"
                  aria-label="More actions"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMore(f.name);
                  }}
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ToolsView = ({
  onSettings,
  onPickPdf
}: {
  onSettings: () => void;
  onPickPdf: () => void;
}) => {
  const tools = [
    { id: 'pdf', title: 'Convert PDF', icon: <FileText size={20} /> },
    { id: 't1', title: 'Image to PDF', icon: <ImageIcon size={20} /> },
    { id: 't2', title: 'Word to PDF', icon: <FileText size={20} /> },
    { id: 't3', title: 'Excel to PDF', icon: <FileSpreadsheet size={20} /> },
    { id: 't4', title: 'Scan to PDF', icon: <Camera size={20} /> }
  ];

  return (
    <div className="pc-page">
      <div className="pc-top pc-top-compact pc-top-actions pc-px">
        <div className="pc-title">Tools</div>
        <button type="button" className="pc-icon-btn" aria-label="Settings" onClick={onSettings}>
          <Settings size={20} />
        </button>
      </div>
      <div className="pc-tools-list pc-px">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            className="pc-tool-row"
            onClick={() => {
              if (t.id === 'pdf') {
                onPickPdf();
                return;
              }
              console.log('Tool', t.id);
            }}
          >
            <div className="pc-tool-row-ico">{t.icon}</div>
            <div className="pc-tool-row-name">{t.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const StackHeader = ({
  title,
  onBack,
  right
}: {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}) => {
  return (
    <div className="pc-stack-header">
      <button type="button" className="pc-back-btn" onClick={onBack} aria-label="Back">
        <ChevronLeft size={20} />
      </button>
      <div className="pc-stack-title">{title}</div>
      <div className="pc-stack-right">{right}</div>
    </div>
  );
};

const SettingsRow = ({
  icon,
  iconBg,
  title,
  subtitle,
  onPress
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}) => {
  return (
    <button type="button" className="pc-setting-row" onClick={onPress}>
      <span className="pc-setting-ico" style={{ backgroundColor: iconBg }}>
        {icon}
      </span>
      <span className="pc-setting-main">
        <span className="pc-setting-title">{title}</span>
        {subtitle ? <span className="pc-setting-sub">{subtitle}</span> : null}
      </span>
      <ChevronRight size={18} className="pc-setting-right" />
    </button>
  );
};

const SettingsPage = ({
  language,
  onBack,
  onOpen
}: {
  language: string;
  onBack: () => void;
  onOpen: (key: ScreenKey) => void;
}) => {
  return (
    <div className="pc-stack">
      <StackHeader title="Settings" onBack={onBack} />
      <div className="pc-stack-body">
        <div className="pc-stack-section">
          <div className="pc-stack-group">
            <SettingsRow
              icon={<Globe size={18} color="#fff" />}
              iconBg="#1A1A1A"
              title="Language"
              subtitle={language}
              onPress={() => onOpen('language')}
            />
            <SettingsRow
              icon={<FolderOpen size={18} color="#fff" />}
              iconBg="#6B7280"
              title="Processing Files"
              subtitle="Queue & history"
              onPress={() => onOpen('processing')}
            />
          </div>
        </div>

        <div className="pc-stack-section">
          <div className="pc-stack-group">
            <SettingsRow
              icon={<ShieldCheck size={18} color="#fff" />}
              iconBg="#16A34A"
              title="Privacy Policy"
              onPress={() => onOpen('privacy')}
            />
            <SettingsRow
              icon={<MessageSquare size={18} color="#fff" />}
              iconBg="#1A1A1A"
              title="Feedback"
              subtitle="Contact & suggestions"
              onPress={() => onOpen('feedback')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const LanguagePage = ({
  value,
  onBack,
  onChange
}: {
  value: 'English' | 'Simplified Chinese';
  onBack: () => void;
  onChange: (v: 'English' | 'Simplified Chinese') => void;
}) => {
  const options: Array<{ key: 'English' | 'Simplified Chinese'; label: string; sub: string }> = [
    { key: 'English', label: 'English', sub: 'United States' },
    { key: 'Simplified Chinese', label: 'Simplified Chinese', sub: 'Mainland China' }
  ];

  return (
    <div className="pc-stack">
      <StackHeader title="Language" onBack={onBack} />
      <div className="pc-stack-body">
        <div className="pc-stack-section">
          <div className="pc-stack-group">
            {options.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className="pc-choice-row"
                onClick={() => onChange(opt.key)}
              >
                <span className="pc-choice-main">
                  <span className="pc-choice-title">{opt.label}</span>
                  <span className="pc-choice-sub">{opt.sub}</span>
                </span>
                {value === opt.key ? (
                  <span className="pc-choice-check">
                    <Check size={18} />
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessingPage = ({ onBack }: { onBack: () => void }) => {
  const items = [
    { id: 'p1', name: 'Invoice_00021.pdf', status: 'Processing', meta: 'OCR • 42%' },
    { id: 'p2', name: 'Marketing_Budget.doc', status: 'Queued', meta: 'Word → PDF' },
    { id: 'p3', name: 'IMG_0421.png', status: 'Completed', meta: 'Image → PDF' }
  ];

  return (
    <div className="pc-stack">
      <StackHeader title="Processing Files" onBack={onBack} />
      <div className="pc-stack-body">
        <div className="pc-stack-section">
          <div className="pc-stack-group">
            {items.map((it) => (
              <div key={it.id} className="pc-processing-row">
                <div className="pc-processing-main">
                  <div className="pc-processing-title">{it.name}</div>
                  <div className="pc-processing-sub">{it.meta}</div>
                </div>
                <div className="pc-processing-right">
                  {it.status === 'Processing' ? <Loader2 size={18} className="pc-spin" /> : null}
                  <span className={`pc-status ${it.status.toLowerCase()}`}>{it.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pc-stack-hint">
          Processing is simulated for prototype preview.
        </div>
      </div>
    </div>
  );
};

const PrivacyPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="pc-stack">
      <StackHeader title="Privacy Policy" onBack={onBack} />
      <div className="pc-stack-body">
        <div className="pc-article">
          <div className="pc-article-title">Your privacy matters</div>
          <div className="pc-article-p">
            This prototype demonstrates typical privacy sections for a PDF utility app. In a production app, this page
            should reflect your legal policy and App Store requirements.
          </div>
          <div className="pc-article-h">Data we process</div>
          <div className="pc-article-p">
            Files selected for conversion may be processed locally on your device or via secure servers depending on the
            selected feature. We recommend avoiding sensitive documents in prototypes.
          </div>
          <div className="pc-article-h">Analytics</div>
          <div className="pc-article-p">
            Basic analytics may be used to improve stability and user experience. You can opt out in a production
            implementation.
          </div>
          <div className="pc-article-h">Contact</div>
          <div className="pc-article-p">
            For privacy questions, contact support@example.com.
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="pc-stack">
      <StackHeader title="Feedback" onBack={onBack} />
      <div className="pc-stack-body">
        <div className="pc-stack-section">
          <div className="pc-stack-group">
            <button type="button" className="pc-setting-row" onClick={() => console.log('Open email')}>
              <span className="pc-setting-ico" style={{ backgroundColor: '#1A1A1A' }}>
                <MessageSquare size={18} color="#fff" />
              </span>
              <span className="pc-setting-main">
                <span className="pc-setting-title">Email Support</span>
                <span className="pc-setting-sub">support@example.com</span>
              </span>
              <ChevronRight size={18} className="pc-setting-right" />
            </button>
            <button type="button" className="pc-setting-row" onClick={() => console.log('Open FAQ')}>
              <span className="pc-setting-ico" style={{ backgroundColor: '#6B7280' }}>
                <Info size={18} color="#fff" />
              </span>
              <span className="pc-setting-main">
                <span className="pc-setting-title">Help Center</span>
                <span className="pc-setting-sub">Common questions</span>
              </span>
              <ChevronRight size={18} className="pc-setting-right" />
            </button>
          </div>
        </div>
        <div className="pc-stack-hint">
          This is a reference interface. Actions are simulated.
        </div>
      </div>
    </div>
  );
};

const PreviewPage = ({
  file,
  onBack,
  onOpenShare,
  onDelete
}: {
  file: PreviewFile;
  onBack: () => void;
  onOpenShare: () => void;
  onDelete: () => void;
}) => {
  type ConvertFormat = 'Word' | 'Excel' | 'TXT' | 'Image';

  const modeState = useState<'annotate' | 'pages'>('annotate');
  const mode = modeState[0];
  const setMode = modeState[1];

  const showToolMenuState = useState(false);
  const showToolMenu = showToolMenuState[0];
  const setShowToolMenu = showToolMenuState[1];

  const processingState = useState<string | null>(null);
  const processing = processingState[0];
  const setProcessing = processingState[1];

  const selectedPagesState = useState<number[]>([]);
  const selectedPages = selectedPagesState[0];
  const setSelectedPages = selectedPagesState[1];

  const confirmState = useState<null | { format: ConvertFormat }>(null);
  const confirm = confirmState[0];
  const setConfirm = confirmState[1];

  const countdownState = useState(0);
  const countdown = countdownState[0];
  const setCountdown = countdownState[1];

  const confirmCommittedRef = useRef(false);
  const confirmTimersRef = useRef<{ intervalId: number | null; timeoutId: number | null }>({
    intervalId: null,
    timeoutId: null
  });

  const toastState = useState<string | null>(null);
  const toast = toastState[0];
  const setToast = toastState[1];

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const runConvert = (label: string) => {
    setShowToolMenu(false);
    setProcessing(label);
    window.setTimeout(() => {
      setProcessing(null);
      setToast(`${label} completed`);
    }, 1200);
  };

  const clearConfirmTimers = useCallback(() => {
    const { intervalId, timeoutId } = confirmTimersRef.current;
    if (intervalId != null) window.clearInterval(intervalId);
    if (timeoutId != null) window.clearTimeout(timeoutId);
    confirmTimersRef.current.intervalId = null;
    confirmTimersRef.current.timeoutId = null;
  }, []);

  const closeConfirm = useCallback(() => {
    clearConfirmTimers();
    confirmCommittedRef.current = false;
    setConfirm(null);
    setCountdown(0);
  }, [clearConfirmTimers]);

  const toolItems = useMemo(() => {
    return [
      {
        id: 'word',
        label: 'Convert to Word',
        iconBg: '#2563EB',
        icon: <FileText size={18} color="#fff" />,
        onPress: () => setConfirm({ format: 'Word' })
      },
      {
        id: 'image',
        label: 'Convert to Image',
        iconBg: '#1A1A1A',
        icon: <ImageIcon size={18} color="#fff" />,
        onPress: () => setConfirm({ format: 'Image' })
      },
      {
        id: 'excel',
        label: 'Convert to Excel',
        iconBg: '#16A34A',
        icon: <FileSpreadsheet size={18} color="#fff" />,
        onPress: () => setConfirm({ format: 'Excel' })
      },
      {
        id: 'ppt',
        label: 'Convert to PPT',
        iconBg: '#EA580C',
        icon: <Presentation size={18} color="#fff" />,
        onPress: () => setConfirm({ format: 'PPT' })
      },
      {
        id: 'txt',
        label: 'Convert to TXT',
        iconBg: '#6B7280',
        icon: <Text size={18} color="#fff" />,
        onPress: () => setConfirm({ format: 'TXT' })
      },
      {
        id: 'share',
        label: 'Share',
        iconBg: '#1A1A1A',
        icon: <Share size={18} color="#fff" />,
        onPress: onOpenShare
      },
      {
        id: 'delete',
        label: 'Delete',
        iconBg: '#D4463C',
        icon: <Trash2 size={18} color="#fff" />,
        onPress: onDelete,
        destructive: true
      }
    ];
  }, []);

  const pages = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);

  const togglePage = (pageNo: number) => {
    setSelectedPages((prev) => (prev.includes(pageNo) ? prev.filter((p) => p !== pageNo) : prev.concat([pageNo])));
  };

  const confirmTitle = confirm
    ? `Are you sure you want to convert this PDF to ${confirm.format === 'Excel' || confirm.format === 'Image' ? 'an' : 'a'} ${confirm.format} file?`
    : '';

  const doConfirmConvert = (format: ConvertFormat) => {
    if (confirmCommittedRef.current) return;
    confirmCommittedRef.current = true;
    clearConfirmTimers();

    const labelMap: Record<ConvertFormat, string> = {
      Word: 'Convert to Word',
      Excel: 'Convert to Excel',
      TXT: 'Convert to TXT',
      Image: 'Convert to Image'
    };
    const label = labelMap[format];
    setConfirm(null);
    setCountdown(0);
    runConvert(label);
  };

  useEffect(() => {
    if (!confirm) return;
    confirmCommittedRef.current = false;
    clearConfirmTimers();

    const format = confirm.format;
    setCountdown(3);

    const intervalId = window.setInterval(() => {
      setCountdown((v) => Math.max(0, v - 1));
    }, 1000);

    const timeoutId = window.setTimeout(() => {
      doConfirmConvert(format);
    }, 3000);

    confirmTimersRef.current.intervalId = intervalId;
    confirmTimersRef.current.timeoutId = timeoutId;

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [confirm]);

  return (
    <div className="pc-preview">
      <div className="pc-preview-top">
        <button type="button" className="pc-preview-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <div className="pc-preview-title">Annotation</div>
        <div className="pc-preview-actions">
          <button type="button" className="pc-preview-btn" aria-label="Undo">
            <Undo2 size={24} />
          </button>
          <button
            type="button"
            className="pc-preview-btn"
            onClick={() => {
              setShowToolMenu(!showToolMenu);
            }}
            aria-label="More"
          >
            <MoreHorizontal size={24} />
          </button>
        </div>
      </div>

      {mode === 'annotate' ? (
      <div className="pc-preview-toolbar">
        <button type="button" className="pc-toolbtn active" aria-label="Pen">
          <Pen size={22} />
        </button>
        <button type="button" className="pc-toolbtn" aria-label="Highlighter">
          <Highlighter size={22} />
        </button>
        <button type="button" className="pc-toolbtn" aria-label="Eraser">
          <Eraser size={22} />
        </button>
        <div className="pc-toolbar-spacer" />
        <button type="button" className="pc-toolbtn" aria-label="Color">
          <div style={{ width: 20, height: 20, borderRadius: 10, background: '#1A1A1A', border: '2px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }} />
        </button>
        <div className="pc-toolbar-spacer" />
        <button type="button" className="pc-toolbtn" aria-label="Undo">
          <Undo2 size={22} />
        </button>
        <button type="button" className="pc-toolbtn" aria-label="Redo">
          <Redo2 size={22} />
        </button>
        <div className="pc-toolbar-spacer" />
        <button type="button" className="pc-toolbtn" aria-label="List" onClick={() => setMode('pages')}>
          <List size={22} />
        </button>
      </div>
      ) : null}

      <div className="pc-preview-body">
        {mode === 'pages' ? (
          <div className="pc-pages">
            <div className="pc-pages-grid">
              {pages.map((p) => {
                const checked = selectedPages.includes(p);
                return (
                  <button key={p} type="button" className="pc-pagecell" onClick={() => togglePage(p)}>
                    <div className={`pc-pagecell-thumb ${checked ? 'active' : ''}`} style={checked ? { borderColor: '#1A1A1A', borderWidth: '2px', boxShadow: '0 0 0 2px rgba(26, 26, 26, 0.1)' } : {}}>
                      <div className="pc-pagecell-num">{p}</div>
                      {checked && (
                        <div style={{ position: 'absolute', top: 4, right: 4, background: '#1A1A1A', borderRadius: 10, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="pc-pagecell-check">
                      <span>Page {p}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : file.objectUrl ? (
          <iframe className="pc-preview-iframe" title={file.name} src={file.objectUrl} />
        ) : (
          <div className="pc-preview-paper">
            <div className="pc-preview-cover">
              <div className="pc-preview-cover-title">Internet Development</div>
              <div className="pc-preview-cover-title">Research Report</div>
              <div className="pc-preview-cover-sub">FROM DOCUMENT LIBRARY</div>
              <div className="pc-preview-cover-date">Jan 10</div>
              <div className="pc-preview-cover-year">2024</div>
            </div>
            <div className="pc-preview-side">REPORT</div>
          </div>
        )}
      </div>

      <div className="pc-preview-tabbar">
        <button type="button" className={`pc-preview-tab ${mode === 'pages' ? 'active' : ''}`} aria-label="Pages" onClick={() => setMode('pages')}>
          <LayoutGrid size={20} />
        </button>
        <button type="button" className={`pc-preview-tab ${mode === 'annotate' ? 'active' : ''}`} aria-label="Annotate" onClick={() => setMode('annotate')}>
          <Files size={20} />
        </button>
        <button type="button" className="pc-preview-tab" aria-label="Edit">
          <Pen size={20} />
        </button>
      </div>

      {showToolMenu ? (
        <div className="pc-preview-menu-layer" onClick={() => setShowToolMenu(false)}>
          <div className="pc-preview-menu" onClick={(e) => e.stopPropagation()}>
            {toolItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="pc-preview-menu-item"
                onClick={() => {
                  setShowToolMenu(false);
                  item.onPress();
                }}
              >
                <span className="pc-preview-menu-ico" style={{ backgroundColor: item.iconBg }}>
                  {item.icon}
                </span>
                <span className="pc-preview-menu-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {confirm ? (
        <div className="pc-confirm-layer pc-fade-in" onClick={closeConfirm}>
          <div className="pc-confirm pc-slide-up" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="pc-confirm-close" aria-label="Close" onClick={closeConfirm}>
              <X size={18} />
            </button>
            <div className="pc-confirm-title">Confirm Conversion</div>
            <div className="pc-confirm-desc">{confirmTitle}</div>
            <div className="pc-confirm-actions">
              <button
                type="button"
                className="pc-confirm-btn ghost"
                onClick={closeConfirm}
              >
                Undo
              </button>
              <button
                type="button"
                className="pc-confirm-btn primary"
                style={{ '--progress': `${((3 - countdown) / 3) * 100}%` } as React.CSSProperties}
                onClick={() => {
                  if (!confirm) return;
                  doConfirmConvert(confirm.format);
                }}
              >
                {countdown > 0 ? `Confirming (${countdown}s)` : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {processing ? (
        <div className="pc-preview-processing">
          <div className="pc-preview-processing-card">
            <Loader2 size={22} className="pc-spin" />
            <div className="pc-preview-processing-title">{processing}</div>
            <div className="pc-preview-processing-sub">{file.name}</div>
          </div>
        </div>
      ) : null}

      {toast ? <div className="pc-toast">{toast}</div> : null}
    </div>
  );
};

const Component = () => {
  const tabState = useState<TabKey>('home');
  const activeTab = tabState[0];
  const setActiveTab = tabState[1];

  const screenStackState = useState<Array<'tabs' | ScreenKey>>(['tabs']);
  const screenStack = screenStackState[0];
  const setScreenStack = screenStackState[1];
  const currentScreen = screenStack[screenStack.length - 1];

  const languageState = useState<'English' | 'Simplified Chinese'>('English');
  const language = languageState[0];
  const setLanguage = languageState[1];

  const showPaywallState = useState(false);
  const showPaywall = showPaywallState[0];
  const setShowPaywall = showPaywallState[1];

  const addSheetState = useState(false);
  const showAddSheet = addSheetState[0];
  const setShowAddSheet = addSheetState[1];

  const fileActionState = useState<string | null>(null);
  const fileAction = fileActionState[0];
  const setFileAction = fileActionState[1];

  const favoritesState = useState<string[]>([]);
  const favorites = favoritesState[0];
  const setFavorites = favoritesState[1];

  const previewFileState = useState<PreviewFile | null>(null);
  const previewFile = previewFileState[0];
  const setPreviewFile = previewFileState[1];

  const filePickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewFile?.objectUrl) {
        URL.revokeObjectURL(previewFile.objectUrl);
      }
    };
  }, [previewFile]);

  const openPdfPicker = () => {
    if (!filePickerRef.current) return;
    filePickerRef.current.value = '';
    filePickerRef.current.click();
  };

  const openPreviewFor = (file: { name: string; type: FileItem['type'] }) => {
    setPreviewFile({ name: file.name, type: file.type });
    pushScreen('preview');
  };

  const isFavorited = (fileName: string) => favorites.includes(fileName);

  const toggleFavorite = (fileName: string) => {
    setFavorites((prev) => (prev.includes(fileName) ? prev.filter((n) => n !== fileName) : prev.concat([fileName])));
  };

  const sheetItems = useMemo(() => {
    if (!fileAction) return [];
    return [
      {
        id: 'share',
        label: 'Share',
        icon: <Share size={20} />,
        onPress: () => {
          console.log('Share', fileAction);
          setFileAction(null);
        }
      },
      {
        id: 'copy',
        label: 'Copy',
        icon: <Copy size={20} />,
        onPress: () => {
          console.log('Copy', fileAction);
          setFileAction(null);
        }
      },
      {
        id: 'favorite',
        label: isFavorited(fileAction) ? 'Remove from Favorites' : 'Add to Favorites',
        icon: <Star size={20} />,
        onPress: () => {
          toggleFavorite(fileAction);
          setFileAction(null);
        }
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: <Trash2 size={20} />,
        destructive: true,
        onPress: () => {
          console.log('Delete', fileAction);
          setFileAction(null);
        }
      }
    ];
  }, [favorites, fileAction, isFavorited, toggleFavorite]);

  const addItems = useMemo(() => {
    return [
      { id: 'import', label: 'Import Files', onPress: () => setShowAddSheet(false) },
      { id: 'scan', label: 'Scan', onPress: () => setShowAddSheet(false) },
      { id: 'photos', label: 'Photos', onPress: () => setShowAddSheet(false) }
    ];
  }, []);

  const pushScreen = (key: ScreenKey) => {
    setScreenStack(screenStack.concat([key]));
  };

  const popScreen = () => {
    if (screenStack.length <= 1) return;
    setScreenStack(screenStack.slice(0, -1));
  };

  const setTab = (tab: TabKey) => {
    setActiveTab(tab);
    if (screenStack.length !== 1 || currentScreen !== 'tabs') {
      setScreenStack(['tabs']);
    }
  };

  return (
    <div className="pc-app">
      <input
        ref={filePickerRef}
        className="pc-file-input"
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const objectUrl = URL.createObjectURL(f);
          setPreviewFile({ name: f.name, type: 'pdf', objectUrl });
          pushScreen('preview');
        }}
      />
      <div className="pc-content">
        {activeTab === 'home' ? (
          <HomeView
            onPremium={() => setShowPaywall(true)}
            onOpenFile={openPreviewFor}
            onMore={(name) => setFileAction(name)}
            onPickPdf={openPdfPicker}
            isFavorited={isFavorited}
          />
        ) : null}
        {activeTab === 'files' ? (
          <FilesView onMore={(name) => setFileAction(name)} onOpenFile={openPreviewFor} isFavorited={isFavorited} />
        ) : null}
        {activeTab === 'recent' ? (
          <RecentView onOpenFile={openPreviewFor} onMore={(name) => setFileAction(name)} isFavorited={isFavorited} />
        ) : null}
        {activeTab === 'tools' ? <ToolsView onSettings={() => pushScreen('settings')} onPickPdf={openPdfPicker} /> : null}
      </div>

      <div className="pc-tabbar">
        <button type="button" className={`pc-tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
          <Home size={22} />
          <span>Home</span>
        </button>
        <button type="button" className={`pc-tab ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setTab('files')}>
          <Files size={22} />
          <span>Files</span>
        </button>

        <div className="pc-tab-mid">
          <button type="button" className="pc-add" onClick={() => setShowAddSheet(true)} aria-label="Add">
            <Plus size={26} color="#fff" />
          </button>
        </div>

        <button type="button" className={`pc-tab ${activeTab === 'recent' ? 'active' : ''}`} onClick={() => setTab('recent')}>
          <Clock size={22} />
          <span>Recent</span>
        </button>
        <button type="button" className={`pc-tab ${activeTab === 'tools' ? 'active' : ''}`} onClick={() => setTab('tools')}>
          <Wrench size={22} />
          <span>Tools</span>
        </button>
      </div>

      {currentScreen !== 'tabs' ? (
        <div className="pc-stack-overlay">
          {currentScreen === 'preview' && previewFile ? (
            <PreviewPage
              file={previewFile}
              onBack={popScreen}
              onOpenShare={() => setFileAction(previewFile.name)}
              onDelete={() => {
                console.log('Delete', previewFile.name);
                setPreviewFile(null);
                popScreen();
              }}
            />
          ) : null}
          {currentScreen === 'settings' ? (
            <SettingsPage
              language={language}
              onBack={popScreen}
              onOpen={(k) => pushScreen(k)}
            />
          ) : null}
          {currentScreen === 'language' ? (
            <LanguagePage
              value={language}
              onBack={popScreen}
              onChange={(v) => setLanguage(v)}
            />
          ) : null}
          {currentScreen === 'processing' ? <ProcessingPage onBack={popScreen} /> : null}
          {currentScreen === 'privacy' ? <PrivacyPage onBack={popScreen} /> : null}
          {currentScreen === 'feedback' ? <FeedbackPage onBack={popScreen} /> : null}
        </div>
      ) : null}

      {showPaywall ? <Paywall onClose={() => setShowPaywall(false)} /> : null}
      {showAddSheet ? (
        <Sheet
          title="Add"
          items={addItems.map((it) => ({ ...it, icon: <Plus size={20} /> }))}
          onClose={() => setShowAddSheet(false)}
        />
      ) : null}
      {fileAction ? <Sheet title={fileAction} items={sheetItems} onClose={() => setFileAction(null)} /> : null}
    </div>
  );
};

export default Component;
