// Sync projects from config to database
// This ensures all configured projects exist in the DB for foreign key relationships
import { query, ensureDb } from './client.js';
import { projects } from '../config/projects.js';
export async function syncProjectsToDb() {
    const pool = await ensureDb();
    if (!pool) {
        console.warn('Database not available, skipping project sync');
        return;
    }
    console.log('Syncing projects from config to database...');
    let projectsUpserted = 0;
    let servicesUpserted = 0;
    for (const project of projects) {
        try {
            // Upsert project
            await query(`
        INSERT INTO projects (id, name, display_name, owner, alert_level, alert_email, uptime_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          owner = EXCLUDED.owner,
          alert_level = EXCLUDED.alert_level,
          alert_email = COALESCE(EXCLUDED.alert_email, projects.alert_email),
          uptime_url = COALESCE(EXCLUDED.uptime_url, projects.uptime_url),
          updated_at = NOW()
        `, [
                project.id,
                project.name,
                project.displayName,
                project.owner,
                project.alertLevel,
                project.alertEmail || null,
                project.uptimeUrl || null,
            ]);
            projectsUpserted++;
            // Upsert services
            for (const service of project.services) {
                // Build config object with provider-specific fields
                const config = {};
                if (service.cfProjectName)
                    config.cfProjectName = service.cfProjectName;
                if (service.flyAppName)
                    config.flyAppName = service.flyAppName;
                if (service.gcpProjectId)
                    config.gcpProjectId = service.gcpProjectId;
                if (service.supabaseProjectRef)
                    config.supabaseProjectRef = service.supabaseProjectRef;
                await query(`
          INSERT INTO services (id, project_id, category, provider, service_name, check_url, config)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            project_id = EXCLUDED.project_id,
            category = EXCLUDED.category,
            provider = EXCLUDED.provider,
            service_name = EXCLUDED.service_name,
            check_url = COALESCE(EXCLUDED.check_url, services.check_url),
            config = EXCLUDED.config
          `, [
                    service.id,
                    project.id,
                    service.category,
                    service.provider,
                    service.serviceName,
                    service.checkUrl || null,
                    JSON.stringify(config),
                ]);
                servicesUpserted++;
            }
        }
        catch (err) {
            console.error(`Failed to sync project ${project.id}:`, err);
        }
    }
    console.log(`Project sync complete: ${projectsUpserted} projects, ${servicesUpserted} services upserted`);
}
//# sourceMappingURL=sync.js.map