import { w as spread_props, z as head, F as ensure_array_like, G as attr, x as attr_class, J as clsx } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { R as Refresh_cw } from "../../../../chunks/refresh-cw.js";
import { D as Database, T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { C as Circle_check_big, a as Circle_x } from "../../../../chunks/circle-x.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { C as Cloud } from "../../../../chunks/cloud.js";
import { j as escape_html } from "../../../../chunks/context.js";
function Github($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
        }
      ],
      ["path", { "d": "M9 18c-4.51 2-5-2-7-2" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "github" },
      /**
       * @component @name Github
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMjJ2LTRhNC44IDQuOCAwIDAgMC0xLTMuNWMzIDAgNi0yIDYtNS41LjA4LTEuMjUtLjI3LTIuNDgtMS0zLjUuMjgtMS4xNS4yOC0yLjM1IDAtMy41IDAgMC0xIDAtMyAxLjUtMi42NC0uNS01LjM2LS41LTggMEM2IDIgNSAyIDUgMmMtLjMgMS4xNS0uMyAyLjM1IDAgMy41QTUuNDAzIDUuNDAzIDAgMCAwIDQgOWMwIDMuNSAzIDUuNSA2IDUuNS0uMzkuNDktLjY4IDEuMDUtLjg1IDEuNjUtLjE3LjYtLjIyIDEuMjMtLjE1IDEuODV2NCIgLz4KICA8cGF0aCBkPSJNOSAxOGMtNC41MSAyLTUtMi03LTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/github
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=github instead. This icon will be removed in v1.0
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
function Play($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "path",
        {
          "d": "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "play" },
      /**
       * @component @name Play
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSA1YTIgMiAwIDAgMSAzLjAwOC0xLjcyOGwxMS45OTcgNi45OThhMiAyIDAgMCAxIC4wMDMgMy40NThsLTEyIDdBMiAyIDAgMCAxIDUgMTl6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/play
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
function Terminal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M12 19h8" }],
      ["path", { "d": "m4 17 6-6-6-6" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "terminal" },
      /**
       * @component @name Terminal
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTloOCIgLz4KICA8cGF0aCBkPSJtNCAxNyA2LTYtNi02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/terminal
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    function getStatusColor(status) {
      switch (status) {
        case "healthy":
        case "success":
          return "text-green-400";
        case "degraded":
        case "running":
          return "text-yellow-400";
        case "down":
        case "failure":
          return "text-red-400";
        default:
          return "text-gray-400";
      }
    }
    function getActionIcon(type) {
      switch (type) {
        case "fly-api":
          return Cloud;
        case "github-workflow":
          return Github;
        case "ssh-command":
          return Terminal;
        default:
          return Play;
      }
    }
    function formatRelativeTime(isoString) {
      if (!isoString) return "Never";
      const date = new Date(isoString);
      const now = /* @__PURE__ */ new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 6e4);
      const diffHours = Math.floor(diffMs / 36e5);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    }
    (() => {
      const grouped = /* @__PURE__ */ new Map();
      for (const action of data.actions) {
        const list = grouped.get(action.serviceId) || [];
        list.push(action);
        grouped.set(action.serviceId, list);
      }
      return grouped;
    })();
    (() => {
      const ids = /* @__PURE__ */ new Set();
      for (const svc of data.health.services) {
        ids.add(svc.id);
      }
      return Array.from(ids).sort();
    })();
    head("1p5hgyd", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Infrastructure | Orchon Admin</title>`);
      });
    });
    $$renderer2.push(`<div class="p-6 space-y-8"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-white">Infrastructure Control</h1> <p class="text-gray-400 text-sm mt-1">Monitor health and trigger recovery actions</p></div> <button class="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors">`);
    Refresh_cw($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Refresh</button></div> `);
    if (form?.success) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-400">${escape_html(form.message || "Action completed successfully")}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (form?.error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <section class="bg-gray-800/50 rounded-xl p-6"><div class="flex items-center gap-3 mb-4">`);
    Database($$renderer2, { class: "w-5 h-5 text-gray-400" });
    $$renderer2.push(`<!----> <h2 class="text-lg font-semibold text-white">Database</h2></div> <div class="flex items-center gap-3">`);
    if (data.health.database.connected) {
      $$renderer2.push("<!--[-->");
      Circle_check_big($$renderer2, { class: "w-6 h-6 text-green-400" });
      $$renderer2.push(`<!----> <span class="text-green-400 font-medium">Connected</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
      Circle_x($$renderer2, { class: "w-6 h-6 text-red-400" });
      $$renderer2.push(`<!----> <span class="text-red-400 font-medium">Disconnected</span> `);
      if (data.health.database.message) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-gray-500 text-sm">(${escape_html(data.health.database.message)})</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></section> <section class="bg-gray-800/50 rounded-xl p-6"><h2 class="text-lg font-semibold text-white mb-4">Service Health</h2> `);
    if (data.health.services.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-gray-500">No services to display</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
      const each_array = ensure_array_like(data.health.services);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let service = each_array[$$index];
        $$renderer2.push(`<div class="bg-gray-900/50 rounded-lg p-4"><div class="flex items-start justify-between"><div class="min-w-0"><p class="font-medium text-white truncate">${escape_html(service.id)}</p> <p class="text-sm text-gray-500 truncate">${escape_html(service.projectName)}</p></div> <div class="shrink-0 ml-2">`);
        if (service.status === "healthy") {
          $$renderer2.push("<!--[-->");
          Circle_check_big($$renderer2, { class: "w-5 h-5 text-green-400" });
        } else {
          $$renderer2.push("<!--[!-->");
          if (service.status === "degraded") {
            $$renderer2.push("<!--[-->");
            Triangle_alert($$renderer2, { class: "w-5 h-5 text-yellow-400" });
          } else {
            $$renderer2.push("<!--[!-->");
            if (service.status === "down") {
              $$renderer2.push("<!--[-->");
              Circle_x($$renderer2, { class: "w-5 h-5 text-red-400" });
            } else {
              $$renderer2.push("<!--[!-->");
              Clock($$renderer2, { class: "w-5 h-5 text-gray-500" });
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div></div> <div class="mt-2 flex items-center gap-2 text-xs text-gray-500"><span class="px-1.5 py-0.5 bg-gray-800 rounded">${escape_html(service.provider)}</span> <span>${escape_html(formatRelativeTime(service.lastChecked))}</span></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section> <section class="bg-gray-800/50 rounded-xl p-6"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-white">Recovery Actions</h2> <button class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white transition-colors">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Add Action</button></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.actions.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-gray-500">No recovery actions configured</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array_2 = ensure_array_like(data.actions);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let action = each_array_2[$$index_2];
        const Icon2 = getActionIcon(action.actionType);
        $$renderer2.push(`<div class="bg-gray-900/50 rounded-lg p-4 flex items-center justify-between"><div class="flex items-center gap-3 min-w-0"><div class="p-2 bg-gray-800 rounded-lg"><!---->`);
        Icon2($$renderer2, { class: "w-5 h-5 text-gray-400" });
        $$renderer2.push(`<!----></div> <div class="min-w-0"><p class="font-medium text-white">${escape_html(action.name)}</p> <p class="text-sm text-gray-500 truncate">${escape_html(action.serviceId)}</p></div></div> <div class="flex items-center gap-2 shrink-0"><form method="POST" action="?/execute"><input type="hidden" name="actionId"${attr("value", action.id)}/> <button type="submit" class="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm text-white transition-colors">`);
        Play($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Execute</button></form> <form method="POST" action="?/deleteAction"><input type="hidden" name="actionId"${attr("value", action.id)}/> <button type="submit" class="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Delete action">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></form></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section> <section class="bg-gray-800/50 rounded-xl p-6"><h2 class="text-lg font-semibold text-white mb-4">Execution Log</h2> `);
    if (data.executions.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-gray-500">No executions yet</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="space-y-2"><!--[-->`);
      const each_array_3 = ensure_array_like(data.executions);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let exec = each_array_3[$$index_3];
        $$renderer2.push(`<div class="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg"><div${attr_class(clsx(getStatusColor(exec.status)))}>`);
        if (exec.status === "success") {
          $$renderer2.push("<!--[-->");
          Circle_check_big($$renderer2, { class: "w-5 h-5" });
        } else {
          $$renderer2.push("<!--[!-->");
          if (exec.status === "failure") {
            $$renderer2.push("<!--[-->");
            Circle_x($$renderer2, { class: "w-5 h-5" });
          } else {
            $$renderer2.push("<!--[!-->");
            if (exec.status === "running") {
              $$renderer2.push("<!--[-->");
              Refresh_cw($$renderer2, { class: "w-5 h-5 animate-spin" });
            } else {
              $$renderer2.push("<!--[!-->");
              Clock($$renderer2, { class: "w-5 h-5" });
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div> <div class="flex-1 min-w-0"><p class="text-white font-medium truncate">${escape_html(exec.actionName)}</p> <p class="text-sm text-gray-500">${escape_html(exec.serviceId)}</p></div> <div class="text-right text-sm shrink-0"><p${attr_class(clsx(getStatusColor(exec.status)))}>${escape_html(exec.status)}</p> <p class="text-gray-500">${escape_html(formatRelativeTime(exec.startedAt))}</p></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></section></div>`);
  });
}
export {
  _page as default
};
