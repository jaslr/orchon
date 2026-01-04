/**
 * Job Storage for Async Operations
 *
 * In-memory job storage with optional file persistence
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// In-memory job storage
const jobs = new Map();

// Job status enum
const JobStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Configuration
const JOBS_DIR = process.env.JOBS_DIR || '/tmp/orchon-proxy-jobs';
const JOB_TTL = 3600000; // 1 hour in ms
const CLEANUP_INTERVAL = 300000; // 5 minutes

// Ensure jobs directory exists
if (!fs.existsSync(JOBS_DIR)) {
  fs.mkdirSync(JOBS_DIR, { recursive: true });
}

/**
 * Generate a unique job ID
 */
function generateJobId() {
  return crypto.randomBytes(8).toString('hex');
}

/**
 * Create a new job
 */
function createJob(request) {
  const id = generateJobId();
  const now = Date.now();

  const job = {
    id,
    status: JobStatus.PENDING,
    request: {
      url: request.url,
      task: request.task,
      // Don't store sensitive data
      has_schema: !!request.output_schema,
      has_callback: !!request.callback_url
    },
    progress: [],
    result: null,
    error: null,
    created_at: new Date(now).toISOString(),
    updated_at: new Date(now).toISOString(),
    expires_at: new Date(now + JOB_TTL).toISOString()
  };

  jobs.set(id, job);
  persistJob(job);

  return job;
}

/**
 * Get a job by ID
 */
function getJob(id) {
  // Try memory first
  let job = jobs.get(id);

  // Try file if not in memory
  if (!job) {
    job = loadJob(id);
    if (job) {
      jobs.set(id, job);
    }
  }

  return job || null;
}

/**
 * Update job status
 */
function updateJobStatus(id, status, data = {}) {
  const job = getJob(id);
  if (!job) {
    throw new Error(`Job not found: ${id}`);
  }

  job.status = status;
  job.updated_at = new Date().toISOString();

  if (data.result !== undefined) {
    job.result = data.result;
  }

  if (data.error !== undefined) {
    job.error = data.error;
  }

  jobs.set(id, job);
  persistJob(job);

  return job;
}

/**
 * Add progress update to job
 */
function addJobProgress(id, progress) {
  const job = getJob(id);
  if (!job) return;

  job.progress.push({
    ...progress,
    timestamp: new Date().toISOString()
  });
  job.updated_at = new Date().toISOString();

  jobs.set(id, job);
  // Don't persist on every progress update for performance
}

/**
 * Mark job as processing
 */
function startJob(id) {
  return updateJobStatus(id, JobStatus.PROCESSING);
}

/**
 * Mark job as completed
 */
function completeJob(id, result) {
  return updateJobStatus(id, JobStatus.COMPLETED, { result });
}

/**
 * Mark job as failed
 */
function failJob(id, error) {
  return updateJobStatus(id, JobStatus.FAILED, {
    error: error instanceof Error ? error.message : String(error)
  });
}

/**
 * List recent jobs (for debugging)
 */
function listJobs(limit = 20) {
  const allJobs = Array.from(jobs.values());
  return allJobs
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit)
    .map(j => ({
      id: j.id,
      status: j.status,
      task: j.request.task,
      url: j.request.url,
      created_at: j.created_at
    }));
}

/**
 * Persist job to file
 */
function persistJob(job) {
  try {
    const filePath = path.join(JOBS_DIR, `${job.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(job, null, 2));
  } catch (e) {
    console.error(`Failed to persist job ${job.id}:`, e.message);
  }
}

/**
 * Load job from file
 */
function loadJob(id) {
  try {
    const filePath = path.join(JOBS_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error(`Failed to load job ${id}:`, e.message);
  }
  return null;
}

/**
 * Clean up expired jobs
 */
function cleanupExpiredJobs() {
  const now = Date.now();

  // Clean memory
  for (const [id, job] of jobs.entries()) {
    if (new Date(job.expires_at).getTime() < now) {
      jobs.delete(id);
    }
  }

  // Clean files
  try {
    const files = fs.readdirSync(JOBS_DIR);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(JOBS_DIR, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (new Date(data.expires_at).getTime() < now) {
          fs.unlinkSync(filePath);
        }
      } catch (e) {
        // Remove corrupt files
        fs.unlinkSync(filePath);
      }
    }
  } catch (e) {
    console.error('Job cleanup error:', e.message);
  }
}

// Start cleanup interval
setInterval(cleanupExpiredJobs, CLEANUP_INTERVAL);

module.exports = {
  JobStatus,
  generateJobId,
  createJob,
  getJob,
  updateJobStatus,
  addJobProgress,
  startJob,
  completeJob,
  failJob,
  listJobs,
  cleanupExpiredJobs
};
