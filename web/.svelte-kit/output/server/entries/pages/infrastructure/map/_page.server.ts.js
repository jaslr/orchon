import { I as INFRASTRUCTURE } from "../../../../chunks/infrastructure.js";
const load = async () => {
  const projects = Object.entries(INFRASTRUCTURE).map(([id, infra]) => ({
    id,
    displayName: infra.displayName,
    identity: infra.identity,
    productionUrl: infra.productionUrl,
    services: infra.services.map((s) => ({
      category: s.category,
      provider: s.provider,
      serviceName: s.serviceName,
      dashboardUrl: s.dashboardUrl
    }))
  })).sort((a, b) => a.displayName.localeCompare(b.displayName));
  return { projects };
};
export {
  load
};
