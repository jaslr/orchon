import { w as spread_props, x as attr_class, y as stringify, z as head } from "../../chunks/index2.js";
import { p as page } from "../../chunks/index3.js";
import { A as Activity } from "../../chunks/activity.js";
import { L as Layers } from "../../chunks/layers.js";
import { C as Cloud } from "../../chunks/cloud.js";
import { S as Server } from "../../chunks/server.js";
import { I as Icon } from "../../chunks/Icon.js";
import { R as Radio } from "../../chunks/radio.js";
import { S as Settings } from "../../chunks/settings.js";
import { j as escape_html } from "../../chunks/context.js";
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
    $$renderer2.push(`<nav class="flex flex-col gap-1 py-2"><a href="/"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(currentPath === "/" ? "bg-gray-800 border-l-2 border-blue-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Activity($$renderer2, {
      class: `w-4 h-4 ${stringify(currentPath === "/" ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(currentPath === "/" ? "text-white" : "text-gray-300")} truncate`)}>Console</div></div></a> <a href="/projects"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(currentPath === "/projects" || currentPath.startsWith("/projects") ? "bg-gray-800 border-l-2 border-blue-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Layers($$renderer2, {
      class: `w-4 h-4 ${stringify(currentPath === "/projects" || currentPath.startsWith("/projects") ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(currentPath === "/projects" || currentPath.startsWith("/projects") ? "text-white" : "text-gray-300")} truncate`)}>Projects</div></div></a> <a href="/deployments"${attr_class(`flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors ${stringify(currentPath === "/deployments" || currentPath.startsWith("/deployments") ? "bg-gray-800/50 border-l-2 border-blue-400" : "hover:bg-gray-800/30 border-l-2 border-transparent")}`)}>`);
    Cloud($$renderer2, {
      class: `w-3.5 h-3.5 ${stringify(currentPath === "/deployments" || currentPath.startsWith("/deployments") ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`text-sm ${stringify(currentPath === "/deployments" || currentPath.startsWith("/deployments") ? "text-white" : "text-gray-400")} truncate`)}>Deployments</div></div></a> <a href="/admin/infra"${attr_class(`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${stringify(currentPath.startsWith("/admin/infra") || currentPath.startsWith("/infrastructure") ? "bg-gray-800 border-l-2 border-blue-500" : "hover:bg-gray-800/50 border-l-2 border-transparent")}`)}>`);
    Server($$renderer2, {
      class: `w-4 h-4 ${stringify(currentPath.startsWith("/admin/infra") || currentPath.startsWith("/infrastructure") ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`font-medium text-sm ${stringify(currentPath.startsWith("/admin/infra") || currentPath.startsWith("/infrastructure") ? "text-white" : "text-gray-300")} truncate`)}>Infrastructure</div></div></a> <a href="/infrastructure/map"${attr_class(`flex items-center gap-3 pl-8 pr-4 py-2 text-left transition-colors ${stringify(currentPath === "/infrastructure/map" ? "bg-gray-800/50 border-l-2 border-blue-400" : "hover:bg-gray-800/30 border-l-2 border-transparent")}`)}>`);
    Map($$renderer2, {
      class: `w-3.5 h-3.5 ${stringify(currentPath === "/infrastructure/map" ? "text-blue-400" : "text-gray-500")} shrink-0`
    });
    $$renderer2.push(`<!----> <div class="flex-1 min-w-0"><div${attr_class(`text-sm ${stringify(currentPath === "/infrastructure/map" ? "text-white" : "text-gray-400")} truncate`)}>Map</div></div></a></nav>`);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children, data } = $$props;
    let isAdminRoute = page.url.pathname.startsWith("/admin");
    let isLoginRoute = page.url.pathname === "/login";
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Orchon</title>`);
      });
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/> <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&amp;display=swap" rel="stylesheet"/>`);
    });
    if (isAdminRoute || isLoginRoute) {
      $$renderer2.push("<!--[-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="min-h-screen bg-gray-900 text-white flex flex-col"><header class="shrink-0 px-4 py-3 border-b border-gray-800"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><a href="/" class="flex items-center gap-3"><img src="/logo.svg" alt="Orchon logo" class="w-8 h-8 text-gray-200"/> <div><h1 class="text-lg font-semibold text-gray-100" style="font-family: 'Roboto', sans-serif;">Orchon</h1> <p class="text-xs text-gray-500">Infrastructure Observatory</p></div></a></div> <div class="flex items-center gap-4"><div class="relative connection-status"><button class="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors cursor-pointer">`);
      Radio($$renderer2, {
        class: `w-3 h-3 ${stringify("text-gray-500")}`
      });
      $$renderer2.push(`<!----> <span${attr_class("text-gray-500")}>${escape_html("Offline")}</span></button></div> <a href="/admin" class="p-2 -m-2 text-gray-400 hover:text-gray-200 transition-colors" title="Settings">`);
      Settings($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></a></div></div></header> <div class="flex-1 flex flex-col lg:flex-row min-h-0"><aside class="hidden lg:flex lg:flex-col w-[12rem] shrink-0 border-r border-gray-800 bg-gray-900">`);
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
