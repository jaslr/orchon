/**
 * Task Templates for Claude Proxy
 *
 * Each template defines a prompt pattern and expected output schema
 */

const TASK_TEMPLATES = {
  /**
   * Generic product extraction
   */
  extract_product: {
    name: 'Extract Product',
    description: 'Extract product information from any e-commerce page',
    prompt: (url, options = {}) => `
You are a product data extractor. Visit this URL and extract structured product information:

URL: ${url}

Extract the following if available:
- Product name/title
- Brand
- Model number
- Price (current and original if on sale)
- Description
- Specifications (as key-value pairs)
- Images (URLs)
- Availability/stock status
- Category
- SKU/product ID

${options.output_schema ? `
Return the data matching this JSON schema:
${JSON.stringify(options.output_schema, null, 2)}
` : `
Return as JSON with this structure:
{
  "name": "string",
  "brand": "string",
  "model": "string",
  "price": { "current": number, "original": number, "currency": "string" },
  "description": "string",
  "specs": { "key": "value", ... },
  "images": ["url1", "url2"],
  "availability": "string",
  "category": "string",
  "sku": "string"
}
`}

If data is not found, use null for that field. Do not make up data.
`,
    default_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        brand: { type: 'string' },
        model: { type: 'string' },
        price: {
          type: 'object',
          properties: {
            current: { type: 'number' },
            original: { type: 'number' },
            currency: { type: 'string' }
          }
        },
        description: { type: 'string' },
        specs: { type: 'object' },
        images: { type: 'array', items: { type: 'string' } },
        availability: { type: 'string' },
        category: { type: 'string' },
        sku: { type: 'string' }
      }
    }
  },

  /**
   * Flashlight-specific extraction for Little List of Lights
   */
  extract_flashlight: {
    name: 'Extract Flashlight Specs',
    description: 'Extract flashlight specifications for LLOL import',
    prompt: (url, options = {}) => `
You are a flashlight specification extractor for a flashlight database. Visit this URL and extract detailed flashlight specifications:

URL: ${url}

Extract the following specifications if available:
- Brand name
- Model name/number
- Maximum lumens (max output)
- Beam distance (in meters)
- Peak intensity (candela)
- Weight (in grams, without batteries)
- Length (in mm)
- Head diameter (in mm)
- Body/tube diameter (in mm)
- IP rating (e.g., IPX8, IP68)
- Impact resistance (in meters)
- LED/emitter type (e.g., "Cree XHP70.2", "Luminus SBT90.2")
- Color temperature (in Kelvin, e.g., 5000K, 6500K)
- CRI (Color Rendering Index, 0-100)
- Maximum runtime
- UI type (e.g., "Anduril 2", "Narsil", "proprietary")
- Driver type
- Reflector type (e.g., "smooth", "orange peel", "TIR")
- Lens material
- Switch type (e.g., "electronic side switch", "mechanical tail switch")
- Body materials (e.g., "aluminum", "titanium", "copper")
- Battery information (type, size, count, configuration)
- Available variants (different LED options, colors, etc.)
- Product images

Return as JSON matching this exact structure for LLOL import:
{
  "brand": "string",
  "model": "string",
  "specs": {
    "max_lumens": number or null,
    "beam_distance": number or null,
    "peak_intensity": number or null,
    "weight": number or null,
    "length": number or null,
    "head_diameter": number or null,
    "body_diameter": number or null,
    "ip_rating": "string" or null,
    "impact_resistance": number or null,
    "emitter": "string" or null,
    "color_temp": number or null,
    "cri": number or null,
    "max_runtime": number or null,
    "ui": "string" or null,
    "driver": "string" or null,
    "reflector": "string" or null,
    "lens": "string" or null,
    "switch": "string" or null,
    "materials": "string" or null
  },
  "batteries": [
    {
      "type": "string (Li-ion, NiMH, Alkaline, etc.)",
      "size": "string (18650, 21700, AA, etc.)",
      "count": number,
      "configuration": "string or null (series, parallel, etc.)"
    }
  ],
  "emitters": [
    {
      "type": "string (LED name)",
      "count": number,
      "color_temp": number or null,
      "cri": number or null
    }
  ],
  "variants": [
    {
      "name": "string (variant description)",
      "specs": { "key": "value overrides" }
    }
  ],
  "images": ["url1", "url2"]
}

Use null for any specification not found on the page. Do not guess or fabricate data.
Parse multiple variants if the product comes in different LED/color options.
`,
    default_schema: {
      type: 'object',
      required: ['brand', 'model'],
      properties: {
        brand: { type: 'string' },
        model: { type: 'string' },
        specs: { type: 'object' },
        batteries: { type: 'array' },
        emitters: { type: 'array' },
        variants: { type: 'array' },
        images: { type: 'array', items: { type: 'string' } }
      }
    }
  },

  /**
   * Extract all links from a page
   */
  extract_links: {
    name: 'Extract Links',
    description: 'Get all links from a page with optional filtering',
    prompt: (url, options = {}) => `
Visit this URL and extract all links:

URL: ${url}

${options.filter ? `Only include links matching: ${options.filter}` : 'Include all links.'}

Return as JSON:
{
  "page_title": "string",
  "page_url": "string",
  "links": [
    {
      "text": "link text",
      "href": "full URL",
      "type": "internal|external"
    }
  ],
  "total_count": number
}
`,
    default_schema: {
      type: 'object',
      properties: {
        page_title: { type: 'string' },
        page_url: { type: 'string' },
        links: { type: 'array' },
        total_count: { type: 'number' }
      }
    }
  },

  /**
   * Take a screenshot
   */
  screenshot: {
    name: 'Screenshot',
    description: 'Take a screenshot of a webpage',
    prompt: (url, options = {}) => `
Navigate to this URL and take a screenshot:

URL: ${url}

${options.full_page ? 'Take a full-page screenshot.' : 'Take a viewport screenshot.'}
${options.selector ? `Focus on this element: ${options.selector}` : ''}

Save the screenshot and return the path.

Return as JSON:
{
  "url": "string",
  "screenshot_path": "string",
  "viewport": { "width": number, "height": number },
  "timestamp": "ISO8601"
}
`,
    default_schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        screenshot_path: { type: 'string' },
        viewport: { type: 'object' },
        timestamp: { type: 'string' }
      }
    }
  },

  /**
   * Custom task - freeform prompt
   */
  custom: {
    name: 'Custom Task',
    description: 'Execute a custom prompt',
    prompt: (url, options = {}) => {
      if (!options.prompt) {
        throw new Error('Custom task requires a prompt');
      }
      return `
${options.prompt}

URL: ${url}

${options.output_schema ? `
Return data matching this JSON schema:
${JSON.stringify(options.output_schema, null, 2)}
` : 'Return the result as JSON.'}
`;
    },
    default_schema: null // Caller must provide or accepts any JSON
  }
};

/**
 * Get a task template by name
 */
function getTask(taskName) {
  const task = TASK_TEMPLATES[taskName];
  if (!task) {
    const available = Object.keys(TASK_TEMPLATES).join(', ');
    throw new Error(`Unknown task: ${taskName}. Available: ${available}`);
  }
  return task;
}

/**
 * Build a prompt for a task
 */
function buildPrompt(taskName, url, options = {}) {
  const task = getTask(taskName);
  return task.prompt(url, options);
}

/**
 * List available tasks
 */
function listTasks() {
  return Object.entries(TASK_TEMPLATES).map(([key, task]) => ({
    id: key,
    name: task.name,
    description: task.description
  }));
}

module.exports = {
  TASK_TEMPLATES,
  getTask,
  buildPrompt,
  listTasks
};
