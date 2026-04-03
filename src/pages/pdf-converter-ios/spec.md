# PDF转换-iOS（统一风格重排）规格

## 目标
- 首页与所有页面遵循参考图的排版与组件风格：白底、浅灰卡片、圆角、轻阴影、强调色为红色。
- 全局统一色板与组件（按钮、卡片、列表、底部 Tab、弹窗 Action Sheet、Paywall）。
- 移动端 iOS 适配：触控区 44px、safe-area 底部适配、文字截断避免换行挤压。

## iOS 极简风格（iOS 17/18 对齐）
- 分隔线：优先使用 0.5px hairline（浅灰透明度），减少厚重边框感。
- 阴影：采用更轻的 soft shadow，避免 “浮夸投影”，整体更贴近系统 App 的克制感。
- 模糊：底部 Tab/顶部导航使用高透玻璃（24px 左右 blur），保持内容层级清晰。
- 交互反馈：按压主要使用浅灰高亮 + 轻微缩放（0.98~0.99），动画曲线统一为系统弹性风格。
- 无障碍：遵循 `prefers-reduced-motion`，在减少动效时禁用过渡与动画。

## 色板（来自参考图风格）
- 背景：#FFFFFF
- 次级背景（卡片/容器）：#F2F2F7
- 文字主色：#111111
- 次级文字：#8E8E93
- 强调色（Tab、主按钮、删除等）：#FF3B30

## 首页（Home）
- 顶部：左侧大标题 Home（34px、粗体），右侧 Premium 胶囊按钮（白底 + 轻阴影）。
- Recent Tools：3 列网格，6 个工具卡片（浅灰背景、圆角 16、图标方块（字母/图形）+ 轻阴影、标题单行截断）。
- Recent files：默认展示为“列表详情视图”（缩略图 + 文件名 + 体积/时间等元信息）。点击标题右侧按钮切换为“图片预览视图”（3 列网格卡片）。
- 底部 Tab：Home / Files / Recent / Tools，中间悬浮 Add 红色圆形按钮（带阴影，safe-area 底部适配）。

## Files
- 顶部大标题 Files。
- 搜索栏：iOS 风格圆角输入（浅灰底）。
- 文件列表：白色卡片容器 + 行分隔；右侧 44px “更多操作”按钮。
- 点击更多按钮：弹出 iOS 风格 Action Sheet，展示文件名与操作项（Share/Copy/Get Info/Delete）。

## Recent / Tools
- Recent：最近文件列表与首页“Recent files”保持一致（列表详情样式）。
- Tools：使用统一的列表按钮样式，保持与首页卡片一致的圆角与阴影。
  - Tools 顶部右上角提供设置入口（齿轮图标），点击进入设置页面。

## 设置（Settings）
- 入口：Tools 页右上角齿轮按钮。
- 页面项：
  - Language：进入语言选择页，支持 English / 简体中文，当前语言作为副标题展示。
  - Processing Files：进入处理队列页，展示 Processing / Queued / Completed 的示例条目。
  - Privacy Policy：进入隐私政策内容页（参考工具类 App 常见结构）。
  - Feedback：进入意见反馈页（邮箱支持、帮助中心等入口，交互可模拟）。
- 交互：
  - 采用 iOS Push 风格全屏覆盖层展示，顶部返回按钮返回上一级。
  - 统一 44px 触控区与 safe-area 适配。

## 弹窗（Action Sheet）
- 背景遮罩 + 模糊。
- 圆角 16 的操作组 + 独立 Cancel 按钮。
- 操作项左侧图标 + 文案；Delete 使用强调色。

## 预览与标注（Preview & Annotation）
- 顶部栏：
  - 左侧返回按钮。
  - 中间标题固定为 "Annotation"。
  - 右侧增加 "Undo" 按钮和 "更多操作" (三点) 按钮。
- 顶部工具栏 (Annotation Toolbar):
  - 位置：紧邻顶部栏下方，固定在顶部。
  - 样式：浮动圆角容器，背景半透明模糊。
  - 功能：画笔、高亮、橡皮擦、颜色选择（红色圆点）、撤销、重做。
  - 右侧增加一个列表图标，用于切换视图（可能）。
- 更多操作菜单 (Sheet):
  - 触发：点击顶部栏的 "更多操作" (三点) 按钮。
  - 内容：Convert to Word, Convert to Image, Convert to Excel, Convert to PPT, Convert to TXT, Share, Delete。每个操作项带图标。
- 页面管理（Pages View）：3 列缩略图网格，点击切换选中状态，右上角带勾选图标。
- 转换确认（Confirmation）：底部弹出的确认卡片，包含倒计时进度环或视觉化的确认按钮。
- 交互动效：使用 `spring` 曲线或系统默认弹性效果；页面切换支持左右滑动（模拟）。

## 订阅（Paywall）
- 统一色板（强调色红），白底、圆角顶部抽屉式过渡。
- 价格：$3.99/周、$9.99/年，年付标记 Best value。
