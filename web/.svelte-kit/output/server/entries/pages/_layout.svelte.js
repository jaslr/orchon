import { w as spread_props, x as attr_class, y as stringify, z as head } from "../../chunks/index2.js";
import { p as page } from "../../chunks/index3.js";
import { A as Activity } from "../../chunks/activity.js";
import { I as Icon } from "../../chunks/Icon.js";
import { F as Folder_git_2 } from "../../chunks/folder-git-2.js";
import { S as Server } from "../../chunks/server.js";
import { L as Layers } from "../../chunks/layers.js";
import { S as Settings } from "../../chunks/settings.js";
function Droplets($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"
        }
      ],
      [
        "path",
        {
          "d": "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "droplets" },
      /**
       * @component @name Droplets
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNyAxNi4zYzIuMiAwIDQtMS44MyA0LTQuMDUgMC0xLjE2LS41Ny0yLjI2LTEuNzEtMy4xOVM3LjI5IDYuNzUgNyA1LjNjLS4yOSAxLjQ1LTEuMTQgMi44NC0yLjI5IDMuNzZTMyAxMS4xIDMgMTIuMjVjMCAyLjIyIDEuOCA0LjA1IDQgNC4wNXoiIC8+CiAgPHBhdGggZD0iTTEyLjU2IDYuNkExMC45NyAxMC45NyAwIDAgMCAxNCAzLjAyYy41IDIuNSAyIDQuOSA0IDYuNXMzIDMuNSAzIDUuNWE2Ljk4IDYuOTggMCAwIDEtMTEuOTEgNC45NyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/droplets
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
function Image($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "rect",
        {
          "width": "18",
          "height": "18",
          "x": "3",
          "y": "3",
          "rx": "2",
          "ry": "2"
        }
      ],
      ["circle", { "cx": "9", "cy": "9", "r": "2" }],
      ["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "image" },
      /**
       * @component @name Image
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgLz4KICA8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/image
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
function Map($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
        }
      ],
      ["path", { "d": "M15 5.764v15" }],
      ["path", { "d": "M9 3.236v15" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "map" },
      /**
       * @component @name Map
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQuMTA2IDUuNTUzYTIgMiAwIDAgMCAxLjc4OCAwbDMuNjU5LTEuODNBMSAxIDAgMCAxIDIxIDQuNjE5djEyLjc2NGExIDEgMCAwIDEtLjU1My44OTRsLTQuNTUzIDIuMjc3YTIgMiAwIDAgMS0xLjc4OCAwbC00LjIxMi0yLjEwNmEyIDIgMCAwIDAtMS43ODggMGwtMy42NTkgMS44M0ExIDEgMCAwIDEgMyAxOS4zODFWNi42MThhMSAxIDAgMCAxIC41NTMtLjg5NGw0LjU1My0yLjI3N2EyIDIgMCAwIDEgMS43ODggMHoiIC8+CiAgPHBhdGggZD0iTTE1IDUuNzY0djE1IiAvPgogIDxwYXRoIGQ9Ik05IDMuMjM2djE1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/map
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
function MainNav($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let currentPath = page.url.pathname;
    let isOnInfraMap = currentPath === "/infrastructure/map";
    let isOnAdminProjects = currentPath.startsWith("/admin/projects");
    let isOnAdminRepos = currentPath.startsWith("/admin/repos");
    let isConfigActive = currentPath.startsWith("/admin/media");
    $$renderer2.push(`<nav class="flex flex-col gap-1 py-2"><a href="/"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(currentPath === "/" ? "bg-gray-800 border-l-2 border-blue-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Activity($$renderer2, {
      class: `w-4 h-4 ${stringify(currentPath === "/" ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(currentPath === "/" ? "text-white" : "text-gray-300")} truncate`)}>Console</div></div></a> <a href="/vastpuddle"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(currentPath.startsWith("/vastpuddle") ? "bg-gray-800 border-l-2 border-emerald-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Droplets($$renderer2, {
      class: `w-4 h-4 ${stringify(currentPath.startsWith("/vastpuddle") ? "text-emerald-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(currentPath.startsWith("/vastpuddle") ? "text-white" : "text-gray-300")} truncate`)}>Vast Puddle</div></div></a> <a href="/projects-infra"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(currentPath.startsWith("/projects-infra") ? "bg-gray-800 border-l-2 border-violet-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Folder_git_2($$renderer2, {
      class: `w-4 h-4 ${stringify(currentPath.startsWith("/projects-infra") ? "text-violet-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(currentPath.startsWith("/projects-infra") ? "text-white" : "text-gray-300")} truncate`)}>My Projects</div></div></a> <div class="flex items-center gap-3 px-4 py-2 mt-2">`);
    Server($$renderer2, { class: "w-4 h-4 text-gray-500 shrink-0" });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div class="font-medium text-xs text-gray-500 uppercase tracking-wide">Infrastructure</div></div></div> <a href="/infrastructure/map"${attr_class(`flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors ${stringify(isOnInfraMap ? "bg-gray-800/50 border-l-2 border-blue-400" : "hover:bg-gray-800/30 border-l-2 border-transparent")}`)}>`);
    Map($$renderer2, {
      class: `w-3.5 h-3.5 ${stringify(isOnInfraMap ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`text-sm ${stringify(isOnInfraMap ? "text-white" : "text-gray-400")} truncate`)}>Map</div></div></a> <a href="/admin/projects"${attr_class(`flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors ${stringify(isOnAdminProjects ? "bg-gray-800/50 border-l-2 border-blue-400" : "hover:bg-gray-800/30 border-l-2 border-transparent")}`)}>`);
    Layers($$renderer2, {
      class: `w-3.5 h-3.5 ${stringify(isOnAdminProjects ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`text-sm ${stringify(isOnAdminProjects ? "text-white" : "text-gray-400")} truncate`)}>Projects</div></div></a> <a href="/admin/repos"${attr_class(`flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors ${stringify(isOnAdminRepos ? "bg-gray-800/50 border-l-2 border-blue-400" : "hover:bg-gray-800/30 border-l-2 border-transparent")}`)}>`);
    Settings($$renderer2, {
      class: `w-3.5 h-3.5 ${stringify(isOnAdminRepos ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`text-sm ${stringify(isOnAdminRepos ? "text-white" : "text-gray-400")} truncate`)}>Config</div></div></a> <a href="/admin/media"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(isConfigActive ? "bg-gray-800 border-l-2 border-amber-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Image($$renderer2, {
      class: `w-4 h-4 ${stringify(isConfigActive ? "text-amber-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(isConfigActive ? "text-white" : "text-gray-300")} truncate`)}>Media</div></div></a></nav>`);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children, data } = $$props;
    let isLoginRoute = page.url.pathname === "/login";
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Orchon</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet"/>`);
    });
    if (isLoginRoute) {
      $$renderer2.push("<!--[-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="min-h-screen bg-gray-900 text-white flex flex-col"><header class="shrink-0 px-4 py-3 border-b border-gray-800"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><a href="/" class="flex items-center gap-3"><img src="/logo.svg" alt="Orchon logo" class="w-8 h-8 text-gray-200"/> <h1 class="text-lg font-semibold text-gray-100" style="font-family: 'Roboto', sans-serif;">Orchon</h1></a></div> <div class="relative user-menu"><button class="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer" title="Menu">`);
      Settings($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div></header> <div class="flex-1 flex flex-col lg:flex-row min-h-0"><aside class="hidden lg:flex lg:flex-col w-[12rem] shrink-0 border-r border-gray-800 bg-gray-900">`);
      MainNav($$renderer2);
      $$renderer2.push(`<!----></aside> <div class="lg:hidden border-b border-gray-800 bg-gray-900"><div class="flex"><a href="/"${attr_class(`flex-1 py-2 text-center text-sm ${stringify(page.url.pathname === "/" ? "text-white border-b-2 border-blue-500" : "text-gray-400")}`)}>Console</a> <a href="/projects"${attr_class(`flex-1 py-2 text-center text-sm ${stringify(page.url.pathname.startsWith("/projects") ? "text-white border-b-2 border-blue-500" : "text-gray-400")}`)}>Projects</a> <a href="/deployments"${attr_class(`flex-1 py-2 text-center text-sm ${stringify(page.url.pathname.startsWith("/deployments") ? "text-white border-b-2 border-blue-500" : "text-gray-400")}`)}>Deploys</a> <a href="/admin/infra"${attr_class(`flex-1 py-2 text-center text-sm ${stringify(page.url.pathname.startsWith("/admin/infra") ? "text-white border-b-2 border-blue-500" : "text-gray-400")}`)}>Infra</a></div></div> <main class="flex-1 flex flex-col overflow-hidden min-w-0">`);
      children($$renderer2);
      $$renderer2.push(`<!----></main></div></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _layout as default
};
