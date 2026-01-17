import { I as INFRASTRUCTURE } from "../../../chunks/infrastructure.js";
const PERSONAL_PROJECT_IDS = [
  "littlelistoflights",
  "livna",
  "orchon",
  "brontiq",
  "loadmanagement",
  // BlatBlat
  "Ladderbox",
  "shippywhippy",
  "wwc",
  // Work With Chip
  "violet"
  // Design system / component library
];
const load = async ({ platform }) => {
  const bucket = platform?.env?.LOGOS_BUCKET;
  let logos = [];
  if (bucket) {
    try {
      const listed = await bucket.list();
      for (const obj of listed.objects) {
        const parts = obj.key.split("/");
        const type = parts[0];
        const filename = parts.slice(1).join("/");
        const name = filename.replace(/\.(svg|png)$/i, "");
        logos.push({
          id: obj.key,
          name,
          url: `/api/logos/${obj.key}`,
          type
        });
      }
    } catch (err) {
      console.error("Failed to load logos:", err);
    }
  }
  const projects = PERSONAL_PROJECT_IDS.map((id) => {
    const infra = INFRASTRUCTURE[id];
    if (!infra) return null;
    const hostingService = infra.services.find((s) => s.category === "hosting");
    const hostingProvider = hostingService?.provider || "unknown";
    const dbService = infra.services.find((s) => s.category === "database");
    const database = dbService?.provider;
    const project = {
      id,
      displayName: infra.displayName,
      productionUrl: infra.productionUrl,
      repoUrl: `https://github.com/${infra.repoOwner}/${id}`,
      hostingProvider,
      database,
      identity: infra.identity,
      localPath: infra.localPath,
      stack: infra.stack,
      services: infra.services
    };
    return project;
  }).filter((p) => p !== null);
  return {
    projects: projects.sort(
      (a, b) => a.displayName.localeCompare(b.displayName)
    ),
    logos
  };
};
export {
  load
};
