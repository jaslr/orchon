import { w as spread_props, F as ensure_array_like, G as attr } from "../../../chunks/index2.js";
import { A as Arrow_right } from "../../../chunks/arrow-right.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { C as Code } from "../../../chunks/code.js";
import { P as Palette, T as Type, C as Component, a as Table, b as Panels_top_left } from "../../../chunks/type.js";
import { j as escape_html } from "../../../chunks/context.js";
function Gauge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "m12 14 4-4" }],
      ["path", { "d": "M3.34 19a10 10 0 1 1 17.32 0" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "gauge" },
      /**
       * @component @name Gauge
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTQgNC00IiAvPgogIDxwYXRoIGQ9Ik0zLjM0IDE5YTEwIDEwIDAgMSAxIDE3LjMyIDAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/gauge
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Moon($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "moon" },
      /**
       * @component @name Moon
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAuOTg1IDEyLjQ4NmE5IDkgMCAxIDEtOS40NzMtOS40NzJjLjQwNS0uMDIyLjYxNy40Ni40MDIuODAzYTYgNiAwIDAgMCA4LjI2OCA4LjI2OGMuMzQ0LS4yMTUuODI1LS4wMDQuODAzLjQwMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/moon
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function _page($$renderer) {
  const sections = [
    {
      href: "/design-system/colors",
      title: "Colors",
      description: "Gray scale, semantic colors, and accent palette",
      icon: Palette
    },
    {
      href: "/design-system/typography",
      title: "Typography",
      description: "Text sizes, weights, and hierarchy",
      icon: Type
    },
    {
      href: "/design-system/components",
      title: "Components",
      description: "Buttons, inputs, cards, chips, and badges",
      icon: Component
    },
    {
      href: "/design-system/data-display",
      title: "Data Display",
      description: "Tables, lists, and high-density patterns",
      icon: Table
    },
    {
      href: "/design-system/layout",
      title: "Layout",
      description: "Spacing, grid, and responsive patterns",
      icon: Panels_top_left
    }
  ];
  const principles = [
    {
      icon: Moon,
      title: "Dark First",
      description: "Built for dark environments with careful contrast ratios"
    },
    {
      icon: Gauge,
      title: "High Density",
      description: "Maximum information in minimum space"
    },
    {
      icon: Code,
      title: "Linear Design",
      description: "Clean lines, minimal decoration, functional aesthetics"
    }
  ];
  $$renderer.push(`<div class="p-6 lg:p-8 max-w-5xl"><div class="mb-12"><h1 class="text-3xl font-bold text-white mb-3">ORCHON Design System</h1> <p class="text-lg text-gray-400 max-w-2xl">A linear, high-density design system for infrastructure monitoring. Built for dark
			environments where data clarity is paramount.</p></div> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Design Principles</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><!--[-->`);
  const each_array = ensure_array_like(principles);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let principle = each_array[$$index];
    $$renderer.push(`<div class="bg-gray-900 border border-gray-800 rounded-lg p-4"><div class="flex items-center gap-3 mb-2"><div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center">`);
    principle.icon($$renderer, { class: "w-4 h-4 text-blue-400" });
    $$renderer.push(`<!----></div> <h3 class="font-medium text-white">${escape_html(principle.title)}</h3></div> <p class="text-sm text-gray-400">${escape_html(principle.description)}</p></div>`);
  }
  $$renderer.push(`<!--]--></div></section> <section class="mb-12"><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Quick Reference</h2> <div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"><div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-800"><div class="p-4"><div class="text-xs text-gray-500 mb-1">Background</div> <div class="flex items-center gap-2"><div class="w-6 h-6 rounded bg-gray-950 border border-gray-700"></div> <code class="text-xs text-gray-300">gray-950</code></div></div> <div class="p-4"><div class="text-xs text-gray-500 mb-1">Surface</div> <div class="flex items-center gap-2"><div class="w-6 h-6 rounded bg-gray-900 border border-gray-700"></div> <code class="text-xs text-gray-300">gray-900</code></div></div> <div class="p-4"><div class="text-xs text-gray-500 mb-1">Border</div> <div class="flex items-center gap-2"><div class="w-6 h-6 rounded bg-gray-800 border border-gray-700"></div> <code class="text-xs text-gray-300">gray-800</code></div></div> <div class="p-4"><div class="text-xs text-gray-500 mb-1">Primary</div> <div class="flex items-center gap-2"><div class="w-6 h-6 rounded bg-blue-500"></div> <code class="text-xs text-gray-300">blue-500</code></div></div></div></div></section> <section><h2 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Documentation</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
  const each_array_1 = ensure_array_like(sections);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let section = each_array_1[$$index_1];
    $$renderer.push(`<a${attr("href", section.href)} class="group bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 hover:bg-gray-900/80 transition-colors"><div class="flex items-start justify-between mb-3"><div class="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">`);
    section.icon($$renderer, {
      class: "w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors"
    });
    $$renderer.push(`<!----></div> `);
    Arrow_right($$renderer, {
      class: "w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors"
    });
    $$renderer.push(`<!----></div> <h3 class="font-medium text-white mb-1">${escape_html(section.title)}</h3> <p class="text-sm text-gray-500">${escape_html(section.description)}</p></a>`);
  }
  $$renderer.push(`<!--]--></div></section> <section class="mt-12 p-4 bg-gray-900/50 border border-gray-800 rounded-lg"><div class="text-xs text-gray-500 uppercase tracking-wider mb-2">Tech Stack</div> <div class="flex flex-wrap gap-2"><span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">SvelteKit 2.x</span> <span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Svelte 5 Runes</span> <span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Tailwind CSS 4</span> <span class="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">Lucide Icons</span></div></section></div>`);
}
export {
  _page as default
};
