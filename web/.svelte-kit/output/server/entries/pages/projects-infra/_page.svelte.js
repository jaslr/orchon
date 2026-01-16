import { z as head, x as attr_class, J as attr_style, F as ensure_array_like, G as attr, y as stringify } from "../../../chunks/index2.js";
import { A as Arrow_up_a_z, a as Zoom_out, Z as Zoom_in, F as Focus } from "../../../chunks/zoom-out.js";
import { F as Folder_git_2 } from "../../../chunks/folder-git-2.js";
import { D as Database } from "../../../chunks/database.js";
import { C as Cloud } from "../../../chunks/cloud.js";
import { G as Globe } from "../../../chunks/globe.js";
import { E as External_link } from "../../../chunks/external-link.js";
import { G as Git_branch } from "../../../chunks/git-branch.js";
import { j as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let panX = 40;
    let panY = 40;
    let zoom = 1;
    let isDragging = false;
    const CARD_WIDTH = 320;
    const CARD_HEIGHT = 140;
    const GAP_X = 30;
    const GAP_Y = 30;
    const COLUMNS = 3;
    const PADDING = 60;
    const providerColors = {
      cloudflare: {
        bg: "bg-orange-950/50",
        text: "text-orange-400",
        border: "border-orange-600"
      },
      flyio: {
        bg: "bg-violet-950/50",
        text: "text-violet-400",
        border: "border-violet-600"
      },
      firebase: {
        bg: "bg-yellow-950/50",
        text: "text-yellow-400",
        border: "border-yellow-600"
      },
      github: {
        bg: "bg-gray-800",
        text: "text-gray-400",
        border: "border-gray-600"
      },
      none: {
        bg: "bg-gray-800/50",
        text: "text-gray-500",
        border: "border-gray-700"
      },
      unknown: {
        bg: "bg-gray-800",
        text: "text-gray-400",
        border: "border-gray-600"
      }
    };
    const dbColors = {
      supabase: "text-green-400",
      pocketbase: "text-amber-400",
      firebase: "text-yellow-400"
    };
    let sortedProjects = [...data.projects].sort((a, b) => a.displayName.localeCompare(b.displayName));
    function getDisplayUrl(url) {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    }
    function getContentDimensions() {
      const rows = Math.ceil(sortedProjects.length / COLUMNS);
      return {
        width: PADDING + COLUMNS * (CARD_WIDTH + GAP_X) - GAP_X + PADDING,
        height: PADDING + rows * (CARD_HEIGHT + GAP_Y) - GAP_Y + PADDING
      };
    }
    let contentDimensions = getContentDimensions();
    head("1qci7na", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Personal Projects | Orchon</title>`);
      });
    });
    $$renderer2.push(`<div class="h-full flex flex-col bg-gray-950 overflow-hidden"><div class="shrink-0 flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm z-10"><div class="flex items-center gap-4"><h1 class="text-lg font-semibold text-white">Personal Projects</h1> <span class="text-xs text-gray-500">${escape_html(sortedProjects.length)} projects</span></div> <div class="flex items-center gap-2"><button class="flex items-center gap-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors">`);
    {
      $$renderer2.push("<!--[-->");
      Arrow_up_a_z($$renderer2, { class: "w-3.5 h-3.5" });
    }
    $$renderer2.push(`<!--]--> Sort</button> <div class="flex items-center gap-1 ml-2"><button class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">`);
    Zoom_out($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button> <span class="text-xs text-gray-400 w-14 text-center">${escape_html(Math.round(zoom * 100))}%</span> <button class="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">`);
    Zoom_in($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----></button> <button class="flex items-center gap-1.5 px-2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white font-medium ml-2" title="Fit diagram to view">`);
    Focus($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> Fit</button></div></div></div> <div class="shrink-0 px-4 py-1 text-xs text-gray-500 bg-gray-900/50">Scroll to zoom | Drag to pan | Non-Junipa projects and side projects</div> <div${attr_class("flex-1 overflow-hidden relative cursor-grab select-none", void 0, { "cursor-grabbing": isDragging })} role="application" tabindex="0"><div class="absolute inset-0 pointer-events-none"${attr_style(` background-image: linear-gradient(rgba(55, 65, 81, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(55, 65, 81, 0.3) 1px, transparent 1px); background-size: ${stringify(40 * zoom)}px ${stringify(40 * zoom)}px; background-position: ${stringify(panX)}px ${stringify(panY)}px; `)}></div> <div class="absolute origin-top-left"${attr_style(`transform: translate(${stringify(panX)}px, ${stringify(panY)}px) scale(${stringify(zoom)});`)}><svg class="absolute top-0 left-0 pointer-events-none"${attr_style(`width: ${stringify(contentDimensions.width)}px; height: ${stringify(contentDimensions.height)}px;`)}><!--[-->`);
    const each_array = ensure_array_like(Array(Math.ceil(sortedProjects.length / COLUMNS)));
    for (let rowIdx = 0, $$length = each_array.length; rowIdx < $$length; rowIdx++) {
      each_array[rowIdx];
      const y = PADDING + rowIdx * (CARD_HEIGHT + GAP_Y) + CARD_HEIGHT / 2;
      $$renderer2.push(`<line${attr("x1", PADDING - 20)}${attr("y1", y)}${attr("x2", PADDING + COLUMNS * (CARD_WIDTH + GAP_X) - GAP_X + 20)}${attr("y2", y)} stroke="rgba(75, 85, 99, 0.3)" stroke-width="1" stroke-dasharray="4 8"></line>`);
    }
    $$renderer2.push(`<!--]--></svg> <!--[-->`);
    const each_array_1 = ensure_array_like(sortedProjects);
    for (let idx = 0, $$length = each_array_1.length; idx < $$length; idx++) {
      let project = each_array_1[idx];
      const col = idx % COLUMNS;
      const row = Math.floor(idx / COLUMNS);
      const x = PADDING + col * (CARD_WIDTH + GAP_X);
      const y = PADDING + row * (CARD_HEIGHT + GAP_Y);
      const colors = providerColors[project.hostingProvider] || providerColors.unknown;
      $$renderer2.push(`<div${attr_class(`absolute rounded-lg overflow-hidden shadow-xl transition-all hover:shadow-2xl ${stringify(colors.bg)} border ${stringify(colors.border)}`)}${attr_style(`left: ${stringify(x)}px; top: ${stringify(y)}px; width: ${stringify(CARD_WIDTH)}px; height: ${stringify(CARD_HEIGHT)}px;`)}><div class="px-4 py-2.5 border-b border-gray-700/50 flex items-center justify-between"><div class="flex items-center gap-2.5">`);
      Folder_git_2($$renderer2, { class: `w-4 h-4 ${stringify(colors.text)}` });
      $$renderer2.push(`<!----> <span class="font-semibold text-white text-sm">${escape_html(project.displayName)}</span></div> <div class="flex items-center gap-2">`);
      if (project.database) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr_class(`flex items-center gap-1 px-1.5 py-0.5 bg-gray-800/80 rounded text-[10px] ${stringify(dbColors[project.database] || "text-gray-400")}`)}>`);
        Database($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----> <span>${escape_html(project.database)}</span></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div${attr_class(`flex items-center gap-1 px-1.5 py-0.5 bg-gray-800/80 rounded text-[10px] ${stringify(colors.text)}`)}>`);
      Cloud($$renderer2, { class: "w-3 h-3" });
      $$renderer2.push(`<!----> <span>${escape_html(project.hostingProvider)}</span></div></div></div> <div class="px-4 py-3 space-y-2">`);
      if (project.productionUrl) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attr("href", project.productionUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 group">`);
        Globe($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> <span class="truncate">${escape_html(getDisplayUrl(project.productionUrl))}</span> `);
        External_link($$renderer2, { class: "w-3 h-3 opacity-60 group-hover:opacity-100" });
        $$renderer2.push(`<!----></a>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="flex items-center gap-2 text-sm text-gray-500">`);
        Globe($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> <span>No production URL</span></div>`);
      }
      $$renderer2.push(`<!--]--> <a${attr("href", project.repoUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 group">`);
      Git_branch($$renderer2, { class: "w-3 h-3" });
      $$renderer2.push(`<!----> <span class="truncate font-mono">${escape_html(project.identity)}/${escape_html(project.id)}</span> `);
      External_link($$renderer2, { class: "w-2.5 h-2.5 opacity-50 group-hover:opacity-100" });
      $$renderer2.push(`<!----></a> `);
      if (project.description) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-[11px] text-gray-500 truncate">${escape_html(project.description)}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="shrink-0 px-4 py-2 bg-gray-900/90 border-t border-gray-800 flex items-center justify-between gap-6 flex-wrap"><div class="flex items-center gap-6 flex-wrap"><div class="flex items-center gap-3"><span class="text-xs text-gray-500">Hosting:</span> <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-orange-600"></div> <span class="text-xs text-gray-400">Cloudflare</span></div> <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-violet-600"></div> <span class="text-xs text-gray-400">Fly.io</span></div> <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-gray-600"></div> <span class="text-xs text-gray-400">GitHub Pages</span></div></div> <div class="flex items-center gap-3"><span class="text-xs text-gray-500">Database:</span> <div class="flex items-center gap-1.5">`);
    Database($$renderer2, { class: "w-3 h-3 text-green-400" });
    $$renderer2.push(`<!----> <span class="text-xs text-gray-400">Supabase</span></div> <div class="flex items-center gap-1.5">`);
    Database($$renderer2, { class: "w-3 h-3 text-amber-400" });
    $$renderer2.push(`<!----> <span class="text-xs text-gray-400">PocketBase</span></div></div></div></div></div>`);
  });
}
export {
  _page as default
};
