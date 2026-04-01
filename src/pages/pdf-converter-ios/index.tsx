import './style.css';
import React, { useMemo, useState } from 'react';
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
  Camera
} from 'lucide-react';

type TabKey = 'home' | 'files' | 'recent' | 'tools';
type ScreenKey = 'settings' | 'language' | 'processing' | 'privacy' | 'feedback';

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
      <div className="pc-glyph-badge">PDF</div>
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
  onPremium
}: {
  onPremium: () => void;
}) => {
  const viewState = useState<'list' | 'grid'>('list');
  const fileView = viewState[0];
  const setFileView = viewState[1];

  const tools: ToolItem[] = [
    { id: 'img', title: 'Image to PDF', color: '#7C5CFF', icon: <ImageIcon size={18} color="#fff" /> },
    { id: 'word', title: 'Word to PDF', color: '#2F6BFF', icon: <FileText size={18} color="#fff" /> },
    { id: 'excel', title: 'Excel to PDF', color: '#22C55E', icon: <FileSpreadsheet size={18} color="#fff" /> },
    { id: 'ppt', title: 'PPT to PDF', color: '#FF7A45', icon: <FileText size={18} color="#fff" /> },
    { id: 'text', title: 'Text to PDF', color: '#3B82F6', icon: <FileText size={18} color="#fff" /> },
    { id: 'scan', title: 'Scan to PDF', color: '#FF4D4F', icon: <Camera size={18} color="#fff" /> }
  ];

  const files: FileItem[] = [
    { id: 'f1', name: 'File name File name File...', type: 'pdf', time: '10:34 AM', size: '1.2MB' },
    { id: 'f2', name: 'File name File name File...', type: 'doc', time: '10:34 AM', size: '860KB' },
    { id: 'f3', name: 'File name File name File...', type: 'xls', time: '10:34 AM', size: '450KB' },
    { id: 'f4', name: 'File name File name File...', type: 'pdf', time: '10:34 AM', size: '2.1MB' },
    { id: 'f5', name: 'File name File name File...', type: 'doc', time: '10:34 AM', size: '720KB' },
    { id: 'f6', name: 'File name File name File...', type: 'xls', time: '10:34 AM', size: '510KB' }
  ];

  return (
    <div className="pc-page">
      <div className="pc-top">
        <div className="pc-title">Home</div>
        <button type="button" className="pc-premium" onClick={onPremium}>
          Premium
        </button>
      </div>

      <div className="pc-section">
        <div className="pc-section-title">Recent Tools</div>
        <div className="pc-tools">
          {tools.map((t) => (
            <button key={t.id} type="button" className="pc-tool">
              <ToolGlyph color={t.color} icon={t.icon} />
              <div className="pc-tool-name">{t.title}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pc-section">
        <div className="pc-section-row">
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
              <div key={f.id} className="pc-home-file-row">
                <div className="pc-home-file-thumb">
                  <div className={`pc-file-type ${f.type}`}>{f.type.toUpperCase()}</div>
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
                  <span className="pc-star">★</span>
                  <span className="pc-more">⋯</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pc-files-grid">
            {files.map((f) => (
              <div key={f.id} className="pc-file-card">
                <div className="pc-file-thumb">
                  <div className={`pc-file-type ${f.type}`}>{f.type.toUpperCase()}</div>
                </div>
                <div className="pc-file-name">{f.name}</div>
                <div className="pc-file-meta">
                  <div className="pc-file-time">{f.time}</div>
                  <div className="pc-file-actions">
                    <span className="pc-star">★</span>
                    <span className="pc-more">⋯</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FilesView = ({
  onMore
}: {
  onMore: (fileName: string) => void;
}) => {
  const queryState = useState('');
  const query = queryState[0];
  const setQuery = queryState[1];

  const files: FileItem[] = [
    { id: 'a', name: 'Contract_Signed.pdf', type: 'pdf', time: '1.2MB' },
    { id: 'b', name: 'Expenses_2026.xlsx', type: 'xls', time: '450KB' },
    { id: 'c', name: 'Resume_Updated.doc', type: 'doc', time: '89KB' },
    { id: 'd', name: 'Invoice_00021.pdf', type: 'pdf', time: '620KB' }
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, query]);

  return (
    <div className="pc-page">
      <div className="pc-top pc-top-compact">
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
          <div key={f.id} className="pc-row">
            <div className={`pc-dotfile ${f.type}`}>{f.type.toUpperCase()}</div>
            <div className="pc-row-main">
              <div className="pc-row-title">{f.name}</div>
              <div className="pc-row-sub">{f.time}</div>
            </div>
            <button
              type="button"
              className="pc-more-btn"
              aria-label="More actions"
              onClick={() => onMore(f.name)}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentView = () => {
  return (
    <div className="pc-page">
      <div className="pc-top pc-top-compact">
        <div className="pc-title">Recent</div>
      </div>
      <div className="pc-section">
        <div className="pc-section-row">
          <div className="pc-section-title">Recent files</div>
        </div>
        <div className="pc-home-files-list">
          {[
            { id: 'rf1', name: 'Invoice_00021.pdf', type: 'pdf', time: 'Today • 10:34 AM', size: '620KB' },
            { id: 'rf2', name: 'Resume_Updated.doc', type: 'doc', time: 'Yesterday • 6:02 PM', size: '89KB' },
            { id: 'rf3', name: 'Expenses_2026.xlsx', type: 'xls', time: 'Mar 29 • 1:16 PM', size: '450KB' },
            { id: 'rf4', name: 'Screenshots.zip.pdf', type: 'pdf', time: 'Mar 28 • 9:41 AM', size: '2.1MB' }
          ].map((f) => (
            <div key={f.id} className="pc-home-file-row">
              <div className="pc-home-file-thumb">
                <div className={`pc-file-type ${f.type}`}>{f.type.toUpperCase()}</div>
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
                <span className="pc-star">★</span>
                <span className="pc-more">⋯</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ToolsView = ({ onSettings }: { onSettings: () => void }) => {
  const tools = [
    { id: 't1', title: 'Image to PDF', icon: <ImageIcon size={20} /> },
    { id: 't2', title: 'Word to PDF', icon: <FileText size={20} /> },
    { id: 't3', title: 'Excel to PDF', icon: <FileSpreadsheet size={20} /> },
    { id: 't4', title: 'Scan to PDF', icon: <Camera size={20} /> }
  ];

  return (
    <div className="pc-page">
      <div className="pc-top pc-top-compact pc-top-actions">
        <div className="pc-title">Tools</div>
        <button type="button" className="pc-icon-btn" aria-label="Settings" onClick={onSettings}>
          <Settings size={20} />
        </button>
      </div>
      <div className="pc-tools-list">
        {tools.map((t) => (
          <button key={t.id} type="button" className="pc-tool-row">
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
              iconBg="#2F6BFF"
              title="Language"
              subtitle={language}
              onPress={() => onOpen('language')}
            />
            <SettingsRow
              icon={<FolderOpen size={18} color="#fff" />}
              iconBg="#FF7A45"
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
              iconBg="#22C55E"
              title="Privacy Policy"
              onPress={() => onOpen('privacy')}
            />
            <SettingsRow
              icon={<MessageSquare size={18} color="#fff" />}
              iconBg="#7C5CFF"
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
  value: 'English' | '简体中文';
  onBack: () => void;
  onChange: (v: 'English' | '简体中文') => void;
}) => {
  const options: Array<{ key: 'English' | '简体中文'; label: string; sub: string }> = [
    { key: 'English', label: 'English', sub: 'United States' },
    { key: '简体中文', label: '简体中文', sub: '中国大陆' }
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
              <span className="pc-setting-ico" style={{ backgroundColor: '#2F6BFF' }}>
                <MessageSquare size={18} color="#fff" />
              </span>
              <span className="pc-setting-main">
                <span className="pc-setting-title">Email Support</span>
                <span className="pc-setting-sub">support@example.com</span>
              </span>
              <ChevronRight size={18} className="pc-setting-right" />
            </button>
            <button type="button" className="pc-setting-row" onClick={() => console.log('Open FAQ')}>
              <span className="pc-setting-ico" style={{ backgroundColor: '#22C55E' }}>
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

const Component = () => {
  const tabState = useState<TabKey>('home');
  const activeTab = tabState[0];
  const setActiveTab = tabState[1];

  const screenStackState = useState<Array<'tabs' | ScreenKey>>(['tabs']);
  const screenStack = screenStackState[0];
  const setScreenStack = screenStackState[1];
  const currentScreen = screenStack[screenStack.length - 1];

  const languageState = useState<'English' | '简体中文'>('English');
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

  const sheetItems = useMemo(() => {
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
        id: 'info',
        label: 'Get Info',
        icon: <Info size={20} />,
        onPress: () => {
          console.log('Info', fileAction);
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
  }, [fileAction]);

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
      <div className="pc-content">
        {activeTab === 'home' ? <HomeView onPremium={() => setShowPaywall(true)} /> : null}
        {activeTab === 'files' ? <FilesView onMore={(name) => setFileAction(name)} /> : null}
        {activeTab === 'recent' ? <RecentView /> : null}
        {activeTab === 'tools' ? <ToolsView onSettings={() => pushScreen('settings')} /> : null}
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
