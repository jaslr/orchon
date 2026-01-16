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
  "wwc"
  // Work With Chip / Violet
];
const load = async () => {
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
  const additionalProjects = [
    {
      id: "violet",
      displayName: "Violet",
      productionUrl: void 0,
      repoUrl: "https://github.com/jaslr/violet",
      hostingProvider: "none",
      identity: "jaslr",
      description: "Design system / component library",
      services: []
    }
  ];
  return {
    projects: [...projects, ...additionalProjects].sort(
      (a, b) => a.displayName.localeCompare(b.displayName)
    )
  };
};
export {
  load
};
