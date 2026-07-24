import { lookupCoords, type LatLng } from "@/lib/coordinates";

// ─── Shared types ─────────────────────────────────────────────────────────────

export type PlannerFormValues = {
  startLocation: string;
  destination: string;
  duration: number;
  experienceLevel: string;
  dailyDistance: string;
  budget: string;
  accommodation: string;
};

export type DayPlan = {
  day: number;
  title: string;
  startTown: string;
  endTown: string;
  ridingTime: string;
  distance: number;
  elevation: number;
  terrain: string;
  highlights: string[];
  accommodation: string;
  notes: string;
};

export type PackingCategory = {
  category: string;
  items: { name: string; essential: boolean }[];
};

export type Itinerary = {
  summary: {
    title: string;
    totalDistance: number;
    totalElevation: number;
    difficulty: string;
    estimatedCaloriesPerDay: number;
    highlights: string[];
  };
  days: DayPlan[];
  packing: PackingCategory[];
  budget: {
    perDay: number;
    total: number;
    accommodation: number;
    food: number;
    water: number;
    miscellaneous: number;
    currency: string;
    tiers: { label: string; amount: number; icon: string }[];
  };
  nutrition: {
    calorieTarget: number;
    hydrationTarget: number;
    mealPlan: { meal: string; suggestions: string[]; timing: string }[];
    tips: string[];
  };
  safety: { category: string; tip: string; priority: "high" | "medium" | "low" }[];
};

// ─── Route database ───────────────────────────────────────────────────────────

type TerrainType = "flat" | "rolling" | "hilly" | "mountainous";

type RouteInfo = {
  /** Full ordered list of towns from start → end (at least 8 entries). */
  waypoints: string[];
  /** Per-segment terrain type (length = waypoints.length − 1). Cycles if too short. */
  terrainProfile: TerrainType[];
  /** Geographic region drives currency, highlights & safety. */
  region: "east-africa" | "europe" | "generic";
  /** True if the route ends on the coast / an island — enables coastal highlights. */
  coastal?: boolean;
};

/** Normalise a place name to a lowercase slug for matching. */
function norm(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ");
}

/**
 * Known routes stored under their forward slug.
 * Reverse direction is handled automatically (waypoints flipped).
 */
const ROUTE_DB: Record<string, RouteInfo> = {
  // ── East Africa ────────────────────────────────────────────────────────────
  "nairobi arusha": {
    waypoints: [
      "Nairobi", "Thika", "Matuu", "Kibwezi", "Tsavo West Gate",
      "Voi", "Moshi", "Arusha",
    ],
    terrainProfile: ["rolling", "rolling", "flat", "flat", "rolling", "hilly", "rolling"],
    region: "east-africa",
  },
  "nairobi mount kilimanjaro": {
    waypoints: [
      "Nairobi", "Thika", "Matuu", "Kibwezi", "Tsavo West Gate",
      "Voi", "Moshi", "Kilimanjaro Gate",
    ],
    terrainProfile: ["rolling", "rolling", "flat", "flat", "rolling", "hilly", "mountainous"],
    region: "east-africa",
  },
  "nairobi mombasa": {
    waypoints: [
      "Nairobi", "Athi River", "Sultan Hamud", "Emali", "Mtito Andei",
      "Voi", "Samburu", "Mariakani", "Mombasa",
    ],
    terrainProfile: ["flat", "rolling", "flat", "flat", "rolling", "flat", "flat", "flat"],
    region: "east-africa",
    coastal: true,
  },
  "nairobi kisumu": {
    waypoints: [
      "Nairobi", "Limuru", "Naivasha", "Gilgil", "Nakuru",
      "Kericho", "Kisumu",
    ],
    terrainProfile: ["hilly", "rolling", "flat", "rolling", "hilly", "rolling"],
    region: "east-africa",
  },
  "nairobi nakuru": {
    waypoints: [
      "Nairobi", "Limuru", "Naivasha", "Gilgil", "Nakuru",
    ],
    terrainProfile: ["hilly", "rolling", "flat", "flat"],
    region: "east-africa",
  },
  "nairobi kampala": {
    waypoints: [
      "Nairobi", "Nakuru", "Eldoret", "Malaba", "Tororo",
      "Jinja", "Kampala",
    ],
    terrainProfile: ["hilly", "rolling", "flat", "flat", "flat", "flat"],
    region: "east-africa",
  },
  "kampala kigali": {
    waypoints: [
      "Kampala", "Masaka", "Lyantonde", "Mbarara", "Kabale",
      "Katuna", "Kigali",
    ],
    terrainProfile: ["flat", "rolling", "rolling", "hilly", "mountainous", "rolling"],
    region: "east-africa",
  },
  "dar es salaam arusha": {
    waypoints: [
      "Dar es Salaam", "Morogoro", "Mikumi", "Iringa",
      "Makambako", "Njombe", "Mbeya", "Arusha",
    ],
    terrainProfile: ["flat", "rolling", "hilly", "mountainous", "hilly", "hilly", "rolling"],
    region: "east-africa",
  },
  "arusha dar es salaam": {
    waypoints: [
      "Arusha", "Moshi", "Same", "Moshi", "Mbeya",
      "Iringa", "Morogoro", "Dar es Salaam",
    ],
    terrainProfile: ["rolling", "rolling", "hilly", "mountainous", "hilly", "rolling", "flat"],
    region: "east-africa",
  },
  "nairobi zanzibar": {
    waypoints: [
      "Nairobi", "Namanga", "Arusha", "Moshi", "Same",
      "Dar es Salaam Ferry", "Zanzibar Town",
    ],
    terrainProfile: ["rolling", "rolling", "hilly", "hilly", "flat", "flat"],
    region: "east-africa",
    coastal: true,
  },
  "entebbe kigali": {
    waypoints: [
      "Entebbe", "Kampala", "Masaka", "Mbarara", "Kabale",
      "Katuna", "Kigali",
    ],
    terrainProfile: ["flat", "flat", "rolling", "rolling", "hilly", "rolling"],
    region: "east-africa",
  },
  "nairobi malindi": {
    waypoints: [
      "Nairobi", "Athi River", "Sultan Hamud", "Emali", "Mtito Andei",
      "Voi", "Mariakani", "Mombasa", "Kilifi", "Malindi",
    ],
    terrainProfile: ["flat", "rolling", "flat", "flat", "rolling", "flat", "flat", "flat", "flat"],
    region: "east-africa",
    coastal: true,
  },
  "nairobi nanyuki": {
    waypoints: [
      "Nairobi", "Thika", "Muranga", "Nyeri", "Naro Moru", "Nanyuki",
    ],
    terrainProfile: ["rolling", "rolling", "hilly", "hilly", "rolling"],
    region: "east-africa",
  },
  "nairobi maasai mara": {
    waypoints: [
      "Nairobi", "Narok", "Sekenani Gate", "Maasai Mara",
    ],
    terrainProfile: ["hilly", "rolling", "rolling"],
    region: "east-africa",
  },
  "kisumu kitale": {
    waypoints: [
      "Kisumu", "Kakamega", "Webuye", "Bungoma", "Kitale",
    ],
    terrainProfile: ["rolling", "rolling", "flat", "rolling"],
    region: "east-africa",
  },
  "arusha serengeti": {
    waypoints: [
      "Arusha", "Mto wa Mbu", "Karatu", "Ngorongoro Crater", "Seronera", "Serengeti",
    ],
    terrainProfile: ["rolling", "hilly", "mountainous", "rolling", "flat"],
    region: "east-africa",
  },
  "dar es salaam bagamoyo": {
    waypoints: [
      "Dar es Salaam", "Kibaha", "Bagamoyo",
    ],
    terrainProfile: ["rolling", "flat"],
    region: "east-africa",
    coastal: true,
  },
  "mbeya karonga": {
    waypoints: [
      "Mbeya", "Kyela", "Karonga",
    ],
    terrainProfile: ["mountainous", "rolling"],
    region: "east-africa",
  },
  "kampala fort portal": {
    waypoints: [
      "Kampala", "Mubende", "Fort Portal", "Kasese",
    ],
    terrainProfile: ["rolling", "rolling", "hilly"],
    region: "east-africa",
  },
  "kampala murchison falls": {
    waypoints: [
      "Kampala", "Masindi", "Murchison Falls",
    ],
    terrainProfile: ["rolling", "rolling"],
    region: "east-africa",
  },
  "jinja sipi falls": {
    waypoints: [
      "Jinja", "Mbale", "Kapchorwa", "Sipi Falls",
    ],
    terrainProfile: ["flat", "rolling", "hilly"],
    region: "east-africa",
  },
  "kigali bujumbura": {
    waypoints: [
      "Kigali", "Muhanga", "Huye", "Bujumbura",
    ],
    terrainProfile: ["hilly", "hilly", "mountainous"],
    region: "east-africa",
  },
  "addis ababa hawassa": {
    waypoints: [
      "Addis Ababa", "Debre Zeit", "Mojo", "Ziway", "Shashamane", "Hawassa",
    ],
    terrainProfile: ["rolling", "flat", "flat", "flat", "flat"],
    region: "east-africa",
  },
  "kisumu kampala": {
    waypoints: [
      "Kisumu", "Busia", "Tororo", "Jinja", "Kampala",
    ],
    terrainProfile: ["rolling", "flat", "flat", "flat"],
    region: "east-africa",
  },

  // ── Europe ─────────────────────────────────────────────────────────────────
  "vienna ljubljana": {
    waypoints: [
      "Vienna", "Baden", "Wiener Neustadt", "Hartberg",
      "Graz", "Maribor", "Ptuj", "Celje", "Ljubljana",
    ],
    terrainProfile: ["flat", "rolling", "rolling", "hilly", "rolling", "flat", "rolling", "rolling"],
    region: "europe",
  },
  "paris amsterdam": {
    waypoints: [
      "Paris", "Compiègne", "Saint-Quentin", "Cambrai",
      "Valenciennes", "Ghent", "Antwerp", "Amsterdam",
    ],
    terrainProfile: ["flat", "flat", "flat", "flat", "flat", "flat", "flat"],
    region: "europe",
  },
  "berlin prague": {
    waypoints: [
      "Berlin", "Zossen", "Luckenwalde", "Doberlug-Kirchhain",
      "Bad Schandau", "Děčín", "Ústí nad Labem", "Prague",
    ],
    terrainProfile: ["flat", "rolling", "rolling", "hilly", "hilly", "rolling", "rolling"],
    region: "europe",
  },
  "amsterdam brussels": {
    waypoints: [
      "Amsterdam", "Utrecht", "Breda", "Antwerp", "Ghent", "Brussels",
    ],
    terrainProfile: ["flat", "flat", "flat", "flat", "flat"],
    region: "europe",
  },
  "florence rome": {
    waypoints: [
      "Florence", "Siena", "San Quirico d'Orcia", "Montalcino",
      "Acquapendente", "Viterbo", "Rome",
    ],
    terrainProfile: ["hilly", "rolling", "rolling", "rolling", "rolling", "rolling"],
    region: "europe",
  },
  "barcelona madrid": {
    waypoints: [
      "Barcelona", "Lleida", "Fraga", "Zaragoza",
      "Calatayud", "Guadalajara", "Madrid",
    ],
    terrainProfile: ["rolling", "flat", "flat", "rolling", "hilly", "rolling"],
    region: "europe",
  },
  "london paris": {
    waypoints: [
      "London", "Dover", "Calais", "Boulogne-sur-Mer",
      "Abbeville", "Amiens", "Paris",
    ],
    terrainProfile: ["flat", "flat", "rolling", "flat", "flat", "flat"],
    region: "europe",
  },
};

// ─── Region detection ─────────────────────────────────────────────────────────

const EA_KEYWORDS = [
  "nairobi","mombasa","kisumu","nakuru","eldoret","thika","naivasha",
  "arusha","moshi","kilimanjaro","dar es salaam","zanzibar","dodoma",
  "kampala","entebbe","jinja","mbarara","kabale",
  "kigali","butare","gisenyi",
  "addis ababa","ethiopia",
  "accra","lagos","abuja","dakar","lusaka","harare","johannesburg",
  "cape town","nairobi","kenya","tanzania","uganda","rwanda",
];

const EU_KEYWORDS = [
  "paris","london","rome","berlin","amsterdam","brussels","vienna",
  "prague","madrid","barcelona","milan","zurich","geneva","lausanne",
  "amsterdam","antwerp","ghent","bruges","florence","siena","venice",
  "lyon","bordeaux","munich","hamburg","cologne","frankfurt","zurich",
  "stockholm","oslo","copenhagen","helsinki","warsaw","budapest",
  "zagreb","belgrade","sofia","athens","lisbon","porto","dublin",
  "edinburgh","glasgow","cardiff","birmingham","manchester","leeds",
];

type Region = "east-africa" | "europe" | "generic";

function detectRegion(start: string, dest: string): Region {
  const haystack = `${norm(start)} ${norm(dest)}`;
  if (EA_KEYWORDS.some((k) => haystack.includes(k))) return "east-africa";
  if (EU_KEYWORDS.some((k) => haystack.includes(k))) return "europe";
  return "generic";
}

// ─── Route lookup & waypoint selection ───────────────────────────────────────

function lookupRoute(start: string, dest: string): RouteInfo | null {
  const s = norm(start);
  const d = norm(dest);

  // Exact forward match
  if (ROUTE_DB[`${s} ${d}`]) return ROUTE_DB[`${s} ${d}`];

  // Exact reverse match (flip waypoints & terrain)
  if (ROUTE_DB[`${d} ${s}`]) {
    const r = ROUTE_DB[`${d} ${s}`];
    return {
      waypoints: [...r.waypoints].reverse(),
      terrainProfile: [...r.terrainProfile].reverse(),
      region: r.region,
    };
  }

  // Partial match: check if any DB key contains both city names
  for (const [key, info] of Object.entries(ROUTE_DB)) {
    if (key.includes(s) || key.includes(d)) {
      // Good enough — check reverse too
      const parts = key.split(" ");
      const firstCity = parts[0];
      if (firstCity === d.split(" ")[0]) {
        return {
          waypoints: [...info.waypoints].reverse(),
          terrainProfile: [...info.terrainProfile].reverse(),
          region: info.region,
        };
      }
      return info;
    }
  }

  return null;
}

/**
 * Select `days + 1` waypoints from the available list.
 * Subsamples if enough exist; supplements with generic names if not.
 */
function selectWaypoints(
  startName: string,
  destName: string,
  allWaypoints: string[],
  days: number,
): string[] {
  const needed = days + 1;
  const src = allWaypoints.length > 0 ? allWaypoints : [startName, destName];

  if (src.length >= needed) {
    // Evenly subsample, always keeping first and last
    return Array.from({ length: needed }, (_, i) => {
      const idx = Math.round((i / (needed - 1)) * (src.length - 1));
      return src[idx];
    });
  }

  // Not enough waypoints — insert generic stops between known ones
  const result = [...src];
  const generics = [
    "Roadside Camp", "Hilltop Bivvy", "Valley Crossing",
    "Midpoint Town", "River Stop", "Trade Post", "Summit Camp",
    "Lakeside Halt", "Forest Camp", "Border Town",
  ];
  let g = 0;
  while (result.length < needed) {
    const mid = Math.floor(result.length / 2);
    result.splice(mid, 0, generics[g++ % generics.length]);
  }
  return result.slice(0, needed);
}

// ─── Generic waypoint pools (fallback) ────────────────────────────────────────

const GENERIC_WAYPOINTS_EA = [
  "Checkpoint Town", "Red Dust Crossroads", "Acacia Camp",
  "Savanna Halt", "Border Post Village", "Crater Rim Stop",
  "Valley Trading Post", "Lakeside Village", "Tea Plantation Town",
  "River Crossing Camp", "Escarpment Settlement", "Baobab Junction",
];

const GENERIC_WAYPOINTS_EU = [
  "Klosterneuburg", "Bruck an der Mur", "Feldkirchen", "Kapfenberg",
  "Weiz", "Gleisdorf", "Anger", "Hartberg", "Vorau", "Mariazell",
  "Schladming", "Liezen", "Admont", "Altenmarkt", "Radstadt",
];

const GENERIC_WAYPOINTS_GEN = [
  "Riverside Camp", "Hill Town", "Valley Crossing", "Mid-Route Town",
  "Ridge Camp", "Border Village", "Plateau Stop", "Forest Halt",
  "Mountain Pass Camp", "Lakeside Town", "Plains Junction", "Summit Town",
];

function genericWaypointPool(region: Region) {
  if (region === "east-africa") return GENERIC_WAYPOINTS_EA;
  if (region === "europe") return GENERIC_WAYPOINTS_EU;
  return GENERIC_WAYPOINTS_GEN;
}

// ─── Real-world distance ──────────────────────────────────────────────────────

/** Great-circle (straight-line) distance in km between two [lat, lng] points. */
function haversineKm([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const R = 6371; // Earth radius, km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Roads are never a straight line — they bend around hills, rivers, and
 * towns. This multiplies the haversine distance to approximate real road
 * distance, scaled by how mountainous the segment is (more terrain =
 * more switchbacks and detours relative to straight-line distance).
 */
const ROAD_DETOUR_FACTOR: Record<TerrainType, number> = {
  flat: 1.15,
  rolling: 1.22,
  hilly: 1.32,
  mountainous: 1.48,
};

// ─── Elevation by terrain ─────────────────────────────────────────────────────

const ELEV_PER_KM: Record<TerrainType, number> = {
  flat: 5,
  rolling: 12,
  hilly: 22,
  mountainous: 38,
};

// ─── Content pools ─────────────────────────────────────────────────────────────

/** Inland East Africa highlights — used on all non-coastal routes. */
const HIGHLIGHTS_EA_INLAND = [
  "Great Rift Valley panorama viewpoint",
  "Traditional Maasai manyatta village stop",
  "Freshly brewed Kenyan chai from a roadside stall",
  "Equator crossing marker photo stop",
  "Giraffe sighting along the roadside",
  "Safari wildlife sighting from the saddle",
  "Baobab tree forest section",
  "Roadside sugarcane juice & mandazi",
  "National park gate crossing",
  "Flamingo colony at a soda lake",
  "Volcanic crater rim viewpoint",
  "Bustling local market town",
  "Fish & ugali lunch at a lakeside village",
  "Sunset silhouettes over the savanna",
  "Mount Kilimanjaro snow-cap visible on the horizon",
  "Tea plantation stretch through the highlands",
  "Lake Victoria shoreline viewpoint",
  "Matatu overtaking challenge stretch",
  "Border post bureaucracy & local curiosity",
  "Colourful wildflower field in the highlands",
  "Lone acacia tree siesta stop",
  "Roadside mechanic fixes a flat with homemade tools",
  "Banana plantation corridor through rural Uganda",
  "Gorilla highlands mist rolling in at dusk",
  "Local fruit market — papaya, pineapple & passion fruit",
  "Roadside rolex (chapati egg wrap) breakfast stop",
  "Crater lake detour and wild swim",
];

/** Coastal East Africa highlights — used when the route ends at the coast or an island. */
const HIGHLIGHTS_EA_COASTAL = [
  "Dhow-building village on the creek",
  "Old town spice market wander",
  "Coral reef snorkel stop at low tide",
  "Swahili architecture and carved doorways",
  "Fresh seafood grilled on the beach",
  "Ocean breeze tailwind section along the shoreline",
  "Mangrove creek crossing by small boat",
  "Beach camp under coconut palms",
  "Sunrise over the Indian Ocean",
  ...HIGHLIGHTS_EA_INLAND,  // coastal routes pass through inland terrain too
];

const HIGHLIGHTS_EU = [
  "Historic market square & cathedral",
  "Vineyard cycling trail with free tasting",
  "Panoramic ridge viewpoint",
  "Riverside café espresso stop",
  "Medieval castle ruins",
  "Local artisan bakery & fresh loaf",
  "Alpine lake turquoise swim stop",
  "Traditional farmhouse lunch",
  "Summit cross & monument photo",
  "Medieval bridge & cobblestone crossing",
  "Thermal spa town half-day break",
  "Baroque cathedral town wander",
  "Monastery hillside visit",
  "Lakeside promenade & ice cream",
  "Mountain pass summit celebration",
  "Border crossing with a coffee",
  "Iron Age hillfort viewpoint",
  "Farmers market vegetable haul",
  "Train-rescue option scouted (just in case)",
  "Trailhead wooden shelter wild camp",
];

const HIGHLIGHTS_GEN = [
  "Local market exploration",
  "Scenic river crossing",
  "Historic town centre wander",
  "Countryside farm lunch stop",
  "Hilltop panoramic view",
  "Traditional restaurant dinner",
  "Roadside waterfall photo stop",
  "Small village café & recharge",
  "Scenic gorge descent",
  "Sunrise summit view",
  "Wildflower meadow break",
  "Ancient ruins detour",
];

function highlightsPool(region: Region, coastal = false) {
  if (region === "east-africa") return coastal ? HIGHLIGHTS_EA_COASTAL : HIGHLIGHTS_EA_INLAND;
  if (region === "europe") return HIGHLIGHTS_EU;
  return HIGHLIGHTS_GEN;
}

// ─── Day titles ───────────────────────────────────────────────────────────────

const TITLES_FLAT: Record<Region, string[]> = {
  "east-africa": [
    "Savanna Tailwind Run", "Plains Sprint", "Red Dust Road Rollers",
    "Coastal Breeze Run", "Tea Country Cruise",
  ],
  "europe": [
    "Flatlands Time Trial", "River Valley Cruise", "Coastal Plain Glide",
    "Polderland Sprint", "Low Country Roll",
  ],
  "generic": [
    "Easy Plains Day", "River Valley Cruise", "Flatlands Roll",
    "Tailwind Day", "Countryside Spin",
  ],
};

const TITLES_ROLLING: Record<Region, string[]> = {
  "east-africa": [
    "Through the Highlands", "Undulating Escarpment Roads", "Red Ochre Hills",
    "Rift Wall Rollers", "Acacia Plateau Traverse",
  ],
  "europe": [
    "Rolling Wine Country", "Countryside Switchbacks", "Foothills & Orchards",
    "Valley & Ridge Traverse", "Pastoral Plateau Day",
  ],
  "generic": [
    "Rolling Hill Country", "Undulating Backroads", "Ridge & Valley Day",
    "Countryside Rollers", "Mixed Terrain Traverse",
  ],
};

const TITLES_HILLY: Record<Region, string[]> = {
  "east-africa": [
    "Into the Kikuyu Highlands", "Escarpment Grind", "Crater Rim Challenge",
    "Highland Tea Country Climb", "Bamboo Forest Ascent",
  ],
  "europe": [
    "Alpine Foothills Battle", "Sustained Hillside Grind", "Into the Passes",
    "Switchbacks & Summit Views", "The Long Climb",
  ],
  "generic": [
    "Into the Hills", "Summit Quest", "Switchback Challenge",
    "Highland Grind", "The Long Climb",
  ],
};

const TITLES_MOUNTAINOUS: Record<Region, string[]> = {
  "east-africa": [
    "Gorilla Highlands Push", "The Big Volcano Ascent", "High Altitude Suffer Fest",
    "Rift Wall Summit Day", "The Roof of East Africa",
  ],
  "europe": [
    "The Alpine Monster", "Col Conquest", "High Mountain Drama",
    "Summit-to-Summit Epic", "The Queen Stage",
  ],
  "generic": [
    "The Big Climb", "Mountain Monster Day", "Summit Day",
    "High Altitude Challenge", "The Alpine Queen Stage",
  ],
};

function terrainTitle(terrain: TerrainType, region: Region, index: number) {
  const pool =
    terrain === "flat" ? TITLES_FLAT[region] :
    terrain === "rolling" ? TITLES_ROLLING[region] :
    terrain === "hilly" ? TITLES_HILLY[region] :
    TITLES_MOUNTAINOUS[region];
  return pool[index % pool.length];
}

// ─── Terrain descriptions ─────────────────────────────────────────────────────

/**
 * Segment-specific terrain descriptions for known route pairs.
 * Key: `${normFrom}|${normTo}` — matched both forward and reverse.
 */
const SEGMENT_TERRAIN_OVERRIDES: Record<string, string> = {
  // Kenya inland
  "nairobi|athi river":         "Busy A2 highway climbing out of Nairobi through the industrial outskirts — use the service lane and ride single file past heavy trucks.",
  "athi river|sultan hamud":    "Open Athi plains road — flat red-soil country with wide skies; a good cadence day before the hills begin.",
  "sultan hamud|emali":         "Flat plains dotted with sisal farms and Maasai cattle herders; midday heat builds fast so start early.",
  "emali|kibwezi":              "Acacia scrub corridor transitioning toward the Tsavo ecosystem — watch for elephant crossings near the road at dawn.",
  "kibwezi|mtito andei":        "Classic Kenya lowland road — flat, hot, and long; the baobab groves provide occasional shade for a break.",
  "mtito andei|voi":            "Tsavo East boundary road with red laterite dust and sweeping savanna — true bikepacking country.",
  "voi|samburu":                "Coastal lowland corridor through dry thornbush; the road descends gradually toward the humid coast.",
  "samburu|mariakani":          "Gentle coastal plain approach with increasing coconut palms and roadside fruit stalls.",
  "mariakani|mombasa":          "Final descent to the coast — mangrove-lined road and the salt smell of the Indian Ocean signal journey's end.",
  "nairobi|limuru":             "Steep initial climb out of Nairobi onto the Limuru plateau — rewarded with cool air and tea-country views.",
  "limuru|naivasha":            "Thrilling Great Rift Valley escarpment descent with panoramic views of the valley floor; gravel shoulder available.",
  "naivasha|gilgil":            "Flat Rift Valley floor riding along Lake Naivasha's northern shore — flamingos visible on the lake at dawn.",
  "gilgil|nakuru":              "Easy rolling plains toward Lake Nakuru; watch for baboons and flamingo flocks on the lakeshore.",
  "nakuru|eldoret":             "Long sweeping climb back out of the Rift Valley followed by fertile highland farming country.",
  "eldoret|malaba":             "Descending road through Uasin Gishu plateau farmland toward the Uganda border — a fast, rewarding day.",
  "malaba|tororo":              "Uganda border crossing into flat sugar cane and maize country; road quality improves markedly.",
  // Uganda
  "tororo|jinja":               "Flat Lake Victoria basin road through banana and sugar plantations; the Nile crossing at Jinja is unmissable.",
  "jinja|kampala":              "Busy tarmac highway approaching Uganda's capital — increasing traffic; use the verge and stay alert.",
  "kampala|masaka":             "Rolling red-dirt highlands west of Kampala through dense banana plantations and small trading towns.",
  "masaka|lyantonde":           "Gently rolling savanna corridor with good tarmac; roadside chapati and chai stops every 15 km.",
  "lyantonde|mbarara":          "Mild undulating road through open grazing country with distant Ankole long-horned cattle visible.",
  "mbarara|kabale":             "Dramatic climb into the Kigezi highlands — the 'Switzerland of Africa'. Cool air, terraced hillsides, and eucalyptus groves.",
  "kabale|katuna":              "Final descent to the Rwanda border through misty terraced farmland; the border crossing is straightforward for cyclists.",
  // Rwanda
  "katuna|kigali":              "Rolling Rwandan highlands on smooth tarmac — immaculately clean roads and organised traffic make for a pleasant ride.",
  "entebbe|kampala":            "Short lakeside approach road from Entebbe — flat with good tarmac and light traffic in the early morning.",
  // Tanzania
  "dar es salaam|morogoro":     "Busy coastal highway climbing inland onto the Morogoro plateau — heat is intense before 9am; carry extra water.",
  "morogoro|mikumi":            "Road enters Mikumi National Park buffer zone — watch for warthogs, zebra and giraffe crossing at dawn.",
  "mikumi|iringa":              "Sustained highland climb through the Southern Highlands escarpment — cool pine forests and red-soil switchbacks.",
  "iringa|makambako":           "Long plateau traverse through mist-belt highland farming country — one of Tanzania's most beautiful cycling sections.",
  "makambako|njombe":           "Steep descent into the Njombe highlands — cool temperatures year-round and pine-eucalyptus forest.",
  "njombe|mbeya":               "Rolling highland road through fertile smallholder farms approaching the Southern Highlands hub of Mbeya.",
  "arusha|moshi":               "Classic Kilimanjaro approach road — Kili's snowcap dominates the horizon on clear mornings. Coffee and banana country.",
  "moshi|same":                 "Descending road through the Pare Hills foothills — increasingly dry and warm as you leave Kili's shadow.",
  "dar es salaam|zanzibar":     "Short ferry crossing from the Dar es Salaam terminal to Zanzibar Town (45–90 min) — bikes travel as cargo.",
  // Kenya coast (Nairobi–Malindi)
  "voi|mariakani":              "Long dry-country stretch from Tsavo into the coastal hinterland — sisal plantations appear as the humidity rises.",
  "mombasa|kilifi":             "Coastal road north of Mombasa via the Nyali/Mtwapa creek crossings — busy but well-tarmacked, with sea breezes.",
  "kilifi|malindi":             "Palm-lined coastal highway hugging the Indian Ocean — coral-rag scenery and frequent fresh coconut stops.",
  // Kenya highlands (Mt Kenya)
  "nairobi|thika":              "Wide dual-carriageway out of Nairobi through coffee estates — busy but shouldered; settles into farmland past Thika.",
  "thika|muranga":              "Rolling tea and coffee country on the lower slopes of the Aberdares — small market towns every few kilometres.",
  "muranga|nyeri":              "Steady climb toward Nyeri with Mt Kenya's snowcap appearing on clear mornings — classic Central Highlands riding.",
  "nyeri|naro moru":            "Highland approach road directly beneath Mt Kenya — cool air, dairy farms, and the mountain filling the skyline.",
  "naro moru|nanyuki":          "Final rolling stretch to Nanyuki on the equator — wheat fields give way to views of Mt Kenya's glaciers.",
  // Kenya — Maasai Mara
  "nairobi|narok":              "Climb over the Ngong Hills escarpment before descending onto the Loita Plains — a dramatic Rift Valley opener.",
  "narok|sekenani gate":        "Open grassland road toward the Mara — expect murram surfaces and the first wildlife sightings near the reserve boundary.",
  "sekenani gate|maasai mara":  "Riding within sight of the Mara's rolling savanna — guided/escorted riding recommended due to wildlife presence.",
  // Kenya — western loop
  "kisumu|kakamega":            "Lake Victoria basin road climbing gently into Kakamega's sugar-cane and tea country.",
  "kakamega|webuye":            "Rolling highland tarmac past the edge of Kakamega Forest — Kenya's last remnant of tropical rainforest.",
  "webuye|bungoma":             "Short, flat farmland link road through Bukusu homesteads and maize fields.",
  "bungoma|kitale":             "Fertile Mt Elgon foothill country — rolling terrain with the mountain visible to the north on clear days.",
  // Tanzania — Serengeti/Ngorongoro
  "arusha|mto wa mbu":          "Descend off the Arusha plateau into the Rift Valley floor — baobabs and Lake Manyara's escarpment to the south.",
  "mto wa mbu|karatu":          "Steady climb up the Rift wall onto the Ngorongoro highlands — coffee shambas and cooler air with every kilometre.",
  "karatu|ngorongoro crater":   "Sustained highland climb to the crater rim — expect mist, Maasai bomas, and one of Africa's great panoramas at the top.",
  "ngorongoro crater|seronera": "Descent from the crater highlands onto the Serengeti plains — open grassland riding within a controlled safari corridor.",
  "seronera|serengeti":         "Endless Serengeti plains — flat, exposed, and best ridden as part of an escorted safari-cycling itinerary.",
  // Tanzania — coast
  "dar es salaam|kibaha":       "Busy highway climbing out of Dar's northern suburbs — heavy truck traffic thins past the Kibaha junction.",
  "kibaha|bagamoyo":            "Quiet coastal road to the historic slave-trade port of Bagamoyo — flat riding through coconut groves and fishing villages.",
  // Tanzania — Malawi border
  "mbeya|kyela":                "Dramatic descent from the Mbeya highlands to the humid lakeshore lowlands near Lake Nyasa.",
  "kyela|karonga":              "Short flat stretch to the Malawi border crossing at Songwe — straightforward for cyclists with onward tarmac into Karonga.",
  // Uganda — Rwenzori
  "kampala|mubende":            "Rolling western highway through banana plantations and cattle corridors — a long transit day toward the Rwenzoris.",
  "mubende|fort portal":        "Undulating tea-country road with the Rwenzori 'Mountains of the Moon' rising on the horizon in clear weather.",
  "fort portal|kasese":         "Ride beneath the snow-capped Rwenzori range through tea estates — one of Uganda's most scenic cycling corridors.",
  // Uganda — Murchison Falls
  "kampala|masindi":            "Long rolling highway north through Lake Kyoga's farmland basin — a full transit day toward Murchison Falls.",
  "masindi|murchison falls":    "Savanna park-approach road with elephant and buffalo crossings possible — ride only with a ranger escort inside the park.",
  // Uganda — Sipi Falls
  "jinja|mbale":                "Flat sugar-cane and rice-paddy corridor along the Mt Elgon foothills, with the mountain building on the horizon.",
  "mbale|kapchorwa":            "Steady climb into the Mt Elgon foothills — coffee shambas give way to cooler, misty highland air.",
  "kapchorwa|sipi falls":       "Short, steep final climb to the Sipi Falls escarpment — arabica coffee farms frame the three-tier waterfall.",
  // Rwanda–Burundi
  "kigali|muhanga":             "Immaculate rolling tarmac through Rwanda's 'thousand hills' — terraced hillsides in every direction.",
  "muhanga|huye":               "Continued highland riding through tea estates toward Rwanda's southern university town of Huye.",
  "huye|bujumbura":             "Sustained mountainous descent from the Rwandan highlands to Lake Tanganyika's shore at Bujumbura.",
  // Ethiopia
  "addis ababa|debre zeit":     "Rolling highland exit from Addis onto the edge of the Rift Valley — crater lakes visible near Debre Zeit.",
  "debre zeit|mojo":            "Flat Rift Valley floor riding past acacia woodland and small market towns.",
  "mojo|ziway":                 "Open Rift Valley corridor with lake views near Ziway — flat, fast, and increasingly warm.",
  "ziway|shashamane":           "Flat highway riding through Oromia farmland with occasional lakeside glimpses.",
  "shashamane|hawassa":         "Short final stretch to Lake Hawassa — flat road through flower farms and fish-market villages.",
  // Kenya–Uganda border crossing
  "kisumu|busia":               "Flat Lake Victoria basin road west from Kisumu through sugar-cane country to the Busia border post.",
  "busia|tororo":               "Busy border-town crossing into Uganda — expect congestion at the post itself, then quiet flat roads beyond.",
  // Europe
  "vienna|baden":               "Well-signed cycle route south from Vienna through suburban vineyards and the Vienna Woods.",
  "baden|wiener neustadt":      "Gently rolling road through Lower Austrian farmland with distant Alpine foothills on the horizon.",
  "wiener neustadt|hartberg":   "Transition from Austrian plains to Styrian foothills — rolling terrain with forested ridges.",
  "hartberg|graz":              "Hilly Styrian countryside with steep vineyard climbs and fast descents into Graz.",
  "graz|maribor":               "Cross the Austria–Slovenia border through the Drava valley — civilised cycling on a riverside trail.",
  "paris|compiegne":            "Flat canal-side road north of Paris through classic French countryside.",
  "berlin|zossen":              "Flat Brandenburg countryside — dedicated cycle paths through pine forest.",
  "florence|siena":             "Classic Tuscan rolling hills — Chianti vineyards and cypress-lined ridge roads.",
  "london|dover":               "Kent countryside to the White Cliffs — rolling hills with a few punchy climbs before the coast.",
  "barcelona|lleida":           "Flat coastal plain transitioning to the Ebro valley — strong westerly tailwind possible.",
};

const TERRAIN_DESC: Record<Region, Record<TerrainType, string[]>> = {
  "east-africa": {
    flat: [
      "Smooth tarmac through open savanna — expect strong midday sun; start before 7am.",
      "Wide plains road with light traffic; watch for potholes after rain and livestock on the road.",
      "Open lowland corridor — flat and fast but exposed; carry more water than you think you need.",
    ],
    rolling: [
      "Undulating escarpment roads with laterite gravel sections through farms and trading towns.",
      "Mixed tarmac and murram (red gravel) — excellent grip when dry, treacherous when wet.",
      "Classic East African rolling terrain — a rhythm of short climbs and open descents through bush.",
    ],
    hilly: [
      "Sustained highland climbs through tea plantations and bamboo forest; cool and misty at the top.",
      "Steep escarpment switchbacks followed by fast descents into the valley floor.",
      "Into the highlands — long grinders rewarded with panoramic Rift Valley views at the summit.",
    ],
    mountainous: [
      "High-altitude volcanic slopes — thin air, loose gravel, and breathtaking views above the cloud layer.",
      "Relentless mountain gradients; pace yourself and savour the gorilla highlands scenery.",
      "Dramatic mountain pass riding — the steepest gradients in East Africa with correspondingly epic views.",
    ],
  },
  "europe": {
    flat: [
      "Dedicated cycle paths and quiet back roads through patchwork farmland.",
      "Flat riverside trail — well-surfaced and mostly car-free through the valley.",
      "Low-country roads ideal for maintaining a strong tempo; watch for crosswinds.",
    ],
    rolling: [
      "Mixed tarmac and light gravel through forests and vineyard country.",
      "Quiet country roads with gentle climbs through orchard villages and market towns.",
      "Pastoral rolling terrain — typical European cycle-touring country at its best.",
    ],
    hilly: [
      "Sustained climbs on mixed gravel; technical descents demand full concentration.",
      "Rolling forest roads with punchy ascents and panoramic valley rewards.",
      "Into the foothills — a series of ridges and valleys that separate the plains from the mountains.",
    ],
    mountainous: [
      "Steep gravel ascents and exposed ridge road — full commitment and a light bike required.",
      "Alpine pass riding — loose surface on the descent; check rear brake pads the night before.",
      "The queen stage: sustained mountain terrain where pacing and fuelling are the whole game.",
    ],
  },
  "generic": {
    flat: [
      "Flat open road — a good day to maintain a steady pace and bank kilometres.",
      "Easy terrain; conserve energy here for tomorrow's harder section.",
      "Long flat corridor through open country — wind direction will make or break your day.",
    ],
    rolling: [
      "Mixed terrain with rolling hills and varied surface types — stay alert on the descents.",
      "Undulating country roads through interesting landscape and local villages.",
      "A rhythm of climbs and drops — classic mixed-terrain touring at its most enjoyable.",
    ],
    hilly: [
      "Hilly section requiring solid fitness and careful gear selection on the climbs.",
      "A demanding day with rewarding views from each crest; short breaks at the tops pay off.",
      "Into the hills — keep cadence high and don't burn matches early.",
    ],
    mountainous: [
      "Serious mountain terrain — pace yourself, eat before you're hungry, drink before you're thirsty.",
      "High-gradient day; every metre of climbing is rewarded on the long descent.",
      "The big mountain stage — this is what you've been training for.",
    ],
  },
};

/** Build a normalised segment key for override lookup. */
function segmentKey(from: string, to: string): string {
  return `${norm(from)}|${norm(to)}`;
}

function terrainDesc(t: TerrainType, region: Region, i: number, from?: string, to?: string): string {
  // Check segment-specific override first (both directions)
  if (from && to) {
    const fwd = segmentKey(from, to);
    const rev = segmentKey(to, from);
    if (SEGMENT_TERRAIN_OVERRIDES[fwd]) return SEGMENT_TERRAIN_OVERRIDES[fwd];
    if (SEGMENT_TERRAIN_OVERRIDES[rev]) return SEGMENT_TERRAIN_OVERRIDES[rev];
  }
  const pool = TERRAIN_DESC[region][t];
  return pool[i % pool.length];
}

// ─── Day notes ────────────────────────────────────────────────────────────────

const NOTES_BY_LEVEL: Record<string, string[]> = {
  Beginner: [
    "Take it easy today — settle into your cadence and don't chase faster riders.",
    "Eat a little before you feel hungry. Your body is still learning to fuel on the move.",
    "Stop for water at every opportunity. Dehydration sneaks up slowly.",
    "If your sit bones are aching, short standing climbs help more than stopping.",
    "Don't underestimate recovery — tonight's sleep is tomorrow's engine.",
    "Aim to finish riding before 3pm so you have time to sort camp before dark.",
    "You're doing great. Every kilometre is a kilometre you didn't expect to do.",
  ],
  Intermediate: [
    "Keep your heart rate in Zone 2 on the climbs — save the matches for tomorrow.",
    "Eat on the bike; a gel every 45 minutes avoids the dreaded bonk.",
    "Your body needs 200–300 calories per hour at pace — don't skip meals.",
    "Top up water at every village. Carrying two litres minimum is non-negotiable.",
    "Check your chain tension and tyre pressure after every rough section.",
    "Push today's effort but leave something in the tank for the days ahead.",
    "Mental stamina matters as much as physical. Break the day into 25km chunks.",
  ],
  Advanced: [
    "Threshold the climbs, recover on the flats — classic stage-race pacing.",
    "You can afford to push today, but track your power-to-distance ratio closely.",
    "Front load your calorie intake this morning — it pays back all afternoon.",
    "Your legs recover fastest when you keep spinning lightly after a hard effort.",
    "Stay aggressive on the descents — every second saved there is free speed.",
    "Heat management: wet your neck and wrists at every water point.",
    "You've got the fitness. Trust it and ride your own race, not the road's.",
  ],
  Expert: [
    "Treat the early kilometres as forced recovery — the real stage starts at km 80.",
    "Nutrition discipline is what separates a good day from a great one at this intensity.",
    "If you feel strong at the summit, you paced it right. If you feel great, you went too easy.",
    "Pre-load electrolytes before the heat builds — don't wait to feel the cramps.",
    "Your biggest enemy today is ego. Patience on the climbs, precision on the descents.",
    "Aero position on the flats; out of saddle only when gradient demands it.",
    "Every training block led to this. Execute the plan and trust the process.",
  ],
};

function dayNote(level: string, dayIndex: number, totalDays: number): string {
  const pool = NOTES_BY_LEVEL[level] ?? NOTES_BY_LEVEL["Intermediate"];
  if (dayIndex === 0) return pool[0]; // Always the "ease in" note
  if (dayIndex === totalDays - 1) return "Savour the final miles. Spin easy, look around — you earned every one of them.";
  return pool[1 + (dayIndex % (pool.length - 1))];
}

// ─── Accommodation string ─────────────────────────────────────────────────────

const ACCOMMODATION_STRINGS: Record<string, Record<Region, string>> = {
  "Wild camping": {
    "east-africa": "Secluded bush camp (Leave No Trace)",
    "europe":      "Wild bivvy spot in forest (check local rules)",
    "generic":     "Wild camp — carry full kit",
  },
  "Hostels": {
    "east-africa": "Budget guesthouse or local hostel",
    "europe":      "Cycle-touring hostel or campsite",
    "generic":     "Budget hostel",
  },
  "B&Bs": {
    "east-africa": "Comfortable guesthouse or B&B",
    "europe":      "Family-run B&B or small hotel",
    "generic":     "B&B or small hotel",
  },
  "Mix of all": {
    "east-africa": "Flexible — campsite, guesthouse, or bush camp as available",
    "europe":      "Mix — bivvy, hostel, or B&B depending on location",
    "generic":     "Mix of accommodation styles",
  },
};

function accString(acc: string, region: Region) {
  return (ACCOMMODATION_STRINGS[acc] ?? ACCOMMODATION_STRINGS["B&Bs"])[region];
}

// ─── Budget ───────────────────────────────────────────────────────────────────

const BUDGET_MAP: Record<string, Record<Region, number>> = {
  "Budget":      { "east-africa": 15,  "europe": 25,  "generic": 20  },
  "Mid-range":   { "east-africa": 40,  "europe": 65,  "generic": 50  },
  "Comfortable": { "east-africa": 90,  "europe": 120, "generic": 100 },
  "Luxury":      { "east-africa": 180, "europe": 250, "generic": 200 },
};

const CURRENCY: Record<Region, string> = {
  "east-africa": "USD",
  "europe":      "EUR",
  "generic":     "USD",
};

// ─── Difficulty label ──────────────────────────────────────────────────────────

const DIFFICULTY: Record<string, string> = {
  Beginner:     "Relaxed",
  Intermediate: "Moderate",
  Advanced:     "Challenging",
  Expert:       "Gruelling",
};

// ─── Calorie & hydration by level ─────────────────────────────────────────────

const CALORIES: Record<string, number> = {
  Beginner: 2600, Intermediate: 3200, Advanced: 4000, Expert: 4800,
};
const HYDRATION: Record<string, number> = {
  Beginner: 3.5, Intermediate: 4.5, Advanced: 5.5, Expert: 6.5,
};

// ─── Nutrition meals by region ────────────────────────────────────────────────

const MEAL_PLANS: Record<Region, { meal: string; timing: string; suggestions: string[] }[]> = {
  "east-africa": [
    { meal: "Breakfast",          timing: "06:30", suggestions: ["Mandazi & black chai", "Uji (porridge) with peanut butter", "Boiled eggs & avocado"] },
    { meal: "Mid-morning snack",  timing: "09:30", suggestions: ["Banana bunch", "Roasted groundnuts", "Energy biscuits"] },
    { meal: "Lunch",              timing: "12:30", suggestions: ["Ugali, sukuma wiki & tilapia", "Beans & chapati at a roadside kiosk", "Rice & stew"] },
    { meal: "Afternoon fuelling", timing: "15:30", suggestions: ["Sugarcane juice at a roadside stall", "Fresh mango", "Glucose biscuits"] },
    { meal: "Dinner",             timing: "19:00", suggestions: ["Nyama choma & roasted maize", "Pilau rice with kachumbari", "Recovery protein shake"] },
  ],
  "europe": [
    { meal: "Breakfast",          timing: "07:00", suggestions: ["Oatmeal with nuts & berries", "Scrambled eggs on toast", "Flat white & croissant"] },
    { meal: "Mid-ride snack",     timing: "10:30", suggestions: ["Banana", "Energy gel", "Handful of trail mix"] },
    { meal: "Lunch",              timing: "13:00", suggestions: ["Pasta salad from a village bakery", "Large sandwich & sparkling water", "Electrolyte drink"] },
    { meal: "Afternoon fuelling", timing: "15:30", suggestions: ["Local pastry or cake", "Energy bar", "Espresso shot"] },
    { meal: "Dinner",             timing: "19:00", suggestions: ["Lean protein with carb-heavy side", "Local trattoria pasta", "Recovery protein shake"] },
  ],
  "generic": [
    { meal: "Breakfast",          timing: "07:00", suggestions: ["Oatmeal with fruit", "Eggs & toast", "Coffee"] },
    { meal: "Mid-ride snack",     timing: "10:30", suggestions: ["Banana", "Energy bar", "Trail mix"] },
    { meal: "Lunch",              timing: "13:00", suggestions: ["Carb-heavy local dish", "Sandwiches", "Electrolyte drink"] },
    { meal: "Afternoon fuelling", timing: "15:30", suggestions: ["Local snack", "Energy gel", "Fresh fruit"] },
    { meal: "Dinner",             timing: "19:00", suggestions: ["Protein with rice or pasta", "Local restaurant special", "Recovery shake"] },
  ],
};

// ─── Safety tips by region ────────────────────────────────────────────────────

type SafetyTip = { category: string; tip: string; priority: "high" | "medium" | "low" };

const SAFETY_EA: SafetyTip[] = [
  { category: "Traffic & Matatus", priority: "high", tip: "Kenya and East African roads have fast-moving minibuses (matatus). Ride single file, use a rear flasher at all times, and never assume you've been seen." },
  { category: "Sun & Heat", priority: "high", tip: "Equatorial sun is relentless. Start riding by 6am, cover 80% of the day's distance before noon, and rest in shade from 12–3pm on hot days." },
  { category: "Hydration", priority: "high", tip: "Carry at least 3 litres and refill at every opportunity. In rural stretches, water sources can be 40+ km apart. Purification tablets are essential." },
  { category: "Mechanical", priority: "medium", tip: "East African roads are rough on tyres and chains. Run 32mm+ tyres at 50–60 psi, carry two spare tubes, and lube your chain every evening." },
  { category: "Wildlife (Safari Routes)", priority: "medium", tip: "Near national parks, wildlife can be close to the road at dawn and dusk. Do not stop or approach — keep moving calmly." },
  { category: "Navigation", priority: "medium", tip: "Download offline maps on Komoot or OsmAnd before each segment. Mobile data is unreliable in rural Kenya and Tanzania." },
  { category: "Police Checkpoints", priority: "low", tip: "Checkpoints are common. Keep your passport accessible, be polite, and expect a short stop. Most officers are curious and friendly toward cyclists." },
  { category: "Malaria Prevention", priority: "high", tip: "Take antimalarial medication as prescribed, use DEET repellent at dusk, and sleep under a net in low-budget accommodation." },
  { category: "Communication", priority: "low", tip: "Buy a local SIM (Safaricom in Kenya, Airtel elsewhere) for cheap data. Share your daily route with someone at home each morning." },
];

const SAFETY_EU: SafetyTip[] = [
  { category: "Traffic & Roads", priority: "high", tip: "Use daytime running lights front and rear. Wear a high-vis vest on main roads and inside tunnels — drivers are not always expecting cyclists." },
  { category: "Weather", priority: "high", tip: "Check local radar each morning — alpine and Central European weather can change within the hour, especially in the afternoon." },
  { category: "Mechanical", priority: "medium", tip: "Practice fixing a puncture and breaking/rejoining a chain before you leave. Carry a spare derailleur hanger specific to your bike model." },
  { category: "Navigation", priority: "medium", tip: "Download offline maps on Komoot or OsmAnd for each day's segment the night before. Do not rely on mobile data in alpine valleys." },
  { category: "Health & Fatigue", priority: "medium", tip: "Rest before you are exhausted, not after. A 10-minute stop every 90 minutes prevents overuse injuries and keeps power output consistent." },
  { category: "Hydration", priority: "medium", tip: "Drink 500 ml per hour minimum. In alpine or rural sections, water points can be sparse — refill at every village fountain." },
  { category: "Cold Descents", priority: "medium", tip: "Alpine descents can be 15°C colder than the valley. Pack a lightweight gilet in your top tube bag so you can put it on at the summit." },
  { category: "Communication", priority: "low", tip: "Share your daily route plan with someone at home. Carry a fully charged power bank and have the local emergency number (112) saved offline." },
];

const SAFETY_GEN: SafetyTip[] = [
  { category: "Traffic & Roads", priority: "high", tip: "Always use front and rear lights in daylight. Ride predictably, signal turns, and never assume drivers have seen you." },
  { category: "Hydration", priority: "high", tip: "Drink 500 ml per hour and refill at every opportunity. Carry more than you think you'll need between water sources." },
  { category: "Mechanical", priority: "medium", tip: "Service your bike before you leave and carry a repair kit including spare tubes, multi-tool, chain lube, and zip ties." },
  { category: "Navigation", priority: "medium", tip: "Download offline maps before each segment. Do not rely solely on cellular data, which can be unavailable in rural areas." },
  { category: "Weather", priority: "medium", tip: "Check forecasts each morning. Be prepared for rapid weather changes, particularly at altitude." },
  { category: "Health & Fatigue", priority: "medium", tip: "Listen to your body. Stop early if you feel unwell. Cycling through exhaustion leads to accidents and injuries." },
  { category: "Communication", priority: "low", tip: "Share your daily route with someone at home. Carry a charged power bank and know the local emergency number." },
];

function safetyTips(region: Region): SafetyTip[] {
  if (region === "east-africa") return SAFETY_EA;
  if (region === "europe") return SAFETY_EU;
  return SAFETY_GEN;
}

// ─── Packing list (accommodation-driven) ─────────────────────────────────────

function buildPacking(acc: string, region: Region, level: string): PackingCategory[] {
  const isCamping = acc === "Wild camping" || acc === "Mix of all";
  const isHotel = acc === "B&Bs";
  const isHostel = acc === "Hostels";

  const cycling: PackingCategory = {
    category: "Cycling Gear",
    items: [
      { name: "Gravel or touring bike (fully serviced)", essential: true },
      { name: "Helmet & cycling glasses", essential: true },
      { name: "Daytime running lights (front & rear)", essential: true },
      { name: "Handlebar or frame bag", essential: true },
      { name: "Rear panniers or bikepacking bags", essential: isCamping },
      { name: "GPS computer or phone mount", essential: false },
      ...(region === "east-africa" ? [{ name: "Bright high-visibility vest", essential: true }] : []),
    ],
  };

  const repair: PackingCategory = {
    category: "Repair Tools",
    items: [
      { name: "Puncture repair kit & 2 spare tubes", essential: true },
      { name: "Mini pump or CO₂ inflator", essential: true },
      { name: "Multi-tool with chain breaker", essential: true },
      { name: "Spare derailleur hanger (bike-specific)", essential: level !== "Beginner" },
      { name: "Chain lube & rag", essential: true },
      { name: "Spare brake pads", essential: false },
      { name: "Zip ties, duct tape & cable ties", essential: false },
      ...(region === "east-africa" ? [{ name: "Extra inner tubes (×3 — rough roads)", essential: true }] : []),
    ],
  };

  const clothing: PackingCategory = {
    category: "Clothing",
    items: [
      { name: "Padded bib shorts (×2)", essential: true },
      { name: "Moisture-wicking base layers", essential: true },
      { name: isCamping || region === "east-africa" ? "Lightweight windproof jacket" : "Waterproof windbreaker", essential: true },
      { name: "Cycling gloves", essential: true },
      { name: "Merino wool socks (×3)", essential: false },
      { name: "Off-bike casual clothes", essential: false },
      ...(region === "east-africa"
        ? [{ name: "Sun sleeves & neck gaiter (sun protection)", essential: true }]
        : [{ name: "Arm warmers & gilet (for cold descents)", essential: level !== "Beginner" }]),
    ],
  };

  const campingItems = isCamping
    ? [
        { name: "Lightweight tent or bivvy sack", essential: true },
        { name: "Sleeping bag (season-rated)", essential: true },
        { name: "Inflatable sleeping pad", essential: true },
        { name: "Headlamp with spare batteries", essential: true },
        { name: "Camp stove & lighter", essential: false },
        { name: "Dry bags for waterproofing gear", essential: true },
        ...(region === "east-africa" ? [{ name: "Mosquito net & DEET repellent", essential: true }] : []),
      ]
    : isHostel
    ? [
        { name: "Sleep sheet / silk liner", essential: true },
        { name: "Padlock for hostel lockers", essential: true },
        { name: "Earplugs & eye mask", essential: false },
        { name: "Small day pack for exploring", essential: false },
      ]
    : [
        // B&B / hotel
        { name: "Chamois cream (nightly application)", essential: true },
        { name: "Charging cables for all devices", essential: true },
        { name: "Travel towel (small)", essential: false },
        { name: "Earplugs & eye mask", essential: false },
      ];

  const sleep: PackingCategory = {
    category: "Camping Equipment",
    items: campingItems,
  };

  const health: PackingCategory = {
    category: "Health & First Aid",
    items: [
      { name: "Basic first aid kit", essential: true },
      { name: "Chamois cream", essential: true },
      { name: "Sunscreen SPF 50+", essential: true },
      { name: "Rehydration sachets", essential: region === "east-africa" },
      ...(region === "east-africa"
        ? [
            { name: "Antimalarial tablets (prescribed)", essential: true },
            { name: "Water purification tablets", essential: true },
          ]
        : []),
      { name: "Pain relief & anti-inflammatories", essential: false },
      { name: "Blister plasters", essential: false },
    ],
  };

  return [cycling, repair, clothing, sleep, health];
}

// ─── Main generator ────────────────────────────────────────────────────────────

export function generateItinerary(trip: PlannerFormValues): Itinerary {
  // ── 1. Daily distance
  const distMap: Record<string, number> = {
    "<50km": 40, "50–80km": 65, "80–120km": 100, "120km+": 135,
  };
  const dailyDist = distMap[trip.dailyDistance] ?? 65;

  // ── 2. Route lookup & region
  const route = lookupRoute(trip.startLocation, trip.destination);
  const region: Region = route?.region ?? detectRegion(trip.startLocation, trip.destination);

  // ── 3. Waypoints
  const sourceWaypoints =
    route?.waypoints ??
    [trip.startLocation, ...genericWaypointPool(region), trip.destination];
  const waypoints = selectWaypoints(
    trip.startLocation,
    trip.destination,
    sourceWaypoints,
    trip.duration,
  );
  // Ensure first and last match user input exactly
  waypoints[0] = trip.startLocation;
  waypoints[waypoints.length - 1] = trip.destination;

  // ── 4. Budget
  const perDayCost = (BUDGET_MAP[trip.budget] ?? BUDGET_MAP["Mid-range"])[region];
  const currency = CURRENCY[region];
  const accCost = Math.round(perDayCost * 0.42);
  const foodCost = Math.round(perDayCost * 0.37);
  const waterCost = Math.round(perDayCost * 0.08);
  const miscCost = perDayCost - accCost - foodCost - waterCost;

  // ── 5. Highlights pool (coastal-aware, deduplicated across days)
  const coastal = route?.coastal ?? false;
  const pool = highlightsPool(region, coastal);
  // Shuffle deterministically using day index so each run is consistent
  const pickHighlights = (dayIdx: number): [string, string] => {
    const a = pool[dayIdx % pool.length];
    const b = pool[(dayIdx + Math.floor(pool.length / 2)) % pool.length];
    return a === b ? [a, pool[(dayIdx + 1) % pool.length]] : [a, b];
  };

  // ── 6. Days
  const terrainProfile = route?.terrainProfile ?? [];

  const days: DayPlan[] = Array.from({ length: trip.duration }, (_, i) => {
    const isFirst = i === 0;
    const isLast = i === trip.duration - 1;

    // Terrain (computed first — distance's road-detour correction depends on it)
    const terrain: TerrainType =
      terrainProfile.length > 0
        ? terrainProfile[i % terrainProfile.length]
        : (["flat", "rolling", "hilly"] as TerrainType[])[i % 3];

    // Distance: real haversine distance between this day's actual start/end
    // towns, corrected for road detour. Falls back to the target-daily-distance
    // heuristic only when either town has no known coordinate (e.g. a
    // generic/placeholder stop on a route shorter than the requested duration).
    const fromCoord = lookupCoords(waypoints[i]);
    const toCoord = lookupCoords(waypoints[i + 1]);
    let dist: number;
    if (fromCoord && toCoord) {
      const straightLineKm = haversineKm(fromCoord, toCoord);
      dist = Math.max(5, Math.round(straightLineKm * ROAD_DETOUR_FACTOR[terrain]));
    } else {
      const factor = isFirst || isLast ? 0.75 : 0.85 + Math.abs(Math.sin(i * 7.3)) * 0.30;
      dist = Math.round(dailyDist * factor);
    }

    const elevPerKm = ELEV_PER_KM[terrain];
    const elev = Math.round(dist * elevPerKm);

    // Riding time
    const speedLow = terrain === "mountainous" ? 12 : terrain === "hilly" ? 14 : terrain === "rolling" ? 16 : 18;
    const speedHigh = speedLow + 4;
    const ridingTime = `${Math.ceil(dist / speedHigh)}–${Math.ceil(dist / speedLow)} hrs`;

    // Title
    const title = isFirst
      ? `Departing ${trip.startLocation}`
      : isLast
      ? `The Final Push to ${trip.destination}`
      : terrainTitle(terrain, region, i);

    return {
      day: i + 1,
      title,
      startTown: waypoints[i],
      endTown: waypoints[i + 1],
      ridingTime,
      distance: dist,
      elevation: elev,
      terrain: terrainDesc(terrain, region, i, waypoints[i], waypoints[i + 1]),
      highlights: pickHighlights(i),
      accommodation: accString(trip.accommodation, region),
      notes: dayNote(trip.experienceLevel, i, trip.duration),
    };
  });

  // ── 7. Summary stats
  const totalDistance = days.reduce((s, d) => s + d.distance, 0);
  const totalElevation = days.reduce((s, d) => s + d.elevation, 0);
  const difficulty = DIFFICULTY[trip.experienceLevel] ?? "Moderate";

  const summaryHighlights = [
    `${totalDistance} km over ${trip.duration} days`,
    `${totalElevation.toLocaleString()} m total elevation gain`,
    `${difficulty} difficulty — ${trip.experienceLevel} riders`,
    trip.accommodation,
    region === "east-africa"
      ? "Authentic East African cycling experience"
      : region === "europe"
      ? "Classic European cycle-touring route"
      : "Adventurous multi-day expedition",
  ];

  // ── 8. Nutrition
  const cals = CALORIES[trip.experienceLevel] ?? 3200;
  const hydration = HYDRATION[trip.experienceLevel] ?? 4.5;

  return {
    summary: {
      title: `${trip.startLocation} → ${trip.destination} — ${difficulty} Expedition`,
      totalDistance,
      totalElevation,
      difficulty,
      estimatedCaloriesPerDay: cals,
      highlights: summaryHighlights,
    },
    days,
    packing: buildPacking(trip.accommodation, region, trip.experienceLevel),
    budget: {
      perDay: perDayCost,
      total: perDayCost * trip.duration,
      accommodation: accCost,
      food: foodCost,
      water: waterCost,
      miscellaneous: miscCost,
      currency,
      tiers: [
        { label: "Accommodation", amount: accCost * trip.duration, icon: "tent" },
        { label: "Food",          amount: foodCost * trip.duration, icon: "coffee" },
        { label: "Water & Drinks", amount: waterCost * trip.duration, icon: "droplets" },
        { label: "Misc & Emergencies", amount: miscCost * trip.duration, icon: "tool" },
      ],
    },
    nutrition: {
      calorieTarget: cals,
      hydrationTarget: hydration,
      mealPlan: MEAL_PLANS[region],
      tips: [
        `Aim for ${Math.round(cals / 4)} calories every 45 minutes on the bike.`,
        `Hydrate before you're thirsty — target ${Math.round(hydration / 10 * 10)}L by end of day.`,
        "Replenish electrolytes after any heavy sweating session.",
        "Real food beats gels on multi-day trips — your gut will thank you.",
      ],
    },
    safety: safetyTips(region),
  };
}
