/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  // Create threads collection
  const collection = new Collection({
    name: "threads",
    type: "base",
    fields: [
      {
        type: "text",
        name: "title",
        required: false,
        max: 500
      },
      {
        type: "text",
        name: "project_hint",
        required: false,
        max: 100
      },
      {
        type: "text",
        name: "llm_override",
        required: false,
        max: 50
      },
      {
        type: "select",
        name: "status",
        required: true,
        values: ["active", "completed", "archived"],
        maxSelect: 1
      },
      {
        type: "text",
        name: "device_id",
        required: false,
        max: 100
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  app.save(collection);
  console.log("Threads collection created successfully");

  // Add indexes
  try {
    const saved = app.findCollectionByNameOrId("threads");
    saved.indexes = [
      "CREATE INDEX idx_threads_status ON threads (status)",
      "CREATE INDEX idx_threads_created ON threads (created DESC)"
    ];
    app.save(saved);
    console.log("Threads indexes created successfully");
  } catch (e) {
    console.log("Failed to add indexes:", e);
  }
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("threads");
    app.delete(collection);
  } catch (e) {
    // Collection doesn't exist
  }
});
