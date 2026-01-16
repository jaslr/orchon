import { F as ensure_array_like, x as attr_class, y as stringify, J as attr_style, K as clsx } from "../../../../chunks/index2.js";
import { j as escape_html } from "../../../../chunks/context.js";
function _page($$renderer) {
  const textSizes = [
    {
      class: "text-xs",
      size: "12px",
      lineHeight: "16px",
      usage: "Labels, timestamps, meta info"
    },
    {
      class: "text-sm",
      size: "14px",
      lineHeight: "20px",
      usage: "Body text, list items"
    },
    {
      class: "text-base",
      size: "16px",
      lineHeight: "24px",
      usage: "Default body"
    },
    {
      class: "text-lg",
      size: "18px",
      lineHeight: "28px",
      usage: "Section headings"
    },
    {
      class: "text-xl",
      size: "20px",
      lineHeight: "28px",
      usage: "Page section titles"
    },
    {
      class: "text-2xl",
      size: "24px",
      lineHeight: "32px",
      usage: "Page titles"
    },
    {
      class: "text-3xl",
      size: "30px",
      lineHeight: "36px",
      usage: "Hero headings"
    }
  ];
  const fontWeights = [
    {
      class: "font-normal",
      weight: "400",
      usage: "Body text, descriptions"
    },
    {
      class: "font-medium",
      weight: "500",
      usage: "Labels, nav items, emphasis"
    },
    {
      class: "font-semibold",
      weight: "600",
      usage: "Headings, primary actions"
    },
    {
      class: "font-bold",
      weight: "700",
      usage: "Hero text, strong emphasis"
    }
  ];
  const textColors = [
    {
      class: "text-white",
      color: "#ffffff",
      usage: "Primary headings, high emphasis"
    },
    {
      class: "text-gray-100",
      color: "#f3f4f6",
      usage: "Secondary headings"
    },
    {
      class: "text-gray-200",
      color: "#e5e7eb",
      usage: "Subheadings"
    },
    {
      class: "text-gray-300",
      color: "#d1d5db",
      usage: "Primary body text"
    },
    {
      class: "text-gray-400",
      color: "#9ca3af",
      usage: "Secondary body text"
    },
    {
      class: "text-gray-500",
      color: "#6b7280",
      usage: "Muted text, captions"
    },
    {
      class: "text-gray-600",
      color: "#4b5563",
      usage: "Very muted, disabled"
    }
  ];
  const specialStyles = [
    {
      name: "Uppercase Labels",
      classes: "text-xs text-gray-500 uppercase tracking-wider",
      example: "Section Label"
    },
    {
      name: "Monospace Code",
      classes: "text-xs font-mono text-gray-400",
      example: "bc115a5"
    },
    {
      name: "Truncate",
      classes: "truncate",
      example: "This is a very long text that will be truncated..."
    },
    {
      name: "Link Text",
      classes: "text-blue-400 hover:text-blue-300",
      example: "View details"
    }
  ];
  $$renderer.push(`<div class="p-6 lg:p-8 max-w-5xl"><div class="mb-8"><h1 class="text-2xl font-bold text-white mb-2">Typography</h1> <p class="text-gray-400">Text sizes, weights, and hierarchy for data-dense interfaces.</p></div> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Font Family</h2> <div class="bg-gray-900 border border-gray-800 rounded-lg p-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><div class="text-xs text-gray-500 mb-2">Primary</div> <p class="text-2xl text-white" style="font-family: 'Roboto', sans-serif;">Roboto</p> <code class="text-xs text-gray-500">font-family: 'Roboto', sans-serif</code></div> <div><div class="text-xs text-gray-500 mb-2">Monospace</div> <p class="text-2xl text-white font-mono">System Mono</p> <code class="text-xs text-gray-500">font-mono (ui-monospace)</code></div></div></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Text Sizes</h2> <p class="text-sm text-gray-400 mb-4">Compact scale optimized for high-density data display.</p> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-800"><!--[-->`);
  const each_array = ensure_array_like(textSizes);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let size = each_array[$$index];
    $$renderer.push(`<div class="flex items-center gap-4 px-4 py-3"><div class="w-24 shrink-0"><code class="text-xs text-blue-400">${escape_html(size.class)}</code></div> <div class="w-24 shrink-0 text-xs text-gray-500">${escape_html(size.size)} / ${escape_html(size.lineHeight)}</div> <div class="flex-1 min-w-0"><p${attr_class(`${stringify(size.class)} text-white truncate`)}>The quick brown fox jumps over the lazy dog</p></div> <div class="text-xs text-gray-500 hidden md:block shrink-0 w-40">${escape_html(size.usage)}</div></div>`);
  }
  $$renderer.push(`<!--]--></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Font Weights</h2> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-800"><!--[-->`);
  const each_array_1 = ensure_array_like(fontWeights);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let weight = each_array_1[$$index_1];
    $$renderer.push(`<div class="flex items-center gap-4 px-4 py-3"><div class="w-28 shrink-0"><code class="text-xs text-blue-400">${escape_html(weight.class)}</code></div> <div class="w-12 shrink-0 text-xs text-gray-500">${escape_html(weight.weight)}</div> <div class="flex-1 min-w-0"><p${attr_class(`text-lg text-white ${stringify(weight.class)}`)}>Sample Text</p></div> <div class="text-xs text-gray-500 hidden md:block shrink-0 w-48">${escape_html(weight.usage)}</div></div>`);
  }
  $$renderer.push(`<!--]--></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Text Colors</h2> <p class="text-sm text-gray-400 mb-4">Hierarchical text colors for visual hierarchy.</p> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-800"><!--[-->`);
  const each_array_2 = ensure_array_like(textColors);
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    let color = each_array_2[$$index_2];
    $$renderer.push(`<div class="flex items-center gap-4 px-4 py-3"><div class="w-28 shrink-0"><code class="text-xs text-blue-400">${escape_html(color.class)}</code></div> <div class="w-20 shrink-0"><div class="flex items-center gap-2"><div class="w-4 h-4 rounded border border-gray-700"${attr_style(`background-color: ${stringify(color.color)};`)}></div> <code class="text-xs text-gray-500">${escape_html(color.color)}</code></div></div> <div class="flex-1 min-w-0"><p${attr_class(`text-sm ${stringify(color.class)}`)}>Sample text demonstrating this color</p></div> <div class="text-xs text-gray-500 hidden md:block shrink-0 w-44">${escape_html(color.usage)}</div></div>`);
  }
  $$renderer.push(`<!--]--></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Hierarchy Example</h2> <div class="bg-gray-900 border border-gray-800 rounded-lg p-6"><div class="space-y-4"><div class="text-xs text-gray-500 uppercase tracking-wider">Section Label</div> <h1 class="text-2xl font-bold text-white">Page Title</h1> <h2 class="text-lg font-semibold text-gray-200">Section Heading</h2> <p class="text-sm text-gray-400">Body text with secondary emphasis. This is the standard text color for most content.</p> <p class="text-xs text-gray-500">Caption or metadata text. Used for timestamps, counts, and auxiliary information.</p> <div class="flex items-center gap-2"><span class="text-sm text-gray-300">Primary</span> <span class="text-xs text-gray-500">owner/repo</span> <code class="text-xs font-mono text-gray-400">v1.2.3</code></div></div></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Special Styles</h2> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-800"><!--[-->`);
  const each_array_3 = ensure_array_like(specialStyles);
  for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
    let style = each_array_3[$$index_3];
    $$renderer.push(`<div class="px-4 py-3"><div class="flex items-center justify-between mb-2"><span class="text-sm text-gray-300">${escape_html(style.name)}</span> <code class="text-xs text-gray-500">${escape_html(style.classes)}</code></div> <div class="max-w-xs"><p${attr_class(clsx(style.classes))}>${escape_html(style.example)}</p></div></div>`);
  }
  $$renderer.push(`<!--]--></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Navigation Pattern</h2> <p class="text-sm text-gray-400 mb-4">Standard navigation item typography from MainNav.</p> <div class="bg-gray-900 border border-gray-800 rounded-lg p-4 max-w-xs"><div class="space-y-1"><div class="flex items-center gap-3 px-4 py-2.5 bg-gray-800 border-l-2 border-blue-500"><div class="w-4 h-4 rounded bg-blue-400/20"></div> <span class="font-medium text-sm text-white">Active Item</span></div> <div class="flex items-center gap-3 px-4 py-2.5 border-l-2 border-transparent hover:bg-gray-800/50"><div class="w-4 h-4 rounded bg-gray-600"></div> <span class="font-medium text-sm text-gray-300">Inactive Item</span></div> <div class="flex items-center gap-3 pl-8 pr-4 py-2"><div class="w-3.5 h-3.5 rounded bg-gray-600"></div> <span class="text-sm text-gray-400">Sub Item</span></div></div></div></section> <section><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Usage Example</h2> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="px-4 py-2 border-b border-gray-800 bg-gray-800/50"><span class="text-xs text-gray-400">Common text patterns</span></div> <pre class="p-4 text-sm text-gray-300 overflow-x-auto"><code>&lt;!-- Section label -->
&lt;div class="text-xs text-gray-500 uppercase tracking-wider mb-3">
  Section Label
&lt;/div>

&lt;!-- Page title -->
&lt;h1 class="text-2xl font-bold text-white mb-2">Page Title&lt;/h1>

&lt;!-- Body text -->
&lt;p class="text-sm text-gray-400">Description text here.&lt;/p>

&lt;!-- Metadata line -->
&lt;div class="text-xs text-gray-500">
  {formatRelativeTime(timestamp)}
&lt;/div>

&lt;!-- Code/version -->
&lt;code class="text-xs font-mono text-gray-400">v1.2.3&lt;/code></code></pre></div></section></div>`);
}
export {
  _page as default
};
