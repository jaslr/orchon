import { z as head, F as ensure_array_like, G as attr, y as stringify, x as attr_class } from "../../chunks/index2.js";
import { C as Cloud } from "../../chunks/cloud.js";
import { A as Arrow_right } from "../../chunks/arrow-right.js";
import { L as Loader, C as Circle_check_big, a as Circle_x } from "../../chunks/loader.js";
import { G as Git_commit_horizontal } from "../../chunks/git-commit-horizontal.js";
import { E as External_link } from "../../chunks/external-link.js";
import { j as escape_html } from "../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let statuses = data.statuses;
    data.lastUpdated;
    let deploymentLog = data.deploymentLog || [];
    let commitActivity = [...statuses].filter((s) => s.lastPush).sort((a, b) => {
      const dateA = new Date(a.lastPush || 0).getTime();
      const dateB = new Date(b.lastPush || 0).getTime();
      return dateB - dateA;
    }).slice(0, 20);
    data.apiSecret || "";
    function formatRelativeTime(isoString) {
      if (!isoString) return "";
      const date = new Date(isoString);
      const now = /* @__PURE__ */ new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 6e4);
      const diffHours = Math.floor(diffMs / 36e5);
      const diffDays = Math.floor(diffMs / 864e5);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    }
    function getStatusColor(status) {
      switch (status) {
        case "success":
          return "text-green-400";
        case "failure":
          return "text-red-400";
        case "deploying":
          return "text-cyan-400";
        default:
          return "text-gray-400";
      }
    }
    function getStatusLabel(status) {
      switch (status) {
        case "success":
          return "Deployed";
        case "failure":
          return "Failed";
        case "deploying":
          return "Deploying";
        default:
          return "Unknown";
      }
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Console | Orchon</title>`);
      });
    });
    $$renderer2.push(`<div class="flex-1 flex flex-col lg:flex-row min-h-0 h-full overflow-hidden gap-4 lg:gap-6 p-4"><div class="flex-1 flex flex-col border border-gray-800 rounded-lg min-w-0 overflow-hidden"><div class="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between"><div class="flex items-center gap-2 text-gray-400">`);
    Cloud($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span class="text-sm font-medium">Recent Deployments</span></div> <a href="/deployments" class="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">View all `);
    Arrow_right($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----></a></div> <div class="flex-1 overflow-y-auto">`);
    if (deploymentLog.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-8 text-center text-gray-500">`);
      Cloud($$renderer2, { class: "w-8 h-8 mx-auto mb-2 opacity-50" });
      $$renderer2.push(`<!----> <p class="text-sm">No recent deployments</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="divide-y divide-gray-800"><!--[-->`);
      const each_array = ensure_array_like(deploymentLog);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let deployment = each_array[$$index];
        const deployTime = deployment.deployCompletedAt || deployment.completedAt || deployment.startedAt;
        const deployStatus = deployment.status === "success" ? "success" : deployment.status === "failure" ? "failure" : deployment.status === "in_progress" ? "deploying" : "unknown";
        $$renderer2.push(`<a${attr("href", `/deployments?project=${stringify(deployment.projectName)}`)} class="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors"><div class="shrink-0">`);
        if (deployStatus === "deploying") {
          $$renderer2.push("<!--[-->");
          Loader($$renderer2, { class: "w-5 h-5 text-cyan-400 animate-spin" });
        } else {
          $$renderer2.push("<!--[!-->");
          if (deployStatus === "success") {
            $$renderer2.push("<!--[-->");
            Circle_check_big($$renderer2, { class: "w-5 h-5 text-green-400" });
          } else {
            $$renderer2.push("<!--[!-->");
            if (deployStatus === "failure") {
              $$renderer2.push("<!--[-->");
              Circle_x($$renderer2, { class: "w-5 h-5 text-red-400" });
            } else {
              $$renderer2.push("<!--[!-->");
              Cloud($$renderer2, { class: "w-5 h-5 text-gray-500" });
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2"><span class="font-medium text-white truncate">${escape_html(deployment.projectDisplayName || deployment.projectName)}</span> <span${attr_class(`text-xs ${stringify(getStatusColor(deployStatus))}`)}>${escape_html(getStatusLabel(deployStatus))}</span></div> <div class="text-xs text-gray-500 truncate">${escape_html(deployment.provider)} ${escape_html(deployment.branch ? `• ${deployment.branch}` : "")}</div></div> <div class="shrink-0 text-xs text-gray-500">${escape_html(formatRelativeTime(deployTime))}</div></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="flex-1 flex flex-col border border-gray-800 rounded-lg min-w-0 overflow-hidden"><div class="shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between"><div class="flex items-center gap-2 text-gray-400">`);
    Git_commit_horizontal($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span class="text-sm font-medium">Recent Commits</span></div></div> <div class="flex-1 overflow-y-auto">`);
    if (commitActivity.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-8 text-center text-gray-500">`);
      Git_commit_horizontal($$renderer2, { class: "w-8 h-8 mx-auto mb-2 opacity-50" });
      $$renderer2.push(`<!----> <p class="text-sm">No recent commits</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="divide-y divide-gray-800"><!--[-->`);
      const each_array_1 = ensure_array_like(commitActivity);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let status = each_array_1[$$index_1];
        $$renderer2.push(`<a${attr("href", status.repoUrl)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors"><div class="shrink-0">`);
        Git_commit_horizontal($$renderer2, { class: "w-5 h-5 text-gray-400" });
        $$renderer2.push(`<!----></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2"><span class="font-medium text-white truncate">${escape_html(status.repo)}</span> `);
        if (status.version) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-xs text-gray-500 font-mono">${escape_html(status.version)}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="text-xs text-gray-500 truncate">`);
        if (status.lastCommitSha) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="font-mono">${escape_html(status.lastCommitSha.slice(0, 7))}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`Pushed to ${escape_html(status.owner)}/${escape_html(status.repo)}`);
        }
        $$renderer2.push(`<!--]--></div></div> <div class="shrink-0 flex items-center gap-2 text-xs text-gray-500"><span>${escape_html(formatRelativeTime(status.lastPush))}</span> `);
        External_link($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----></div></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
export {
  _page as default
};
