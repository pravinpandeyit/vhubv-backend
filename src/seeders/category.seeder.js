const db = require("../../src/modules/model.index");
const Category = db.spaceCategories;

async function CategorySeederFn() {
  try {
    const categories = [
      { name: "Long-term Leasing", description: "Workspaces for Long-term Leasing", parentId: null, status: 1 },
      { name: "On-demand", description: "Workspaces for On-demand", parentId: null, status: 1 },
      { name: "Virtual Office", description: "Workspaces for Virtual Office", parentId: null, status: 1 }
    ];

    const createdParents = await Promise.all(categories.map(data => Category.create(data)));

    const longTermLeasingId = createdParents[0].id; 
    const onDemandId = createdParents[1].id;      

    const subcategories = [
      { name: "Coworking Space", description: "Workspaces for Coworking Space", parentId: longTermLeasingId, status: 1 },
      { name: "Managed Office", description: "Workspaces for Managed Office", parentId: longTermLeasingId, status: 1 },
      { name: "Office/Commercial", description: "Workspaces for Office/Commercial", parentId: longTermLeasingId, status: 1 },
      { name: "Day Pass", description: "Workspaces for Day Pass", parentId: onDemandId, status: 1 },
      { name: "Event Spaces", description: "Workspaces for Event Spaces", parentId: onDemandId, status: 1 },
      { name: "Meeting Room", description: "Workspaces for Meeting Room", parentId: onDemandId, status: 1 }
    ];

    await Promise.all(subcategories.map(data => Category.create(data)));

    console.log("Categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}

module.exports = CategorySeederFn;
