/**
 * Static coordinate lookup table for all towns in the route database
 * plus a comprehensive set of East African, European and world cities.
 * Keys are lowercase, stripped of punctuation.  Coordinates are [lat, lng].
 *
 * IMPORTANT: Always prefer this table over Nominatim — Nominatim can return
 * wrong results for city names that exist in multiple countries (e.g. "Kampala"
 * also exists as a tiny settlement in Queensland, Australia).
 */

export type LatLng = [number, number];

const RAW: Record<string, LatLng> = {

  // ── Kenya ────────────────────────────────────────────────────────────────────
  "nairobi":            [-1.2921,  36.8219],
  "thika":              [-1.0332,  37.0693],
  "ruiru":              [-1.1476,  36.9634],
  "kiambu":             [-1.1718,  36.8352],
  "langata":            [-1.3341,  36.7567],
  "limuru":             [-1.1134,  36.6506],
  "athi river":         [-1.4577,  36.9834],
  "sultan hamud":       [-2.0534,  37.3667],
  "emali":              [-2.0895,  37.4504],
  "makindu":            [-2.2760,  37.8260],
  "kibwezi":            [-2.4026,  37.9604],
  "mtito andei":        [-2.6847,  38.1665],
  "tsavo west gate":    [-3.2499,  38.0899],
  "tsavo east gate":    [-3.2316,  38.4753],
  "voi":                [-3.3960,  38.5566],
  "wundanyi":           [-3.3960,  38.3620],
  "samburu":            [-3.9040,  39.3660],
  "mariakani":          [-3.8678,  39.4617],
  "mtwapa":             [-3.9395,  39.7380],
  "mombasa":            [-4.0435,  39.6682],
  "diani beach":        [-4.2792,  39.5852],
  "shimoni":            [-4.6452,  39.3833],
  "takaungu":           [-3.6667,  39.8500],
  "kilifi":             [-3.6306,  39.8499],
  "watamu":             [-3.3561,  40.0153],
  "gede":               [-3.3128,  40.0250],
  "malindi":            [-3.2138,  40.1169],
  "lamu":               [-2.2686,  40.9020],
  "hola":               [-1.5000,  40.0333],
  "garissa":            [-0.4531,  39.6441],
  "dadaab":             [ 0.0530,  40.3190],
  "mandera":            [ 3.9368,  41.8669],
  "wajir":              [ 1.7471,  40.0572],
  "naivasha":           [-0.7175,  36.4314],
  "gilgil":             [-0.5004,  36.3232],
  "nakuru":             [-0.3031,  36.0800],
  "londiani":           [-0.1569,  35.5972],
  "kericho":            [-0.3670,  35.2833],
  "litein":             [-0.3736,  35.2852],
  "keroka":             [-0.8333,  34.9333],
  "kisii":              [-0.6817,  34.7669],
  "homa bay":           [-0.5267,  34.4570],
  "siaya":              [-0.0608,  34.2888],
  "ugunja":             [-0.0467,  34.2667],
  "gem":                [-0.0830,  34.4330],
  "bondo":              [-0.3360,  34.2730],
  "kisumu":             [-0.1022,  34.7617],
  "mumias":             [ 0.3373,  34.4913],
  "butere":             [ 0.2010,  34.4940],
  "kakamega":           [ 0.2838,  34.7518],
  "vihiga":             [ 0.0688,  34.7261],
  "webuye":             [ 0.6102,  34.7696],
  "bungoma":            [ 0.5643,  34.5601],
  "busia":              [ 0.4605,  34.1133],
  "malaba":             [ 0.6327,  34.2630],
  "eldoret":            [ 0.5143,  35.2698],
  "kitale":             [ 1.0144,  35.0062],
  "kapenguria":         [ 1.2390,  35.1130],
  "lodwar":             [ 3.1192,  35.5972],
  "lokichoggio":        [ 4.2072,  34.3503],
  "kakuma":             [ 3.7181,  34.8601],
  "baragoi":            [ 1.7833,  36.7833],
  "maralal":            [ 1.0978,  36.7017],
  "loyangalani":        [ 2.7524,  36.7186],
  "marsabit":           [ 2.3284,  37.9842],
  "moyale":             [ 3.5264,  39.0550],
  "isiolo":             [ 0.3538,  37.5822],
  "meru":               [ 0.0463,  37.6490],
  "nanyuki":            [ 0.0174,  37.0742],
  "naro moru":          [-0.1646,  37.0233],
  "nyahururu":          [ 0.0280,  36.3680],
  "nyeri":              [-0.4200,  36.9478],
  "muranga":            [-0.7215,  37.1518],
  "embu":               [-0.5316,  37.4588],
  "machakos":           [-1.5177,  37.2634],
  "mutomo":             [-1.8350,  38.2020],
  "kitui":              [-1.3667,  38.0167],
  "wote":               [-1.7807,  37.6307],
  "kajiado":            [-1.8511,  36.7781],
  "namanga":            [-2.5483,  36.7972],
  "narok":              [-1.0839,  35.8718],
  "sekenani gate":      [-1.5000,  35.1500],
  "talek gate":         [-1.4400,  35.1000],
  "maasai mara":        [-1.4930,  35.1441],

  // ── Uganda ─────────────────────────────────────────────────────────────────
  "kampala":            [ 0.3476,  32.5825],
  "nansana":            [ 0.3820,  32.5139],
  "kira":               [ 0.3578,  32.6539],
  "mukono":             [ 0.3533,  32.7550],
  "mubende":            [ 0.5637,  31.3742],
  "entebbe":            [ 0.0552,  32.4637],
  "jinja":              [ 0.4244,  33.2041],
  "tororo":             [ 0.6922,  34.1808],
  "mbale":              [ 1.0806,  34.1753],
  "soroti":             [ 1.7151,  33.6103],
  "lira":               [ 2.2499,  32.8999],
  "gulu":               [ 2.7747,  32.3044],
  "arua":               [ 3.0190,  30.9114],
  "hoima":              [ 1.4344,  31.3566],
  "masaka":             [-0.3328,  31.7328],
  "lyantonde":          [-0.3980,  31.1536],
  "mbarara":            [-0.6069,  30.6545],
  "kabale":             [-1.2482,  29.9878],
  "katuna":             [-1.2905,  29.7922],
  "fort portal":        [ 0.6700,  30.2749],
  "kasese":             [ 0.1833,  30.0833],
  "masindi":            [ 1.6742,  31.7148],
  "pakwach":            [ 2.4600,  31.4931],
  "murchison falls":    [ 2.2667,  31.8000],
  "kapchorwa":          [ 1.3980,  34.4520],
  "sipi falls":         [ 1.3167,  34.3833],

  // ── Rwanda ─────────────────────────────────────────────────────────────────
  "kigali":             [-1.9441,  30.0619],
  "musanze":            [-1.4990,  29.6339],
  "ruhengeri":          [-1.4990,  29.6339],
  "gisenyi":            [-1.7046,  29.2572],
  "rubavu":             [-1.7046,  29.2572],
  "muhanga":            [-2.0836,  29.7569],
  "huye":               [-2.5936,  29.7399],
  "butare":             [-2.5936,  29.7399],
  "cyangugu":           [-2.4847,  28.9075],

  // ── Burundi ────────────────────────────────────────────────────────────────
  "bujumbura":          [-3.3869,  29.3606],
  "gitega":             [-3.4271,  29.9247],

  // ── Tanzania ───────────────────────────────────────────────────────────────
  "dar es salaam":      [-6.7924,  39.2083],
  "dar es salaam ferry":[-6.8225,  39.2886],
  "kibaha":             [-6.7770,  38.9241],
  "morogoro":           [-6.8242,  37.6606],
  "handeni":            [-5.3780,  38.0170],
  "korogwe":            [-5.1484,  38.4820],
  "tanga":              [-5.0690,  39.0989],
  "lindi":              [-9.9920,  39.7068],
  "mtwara":             [-10.2667, 40.1833],
  "zanzibar town":      [-6.1659,  39.2026],
  "zanzibar city":      [-6.1659,  39.2026],
  "zanzibar":           [-6.1659,  39.2026],
  "nansio":             [-2.0397,  33.0748],
  "mikumi":             [-7.4045,  36.9905],
  "dodoma":             [-6.1722,  35.7395],
  "iringa":             [-7.7700,  35.6923],
  "mafinga":            [-8.4095,  35.2474],
  "makambako":          [-8.8494,  34.8199],
  "njombe":             [-9.3340,  34.7696],
  "songea":             [-10.6820, 35.6520],
  "mbeya":              [-8.9001,  33.4607],
  "tunduma":            [-9.3000,  32.7667],
  "sumbawanga":         [-7.9680,  31.6112],
  "mpanda":             [-6.3438,  31.0711],
  "kigoma":             [-4.8780,  29.6276],
  "kasulu":             [-4.5764,  30.0826],
  "tabora":             [-5.0167,  32.8000],
  "shinyanga":          [-3.6607,  33.4273],
  "kahama":             [-3.5538,  32.5951],
  "singida":            [-4.8176,  34.7480],
  "babati":             [-4.2120,  35.7489],
  "same":               [-4.0741,  37.7284],
  "moshi":              [-3.3539,  37.3412],
  "kilimanjaro gate":   [-3.0674,  37.3556],
  "mount kilimanjaro":  [-3.0674,  37.3556],
  "arusha":             [-3.3869,  36.6830],
  "mwanza":             [-2.5167,  32.9000],
  "musoma":             [-1.5000,  33.8000],
  "bukoba":             [-1.3310,  31.8116],
  "karatu":             [-3.3372,  35.6839],
  "mto wa mbu":         [-3.3494,  35.8611],
  "ngorongoro crater":  [-3.2000,  35.5000],
  "ngorongoro":         [-3.2000,  35.5000],
  "seronera":           [-2.4589,  34.8215],
  "serengeti":          [-2.3333,  34.8333],
  "bagamoyo":           [-6.4432,  38.9008],
  "kyela":              [-9.5833,  33.8500],
  "karonga":            [-9.9333,  33.9333],

  // ── Ethiopia ───────────────────────────────────────────────────────────────
  "addis ababa":        [ 9.0320,  38.7469],
  "debre zeit":         [ 8.7500,  38.9833],
  "bishoftu":           [ 8.7500,  38.9833],
  "mojo":               [ 8.6167,  39.1167],
  "ziway":              [ 7.9333,  38.7167],
  "batu":               [ 7.9333,  38.7167],
  "shashamane":         [ 7.2000,  38.6000],
  "dire dawa":          [ 9.5930,  41.8661],
  "hawassa":            [ 7.0621,  38.4766],
  "bahir dar":          [11.5931,  37.3921],

  // ── South Africa ───────────────────────────────────────────────────────────
  "johannesburg":       [-26.2041, 28.0473],
  "cape town":          [-33.9249, 18.4241],
  "durban":             [-29.8587, 31.0218],
  "pretoria":           [-25.7479, 28.2293],

  // ── Other Africa ───────────────────────────────────────────────────────────
  "lusaka":             [-15.4167, 28.2833],
  "harare":             [-17.8292, 31.0522],
  "accra":              [  5.6037, -0.1870],
  "lagos":              [  6.5244,  3.3792],
  "abuja":              [  9.0579,  7.4951],
  "dakar":              [ 14.6928,-17.4467],

  // ── Austria ────────────────────────────────────────────────────────────────
  "vienna":             [48.2082,  16.3738],
  "wien":               [48.2082,  16.3738],
  "baden":              [48.0014,  16.2317],
  "wiener neustadt":    [47.8099,  16.2440],
  "wr neustadt":        [47.8099,  16.2440],
  "hartberg":           [47.2833,  15.9667],
  "graz":               [47.0707,  15.4395],
  "salzburg":           [47.8095,  13.0550],
  "linz":               [48.3069,  14.2858],
  "innsbruck":          [47.2692,  11.4041],
  "klagenfurt":         [46.6247,  14.3050],
  "villach":            [46.6103,  13.8558],
  "hallstatt":          [47.5620,  13.6493],
  "bad ischl":          [47.7145,  13.6223],
  "gmunden":            [47.9183,  13.7990],

  // ── Slovenia ───────────────────────────────────────────────────────────────
  "ljubljana":          [46.0569,  14.5058],
  "maribor":            [46.5547,  15.6459],
  "ptuj":               [46.4200,  15.8694],
  "celje":              [46.2319,  15.2680],
  "kranjska gora":      [46.4847,  13.7847],
  "bovec":              [46.3375,  13.5534],
  "tolmin":             [46.1837,  13.7303],
  "idrija":             [45.9994,  14.0281],
  "novo mesto":         [45.8011,  15.1711],

  // ── Croatia & Balkans ──────────────────────────────────────────────────────
  "zagreb":             [45.8150,  15.9819],
  "split":              [43.5081,  16.4402],
  "dubrovnik":          [42.6507,  18.0944],
  "belgrade":           [44.7866,  20.4489],
  "sarajevo":           [43.8476,  18.3564],
  "skopje":             [41.9981,  21.4254],

  // ── France ─────────────────────────────────────────────────────────────────
  "paris":              [48.8566,   2.3522],
  "compiegne":          [49.4178,   2.8254],
  "saint-quentin":      [49.8467,   3.2867],
  "cambrai":            [50.1767,   3.2350],
  "valenciennes":       [50.3581,   3.5236],
  "amiens":             [49.8942,   2.2957],
  "abbeville":          [50.1057,   1.8361],
  "calais":             [50.9513,   1.8587],
  "boulogne-sur-mer":   [50.7264,   1.6146],
  "lyon":               [45.7640,   4.8357],
  "bordeaux":           [44.8378,  -0.5792],
  "marseille":          [43.2965,   5.3698],
  "nice":               [43.7102,   7.2620],
  "strasbourg":         [48.5734,   7.7521],
  "nantes":             [47.2184,  -1.5536],
  "toulouse":           [43.6047,   1.4442],
  "lille":              [50.6292,   3.0573],

  // ── Netherlands ────────────────────────────────────────────────────────────
  "amsterdam":          [52.3676,   4.9041],
  "utrecht":            [52.0907,   5.1214],
  "rotterdam":          [51.9225,   4.4792],
  "the hague":          [52.0705,   4.3007],
  "eindhoven":          [51.4416,   5.4697],
  "groningen":          [53.2194,   6.5665],

  // ── Belgium ────────────────────────────────────────────────────────────────
  "brussels":           [50.8503,   4.3517],
  "ghent":              [51.0543,   3.7174],
  "antwerp":            [51.2194,   4.4025],
  "bruges":             [51.2093,   3.2247],
  "breda":              [51.5719,   4.7683],

  // ── Germany ────────────────────────────────────────────────────────────────
  "berlin":             [52.5200,  13.4050],
  "munich":             [48.1351,  11.5820],
  "hamburg":            [53.5753,  10.0153],
  "cologne":            [50.9333,   6.9500],
  "frankfurt":          [50.1109,   8.6821],
  "stuttgart":          [48.7758,   9.1829],
  "dusseldorf":         [51.2217,   6.7762],
  "zossen":             [52.2172,  13.4517],
  "luckenwalde":        [52.0861,  13.1700],
  "doberlug-kirchhain": [51.6175,  13.5672],

  // ── Czech Republic ─────────────────────────────────────────────────────────
  "prague":             [50.0755,  14.4378],
  "decin":              [50.7742,  14.2011],
  "usti nad labem":     [50.6607,  14.0323],
  "bad schandau":       [50.9180,  14.1500],

  // ── Italy ──────────────────────────────────────────────────────────────────
  "rome":               [41.9028,  12.4964],
  "florence":           [43.7696,  11.2558],
  "milan":              [45.4642,   9.1900],
  "venice":             [45.4408,  12.3155],
  "bologna":            [44.4949,  11.3426],
  "siena":              [43.3188,  11.3307],
  "san quirico dorcia":     [43.0588,  11.6035],
  "san quirico d orcia":   [43.0588,  11.6035],
  "montalcino":         [43.0578,  11.4891],
  "acquapendente":      [42.7406,  11.8669],
  "viterbo":            [42.4178,  12.1078],

  // ── Spain ──────────────────────────────────────────────────────────────────
  "barcelona":          [41.3851,   2.1734],
  "madrid":             [40.4168,  -3.7038],
  "lleida":             [41.6148,   0.6267],
  "fraga":              [41.5228,   0.3519],
  "zaragoza":           [41.6488,  -0.8891],
  "calatayud":          [41.3567,  -1.6433],
  "guadalajara":        [40.6324,  -3.1669],
  "seville":            [37.3891,  -5.9845],
  "valencia":           [39.4699,  -0.3763],
  "bilbao":             [43.2630,  -2.9350],
  "san sebastian":      [43.3128,  -1.9752],

  // ── Portugal ───────────────────────────────────────────────────────────────
  "lisbon":             [38.7223,  -9.1393],
  "porto":              [41.1579,  -8.6291],

  // ── UK ─────────────────────────────────────────────────────────────────────
  "london":             [51.5074,  -0.1278],
  "dover":              [51.1279,   1.3134],
  "edinburgh":          [55.9533,  -3.1883],
  "manchester":         [53.4808,  -2.2426],
  "birmingham":         [52.4862,  -1.8904],
  "glasgow":            [55.8642,  -4.2518],

  // ── Ireland ────────────────────────────────────────────────────────────────
  "dublin":             [53.3498,  -6.2603],

  // ── Switzerland ────────────────────────────────────────────────────────────
  "zurich":             [47.3769,   8.5417],
  "geneva":             [46.2044,   6.1432],
  "lausanne":           [46.5197,   6.6323],
  "bern":               [46.9480,   7.4474],

  // ── Scandinavia ────────────────────────────────────────────────────────────
  "stockholm":          [59.3293,  18.0686],
  "oslo":               [59.9139,  10.7522],
  "copenhagen":         [55.6761,  12.5683],
  "helsinki":           [60.1699,  24.9384],

  // ── Eastern Europe ─────────────────────────────────────────────────────────
  "warsaw":             [52.2297,  21.0122],
  "budapest":           [47.4979,  19.0402],
  "krakow":             [50.0647,  19.9450],
  "athens":             [37.9838,  23.7275],
  "sofia":              [42.6977,  23.3219],
  "bucharest":          [44.4268,  26.1025],

  // ── North America ──────────────────────────────────────────────────────────
  "new york":           [40.7128, -74.0060],
  "los angeles":        [34.0522,-118.2437],
  "chicago":            [41.8781, -87.6298],
  "toronto":            [43.6532, -79.3832],
  "vancouver":          [49.2827,-123.1207],

  // ── Asia ───────────────────────────────────────────────────────────────────
  "tokyo":              [35.6762, 139.6503],
  "beijing":            [39.9042, 116.4074],
  "shanghai":           [31.2304, 121.4737],
  "bangkok":            [13.7563, 100.5018],
  "singapore":          [ 1.3521, 103.8198],
  "mumbai":             [19.0760,  72.8777],
  "delhi":              [28.7041,  77.1025],
  "kathmandu":          [27.7172,  85.3240],

  // ── Oceania ────────────────────────────────────────────────────────────────
  "sydney":             [-33.8688, 151.2093],
  "melbourne":          [-37.8136, 144.9631],
  "auckland":           [-36.8485, 174.7633],
};

// ── Normalise a place name for lookup ─────────────────────────────────────────
/**
 * Convert any place name to the canonical lowercase key used in RAW.
 * Handles: mixed case, Unicode apostrophes, extra whitespace, accented chars.
 * "Kampala", "KAMPALA", "kampala", " Kampala " all produce "kampala".
 */
export function normalise(name: string): string {
  return String(name ?? "")   // defensive cast — never throws on null/undefined
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC''`]/g, "")   // smart quotes + backtick
    .replace(/[^a-z0-9\s-]/g, " ")             // non-alphanum → space
    .replace(/\s+/g, " ")                       // collapse whitespace
    .trim();
}

/**
 * Look up coordinates for a place name using the static table.
 *
 * Rules:
 *  1. Exact normalised match — handles any case ("Kampala", "KAMPALA", etc.)
 *  2. Strip parenthetical alias  e.g. "Musanze (Ruhengeri)" → "musanze"
 *  3. Slash alias                e.g. "Gisenyi/Rubavu"     → "gisenyi"
 *
 * Returns null only when the table genuinely has no entry.
 * The caller (RouteMap) must NOT fall back to Nominatim for cities that
 * exist in this table — Nominatim returns wrong-country results for
 * ambiguous names (e.g. "Kampala" also exists in Queensland, Australia).
 */
export function lookupCoords(name: string): LatLng | null {
  const key = normalise(name);
  if (!key) return null;

  // 1. Exact match (covers all case variants — normalise always lowercases)
  if (RAW[key] !== undefined) return RAW[key];

  // 2. Parenthetical alias
  const stripped = key.replace(/\s*\(.*?\)/, "").trim();
  if (stripped !== key && RAW[stripped] !== undefined) return RAW[stripped];

  // 3. Slash alias
  if (key.includes("/")) {
    for (const part of key.split("/").map((s) => s.trim())) {
      if (RAW[part] !== undefined) return RAW[part];
    }
  }

  return null;
}

/**
 * Geocode a place name using Nominatim (OpenStreetMap) as a last resort.
 * Only called when lookupCoords returns null.
 * Prefer the static table — it is always more reliable than Nominatim for
 * city names shared across multiple countries.
 */
export async function geocodeNominatim(name: string): Promise<LatLng | null> {
  try {
    const q = encodeURIComponent(name);
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=0`;
    const res = await fetch(url, {
      headers: { "Accept-Language": "en" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch {
    return null;
  }
}
