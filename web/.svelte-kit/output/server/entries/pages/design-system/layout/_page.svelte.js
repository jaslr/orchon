import { F as ensure_array_like, J as attr_style, y as stringify, x as attr_class } from "../../../../chunks/index2.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { L as Layers } from "../../../../chunks/layers.js";
import { S as Settings } from "../../../../chunks/settings.js";
import { j as escape_html } from "../../../../chunks/context.js";
function _page($$renderer) {
  const spacingScale = [
    {
      class: "p-0.5 / gap-0.5",
      value: "2px",
      usage: "Toggle button groups"
    },
    {
      class: "p-1 / gap-1",
      value: "4px",
      usage: "Tight button groups"
    },
    {
      class: "p-1.5 / gap-1.5",
      value: "6px",
      usage: "Icon button padding"
    },
    {
      class: "p-2 / gap-2",
      value: "8px",
      usage: "Standard small gap"
    },
    {
      class: "p-3 / gap-3",
      value: "12px",
      usage: "List item padding, card body"
    },
    {
      class: "p-4 / gap-4",
      value: "16px",
      usage: "Card padding, standard gap"
    },
    {
      class: "p-6 / gap-6",
      value: "24px",
      usage: "Section padding, large gap"
    },
    { class: "p-8 / gap-8", value: "32px", usage: "Page padding" }
  ];
  const borderRadii = [
    {
      class: "rounded",
      value: "4px",
      usage: "Buttons, inputs, badges"
    },
    {
      class: "rounded-lg",
      value: "8px",
      usage: "Cards, panels, dropdowns"
    },
    {
      class: "rounded-full",
      value: "9999px",
      usage: "Status dots, avatars"
    }
  ];
  $$renderer.push(`<div class="p-6 lg:p-8 max-w-5xl"><div class="mb-8"><h1 class="text-2xl font-bold text-white mb-2">Layout</h1> <p class="text-gray-400">Spacing, grid patterns, and responsive design principles.</p></div> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Page Structure</h2> <p class="text-sm text-gray-400 mb-4">Standard page layout with header, sidebar navigation, and main content area.</p> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="h-64 flex flex-col"><div class="shrink-0 h-12 border-b border-gray-700 bg-gray-800/50 flex items-center justify-between px-4"><div class="flex items-center gap-2"><div class="w-6 h-6 bg-gray-700 rounded"></div> <div class="w-16 h-3 bg-gray-700 rounded"></div></div> <div class="flex items-center gap-2"><div class="w-12 h-3 bg-gray-700 rounded"></div> <div class="w-6 h-6 bg-gray-700 rounded"></div></div></div> <div class="flex-1 flex min-h-0"><div class="w-32 shrink-0 border-r border-gray-700 bg-gray-800/30 p-2 space-y-1"><div class="h-6 bg-gray-700 rounded"></div> <div class="h-6 bg-gray-600 rounded"></div> <div class="h-6 bg-gray-700 rounded"></div></div> <div class="flex-1 p-4 bg-gray-950"><div class="h-4 w-32 bg-gray-700 rounded mb-4"></div> <div class="grid grid-cols-2 gap-2"><div class="h-16 bg-gray-800 rounded"></div> <div class="h-16 bg-gray-800 rounded"></div></div></div></div></div></div> <div class="mt-4 grid grid-cols-3 gap-4 text-xs"><div class="bg-gray-900 border border-gray-800 rounded p-3"><div class="text-gray-500 mb-1">Header</div> <code class="text-gray-400">shrink-0 px-4 py-3 border-b</code></div> <div class="bg-gray-900 border border-gray-800 rounded p-3"><div class="text-gray-500 mb-1">Sidebar</div> <code class="text-gray-400">w-[12rem] shrink-0 border-r</code></div> <div class="bg-gray-900 border border-gray-800 rounded p-3"><div class="text-gray-500 mb-1">Content</div> <code class="text-gray-400">flex-1 overflow-y-auto</code></div></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Split Panel Layout</h2> <p class="text-sm text-gray-400 mb-4">Master-detail pattern used on Projects page. List on left, details on right.</p> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="h-48 flex"><div class="w-48 shrink-0 border-r border-gray-700 bg-gray-800/30"><div class="px-3 py-2 border-b border-gray-700 text-xs text-gray-500">Projects</div> <div class="p-2 space-y-1"><div class="h-8 bg-gray-700 border-l-2 border-blue-500 rounded-r"></div> <div class="h-8 bg-gray-800 rounded"></div> <div class="h-8 bg-gray-800 rounded"></div></div></div> <div class="flex-1 p-4 bg-gray-950"><div class="h-4 w-24 bg-gray-700 rounded mb-3"></div> <div class="h-3 w-full bg-gray-800 rounded mb-2"></div> <div class="h-3 w-3/4 bg-gray-800 rounded"></div></div></div></div> <pre class="mt-4 text-xs text-gray-400 bg-gray-900 border border-gray-800 p-4 rounded overflow-x-auto"><code>&lt;div class="flex-1 flex flex-col lg:flex-row min-h-0 h-full">
  &lt;!-- Master List -->
  &lt;aside class="hidden lg:flex lg:flex-col w-[18rem] shrink-0 border-r border-gray-800">
    &lt;!-- List content -->
  &lt;/aside>

  &lt;!-- Detail Panel -->
  &lt;div class="flex-1 flex flex-col overflow-y-auto">
    &lt;!-- Detail content -->
  &lt;/div>
&lt;/div></code></pre></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Two Column Layout</h2> <p class="text-sm text-gray-400 mb-4">Equal columns for side-by-side content (Console page pattern).</p> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="h-32 flex gap-4 p-4 bg-gray-950"><div class="flex-1 bg-gray-800 rounded-lg p-3"><div class="h-3 w-24 bg-gray-700 rounded mb-2"></div> <div class="h-12 bg-gray-700/50 rounded"></div></div> <div class="flex-1 bg-gray-800 rounded-lg p-3"><div class="h-3 w-24 bg-gray-700 rounded mb-2"></div> <div class="h-12 bg-gray-700/50 rounded"></div></div></div></div> <pre class="mt-4 text-xs text-gray-400 bg-gray-900 border border-gray-800 p-4 rounded overflow-x-auto"><code>&lt;div class="flex-1 flex flex-col lg:flex-row min-h-0 gap-4 lg:gap-6 p-4">
  &lt;div class="flex-1 flex flex-col border border-gray-800 rounded-lg">
    &lt;!-- Left panel -->
  &lt;/div>
  &lt;div class="flex-1 flex flex-col border border-gray-800 rounded-lg">
    &lt;!-- Right panel -->
  &lt;/div>
&lt;/div></code></pre></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Spacing Scale</h2> <p class="text-sm text-gray-400 mb-4">Consistent spacing values used throughout the application.</p> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-800"><!--[-->`);
  const each_array = ensure_array_like(spacingScale);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let spacing = each_array[$$index];
    $$renderer.push(`<div class="flex items-center px-4 py-3"><div class="w-32 shrink-0"><code class="text-xs text-blue-400">${escape_html(spacing.class)}</code></div> <div class="w-16 shrink-0 text-xs text-gray-500">${escape_html(spacing.value)}</div> <div class="flex-1"><div class="flex items-center gap-2"><div class="bg-blue-500/30 border border-blue-500"${attr_style(`width: ${stringify(spacing.value)}; height: ${stringify(spacing.value)};`)}></div> <span class="text-xs text-gray-400">${escape_html(spacing.usage)}</span></div></div></div>`);
  }
  $$renderer.push(`<!--]--></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Border Radius</h2> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-800"><!--[-->`);
  const each_array_1 = ensure_array_like(borderRadii);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let radius = each_array_1[$$index_1];
    $$renderer.push(`<div class="flex items-center px-4 py-3"><div class="w-32 shrink-0"><code class="text-xs text-blue-400">${escape_html(radius.class)}</code></div> <div class="w-16 shrink-0 text-xs text-gray-500">${escape_html(radius.value)}</div> <div class="flex-1 flex items-center gap-4"><div${attr_class(`w-12 h-12 bg-gray-700 ${stringify(radius.class)}`)}></div> <span class="text-xs text-gray-400">${escape_html(radius.usage)}</span></div></div>`);
  }
  $$renderer.push(`<!--]--></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Card Patterns</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><div class="text-xs text-gray-500 mb-2">Bordered Card</div> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="px-4 py-3 border-b border-gray-800"><span class="text-sm font-medium text-white">Header</span></div> <div class="p-4"><p class="text-sm text-gray-400">Card content</p></div></div> <code class="text-xs text-gray-500 mt-2 block">border border-gray-800 rounded-lg</code></div> <div><div class="text-xs text-gray-500 mb-2">Filled Card</div> <div class="bg-gray-800 rounded-lg p-4"><div class="text-xs text-gray-500 uppercase tracking-wider mb-2">Label</div> <p class="text-sm text-gray-300">Card content</p></div> <code class="text-xs text-gray-500 mt-2 block">bg-gray-800 rounded-lg p-4</code></div></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Responsive Patterns</h2> <p class="text-sm text-gray-400 mb-4">Key breakpoint patterns for mobile and desktop.</p> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><table class="w-full text-sm"><thead><tr class="border-b border-gray-800"><th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Pattern</th><th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Mobile</th><th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Desktop (lg+)</th></tr></thead><tbody class="divide-y divide-gray-800"><tr><td class="px-4 py-3 text-gray-300">Navigation</td><td class="px-4 py-3"><code class="text-xs text-gray-400">Horizontal tabs (border-b)</code></td><td class="px-4 py-3"><code class="text-xs text-gray-400">Vertical sidebar (border-r)</code></td></tr><tr><td class="px-4 py-3 text-gray-300">Sidebar</td><td class="px-4 py-3"><code class="text-xs text-gray-400">hidden</code></td><td class="px-4 py-3"><code class="text-xs text-gray-400">lg:flex lg:flex-col</code></td></tr><tr><td class="px-4 py-3 text-gray-300">Split Panel</td><td class="px-4 py-3"><code class="text-xs text-gray-400">Accordion (expandable)</code></td><td class="px-4 py-3"><code class="text-xs text-gray-400">Side-by-side panels</code></td></tr><tr><td class="px-4 py-3 text-gray-300">Content Layout</td><td class="px-4 py-3"><code class="text-xs text-gray-400">flex-col</code></td><td class="px-4 py-3"><code class="text-xs text-gray-400">lg:flex-row</code></td></tr></tbody></table></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Navigation Patterns</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="px-4 py-2 border-b border-gray-800 text-xs text-gray-500">Desktop Sidebar</div> <div class="p-2"><div class="flex items-center gap-3 px-4 py-2.5 bg-gray-800 border-l-2 border-blue-500">`);
  Activity($$renderer, { class: "w-4 h-4 text-blue-400" });
  $$renderer.push(`<!----> <span class="text-sm text-white">Active</span></div> <div class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/50 border-l-2 border-transparent">`);
  Layers($$renderer, { class: "w-4 h-4 text-gray-500" });
  $$renderer.push(`<!----> <span class="text-sm text-gray-300">Inactive</span></div> <div class="flex items-center gap-3 pl-8 pr-4 py-2 hover:bg-gray-800/30 border-l-2 border-transparent">`);
  Settings($$renderer, { class: "w-3.5 h-3.5 text-gray-500" });
  $$renderer.push(`<!----> <span class="text-sm text-gray-400">Sub-item</span></div></div></div> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="px-4 py-2 border-b border-gray-800 text-xs text-gray-500">Mobile Tabs</div> <div class="flex border-b border-gray-700"><div class="flex-1 py-2 text-center text-sm text-white border-b-2 border-blue-500">Console</div> <div class="flex-1 py-2 text-center text-sm text-gray-400">Projects</div> <div class="flex-1 py-2 text-center text-sm text-gray-400">Deploys</div></div> <div class="p-4 text-center text-xs text-gray-500">Content area</div></div></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Overflow Handling</h2> <p class="text-sm text-gray-400 mb-4">Critical patterns for preventing layout breaks with long content.</p> <div class="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-4"><div><div class="text-xs text-gray-500 mb-2">Flex with truncate</div> <div class="flex items-center gap-3 bg-gray-800 p-3 rounded max-w-sm"><div class="w-6 h-6 bg-gray-600 rounded shrink-0"></div> <div class="flex-1 min-w-0"><div class="text-sm text-white truncate">This is a very long project name that should truncate</div> <div class="text-xs text-gray-500 truncate">owner/repository-with-a-very-long-name</div></div> <div class="shrink-0 text-xs text-gray-500">2m ago</div></div> <code class="text-xs text-gray-500 mt-2 block">flex-1 min-w-0 + truncate</code></div> <div><div class="text-xs text-gray-500 mb-2">Scrollable container</div> <div class="bg-gray-800 rounded h-20 overflow-y-auto p-2"><!--[-->`);
  const each_array_2 = ensure_array_like(Array(10));
  for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
    each_array_2[i];
    $$renderer.push(`<div class="text-xs text-gray-400 py-1">Item ${escape_html(i + 1)}</div>`);
  }
  $$renderer.push(`<!--]--></div> <code class="text-xs text-gray-500 mt-2 block">overflow-y-auto</code></div></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Small Viewport / Mobile Layout</h2> <p class="text-sm text-gray-400 mb-4">Mobile-first responsive design patterns. Primary breakpoint: <code class="text-blue-400">lg:</code> (1024px).</p> <div class="mb-6"><div class="text-xs text-gray-500 mb-2">Breakpoints</div> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><table class="w-full text-sm"><thead><tr class="border-b border-gray-800"><th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Prefix</th><th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Min Width</th><th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Usage</th></tr></thead><tbody class="divide-y divide-gray-800"><tr><td class="px-4 py-3"><code class="text-blue-400">sm:</code></td><td class="px-4 py-3 text-gray-400">640px</td><td class="px-4 py-3 text-xs text-gray-500">Minor adjustments</td></tr><tr><td class="px-4 py-3"><code class="text-blue-400">md:</code></td><td class="px-4 py-3 text-gray-400">768px</td><td class="px-4 py-3 text-xs text-gray-500">Tablet layouts, grid columns</td></tr><tr class="bg-gray-800/30"><td class="px-4 py-3"><code class="text-green-400">lg:</code></td><td class="px-4 py-3 text-gray-300">1024px</td><td class="px-4 py-3 text-xs text-gray-300">Primary breakpoint - sidebar visible</td></tr><tr><td class="px-4 py-3"><code class="text-blue-400">xl:</code></td><td class="px-4 py-3 text-gray-400">1280px</td><td class="px-4 py-3 text-xs text-gray-500">Wide desktop</td></tr></tbody></table></div></div> <div class="mb-6"><div class="text-xs text-gray-500 mb-2">Navigation Pattern</div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="px-3 py-2 border-b border-gray-800 text-xs text-gray-500">Mobile (&lt;1024px)</div> <div class="bg-gray-950 p-2"><div class="flex border-b border-gray-700"><div class="flex-1 py-2 text-center text-xs text-white border-b-2 border-blue-500">Console</div> <div class="flex-1 py-2 text-center text-xs text-gray-400">Projects</div> <div class="flex-1 py-2 text-center text-xs text-gray-400">Deploys</div> <div class="flex-1 py-2 text-center text-xs text-gray-400">Infra</div></div> <div class="h-16 flex items-center justify-center text-xs text-gray-500">Content</div></div></div> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="px-3 py-2 border-b border-gray-800 text-xs text-gray-500">Desktop (1024px+)</div> <div class="flex bg-gray-950"><div class="w-24 shrink-0 border-r border-gray-700 p-2 space-y-1"><div class="h-5 bg-gray-700 rounded text-xs"></div> <div class="h-5 bg-gray-800 rounded text-xs"></div> <div class="h-5 bg-gray-800 rounded text-xs"></div></div> <div class="flex-1 h-24 flex items-center justify-center text-xs text-gray-500">Content</div></div></div></div> <pre class="mt-4 text-xs text-gray-400 bg-gray-900 border border-gray-800 p-4 rounded overflow-x-auto"><code>&lt;!-- Sidebar (desktop only) -->
&lt;aside class="hidden lg:flex lg:flex-col w-[12rem] shrink-0 border-r border-gray-800">
  &lt;MainNav />
&lt;/aside>

&lt;!-- Mobile tabs (mobile only) -->
&lt;div class="lg:hidden border-b border-gray-800">
  &lt;div class="flex">
    &lt;a href="/" class="flex-1 py-2 text-center text-sm">Console&lt;/a>
    &lt;a href="/projects" class="flex-1 py-2 text-center text-sm">Projects&lt;/a>
    &lt;!-- ... -->
  &lt;/div>
&lt;/div></code></pre></div> <div class="mb-6"><div class="text-xs text-gray-500 mb-2">Touch-Friendly Tap Targets</div> <div class="bg-gray-900 border border-gray-800 rounded-lg p-4"><p class="text-sm text-gray-400 mb-4">Minimum tap target: <code class="text-blue-400">44x44px</code> (Apple HIG) / <code class="text-blue-400">48x48px</code> (Material).</p> <div class="flex items-end gap-6"><div class="text-center"><div class="w-11 h-11 bg-gray-700 rounded flex items-center justify-center mb-2 border border-dashed border-gray-500"><div class="w-5 h-5 bg-blue-500 rounded"></div></div> <div class="text-xs text-gray-500">44px min</div> <code class="text-xs text-gray-600">p-2</code></div> <div class="text-center"><div class="w-12 h-12 bg-gray-700 rounded flex items-center justify-center mb-2 border border-dashed border-gray-500"><div class="w-5 h-5 bg-blue-500 rounded"></div></div> <div class="text-xs text-gray-500">48px ideal</div> <code class="text-xs text-gray-600">p-3</code></div></div> <div class="mt-4 text-xs text-gray-500"><p>Patterns used:</p> <ul class="mt-1 space-y-1 text-gray-400"><li>- Mobile nav tabs: <code class="text-blue-400">flex-1 py-2</code> (full width, generous height)</li> <li>- Icon buttons: <code class="text-blue-400">p-2 -m-2</code> (visual size + touch padding)</li> <li>- List items: <code class="text-blue-400">py-2.5</code> or <code class="text-blue-400">py-3</code> minimum</li></ul></div></div></div> <div class="mb-6"><div class="text-xs text-gray-500 mb-2">Content Stacking</div> <div class="bg-gray-900 border border-gray-800 rounded-lg p-4"><p class="text-sm text-gray-400 mb-4">Side-by-side panels stack vertically on small screens.</p> <pre class="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-x-auto"><code>&lt;!-- Two-column to stacked -->
&lt;div class="flex flex-col lg:flex-row gap-4">
  &lt;div class="flex-1">Panel A&lt;/div>
  &lt;div class="flex-1">Panel B&lt;/div>
&lt;/div>

&lt;!-- Split panel (Projects page) -->
&lt;div class="flex flex-col lg:flex-row min-h-0">
  &lt;aside class="hidden lg:flex w-[18rem]">List&lt;/aside>
  &lt;div class="flex-1">Detail&lt;/div>
&lt;/div></code></pre></div></div> <div><div class="text-xs text-gray-500 mb-2">Mobile-Specific Considerations</div> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-800"><div class="px-4 py-3"><div class="text-sm text-gray-300 mb-1">Safe area insets</div> <code class="text-xs text-gray-500">env(safe-area-inset-bottom)</code> <span class="text-xs text-gray-500 ml-2">for notched devices</span></div> <div class="px-4 py-3"><div class="text-sm text-gray-300 mb-1">Horizontal scrolling</div> <code class="text-xs text-gray-500">overflow-x-auto</code> <span class="text-xs text-gray-500 ml-2">with scroll snap for carousels</span></div> <div class="px-4 py-3"><div class="text-sm text-gray-300 mb-1">Text truncation</div> <code class="text-xs text-gray-500">truncate</code> or <code class="text-xs text-gray-500">line-clamp-2</code> <span class="text-xs text-gray-500 ml-2">to prevent overflow</span></div> <div class="px-4 py-3"><div class="text-sm text-gray-300 mb-1">Font sizes</div> <code class="text-xs text-gray-500">text-sm</code> minimum <span class="text-xs text-gray-500 ml-2">(14px) for readability</span></div> <div class="px-4 py-3"><div class="text-sm text-gray-300 mb-1">Viewport meta</div> <code class="text-xs text-gray-500">width=device-width, initial-scale=1</code> <span class="text-xs text-gray-500 ml-2">prevents zoom issues</span></div></div></div></section> <section><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Z-Index Layers</h2> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><table class="w-full text-sm"><thead><tr class="border-b border-gray-800"><th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Layer</th><th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Z-Index</th><th class="px-4 py-2 text-left text-xs text-gray-500 font-medium">Usage</th></tr></thead><tbody class="divide-y divide-gray-800"><tr><td class="px-4 py-3 text-gray-300">Base content</td><td class="px-4 py-3"><code class="text-xs text-gray-400">z-0</code></td><td class="px-4 py-3 text-xs text-gray-500">Page content, cards</td></tr><tr><td class="px-4 py-3 text-gray-300">Sticky headers</td><td class="px-4 py-3"><code class="text-xs text-gray-400">z-10</code></td><td class="px-4 py-3 text-xs text-gray-500">Controls bar, table headers</td></tr><tr><td class="px-4 py-3 text-gray-300">Dropdowns</td><td class="px-4 py-3"><code class="text-xs text-gray-400">z-10</code></td><td class="px-4 py-3 text-xs text-gray-500">Sort menus, select options</td></tr><tr><td class="px-4 py-3 text-gray-300">Modals</td><td class="px-4 py-3"><code class="text-xs text-gray-400">z-50</code></td><td class="px-4 py-3 text-xs text-gray-500">Dialogs, overlays</td></tr></tbody></table></div></section></div>`);
}
export {
  _page as default
};
