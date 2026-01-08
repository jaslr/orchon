/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  // First ensure threads collection exists
  let threadsCollection;
  try {
    threadsCollection = app.findCollectionByNameOrId("threads");
  } catch (e) {
    console.log("Threads collection not found, messages migration will fail");
    return;
  }

  // Create messages collection
  const collection = new Collection({
    name: "messages",
    type: "base",
    fields: [
      {
        type: "relation",
        name: "thread",
        required: true,
        collectionId: threadsCollection.id,
        cascadeDelete: true,
        maxSelect: 1
      },
      {
        type: "select",
        name: "role",
        required: true,
        values: ["user", "assistant", "system"],
        maxSelect: 1
      },
      {
        type: "text",
        name: "content",
        required: true,
        max: 100000
      },
      {
        type: "select",
        name: "status",
        required: false,
        values: ["sending", "streaming", "complete", "error"],
        maxSelect: 1
      },
      {
        type: "json",
        name: "metadata",
        required: false
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: ""
  });

  app.save(collection);
  console.log("Messages collection created successfully");

  // Add indexes
  try {
    const saved = app.findCollectionByNameOrId("messages");
    saved.indexes = [
      "CREATE INDEX idx_messages_thread ON messages (thread)",
      "CREATE INDEX idx_messages_created ON messages (created ASC)"
    ];
    app.save(saved);
    console.log("Messages indexes created successfully");
  } catch (e) {
    console.log("Failed to add indexes:", e);
  }
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("messages");
    app.delete(collection);
  } catch (e) {
    // Collection doesn't exist
  }
});
