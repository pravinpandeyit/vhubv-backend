const { asyncHandler } = require('../../../utils/asyncHandler.js');
const { ApiError } = require('../../../utils/ApiError');
const { ApiResponse } = require('../../../utils/ApiResponse.js');
const envConfig = require("../../../config/env.config.js");
const db = require('../../model.index.js');
const spaceCategories = db.spaceCategories;
const workspaceProperty = db.workspaceProperty;
const workspaceDayPass = db.workspaceDayPass;
const workspaceMeetingRoom = db.workspaceMeetingRoom;
const workspaceMeetingEquipment = db.workspaceMeetingEquipment;
const workspaceMetingAmenities = db.workspaceMetingAmenities;
const workspaceMeetingRoomBookings = db.workspaceMeetingRoomBookings;
const workspaceDayPassTiming = db.workspaceDayPassTiming;
const workspaceAmenities = db.workspaceAmenities;
const amenitiesMaster = db.amenitiesMaster;
const workspaceConnectivity = db.workspaceConnectivity;
const workspaceTiming = db.workspaceDayPassTiming;
const partnerSubmission = db.partnerSubmission;
const Op = db.Sequelize.Op;


// Add Workspace Property partner
exports.addPartnerSubmission = asyncHandler(async (req, res) => {
  const {type_of_establishment,name_of_establishment,ownership_of_property,city,first_name,last_name,phone,alternatePhone,email} = req.body;
  try {
    const submission = await partnerSubmission.create({
      type_of_establishment:type_of_establishment,name_of_establishment:name_of_establishment,ownership_of_property:ownership_of_property,city:city,
      first_name:first_name,last_name:last_name,phone:phone,alternatePhone:alternatePhone,email:email,status:0
    });
    return ApiResponse(res, 200, "Partner submission received.", submission);
  } catch (error) {
    return ApiError(res, 400, "Something went wrong to add data.", error);
  }
});

// Add Workspace Property
exports.addSpace = asyncHandler(async (req, res) => {

  try {
    const {
      categoryId,
      subcategoryId,
      brand,
      center_type,
      inventory_type,
      product_types,
      type_of_establishment,
      name_of_establishment,
      ownership_of_property,
      city,
      complete_address,
      working_days,
      opening_time,
      internet_type,
      num_of_seats_available_for_coworking,
      area_in_sqft,
      cabins,
      current_occupancy_percentage,
      pictures_of_the_space,
      parking,
      metro_connectivity,
      is_popular,
      price,
      min_lock_in_months,
      latitude,
      longitude,
      first_name,
      last_name,
      mobile,
      email,
      furnishing,
      developer,
      building_grade,
      year_built,
      solutions,
      connectivity
    } = req.body;

    const category = await spaceCategories.findByPk(categoryId);
    const subcategory = await spaceCategories.findByPk(subcategoryId);
    if (!category || !subcategory || String(subcategory.parentId) !== String(categoryId)) {
      return ApiError(res, 400, "Invalid category or subcategory.");
    }

    const newSpace = await workspaceProperty.create({
      categoryId,
      subcategoryId,
      brand,
      center_type,
      inventory_type,
      product_types,
      type_of_establishment,
      name_of_establishment,
      ownership_of_property,
      city,
      complete_address,
      working_days,
      opening_time,
      internet_type,
      num_of_seats_available_for_coworking,
      area_in_sqft,
      cabins,
      current_occupancy_percentage,
      pictures_of_the_space,
      parking,
      metro_connectivity,
      is_popular,
      price,
      min_lock_in_months,
      latitude,
      longitude,
      first_name,
      last_name,
      mobile,
      email,
      furnishing,
      developer,
      building_grade,
      year_built,
      solutions,
    });


    if (connectivity && Array.isArray(connectivity) && connectivity.length > 0) {
      const enrichedConnectivity = connectivity
        .map((entry) => {
          try {
            const parsed = JSON.parse(entry);
            return {
              station_name: parsed.station_name,
              metro_line: parsed.metro_line,
              distance_in_m: Number(parsed.distance_in_m),
              workspace_id: newSpace.id,
            };
          } catch (e) {
            console.error("Invalid JSON in connectivity:", entry);
            return null;
          }
        })
        .filter(Boolean);

      if (enrichedConnectivity.length > 0) {
        try {
          await workspaceConnectivity.bulkCreate(enrichedConnectivity);
        } catch (err) {
          console.error("DB Error while inserting connectivity:", err);
        }
      }
    }

    return ApiResponse(res, 201, "Workspace property added successfully", newSpace);

  } catch (error) {
    console.log(error);

  }
});

// List Workspace Properties with Filters
exports.listProperties = asyncHandler(async (req, res) => {
  const {
    brand,
    center_type,
    inventory_type,
    product_type,
    type_of_establishment,
    city,
    internet_type,
    working_days,
    min_seats,
    max_seats,
    min_area,
    max_area,
    parking,
    metro_connectivity,
    is_popular,
    price_min,
    price_max,
    min_lock_in_months,
    search,
    sort_by,
    price_range,
    furnishing,
    developer,
    building_grade,
    year_built_from,
    year_built_to,
    solutions,
    page = 1,
    limit = 20,
  } = req.query;

  const where = {};
  if (furnishing) where.furnishing = furnishing;
  if (developer) where.developer = { [Op.iLike]: `%${developer}%` };
  if (building_grade) where.building_grade = building_grade;

  if (year_built_from || year_built_to) {
    where.year_built = {};
    if (year_built_from) where.year_built[Op.gte] = parseInt(year_built_from);
    if (year_built_to) where.year_built[Op.lte] = parseInt(year_built_to);
  }
  if (solutions) {
    const solutions = solutions.split(",").map((s) => s.trim());
    where.solutions = { [Op.or]: solutions };
  }

  if (brand) {
    const brands = brand.split(",").map((b) => b.trim());
    where.brand = { [Op.or]: brands };
  }

  if (center_type) {
    const centerTypes = center_type.split(",").map((c) => c.trim());
    where.center_type = { [Op.or]: centerTypes };
  }

  if (inventory_type) {
    const inventoryTypes = inventory_type.split(",").map((i) => i.trim());
    where.inventory_type = { [Op.or]: inventoryTypes };
  }

  if (product_type) where.product_types = { [Op.contains]: [product_type] };
  if (type_of_establishment) where.type_of_establishment = type_of_establishment;
  if (city) where.city = city;
  if (internet_type) where.internet_type = internet_type;
  if (working_days) where.working_days = working_days;
  if (parking !== undefined) where.parking = parking === "true";
  if (metro_connectivity !== undefined) where.metro_connectivity = metro_connectivity === "true";
  if (is_popular !== undefined) where.is_popular = is_popular === "true";
  if (min_lock_in_months) where.min_lock_in_months = { [Op.gte]: parseInt(min_lock_in_months) };

  if (min_seats || max_seats) {
    where.num_of_seats_available_for_coworking = {};
    if (min_seats) where.num_of_seats_available_for_coworking[Op.gte] = parseInt(min_seats);
    if (max_seats) where.num_of_seats_available_for_coworking[Op.lte] = parseInt(max_seats);
  }

  if (min_area || max_area) {
    where.area_in_sqft = {};
    if (min_area) where.area_in_sqft[Op.gte] = parseInt(min_area);
    if (max_area) where.area_in_sqft[Op.lte] = parseInt(max_area);
  }

  // Price range bucket filters
  if (price_range) {
    const priceConditions = [];
    const buckets = price_range.split(",");

    buckets.forEach((range) => {
      switch (range) {
        case "under_7500":
          priceConditions.push({ price: { [Op.lt]: 7500 } });
          break;
        case "7500_15000":
          priceConditions.push({ price: { [Op.between]: [7500, 15000] } });
          break;
        case "15000_25000":
          priceConditions.push({ price: { [Op.between]: [15000, 25000] } });
          break;
        case "over_25000":
          priceConditions.push({ price: { [Op.gt]: 25000 } });
          break;
      }
    });

    if (priceConditions.length > 0) {
      where[Op.or] = priceConditions;
    }
  }

  if (price_min || price_max) {
    where.price = where.price || {};
    if (price_min) where.price[Op.gte] = parseInt(price_min);
    if (price_max) where.price[Op.lte] = parseInt(price_max);
  }

  if (search) {
    where[Op.or] = [
      { name_of_establishment: { [Op.iLike]: `%${search}%` } },
      { complete_address: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Sort handling
  let order = [["createdAt", "DESC"]]; // default

  if (sort_by === "popularity") {
    order = [["is_popular", "DESC"]];
  } else if (sort_by === "price_low_to_high") {
    order = [["price", "ASC"]];
  } else if (sort_by === "price_high_to_low") {
    order = [["price", "DESC"]];
  } else if (sort_by === "distance") {
    const cityCenters = {
      delhi: { lat: 28.6139, lng: 77.2090 },
      mumbai: { lat: 19.0760, lng: 72.8777 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
    };
    const cityKey = city?.toLowerCase();
    if (cityCenters[cityKey]) {
      const { lat, lng } = cityCenters[cityKey];
      order = [
        [
          Sequelize.literal(
            `(3959 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude))))`
          ),
          "ASC",
        ],
      ];
    }
  }

  // Final fetch
  const offset = (page - 1) * limit;
  const { count, rows } = await workspaceProperty.findAndCountAll({
    where,
    offset,
    limit: parseInt(limit),
    order,
  });

  return res.status(200).json({
    success: true,
    message: "Workspace properties fetched successfully",
    spaceList: rows,
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(count / limit),
  });
});

// List Workspace Properties with Filters
exports.addWorkspaceDayPass = asyncHandler(async (req, res) => {
  try {
    const {
      space_type,
      price_per_day,
      credits_required,
      timings,
      is_open_now,
      is_open_early,
      is_close_late,
      fnb_discount,
      popularity_score,
      distance_from_center_km,
      workspace_id,
    } = req.body;

    if (!workspace_id) {
      return ApiError(res, 400, "workspace Id is Mandatory.");
    }

    const dayPassData = await workspaceDayPass.create({
      workspace_id,
      price_per_day,
      credits_required,
      opens_at: timings.opens_at,
      closes_at: timings.closes_at,
      is_open_now,
      is_open_early,
      is_close_late,
      space_type,
      fnb_discount,
      popularity_score,
      distance_from_center_km,
    });

    if (timings?.weekly?.length > 0) {
      const weeklyData = timings.weekly.map((day) => ({
        workspace_id: dayPassData.workspace_id,
        workspace_day_pass_id: dayPassData.id,
        day_of_week: day.day,
        opens_at: day.is_closed ? null : day.opens_at,
        closes_at: day.is_closed ? null : day.closes_at,
        is_closed: day.is_closed ?? false,
      }));

      await workspaceDayPassTiming.bulkCreate(weeklyData);
    }

    return ApiResponse(res, 201, "Day Pass workspace added successfully", dayPassData);

  } catch (err) {
    console.error("Error adding Day Pass:", err);
    return ApiError(res, 400, "Internal server error.", err.message);
  }
});

// List Workspace add meeting room detail
exports.addMeetingRoom = asyncHandler(async (req, res) => {
  try {
    const {
      price_per_hour, credits_required, workspace_id,
      capacity, room_type, is_instant_confirmation, timings,
      equipments, amenities, popularity_score, distance_from_center_km
    } = req.body;

    await workspaceMeetingRoom.create({
      workspace_id: workspace_id,
      price_per_hour,
      credits_required,
      capacity,
      room_type,
      is_instant_confirmation,
      popularity_score,
      distance_from_center_km
    });

    await workspaceMeetingEquipment.create({
      workspace_id: workspace_id,
      monitor_tv_projector: equipments.monitor_tv_projector,
      speakers: equipments.speakers,
      video_conference: equipments.video_conference,
      whiteboard: equipments.whiteboard
    });

    const meetingData = await workspaceMetingAmenities.create({
      workspace_id: workspace_id,
      parking: amenities.parking,
      beverages: amenities.beverages,
      electricity: amenities.electricity,
      stationery: amenities.stationery
    });
    if (timings?.weekly?.length > 0) {
      const weeklyData = timings.weekly.map((day) => ({
        workspace_id: meetingData.workspace_id,
        workspace_day_pass_id: meetingData.id,
        day_of_week: day.day,
        opens_at: day.is_closed ? null : day.opens_at,
        closes_at: day.is_closed ? null : day.closes_at,
        is_closed: day.is_closed ?? false,
      }));

      await workspaceDayPassTiming.bulkCreate(weeklyData);
    }
    return ApiResponse(res, 201, "Meeting room added successfully", {});

  } catch (err) {
    console.error('Add Meeting Room Error:', err);
    return ApiError(res, 500, "Internal server error", err.message);
  }
})

// List Workspace meeting room and day pass
exports.listWorkspaces = asyncHandler(async (req, res) => {
  try {
    const {
      product_type,
      city,
      location,
      brand,
      min_price,
      max_price,
      capacity,
      room_type,
      monitor_tv_projector,
      speakers,
      video_conference,
      whiteboard,
      beverages,
      electricity,
      stationery,
      is_instant_confirmation,
      sort_by,
      search,
      date,
      duration,
      time_slot,
      space_type,
      is_open_now,
      is_open_early,
      is_close_late,
      parking,
      metro_connectivity,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    const workspaceFilters = {
      ...(city && { city }),
      ...(brand && { brand: { [Op.in]: brand.split(',') } }),
      ...(location && {
        complete_address: { [Op.iLike]: `%${location}%` },
      }),
      ...(product_type && {
        product_types: { [Op.iLike]: `%${product_type}%` },
      }),
      ...(search && {
        [Op.or]: [
          { name_of_establishment: { [Op.iLike]: `%${search}%` } },
          { brand: { [Op.iLike]: `%${search}%` } },
          { complete_address: { [Op.iLike]: `%${search}%` } },
        ],
      }),
      ...(parking !== undefined && { parking: parking }),
      ...(metro_connectivity !== undefined && { metro_connectivity: metro_connectivity }),
    };

    const properties = await workspaceProperty.findAll({ where: workspaceFilters });
    const workspaceIds = properties.map((p) => p.id);
    let listings = [];

    if (product_type === "meeting_room") {
      const roomTypeArr = room_type?.split(',');
      const meetingRooms = await workspaceMeetingRoom.findAll({
        where: {
          workspace_id: workspaceIds,
          ...(min_price && { price_per_hour: { [Op.gte]: min_price } }),
          ...(max_price && { price_per_hour: { [Op.lte]: max_price } }),
          ...(capacity && { capacity: { [Op.gte]: capacity } }),
          ...(room_type && { room_type: { [Op.in]: roomTypeArr } }),
          ...(is_instant_confirmation && { is_instant_confirmation }),
        },
      });

      const equipment = await workspaceMeetingEquipment.findAll({ where: { workspace_id: workspaceIds } });
      const amenities = await workspaceMetingAmenities.findAll({ where: { workspace_id: workspaceIds } });
      const bookings = await workspaceMeetingRoomBookings.findAll({ where: { booking_date: date } });

      const monitorTv = monitor_tv_projector !== undefined ? parseInt(monitor_tv_projector) : undefined;
      const spk = speakers !== undefined ? parseInt(speakers) : undefined;
      const vc = video_conference !== undefined ? parseInt(video_conference) : undefined;
      const wb = whiteboard !== undefined ? parseInt(whiteboard) : undefined;
      const bev = beverages !== undefined ? parseInt(beverages) : undefined;
      const elec = electricity !== undefined ? parseInt(electricity) : undefined;
      const stat = stationery !== undefined ? parseInt(stationery) : undefined;

      const getTimeRange = (slot) => {
        if (!slot) return ["00:00:00", "23:59:59"];
        if (slot === "morning") return ["06:00:00", "12:00:00"];
        if (slot === "afternoon") return ["12:00:01", "16:00:00"];
        if (slot === "evening") return ["16:00:01", "23:59:59"];
        return ["00:00:00", "23:59:59"];
      };

      const [startTime, endTime] = getTimeRange(time_slot);

      listings = meetingRooms.filter((room) => {
        const eq = equipment.find((e) => e.workspace_id === room.workspace_id);
        const am = amenities.find((a) => a.workspace_id === room.workspace_id);

        if (monitorTv !== undefined && (!eq || eq.monitor_tv_projector !== monitorTv)) return false;
        if (spk !== undefined && (!eq || eq.speakers !== spk)) return false;
        if (vc !== undefined && (!eq || eq.video_conference !== vc)) return false;
        if (wb !== undefined && (!eq || eq.whiteboard !== wb)) return false;

        if (bev !== undefined && (!am || am.beverages !== bev)) return false;
        if (elec !== undefined && (!am || am.electricity !== elec)) return false;
        if (stat !== undefined && (!am || am.stationery !== stat)) return false;

        if (date && duration) {
          const roomBookings = bookings.filter(b => b.meeting_room_id === room.id);
          const isAvailable = !roomBookings.some(b => {
            return (
              b.start_time < endTime &&
              b.end_time > startTime
            );
          });
          if (!isAvailable) return false;
        }

        return true;
      });

      const transformToBoolean = (data) => {
        if (!data) return null;
        const transformed = { ...data.toJSON?.() || data };
        const booleanKeys = [
          "monitor_tv_projector",
          "speakers",
          "video_conference",
          "whiteboard",
          "beverages",
          "electricity",
          "stationery",
          "status",
        ];
        for (const key of booleanKeys) {
          if (key in transformed) {
            transformed[key] = Boolean(transformed[key]);
          }
        }
        return transformed;
      };

      listings = listings.map((room) => {
        const workspace = properties.find((p) => p.id === room.workspace_id);
        const eq = equipment.find((e) => e.workspace_id === room.workspace_id);
        const am = amenities.find((a) => a.workspace_id === room.workspace_id);

        return {
          ...room.toJSON(),
          workspace: workspace?.toJSON?.() || workspace,
          equipment: transformToBoolean(eq),
          amenities: transformToBoolean(am),
        };
      });
    } else if (product_type === "day_pass") {
      const dayPasses = await workspaceDayPass.findAll({
        where: {
          workspace_id: workspaceIds,
          ...(min_price && { price_per_day: { [Op.gte]: min_price } }),
          ...(max_price && { price_per_day: { [Op.lte]: max_price } }),
          ...(space_type && { space_type }),
          ...(is_open_now !== undefined && { is_open_now: parseInt(is_open_now) }),
          ...(is_open_early !== undefined && { is_open_early: parseInt(is_open_early) }),
          ...(is_close_late !== undefined && { is_close_late: parseInt(is_close_late) }),
        },
      });

      listings = dayPasses.map((pass) => {
        const workspace = properties.find((p) => p.id === pass.workspace_id);
        return {
          ...pass.toJSON(),
          workspace: workspace?.toJSON?.() || workspace,
        };
      });
    }

    if (sort_by === "popularity") {
      listings.sort((a, b) => (b.workspace?.popularity_score || 0) - (a.workspace?.popularity_score || 0));
    } else if (sort_by === "distance") {
      listings.sort((a, b) => (a.workspace?.distance_from_center || 0) - (b.workspace?.distance_from_center || 0));
    } else if (sort_by === "price_low_high") {
      listings.sort((a, b) => (a.price_per_hour || a.price_per_day || 0) - (b.price_per_hour || b.price_per_day || 0));
    } else if (sort_by === "price_high_low") {
      listings.sort((a, b) => (b.price_per_hour || b.price_per_day || 0) - (a.price_per_hour || a.price_per_day || 0));
    } else if (sort_by === "capacity_low_high") {
      listings.sort((a, b) => (a.capacity || 0) - (b.capacity || 0));
    } else if (sort_by === "capacity_high_low") {
      listings.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
    }

    const total = listings.length;
    const paginated = listings.slice(offset, offset + parseInt(limit));

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      count: paginated.length,
      data: paginated,
    });
  } catch (err) {
    console.error("Listing error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});

// List Workspace detail
exports.getWorkspaceDetails = asyncHandler(async (req, res) => {
  const workspace_id = req.params.id;
  const { product_type } = req.query;

  if (!workspace_id || !product_type) {
    return res.status(400).json({
      success: false,
      message: "workspace Id and product type are required",
    });
  }

  try {
    // 🔹 Get workspace basic info
    const workspace = await workspaceProperty.findOne({
      where: { id: workspace_id },
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    let data = {
      workspace: workspace.toJSON(),
      parking: Boolean(workspace.parking),
      metro_connectivity: Boolean(workspace.metro_connectivity),
    };

    // 🔹 Connectivity list
    const connectivityList = await workspaceConnectivity.findAll({
      where: { workspace_id },
    });
    data.connectivity = connectivityList.map((c) => c.toJSON());

    // 🔹 Timing (workspace open/close days)
    const timing = await workspaceTiming.findAll({
      where: { workspace_id },
    });
    data.timing = timing ? timing : null;

    // 🔹 Helper: convert numeric flags to Boolean
    const toBool = (obj) => {
      if (!obj) return null;
      const val = obj;
      Object.keys(val).forEach((key) => {
        if (typeof val[key] === "number" && key !== "id" && key !== "workspace_id") {
          val[key] = Boolean(val[key]);
        }
      });
      return val;
    };

    // 🔹 If meeting_room
    if (product_type === "meeting_room") {

      const rooms = await workspaceMeetingRoom.findAll({
        where: { workspace_id },
      });

      const equipment = await workspaceMeetingEquipment.findOne({
        where: { workspace_id },
      });

      const meetingRoomAmenities = await workspaceMetingAmenities.findOne({
        where: { workspace_id },
      });
      const amenities = await workspaceAmenities.findAll({
        where: { workspace_id },
      });
      data.generalAmenities = toBool(amenities);
      data.meeting_rooms = rooms.map((r) => r.toJSON());
      data.equipment = toBool(equipment);
      data.meetingRoomAmenities = toBool(meetingRoomAmenities);
    }

    // 🔹 If day_pass
    if (product_type === "day_pass") {
      const dayPass = await workspaceDayPass.findOne({
        where: { workspace_id },
      });

      if (dayPass) {
        const pass = dayPass.toJSON();

        // Weekly timings
        const weeklyTimings = await workspaceDayPassTiming.findAll({
          where: { workspace_day_pass_id: pass.id },
        });

        data.day_pass = {
          ...pass,
          is_open_now: Boolean(pass.is_open_now),
          is_open_early: Boolean(pass.is_open_early),
          is_close_late: Boolean(pass.is_close_late),
          weekly_timings: weeklyTimings.map(t => t.toJSON()),
        };
      }

      // General amenities (not meeting room)
      const amenities = await workspaceAmenities.findAll({
        where: { workspace_id },
      });
      data.generalAmenities = toBool(amenities);
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Detail fetch error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
});


exports.addWorkspaceAmenities = asyncHandler(async (req, res) => {
  const { workspace_id, amenities } = req.body;

  if (!workspace_id || !Array.isArray(amenities) || amenities.length === 0) {
    return res.status(400).json({
      success: false,
      message: "workspace_id and amenities array are required.",
    });
  }

  try {
    await workspaceAmenities.destroy({ where: { workspace_id } });

    const formattedAmenities = amenities.map((item) => ({
      workspace_id,
      amenity_id: item.amenity_id,
      status: item.status || 'available', // default
      info: item.info || null,
    }));

    const inserted = await workspaceAmenities.bulkCreate(formattedAmenities);

    return res.status(201).json({
      success: true,
      message: "Workspace amenities added successfully.",
      data: inserted,
    });
  } catch (error) {
    console.error("Amenity insert error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

exports.addMasterAmenity = asyncHandler(async (req, res) => {
  const { key, label, category } = req.body;

  if (!key || !label) {
    return res.status(400).json({
      success: false,
      message: "Amenity 'key' and 'label' are required.",
    });
  }

  try {
    // Check duplicate
    const existing = await amenitiesMaster.findOne({ where: { key } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Amenity with key '${key}' already exists.`,
      });
    }

    const newAmenity = await amenitiesMaster.create({
      key,
      label,
      category: category || "common",
    });

    return res.status(201).json({
      success: true,
      message: "Amenity added to master list.",
      data: newAmenity,
    });
  } catch (err) {
    console.error("Add master amenity error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
});
