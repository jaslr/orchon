import { w as spread_props, z as head, F as ensure_array_like, G as attr, x as attr_class, y as stringify } from "../../../chunks/index2.js";
import { p as page } from "../../../chunks/index3.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { P as Palette, T as Type, C as Component, a as Table, b as Panels_top_left } from "../../../chunks/type.js";
import { j as escape_html } from "../../../chunks/context.js";
function Book_open($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M12 7v14" }],
      [
        "path",
        {
          "d": "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "book-open" },
      /**
       * @component @name BookOpen
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgN3YxNCIgLz4KICA8cGF0aCBkPSJNMyAxOGExIDEgMCAwIDEtMS0xVjRhMSAxIDAgMCAxIDEtMWg1YTQgNCAwIDAgMSA0IDQgNCA0IDAgMCAxIDQtNGg1YTEgMSAwIDAgMSAxIDF2MTNhMSAxIDAgMCAxLTEgMWgtNmEzIDMgMCAwIDAtMyAzIDMgMyAwIDAgMC0zLTN6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/book-open
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
function Chevron_left($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
    Icon($$renderer2, spread_props([
      { name: "chevron-left" },
      /**
       * @component @name ChevronLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUgMTgtNi02IDYtNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-left
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
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    let currentPath = page.url.pathname;
    const navItems = [
      {
        href: "/design-system",
        label: "Overview",
        icon: Book_open,
        exact: true
      },
      {
        href: "/design-system/colors",
        label: "Colors",
        icon: Palette
      },
      {
        href: "/design-system/typography",
        label: "Typography",
        icon: Type
      },
      {
        href: "/design-system/components",
        label: "Components",
        icon: Component
      },
      {
        href: "/design-system/data-display",
        label: "Data Display",
        icon: Table
      },
      { href: "/design-system/layout", label: "Layout", icon: Panels_top_left }
    ];
    function isActive(href, exact = false) {
      if (exact) {
        return currentPath === href;
      }
      return currentPath === href || currentPath.startsWith(href + "/");
    }
    head("1wb4al6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Design System | Orchon</title>`);
      });
    });
    $$renderer2.push(`<div class="flex-1 flex flex-col lg:flex-row min-h-0 h-full overflow-hidden"><aside class="shrink-0 w-full lg:w-56 border-b lg:border-b-0 lg:border-r border-gray-800 bg-gray-900"><div class="px-4 py-3 border-b border-gray-800"><a href="/" class="flex items-center gap-2 text-gray-400 hover:text-gray-200 text-sm transition-colors">`);
    Chevron_left($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>Back to App</span></a></div> <div class="px-4 py-4 border-b border-gray-800"><h1 class="text-lg font-semibold text-white">Design System</h1> <p class="text-xs text-gray-500 mt-1">ORCHON UI Reference</p></div> <nav class="flex lg:flex-col overflow-x-auto lg:overflow-x-visible"><!--[-->`);
    const each_array = ensure_array_like(navItems);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      const active = isActive(item.href, item.exact);
      $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${stringify(active ? "bg-gray-800 text-white border-b-2 lg:border-b-0 lg:border-l-2 border-blue-500" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border-b-2 lg:border-b-0 lg:border-l-2 border-transparent")}`)}><!---->`);
      item.icon($$renderer2, {
        class: `w-4 h-4 ${stringify(active ? "text-blue-400" : "text-gray-500")}`
      });
      $$renderer2.push(`<!----> <span>${escape_html(item.label)}</span></a>`);
    }
    $$renderer2.push(`<!--]--></nav></aside> <main class="flex-1 overflow-y-auto bg-gray-950">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main></div>`);
  });
}
export {
  _layout as default
};
