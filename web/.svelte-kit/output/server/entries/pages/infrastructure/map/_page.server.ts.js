import { I as INFRASTRUCTURE, c as getSourceReposWithInstances, d as getClients, e as getGcpProject } from "../../../../chunks/infrastructure.js";
const load = async () => {
  const projects = Object.entries(INFRASTRUCTURE).map(([id, infra]) => ({
    id,
    displayName: infra.displayName,
    identity: infra.identity,
    productionUrl: infra.productionUrl,
    sourceRepo: infra.sourceRepo,
    isSourceRepo: infra.isSourceRepo,
    services: infra.services.map((s) => ({
      category: s.category,
      provider: s.provider,
      serviceName: s.serviceName,
      dashboardUrl: s.dashboardUrl
    }))
  })).sort((a, b) => a.displayName.localeCompare(b.displayName));
  const sourceRepos = getSourceReposWithInstances();
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
  return { projects, sourceRepos, clients };
};
export {
  load
};
