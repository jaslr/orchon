import { c as getSourceReposWithInstances, d as getClients, e as getGcpProject } from "../../../chunks/infrastructure.js";
var define_PACKAGE_INFO_default = { name: "orchon-web", version: "0.0.91", description: "ORCHON Web Dashboard - SvelteKit frontend", dependencyCount: 9, devDependencyCount: 11, keyPackages: ["svelte", "@sveltejs/kit", "tailwindcss", "d3-force", "pixi.js", "vite", "typescript", "@lucide/svelte"] };
const load = async () => {
  const packageInfo = define_PACKAGE_INFO_default;
  const allSourceRepos = getSourceReposWithInstances();
  const sourceRepos = allSourceRepos.filter(
    (repo) => repo.id === "junipa" || repo.id === "junipa-organisations"
  );
  const clients = getClients().map((client) => {
    let orgPortal = void 0;
    if (client.orgPortal) {
      const gcpProject = getGcpProject(client.orgPortal.gcpProject);
      orgPortal = {
        gcpProject: client.orgPortal.gcpProject,
        displayName: gcpProject?.displayName || client.orgPortal.gcpProject,
        customDomain: gcpProject?.customDomain,
        productionUrl: gcpProject?.customDomain ? `https://${gcpProject.customDomain}` : void 0
      };
    }
    const campuses = client.campuses.map((campus) => {
      const gcpProject = getGcpProject(campus.gcpProject);
      return {
        id: campus.id,
        displayName: campus.displayName,
        gcpProject: campus.gcpProject,
        customDomain: gcpProject?.customDomain,
        productionUrl: gcpProject?.customDomain ? `https://${gcpProject.customDomain}` : void 0
      };
    });
    return {
      id: client.id,
      displayName: client.displayName,
      marketingUrl: client.marketingUrl,
      orgPortal,
      campuses
    };
  });
  return { sourceRepos, clients, packageInfo };
};
export {
  load
};
