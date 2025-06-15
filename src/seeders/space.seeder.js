const db = require("../../src/modules/model.index");
const workspaceProperty = db.workspaceProperty;

async function PropertySeederFn() {
  try {
    const properties = [
      {
        type_of_establishment: 'Coworking',
        name_of_establishment: 'WeWork - Cybercity',
        ownership_of_property: 'Leased',
        city: 'Gurgaon',
        complete_address: 'Building 9A, Cybercity, DLF Phase 3, Gurgaon, Haryana',
        working_days: 'Mon-Sat',
        opening_time: '09:00:00',
        internet_type: 'High-speed WiFi',
        num_of_seats_available_for_coworking: 120,
        pictures_of_the_space: [
          'https://cdn.example.com/images/wework1.jpg',
          'https://cdn.example.com/images/wework2.jpg'
        ],
        first_name: 'Rohit',
        last_name: 'Mehra',
        mobile: '9876543210',
        email: 'rohit@wework.com',
        status: 1,
        latitude: '28.4945',
        longitude: '77.0897',
        area_in_sqft: '15000',
        cabins: '12',
        current_occupancy_percentage: '85%',
      },
      {
        type_of_establishment: 'Meeting Room',
        name_of_establishment: 'Spacetime - Savitri Complex',
        ownership_of_property: 'Owned',
        city: 'Delhi',
        complete_address: '5th Floor, DLF Centre, Savitri Cinema Complex, GK2, Delhi',
        working_days: 'Mon-Sat',
        opening_time: '09:30:00',
        internet_type: 'High-speed Broadband',
        num_of_seats_available_for_coworking: 6,
        pictures_of_the_space: [
          'https://cdn.example.com/images/spacetime1.jpg'
        ],
        first_name: 'Divya',
        last_name: 'Kapoor',
        mobile: '9810098100',
        email: 'divya@spacetime.in',
        status: 1,
        latitude: '28.5500',
        longitude: '77.2400',
        area_in_sqft: '400',
        cabins: '1',
        current_occupancy_percentage: '70%',
      },
      {
        type_of_establishment: 'Day Pass',
        name_of_establishment: 'The Office Pass - Noida Sec 63',
        ownership_of_property: 'Owned',
        city: 'Noida',
        complete_address: 'C-16, Sector 63, Noida, Uttar Pradesh',
        working_days: 'Mon-Fri',
        opening_time: '09:00:00',
        internet_type: 'Fiber Optic',
        num_of_seats_available_for_coworking: 25,
        pictures_of_the_space: [
          'https://cdn.example.com/images/top-noida1.jpg'
        ],
        first_name: 'Sahil',
        last_name: 'Khanna',
        mobile: '9990001234',
        email: 'sahil@theofficepass.com',
        status: 1,
        latitude: '28.6225',
        longitude: '77.3700',
        area_in_sqft: '2200',
        cabins: '3',
        current_occupancy_percentage: '80%',
      }
    ];

    // Insert all properties using model.create
    for (const property of properties) {
      await workspaceProperty.create(property);
    }

    console.log("Properties seeded successfully.");
  } catch (error) {
    console.error("Error seeding properties:", error);
  }
}

module.exports = PropertySeederFn;
