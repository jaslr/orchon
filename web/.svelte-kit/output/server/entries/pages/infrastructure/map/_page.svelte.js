import { w as spread_props, z as head, x as attr_class, K as attr_style, y as stringify, F as ensure_array_like, G as attr } from "../../../../chunks/index2.js";
import { S as Settings } from "../../../../chunks/settings.js";
import { A as Arrow_up_a_z, a as Zoom_out, Z as Zoom_in, F as Focus } from "../../../../chunks/zoom-out.js";
import { B as Building_2 } from "../../../../chunks/building-2.js";
import { G as Globe } from "../../../../chunks/globe.js";
import { E as External_link } from "../../../../chunks/external-link.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { P as Package } from "../../../../chunks/package.js";
import { j as escape_html } from "../../../../chunks/context.js";
function Network($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "rect",
        { "x": "16", "y": "16", "width": "6", "height": "6", "rx": "1" }
      ],
      [
        "rect",
        { "x": "2", "y": "16", "width": "6", "height": "6", "rx": "1" }
      ],
      [
        "rect",
        { "x": "9", "y": "2", "width": "6", "height": "6", "rx": "1" }
      ],
      ["path", { "d": "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" }],
      ["path", { "d": "M12 12V8" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "network" },
      /**
       * @component @name Network
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHJ4PSIxIiAvPgogIDxyZWN0IHg9IjIiIHk9IjE2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgLz4KICA8cmVjdCB4PSI5IiB5PSIyIiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgLz4KICA8cGF0aCBkPSJNNSAxNnYtM2ExIDEgMCAwIDEgMS0xaDEyYTEgMSAwIDAgMSAxIDF2MyIgLz4KICA8cGF0aCBkPSJNMTIgMTJWOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/network
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
function School($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M14 21v-3a2 2 0 0 0-4 0v3" }],
      ["path", { "d": "M18 5v16" }],
      ["path", { "d": "m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" }],
      [
        "path",
        {
          "d": "m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11"
        }
      ],
      ["path", { "d": "M6 5v16" }],
      ["circle", { "cx": "12", "cy": "9", "r": "2" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "school" },
      /**
       * @component @name School
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMjF2LTNhMiAyIDAgMCAwLTQgMHYzIiAvPgogIDxwYXRoIGQ9Ik0xOCA1djE2IiAvPgogIDxwYXRoIGQ9Im00IDYgNy4xMDYtMy43OWEyIDIgMCAwIDEgMS43ODggMEwyMCA2IiAvPgogIDxwYXRoIGQ9Im02IDExLTMuNTIgMi4xNDdhMSAxIDAgMCAwLS40OC44NTRWMTlhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0ydi01YTEgMSAwIDAgMC0uNDgtLjg1M0wxOCAxMSIgLz4KICA8cGF0aCBkPSJNNiA1djE2IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iOSIgcj0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/school
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
    let { data } = $$props;
    let toggleOverrides = {};
    function isProjectEnabled(gcpProjectId, defaultEnabled) {
      if (gcpProjectId in toggleOverrides) {
        return toggleOverrides[gcpProjectId];
      }
      return defaultEnabled;
    }
    let standaloneProjects = data.projects.filter((p) => !p.sourceRepo);
    [...standaloneProjects].sort((a, b) => a.displayName.localeCompare(b.displayName));
    let sortedSourceRepos = [...data.sourceRepos].sort((a, b) => a.displayName.localeCompare(b.displayName));
    let filteredClients = data.clients.map((client) => {
      const enabledCampuses = client.campuses.filter((campus) => isProjectEnabled(campus.gcpProject, true));
      const orgPortalEnabled = client.orgPortal ? isProjectEnabled(client.orgPortal.gcpProject, true) : true;
      return {
        ...client,
        campuses: enabledCampuses,
        orgPortal: orgPortalEnabled ? client.orgPortal : void 0
      };
    }).filter((client) => client.campuses.length > 0 || client.orgPortal);
    let sortedClients = [...filteredClients].sort((a, b) => a.displayName.localeCompare(b.displayName));
    let panX = 40;
    let panY = 40;
    let zoom = 1;
    let isDragging = false;
    const REPO_WIDTH = 280;
    const REPO_HEIGHT = 120;
    const INSTANCE_HEIGHT = 80;
    const CLIENT_WIDTH = 200;
    const CLIENT_HEIGHT = 80;
    const ORG_PORTAL_WIDTH = 280;
    const ORG_PORTAL_HEIGHT = 100;
    const CAMPUS_WIDTH = 240;
    const CAMPUS_HEIGHT = 75;
    const COL1_TO_COL2_GAP = 120;
    const COL2_TO_COL3_GAP = 140;
    const VERTICAL_GAP = 20;
    const BLOCK_VERTICAL_GAP = 50;
    const PADDING = 60;
    function getDisplayUrl(url) {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    }
    function getContentDimensions() {
      {
        let totalHeight = PADDING;
        for (const client of sortedClients) {
          const campusesHeight = client.campuses.length > 0 ? client.campuses.length * (CAMPUS_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP : CAMPUS_HEIGHT;
          const orgPortalHeight = client.orgPortal ? ORG_PORTAL_HEIGHT : 0;
          const blockHeight = Math.max(CLIENT_HEIGHT, orgPortalHeight, campusesHeight);
          totalHeight += blockHeight + BLOCK_VERTICAL_GAP;
        }
        const totalWidth = PADDING + CLIENT_WIDTH + COL1_TO_COL2_GAP + ORG_PORTAL_WIDTH + COL2_TO_COL3_GAP + CAMPUS_WIDTH + PADDING;
        return { width: totalWidth, height: totalHeight + PADDING };
      }
    }
    function getClientPositions() {
      const positions = /* @__PURE__ */ new Map();
      let currentY = PADDING;
      const col1X = PADDING;
      const col2X = PADDING + CLIENT_WIDTH + COL1_TO_COL2_GAP;
      const col3X = col2X + ORG_PORTAL_WIDTH + COL2_TO_COL3_GAP;
      for (const client of sortedClients) {
        const campusesHeight = client.campuses.length > 0 ? client.campuses.length * (CAMPUS_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP : CAMPUS_HEIGHT;
        const orgPortalHeight = client.orgPortal ? ORG_PORTAL_HEIGHT : 0;
        const blockHeight = Math.max(CLIENT_HEIGHT, orgPortalHeight, campusesHeight);
        const clientX = col1X;
        const clientY = currentY + (blockHeight - CLIENT_HEIGHT) / 2;
        let orgPortalX;
        let orgPortalY;
        if (client.orgPortal) {
          orgPortalX = col2X;
          orgPortalY = currentY + (blockHeight - ORG_PORTAL_HEIGHT) / 2;
        }
        const campusPositions = [];
        const campusesStartY = currentY + (blockHeight - campusesHeight) / 2;
        for (let i = 0; i < client.campuses.length; i++) {
          campusPositions.push({
            id: client.campuses[i].id,
            x: col3X,
            y: campusesStartY + i * (CAMPUS_HEIGHT + VERTICAL_GAP)
          });
        }
        positions.set(client.id, { clientX, clientY, orgPortalX, orgPortalY, campusPositions });
        currentY += blockHeight + BLOCK_VERTICAL_GAP;
      }
      return positions;
    }
    function getRepoPositions() {
      const positions = /* @__PURE__ */ new Map();
      let currentY = PADDING;
      for (const repo of sortedSourceRepos) {
        const instancesHeight = repo.instances.length > 0 ? repo.instances.length * (INSTANCE_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP : 0;
        const repoBlockHeight = Math.max(REPO_HEIGHT, instancesHeight);
        const repoX = PADDING;
        const repoY = currentY + (repoBlockHeight - REPO_HEIGHT) / 2;
        const instancePositions = [];
        const instanceStartY = currentY + (repoBlockHeight - instancesHeight) / 2;
        for (let i = 0; i < repo.instances.length; i++) {
          instancePositions.push({
            id: repo.instances[i].id,
            x: PADDING + REPO_WIDTH + COL1_TO_COL2_GAP,
            y: instanceStartY + i * (INSTANCE_HEIGHT + VERTICAL_GAP)
          });
        }
        positions.set(repo.id, { x: repoX, y: repoY, instancePositions });
        currentY += repoBlockHeight + BLOCK_VERTICAL_GAP;
      }
      return positions;
    }
    let clientPositions = getClientPositions();
    getRepoPositions();
    let contentDimensions = getContentDimensions();
    head("hoqwi7", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Infrastructure Map | Orchon</title>`);
      });
    });
    $$renderer2.push(`<div class="h-full flex flex-col bg-gray-950 overflow-hidden"><div class="shrink-0 flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm z-10"><div class="flex items-center gap-4"><h1 class="text-lg font-semibold text-white">Infrastructure Map</h1> <div class="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5"><button${attr_class(`px-3 py-1 text-xs rounded-md transition-colors ${stringify(
      "bg-emerald-600 text-white"
    )}`)}>Ownership</button> <button${attr_class(`px-3 py-1 text-xs rounded-md transition-colors ${stringify("text-gray-400 hover:text-white")}`)}>Repos</button> <button${attr_class(`px-3 py-1 text-xs rounded-md transition-colors ${stringify("text-gray-400 hover:text-white")}`)}>Flat</button></div> <span class="text-xs text-gray-500">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`${escape_html(sortedClients.length)} clients, ${escape_html(sortedClients.filter((c) => c.orgPortal).length)} org portals, ${escape_html(sortedClients.reduce((acc, c) => acc + c.campuses.length, 0))} campuses`);
    }
    $$renderer2.push(`<!--]--></span></div> <div class="flex items-center gap-2"><a href="/infrastructure/settings" class="flex items-center gap-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors" title="Manage GCP Projects">`);
    Settings($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> Settings</a> <button class="flex items-center gap-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 transition-colors">`);
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
    $$renderer2.push(`<!----> Fit</button></div></div></div> <div class="shrink-0 px-4 py-1 text-xs text-gray-500 bg-gray-900/50">Scroll to zoom | Drag to pan | ${escape_html(
      "Organisation ownership hierarchy"
    )}</div> <div${attr_class("flex-1 overflow-hidden relative cursor-grab select-none", void 0, { "cursor-grabbing": isDragging })} role="application" tabindex="0"><div class="absolute inset-0 pointer-events-none"${attr_style(` background-image: linear-gradient(rgba(55, 65, 81, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(55, 65, 81, 0.3) 1px, transparent 1px); background-size: ${stringify(40 * zoom)}px ${stringify(40 * zoom)}px; background-position: ${stringify(panX)}px ${stringify(panY)}px; `)}></div> <div class="absolute origin-top-left"${attr_style(`transform: translate(${stringify(panX)}px, ${stringify(panY)}px) scale(${stringify(zoom)});`)}>`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<svg class="absolute top-0 left-0 pointer-events-none"${attr_style(`width: ${stringify(contentDimensions.width)}px; height: ${stringify(contentDimensions.height)}px;`)}><!--[-->`);
      const each_array = ensure_array_like(sortedClients);
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let client = each_array[$$index_2];
        const pos = clientPositions.get(client.id);
        if (pos) {
          $$renderer2.push("<!--[-->");
          if (client.orgPortal && pos.orgPortalX !== void 0 && pos.orgPortalY !== void 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<path${attr("d", `M ${stringify(pos.clientX + CLIENT_WIDTH)} ${stringify(pos.clientY + CLIENT_HEIGHT / 2)}
									   C ${stringify(pos.clientX + CLIENT_WIDTH + COL1_TO_COL2_GAP / 2)} ${stringify(pos.clientY + CLIENT_HEIGHT / 2)},
									     ${stringify(pos.orgPortalX - COL1_TO_COL2_GAP / 2)} ${stringify(pos.orgPortalY + ORG_PORTAL_HEIGHT / 2)},
									     ${stringify(pos.orgPortalX)} ${stringify(pos.orgPortalY + ORG_PORTAL_HEIGHT / 2)}`)} fill="none" stroke="rgba(139, 92, 246, 0.5)" stroke-width="2"></path><!--[-->`);
            const each_array_1 = ensure_array_like(pos.campusPositions);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let campusPos = each_array_1[$$index];
              $$renderer2.push(`<path${attr("d", `M ${stringify(pos.orgPortalX + ORG_PORTAL_WIDTH)} ${stringify(pos.orgPortalY + ORG_PORTAL_HEIGHT / 2)}
										   C ${stringify(pos.orgPortalX + ORG_PORTAL_WIDTH + COL2_TO_COL3_GAP / 2)} ${stringify(pos.orgPortalY + ORG_PORTAL_HEIGHT / 2)},
										     ${stringify(campusPos.x - COL2_TO_COL3_GAP / 2)} ${stringify(campusPos.y + CAMPUS_HEIGHT / 2)},
										     ${stringify(campusPos.x)} ${stringify(campusPos.y + CAMPUS_HEIGHT / 2)}`)} fill="none" stroke="rgba(16, 185, 129, 0.4)" stroke-width="2" stroke-dasharray="6 4"></path><circle${attr("cx", campusPos.x)}${attr("cy", campusPos.y + CAMPUS_HEIGHT / 2)} r="4" fill="rgb(16, 185, 129)"></circle>`);
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<!--[-->`);
            const each_array_2 = ensure_array_like(pos.campusPositions);
            for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
              let campusPos = each_array_2[$$index_1];
              $$renderer2.push(`<path${attr("d", `M ${stringify(pos.clientX + CLIENT_WIDTH)} ${stringify(pos.clientY + CLIENT_HEIGHT / 2)}
										   C ${stringify(pos.clientX + CLIENT_WIDTH + (COL1_TO_COL2_GAP + ORG_PORTAL_WIDTH + COL2_TO_COL3_GAP) / 2)} ${stringify(pos.clientY + CLIENT_HEIGHT / 2)},
										     ${stringify(campusPos.x - COL2_TO_COL3_GAP / 2)} ${stringify(campusPos.y + CAMPUS_HEIGHT / 2)},
										     ${stringify(campusPos.x)} ${stringify(campusPos.y + CAMPUS_HEIGHT / 2)}`)} fill="none" stroke="rgba(75, 85, 99, 0.6)" stroke-width="2" stroke-dasharray="4 4"></path><circle${attr("cx", campusPos.x)}${attr("cy", campusPos.y + CAMPUS_HEIGHT / 2)} r="4" fill="rgb(107, 114, 128)"></circle>`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></svg><!--[-->`);
      const each_array_3 = ensure_array_like(sortedClients);
      for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
        let client = each_array_3[$$index_4];
        const pos = clientPositions.get(client.id);
        if (pos) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="absolute bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden"${attr_style(`left: ${stringify(pos.clientX)}px; top: ${stringify(pos.clientY)}px; width: ${stringify(CLIENT_WIDTH)}px; min-height: ${stringify(CLIENT_HEIGHT)}px;`)}><div class="px-3 py-2"><div class="flex items-center gap-2">`);
          Building_2($$renderer2, { class: "w-4 h-4 text-gray-400" });
          $$renderer2.push(`<!----> <span class="font-medium text-gray-200 text-sm">${escape_html(client.displayName)}</span></div> `);
          if (client.marketingUrl) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<a${attr("href", client.marketingUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-400 mt-1.5 group">`);
            Globe($$renderer2, { class: "w-3 h-3" });
            $$renderer2.push(`<!----> <span class="truncate">${escape_html(getDisplayUrl(client.marketingUrl))}</span> `);
            External_link($$renderer2, { class: "w-2 h-2 opacity-50 group-hover:opacity-100" });
            $$renderer2.push(`<!----></a>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <div class="text-[10px] text-gray-600 mt-1">${escape_html(client.campuses.length)} campus${escape_html(client.campuses.length !== 1 ? "es" : "")}</div></div></div> `);
          if (client.orgPortal && pos.orgPortalX !== void 0 && pos.orgPortalY !== void 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="absolute bg-gray-900 border-2 border-emerald-500 rounded-lg overflow-hidden shadow-xl shadow-emerald-500/10"${attr_style(`left: ${stringify(pos.orgPortalX)}px; top: ${stringify(pos.orgPortalY)}px; width: ${stringify(ORG_PORTAL_WIDTH)}px; min-height: ${stringify(ORG_PORTAL_HEIGHT)}px;`)}><div class="px-4 py-2.5 bg-emerald-950/50 border-b border-emerald-500/30"><div class="flex items-center gap-2">`);
            Network($$renderer2, { class: "w-4 h-4 text-emerald-400" });
            $$renderer2.push(`<!----> <span class="font-semibold text-white text-sm">Org Portal</span></div> <div class="text-[9px] text-emerald-300/70 mt-0.5">junipa-organisations</div></div> <div class="px-4 py-2">`);
            if (client.orgPortal.productionUrl) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<a${attr("href", client.orgPortal.productionUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 group"><span class="truncate">${escape_html(client.orgPortal.customDomain)}</span> `);
              External_link($$renderer2, { class: "w-2.5 h-2.5 opacity-60 group-hover:opacity-100" });
              $$renderer2.push(`<!----></a>`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--> <div class="text-[9px] text-gray-500 mt-1 font-mono">${escape_html(client.orgPortal.gcpProject)}</div></div></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <!--[-->`);
          const each_array_4 = ensure_array_like(pos.campusPositions);
          for (let i = 0, $$length2 = each_array_4.length; i < $$length2; i++) {
            let campusPos = each_array_4[i];
            const campus = client.campuses[i];
            $$renderer2.push(`<div class="absolute bg-gray-900 border border-gray-600 rounded-lg overflow-hidden shadow-lg hover:border-gray-500 transition-colors"${attr_style(`left: ${stringify(campusPos.x)}px; top: ${stringify(campusPos.y)}px; width: ${stringify(CAMPUS_WIDTH)}px; min-height: ${stringify(CAMPUS_HEIGHT)}px;`)}><div class="px-3 py-1.5 bg-gray-800/50 border-b border-gray-700"><div class="flex items-center gap-2">`);
            School($$renderer2, { class: "w-3.5 h-3.5 text-blue-400" });
            $$renderer2.push(`<!----> <span class="font-medium text-white text-xs truncate">${escape_html(campus.displayName)}</span></div></div> <div class="px-3 py-1.5">`);
            if (campus.productionUrl) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<a${attr("href", campus.productionUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 group"><span class="truncate">${escape_html(campus.customDomain || getDisplayUrl(campus.productionUrl))}</span> `);
              External_link($$renderer2, { class: "w-2.5 h-2.5 opacity-60 group-hover:opacity-100" });
              $$renderer2.push(`<!----></a>`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--> <div class="text-[9px] text-gray-500 mt-0.5 font-mono">${escape_html(campus.gcpProject)}</div></div></div>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="shrink-0 px-4 py-2 bg-gray-900/90 border-t border-gray-800 flex items-center justify-between gap-6 flex-wrap"><div class="flex items-center gap-6 flex-wrap">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-3"><span class="text-xs text-gray-500">Hierarchy:</span> <div class="flex items-center gap-1.5">`);
      Building_2($$renderer2, { class: "w-3.5 h-3.5 text-gray-400" });
      $$renderer2.push(`<!----> <span class="text-xs text-gray-400">Client</span></div> <div class="flex items-center gap-1.5">`);
      Network($$renderer2, { class: "w-3.5 h-3.5 text-emerald-400" });
      $$renderer2.push(`<!----> <span class="text-xs text-gray-400">Org Portal</span></div> <div class="flex items-center gap-1.5">`);
      School($$renderer2, { class: "w-3.5 h-3.5 text-blue-400" });
      $$renderer2.push(`<!----> <span class="text-xs text-gray-400">Campus</span></div></div> <div class="flex items-center gap-3"><span class="text-xs text-gray-500">Lines:</span> <div class="flex items-center gap-1.5"><div class="w-6 h-0.5 rounded bg-purple-500"></div> <span class="text-xs text-gray-400">to org portal</span></div> <div class="flex items-center gap-1.5"><div class="w-6 h-0.5 rounded bg-emerald-500 opacity-60" style="background: repeating-linear-gradient(90deg, rgb(16 185 129 / 0.6) 0px, rgb(16 185 129 / 0.6) 4px, transparent 4px, transparent 8px);"></div> <span class="text-xs text-gray-400">to campus</span></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (data.packageInfo) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-4 text-xs border-l border-gray-700 pl-4"><div class="flex items-center gap-1.5">`);
      Package($$renderer2, { class: "w-3.5 h-3.5 text-cyan-500" });
      $$renderer2.push(`<!----> <span class="text-gray-400 font-mono">${escape_html(data.packageInfo.name)}</span> <span class="text-cyan-400 font-mono">v${escape_html(data.packageInfo.version)}</span></div> <div class="flex items-center gap-2 text-gray-500"><span>${escape_html(data.packageInfo.dependencyCount)} deps</span> <span class="text-gray-600">|</span> <span>${escape_html(data.packageInfo.devDependencyCount)} dev</span></div> <div class="flex items-center gap-1.5 text-gray-600"><!--[-->`);
      const each_array_13 = ensure_array_like(data.packageInfo.keyPackages.slice(0, 4));
      for (let $$index_13 = 0, $$length = each_array_13.length; $$index_13 < $$length; $$index_13++) {
        let pkg = each_array_13[$$index_13];
        $$renderer2.push(`<span class="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400">${escape_html(pkg.replace("@", "").split("/").pop())}</span>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
