import { G as attr, y as stringify, x as attr_class, F as ensure_array_like, J as attr_style, z as head } from "../../../chunks/index2.js";
import { p as page } from "../../../chunks/index3.js";
import { a as getProvidersByCategory, b as getAllProjects, I as INFRASTRUCTURE } from "../../../chunks/infrastructure.js";
import { k as ssr_context, j as escape_html } from "../../../chunks/context.js";
import "clsx";
import { R as Refresh_cw } from "../../../chunks/refresh-cw.js";
import { A as Activity } from "../../../chunks/activity.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function InfrastructureMap($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let nodes = [];
    let links = [];
    let loading = true;
    let selectedNode = null;
    let transform = { x: 0, y: 0, k: 1 };
    const statusColors = {
      healthy: {
        border: "#22c55e",
        bg: "rgba(34, 197, 94, 0.1)",
        glow: "#22c55e"
      },
      degraded: {
        border: "#eab308",
        bg: "rgba(234, 179, 8, 0.1)",
        glow: "#eab308"
      },
      down: {
        border: "#ef4444",
        bg: "rgba(239, 68, 68, 0.1)",
        glow: "#ef4444"
      },
      unknown: {
        border: "#6b7280",
        bg: "rgba(107, 114, 128, 0.1)",
        glow: "#6b7280"
      }
    };
    const nodeSizes = { platform: 45, service: 30, external: 35, app: 28 };
    function getLinkPath(link) {
      const source = typeof link.source === "string" ? nodes.find((n) => n.id === link.source) : link.source;
      const target = typeof link.target === "string" ? nodes.find((n) => n.id === link.target) : link.target;
      if (!source?.x || !source?.y || !target?.x || !target?.y) return "";
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dr = Math.sqrt(dx * dx + dy * dy) * 0.8;
      return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
    }
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="relative w-full h-full min-h-[400px] bg-gray-900 rounded-lg overflow-hidden">`);
    if (nodes.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10"><div class="flex items-center gap-2 text-gray-400">`);
      Refresh_cw($$renderer2, { class: "w-5 h-5 animate-spin" });
      $$renderer2.push(`<!----> <span>Loading infrastructure status...</span></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="absolute top-4 right-4 flex items-center gap-2 z-10"><button${attr("disabled", loading, true)} class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors disabled:opacity-50 cursor-pointer">`);
    Refresh_cw($$renderer2, {
      class: `w-3.5 h-3.5 ${stringify("animate-spin")}`
    });
    $$renderer2.push(`<!----> Refresh</button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <svg role="img" aria-label="Infrastructure map visualization"${attr_class(`w-full h-full cursor-grab ${stringify("")}`)}><g${attr("transform", `translate(${stringify(transform.x)}, ${stringify(transform.y)}) scale(${stringify(transform.k)})`)}><!--[-->`);
    const each_array = ensure_array_like(links);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let link = each_array[$$index];
      const path = getLinkPath(link);
      if (path) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<path${attr("d", path)} fill="none" stroke="#374151" stroke-width="1.5" stroke-opacity="0.5" marker-end="url(#arrowhead)"></path>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    const each_array_1 = ensure_array_like(nodes);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let node = each_array_1[$$index_1];
      const size = nodeSizes[node.type];
      const colors = statusColors[node.status];
      const isSelected = selectedNode?.id === node.id;
      if (node.x !== void 0 && node.y !== void 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<g${attr("transform", `translate(${stringify(node.x)}, ${stringify(node.y)})`)} class="cursor-pointer" role="button" tabindex="0"${attr("aria-label", `${stringify(node.label)} - ${stringify(node.status)}`)}>`);
        if (node.status === "healthy") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<circle${attr("r", size + 4)}${attr("fill", colors.glow)} opacity="0.15"></circle>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--><circle${attr("r", size)}${attr("fill", colors.bg)}${attr("stroke", colors.border)}${attr("stroke-width", isSelected ? 3 : 2)} class="transition-all duration-150"></circle><circle${attr("cx", size - 5)}${attr("cy", -size + 5)} r="5"${attr("fill", colors.border)}></circle><text${attr("y", size + 14)} text-anchor="middle" class="text-[11px] fill-gray-300 font-medium pointer-events-none">${escape_html(node.label)}</text><text${attr("y", size + 26)} text-anchor="middle" class="text-[9px] fill-gray-500 uppercase pointer-events-none">${escape_html(node.type)}</text></g>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></g><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#374151"></polygon></marker></defs></svg> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div${attr_class(`absolute bottom-4 left-4 bg-gray-800/90 border border-gray-700 rounded px-3 py-2 text-xs ${stringify("")}`)}><div class="flex items-center gap-4"><!--[-->`);
    const each_array_3 = ensure_array_like(["healthy", "degraded", "down", "unknown"]);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let status = each_array_3[$$index_3];
      $$renderer2.push(`<div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full"${attr_style(`background-color: ${stringify(statusColors[status].border)}`)}></div> <span class="text-gray-400 capitalize">${escape_html(status)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    page.data.apiSecret || "";
    getProvidersByCategory();
    const projects = getAllProjects();
    let ownerFilters = { jaslr: true, vp: true };
    const categoryOrder = [
      "hosting",
      "database",
      "auth",
      "storage",
      "monitoring",
      "ci",
      "dns",
      "email",
      "analytics",
      "cdn",
      "secrets"
    ];
    let projectsWithServices = (() => {
      const result = [];
      for (const project of projects) {
        const infraConfig = INFRASTRUCTURE[project.id];
        if (!infraConfig) continue;
        const sortedServices = [...infraConfig.services].sort((a, b) => {
          const aIndex = categoryOrder.indexOf(a.category);
          const bIndex = categoryOrder.indexOf(b.category);
          return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
        });
        result.push({
          id: project.id,
          displayName: infraConfig.displayName,
          identity: infraConfig.identity,
          services: sortedServices.map((s) => ({
            category: s.category,
            provider: s.provider,
            serviceName: s.serviceName
          }))
        });
      }
      return result;
    })();
    function filterByOwner(projectList) {
      return projectList.filter((project) => {
        const isJaslr = project.identity === "jaslr";
        const isVP = project.identity === "jvp-ux";
        const isJunipa = project.id.toLowerCase().includes("junipa") || project.displayName.toLowerCase().includes("junipa");
        if (isJunipa) return true;
        if (isJaslr && ownerFilters.jaslr && !isJunipa) return true;
        if (isVP && ownerFilters.vp && !isJunipa) return true;
        return false;
      });
    }
    (() => {
      const filtered = filterByOwner(projectsWithServices);
      const sorted = [...filtered];
      {
        sorted.sort((a, b) => a.displayName.localeCompare(b.displayName));
      }
      return sorted;
    })();
    head("1ny0ztv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Ecosystem | Orchon</title>`);
      });
    });
    $$renderer2.push(`<div class="flex-1 flex flex-col overflow-hidden"><div class="shrink-0 border-b border-gray-800 bg-gray-900 px-4 sm:px-6 py-3"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div class="flex gap-1"><button${attr_class(`px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-t flex items-center gap-1.5 ${stringify(
      "text-white bg-gray-800 border-b-2 border-green-500"
    )}`)}>`);
    Activity($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Infrastructure</button> <button${attr_class(`px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-t ${stringify("text-gray-400 hover:text-gray-200")}`)}>Projects</button> <button${attr_class(`px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-t ${stringify("text-gray-400 hover:text-gray-200")}`)}>Flow Diagram</button></div> `);
    {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex-1 overflow-hidden p-4 sm:p-6">`);
      InfrastructureMap($$renderer2);
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
