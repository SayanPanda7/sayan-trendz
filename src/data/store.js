const jewelryShot = (query, sig, width = 900, height = 1200) =>
  `https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=${width}&auto=format&fit=crop`;
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const categoryBlueprints = [
  {
    category: 'Jhumkas',
    subcategory: 'Jhumkas',
    sizes: ['One Size'],
    basePrice: 1299,
    range: 950,
    keywords: [
      'indian jhumka earrings luxury jewellery',
      'kundan jhumka earrings close up',
      'pearl jhumka indian festive jewellery',
      'meenakari jhumka earrings product',
    ],
    materials: ['22K Gold Plated Alloy', 'Kundan & Pearl Work', 'Meenakari Finish', 'Hand-set Stones'],
    colors: ['Antique Gold', 'Pearl White', 'Ruby Red'],
    names: [
      'Aadhira Pearl Kundan Jhumkas',
      'Meher Lotus Meenakari Jhumkas',
      'Svara Temple Coin Jhumkas',
      'Ziya Chand Pearl Jhumkas',
      'Ira Mirror Festive Jhumkas',
      'Noor Antique Dome Jhumkas',
      'Ruhani Filigree Bell Jhumkas',
      'Tara Navratri Mirror Jhumkas',
      'Kiara Ruby Drop Jhumkas',
      'Mira Gota Pearl Jhumkas',
      'Eshani Polki Tassel Jhumkas',
      'Lavanya Bridal Pearl Jhumkas',
      'Aarohi Kundan Flare Jhumkas',
      'Sitara Statement Jhumkas',
    ],
  },
  {
    category: 'Oxidised Earrings',
    subcategory: 'Oxidised Earrings',
    sizes: ['One Size'],
    basePrice: 799,
    range: 750,
    keywords: [
      'oxidised silver earrings indian jewellery',
      'tribal oxidised earrings close up',
      'boho oxidised danglers jewelry',
      'oxidised earrings product photography',
    ],
    materials: ['Oxidised Silver Finish', 'German Silver Alloy', 'Coin Detail Work', 'Hand-carved Metal'],
    colors: ['Oxidised Silver', 'Charcoal', 'Antique Grey'],
    names: [
      'Tribal Moon Oxidised Earrings',
      'Lotus Coin Oxidised Danglers',
      'Vintage Peacock Oxidised Earrings',
      'Phool Patti Silver Drops',
      'Desert Mirror Oxidised Earrings',
      'Chand Tara Oxidised Danglers',
      'Nomad Bell Silver Earrings',
      'Rustic Temple Oxidised Earrings',
      'Boho Layered Coin Drops',
      'Noor Afghani Oxidised Earrings',
      'Jalsa Silver Charm Earrings',
      'Raahi Engraved Oxidised Earrings',
      'Falak Crescent Silver Drops',
      'Sahiba Tribal Tassel Earrings',
    ],
  },
  {
    category: 'Necklaces',
    subcategory: 'Necklaces & Pearl Sets',
    sizes: ['One Size'],
    basePrice: 1899,
    range: 2600,
    keywords: [
      'indian necklace set jewellery luxury',
      'pearl choker necklace set product',
      'kundan necklace jewellery close up',
      'bridal necklace set indian jewellery',
    ],
    materials: ['Kundan Setting', 'Baroque Pearls', 'Polki Stones', 'Gold Tone Alloy'],
    colors: ['Champagne Gold', 'Pearl White', 'Emerald Green'],
    names: [
      'Anaya Pearl Choker Necklace Set',
      'Rajwadi Kundan Necklace',
      'Mogra Layered Pearl Set',
      'Emerald Polki Necklace Set',
      'Gulnaar Temple Necklace',
      'Ivory Drop Bridal Necklace',
      'Noor Statement Collar Necklace',
      'Tvastra Pearl Cascade Necklace',
      'Maharani Festive Necklace Set',
      'Leher Coin Charm Necklace',
      'Dhwani Minimal Pendant Necklace',
      'Sia Baroque Pearl Collar Set',
      'Zariya Double Layer Kundan Set',
      'Taraani Pearl Rani Haar',
    ],
  },
  {
    category: 'Rings',
    subcategory: 'Rings',
    sizes: ['6', '7', '8'],
    basePrice: 599,
    range: 950,
    keywords: [
      'indian statement ring jewellery product',
      'adjustable kundan ring close up',
      'pearl cocktail ring jewellery',
      'bridal ring product photography',
    ],
    materials: ['Adjustable Alloy Base', 'Kundan Stone Setting', 'Pearl Embellishment', 'Gold Tone Finish'],
    colors: ['Antique Gold', 'Pearl White', 'Rose Gold'],
    names: [
      'Ava Floral Kundan Ring',
      'Misha Pearl Cocktail Ring',
      'Noor Adjustable Polki Ring',
      'Jiya Lotus Statement Ring',
      'Rhea Mirror Festive Ring',
      'Eira Emerald Accent Ring',
      'Aroha Temple Ring',
      'Kiara Bridal Cluster Ring',
      'Suhana Meenakari Ring',
      'Maya Open Cuff Ring',
      'Meher Crystal Bloom Ring',
      'Inaya Pearl Drop Ring',
    ],
  },
  {
    category: 'Bangles',
    subcategory: 'Bangles & Kadas',
    sizes: ['2.4', '2.6', '2.8'],
    basePrice: 1299,
    range: 2200,
    keywords: [
      'indian bangles jewellery product',
      'kundan bangles set close up',
      'bridal kada bangles luxury',
      'gold bangles product photography',
    ],
    materials: ['Gold Tone Alloy', 'Kundan Detailing', 'Pearl Handwork', 'Stone Stud Finish'],
    colors: ['Gold', 'Pearl White', 'Ruby Red'],
    names: [
      'Aabha Kundan Bangle Stack',
      'Riva Pearl Kada Set',
      'Noor Bridal Stone Bangles',
      'Sitara Textured Gold Bangles',
      'Anika Temple Kada Pair',
      'Myra Meenakari Bangle Set',
      'Ishaani Pearl Line Bangles',
      'Abeer Festive Kada Stack',
      'Taraani Mirror Stone Bangles',
      'Sana Antique Gold Bangles',
      'Ruhi Wedding Kada Duo',
      'Zeenat Deluxe Bangle Set',
    ],
  },
  {
    category: 'Bridal Collection',
    subcategory: 'Bridal Collection',
    sizes: ['One Size'],
    basePrice: 4999,
    range: 6200,
    keywords: [
      'indian bridal jewellery set luxury',
      'kundan bridal necklace set product',
      'bridal jewelry indian wedding close up',
      'polki bridal jewellery photography',
    ],
    materials: ['Premium Polki Finish', 'Kundan & Pearl Work', 'Statement Stone Setting', 'Bridal Gold Tone Alloy'],
    colors: ['Royal Gold', 'Pearl White', 'Emerald Green'],
    names: [
      'Maharani Polki Bridal Set',
      'Saanjh Kundan Bridal Necklace Set',
      'Rajlaxmi Pearl Bridal Combo',
      'Noor Mahal Wedding Choker Set',
      'Heer Rani Haar Bridal Set',
      'Ameera Bridal Matha Patti Combo',
      'Veda Wedding Polki Layer Set',
      'Jannat Bridal Pearl Choker Set',
      'Sitara Rajwadi Bridal Ensemble',
      'Anvika Wedding Heritage Set',
      'Meher Bridal Jadau Collection',
      'Noorani Dulhan Statement Set',
      'Eshaal Luxury Bridal Combo',
      'Zarqaa Pearl Polki Bridal Set',
    ],
  },
  {
    category: 'Korean Jewelry',
    subcategory: 'Korean Jewelry & Anklets',
    sizes: ['One Size'],
    basePrice: 499,
    range: 900,
    keywords: [
      'korean jewelry minimal gold product',
      'korean pearl earrings jewelry close up',
      'minimal anklet jewelry product',
      'cute korean necklace bracelet set',
    ],
    materials: ['18K Gold Tone Finish', 'Minimal Alloy Base', 'Pearl Accent', 'Stainless Steel Chain'],
    colors: ['Soft Gold', 'Pearl White', 'Blush Rose'],
    names: [
      'Luna Bow Korean Earrings',
      'Miso Heart Charm Necklace',
      'Yuri Pearl Drop Earrings',
      'Sora Butterfly Anklet',
      'Hana Layered Chain Bracelet',
      'Nari Crystal Bow Ring',
      'Eun Clover Pendant Necklace',
      'Mina Star Drop Earrings',
      'Jia Pearl Anklet Duo',
      'Ara Minimal Hoop Set',
      'Seo Ribbon Charm Bracelet',
      'Nabi Heart Pearl Set',
    ],
  },
  {
    category: 'Gift Boxes',
    subcategory: 'Gift Boxes & Combo Sets',
    sizes: ['One Size'],
    basePrice: 1699,
    range: 3200,
    keywords: [
      'jewelry gift box luxury product',
      'festive jewellery hamper gift box',
      'bridal jewelry gift box product',
      'premium accessories gift set flatlay',
    ],
    materials: ['Curated Multi-piece Set', 'Velvet Box Packaging', 'Premium Gifting Sleeve', 'Mixed Finish Jewellery'],
    colors: ['Champagne Gold', 'Velvet Beige', 'Midnight Black'],
    names: [
      'Saanvi Festive Gift Box',
      'Pearl Muse Jewelry Gift Set',
      'Bridal Glow Gift Hamper',
      'Classic Gold Combo Box',
      'Korean Charm Gift Box',
      'Sisterhood Luxe Gifting Set',
      'Wedding Guest Jewelry Box',
      'Celebration Essentials Gift Set',
      'Noor Premium Combo Gift Box',
      'Festive Sparkle Jewelry Trunk',
    ],
  },
];

const badgeFromTags = (tags) => {
  if (tags.includes('bestSeller')) {
    return 'Best Seller';
  }

  if (tags.includes('newArrival')) {
    return 'New';
  }

  if (tags.includes('limited')) {
    return 'Limited Edition';
  }

  return 'Trending';
};

const sizesByCategory = {
  Rings: ['6', '7', '8'],
  Bangles: ['2.4', '2.6', '2.8'],
};

const buildGallery = (query, seed) => [
  jewelryShot(`${query}, luxury indian jewellery product`, seed),
  jewelryShot(`${query}, closeup jewellery shot`, seed + 80),
  jewelryShot(`${query}, styled flatlay`, seed + 160),
  jewelryShot(`${query}, fashion accessories editorial`, seed + 240),
];

const buildTags = (category, index) => {
  const tags = ['recommended'];

  if (index % 2 === 0) {
    tags.push('trending');
  }

  if (index % 3 === 0) {
    tags.push('newArrival');
  }

  if (index % 4 === 0) {
    tags.push('bestSeller');
  }

  if (index % 5 === 0) {
    tags.push('limited');
  }

  if (['Jhumkas', 'Oxidised Earrings', 'Necklaces', 'Bridal Collection', 'Gift Boxes'].includes(category)) {
    tags.push('festival');
  }

  if (category === 'Bridal Collection') {
    tags.push('bridal', 'premium');
  }

  if (category === 'Korean Jewelry') {
    tags.push('korean');
  }

  if (category === 'Gift Boxes') {
    tags.push('giftSet');
  }

  return [...new Set(tags)];
};

export const products = categoryBlueprints.flatMap((blueprint, blueprintIndex) =>
  blueprint.names.map((name, index) => {
    const id = blueprintIndex * 100 + index + 1;
    const price = blueprint.basePrice + ((index * 173 + blueprintIndex * 91) % blueprint.range);
    const oldPrice = price + 300 + ((index * 131 + blueprintIndex * 67) % Math.max(Math.floor(blueprint.range * 0.8), 400));
    const rating = Number((4.4 + ((index + blueprintIndex) % 6) * 0.1).toFixed(1));
    const reviewsCount = 48 + ((index * 29 + blueprintIndex * 17) % 280);
    const tags = buildTags(blueprint.category, index);
    const badge = badgeFromTags(tags);
    const gallery = buildGallery(blueprint.keywords[index % blueprint.keywords.length], id + 30);
    const material = blueprint.materials[index % blueprint.materials.length];
    const sizes = sizesByCategory[blueprint.category] || blueprint.sizes;
    const isGiftBox = blueprint.category === 'Gift Boxes';

    return {
      id,
      _id: `fallback-${id}`,
      name,
      title: name,
      slug: slugify(name),
      sku: `STJ-${String(id).padStart(4, '0')}`,
      price,
      salePrice: price,
      oldPrice,
      mrp: oldPrice,
      category: blueprint.category,
      subcategory: blueprint.subcategory,
      description: `${name} is designed with ${material.toLowerCase()} and a refined feminine finish that feels premium, gift-worthy, and occasion-ready for Indian festive and bridal styling.`,
      shortDescription: `Luxury ${blueprint.category.toLowerCase()} with premium detailing and polished gifting appeal.`,
      material,
      fabric: material,
      rating,
      reviewsCount,
      reviews: reviewsCount,
      badge,
      status: 'active',
      tags,
      collections: [blueprint.category, ...tags],
      images: gallery,
      primaryImage: gallery[0],
      secondaryImage: gallery[1],
      sizes,
      colorways: blueprint.colors,
      features: [
        `${material} for a polished luxury finish`,
        'Lightweight enough for festive day-to-evening styling',
        isGiftBox ? 'Presented in premium gifting-ready packaging' : 'Boutique-inspired detailing for elevated occasions',
      ],
      details: [
        `${material} crafted for a premium look and comfortable wear`,
        isGiftBox ? 'Curated multi-piece box suitable for gifting and special occasions' : 'Designed to pair beautifully with sarees, lehengas, kurtas, and fusion outfits',
        'Finished with smooth edges, rich shine, and elevated boutique presentation',
      ],
      washCare: [
        'Store in a dry zip pouch or box',
        'Avoid perfumes, water, and harsh sprays',
        'Wipe gently with a soft cloth after use',
      ],
      shipping: ['Free shipping on prepaid orders', 'Fast dispatch in 24-48 hours', '7-day easy return on eligible styles'],
      offers: ['Flat 10% OFF on first order', 'Extra 5% OFF on prepaid checkout', 'Festive combo savings on selected styles'],
      inventory: {
        total: 6 + ((id * 7) % 18),
        lowStockThreshold: 8,
        sizes: sizes.map((size, sizeIndex) => ({
          label: size,
          stock: Math.max(2, 2 + ((id + sizeIndex * 3) % 8)),
        })),
      },
      metrics: {
        totalSold: 15 + ((id * 11) % 140),
        views: 120 + ((id * 43) % 1400),
        wishlisted: 8 + ((id * 5) % 120),
      },
      emi: price >= 1999 ? `EMI from ₹${Math.max(99, Math.round(price / 6))}/month` : 'Prepaid offers available at checkout',
      stockLabel: tags.includes('limited') ? 'Limited pieces left in stock' : 'Ready to ship within 24 hours',
    };
  }),
);

export const announcements = ['Free Shipping Across India', 'Festive Jewelry Sale Live', 'Flat 50% OFF On Select Styles', 'New Luxe Drops Every Friday'];

export const navLinks = [
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'Trending', href: '#trending-now' },
  { label: 'Bridal Collection', href: '#bridal-collection' },
  { label: 'Gift Boxes', href: '#gift-boxes' },
  { label: 'Korean Jewelry', href: '#korean-edit' },
];

export const heroSlides = [
  {
    id: 'bridal-luxe',
    image: products.find((product) => product.category === 'Bridal Collection')?.images[0],
    eyebrow: 'Luxury Bridal Jewelry',
    title: 'Grand Bridal Sparkle For The Modern Indian Celebration',
    description:
      'Discover premium bridal sets, polki chokers, pearl layers, and heirloom-inspired statement pieces with elevated feminine styling.',
    badge: 'Bridal Luxe Event',
  },
  {
    id: 'festive-edit',
    image: products.find((product) => product.category === 'Jhumkas')?.images[2],
    eyebrow: 'Festive Edit',
    title: 'Statement Jhumkas, Necklaces And Gift-Worthy Jewelry Drops',
    description:
      'From temple-finish jhumkas to pearl chokers and curated gift boxes, shop jewelry that feels rich, celebratory, and original.',
    badge: 'Festival Collection Live',
  },
  {
    id: 'daily-luxe',
    image: products.find((product) => product.category === 'Korean Jewelry')?.images[1],
    eyebrow: 'Everyday Premium',
    title: 'Minimal Korean Jewelry Meets Indian Luxe Styling',
    description:
      'A fresh, premium mix of bow earrings, anklets, delicate chains, and modern gifting pieces for daily elegance.',
    badge: 'New Jewelry Drop',
  },
];

const categoryCount = (category) => `${products.filter((product) => product.category === category).length} Styles`;
const tagCount = (tag) => `${products.filter((product) => product.tags.includes(tag)).length} Picks`;

export const categories = [
  { title: 'Jhumkas', image: products.find((product) => product.category === 'Jhumkas')?.images[0], count: categoryCount('Jhumkas') },
  { title: 'Oxidised Earrings', image: products.find((product) => product.category === 'Oxidised Earrings')?.images[0], count: categoryCount('Oxidised Earrings') },
  { title: 'Necklaces', image: products.find((product) => product.category === 'Necklaces')?.images[0], count: categoryCount('Necklaces') },
  { title: 'Rings', image: products.find((product) => product.category === 'Rings')?.images[0], count: categoryCount('Rings') },
  { title: 'Bangles', image: products.find((product) => product.category === 'Bangles')?.images[0], count: categoryCount('Bangles') },
  { title: 'Bridal Collection', image: products.find((product) => product.category === 'Bridal Collection')?.images[0], count: categoryCount('Bridal Collection') },
  { title: 'Korean Jewelry', image: products.find((product) => product.category === 'Korean Jewelry')?.images[0], count: categoryCount('Korean Jewelry') },
  { title: 'Gift Boxes', image: products.find((product) => product.category === 'Gift Boxes')?.images[0], count: categoryCount('Gift Boxes') },
  { title: 'New Arrivals', image: products.find((product) => product.tags.includes('newArrival'))?.images[0], count: tagCount('newArrival') },
  { title: 'Best Sellers', image: products.find((product) => product.tags.includes('bestSeller'))?.images[0], count: tagCount('bestSeller') },
];

export const collectionConfigs = [
  {
    id: 'best-sellers',
    title: 'Best Sellers',
    subtitle: 'Customer-loved earrings, necklace sets, rings, and bangles with strong boutique appeal.',
    tag: 'bestSeller',
  },
  {
    id: 'new-arrivals',
    title: 'New Arrivals',
    subtitle: 'Fresh jewelry drops for festive gifting, bridal sparkle, and elevated everyday accessorising.',
    tag: 'newArrival',
  },
  {
    id: 'trending-now',
    title: 'Trending Products',
    subtitle: 'Premium social-first styles inspired by modern Indian jewelry boutiques and festive edits.',
    tag: 'trending',
  },
  {
    id: 'festival-collection',
    title: 'Festival Collection',
    subtitle: 'Statement jhumkas, festive necklace sets, and celebration-ready sparkle for every Indian occasion.',
    tag: 'festival',
  },
  {
    id: 'bridal-collection',
    title: 'Bridal Collection',
    subtitle: 'Heirloom-inspired bridal jewelry with rich polki, pearls, and regal gold-toned finishing.',
    tag: 'bridal',
  },
  {
    id: 'korean-edit',
    title: 'Korean Jewelry',
    subtitle: 'Minimal charm chains, pearl bows, and modern anklets with a luxe Korean-inspired finish.',
    tag: 'korean',
  },
  {
    id: 'gift-boxes',
    title: 'Combo Gift Boxes',
    subtitle: 'Elegant gifting sets curated for birthdays, bridesmaids, festive hampers, and premium celebration gifting.',
    tag: 'giftSet',
  },
  {
    id: 'limited-stock',
    title: 'Limited Edition',
    subtitle: 'Small-batch statement pieces and occasion styles that won’t stay in stock for long.',
    tag: 'limited',
  },
  {
    id: 'recommended-for-you',
    title: 'Recommended For You',
    subtitle: 'Personalized jewelry picks based on what shoppers are saving, gifting, and styling right now.',
    tag: 'recommended',
  },
];

export const customerReviews = [
  {
    name: 'Ishita B.',
    city: 'Kolkata',
    title: 'Looks like premium boutique jewelry',
    body: 'The pearl necklace set arrived beautifully packed and the shine feels far more premium than the price. It photographed beautifully for my event.',
    rating: 5,
    image: products.find((product) => product.category === 'Necklaces')?.images[1],
    verified: true,
  },
  {
    name: 'Rupali K.',
    city: 'Mumbai',
    title: 'Perfect festive earrings',
    body: 'My jhumkas looked rich, lightweight, and festive without feeling overdone. They matched both my saree and my lehenga effortlessly.',
    rating: 5,
    image: products.find((product) => product.category === 'Jhumkas')?.images[2],
    verified: true,
  },
  {
    name: 'Sana R.',
    city: 'Delhi',
    title: 'Bridal collection feels luxurious',
    body: 'The bridal set had a polished finish, strong clasp quality, and a beautiful premium look in person. It elevated my full wedding guest outfit.',
    rating: 5,
    image: products.find((product) => product.category === 'Bridal Collection')?.images[1],
    verified: true,
  },
  {
    name: 'Megha T.',
    city: 'Bengaluru',
    title: 'Gift box was a hit',
    body: 'I ordered a combo gift box for a friend and the packaging plus jewelry selection felt truly gift-worthy. It looked chic and expensive.',
    rating: 4,
    image: products.find((product) => product.category === 'Gift Boxes')?.images[1],
    verified: true,
  },
];

export const ratingBreakdown = [
  { label: '5 Star', value: 84 },
  { label: '4 Star', value: 11 },
  { label: '3 Star', value: 3 },
  { label: '2 Star', value: 1 },
  { label: '1 Star', value: 1 },
];

export const instagramFeed = [
  { id: 'insta-1', image: products.find((product) => product.category === 'Jhumkas')?.images[1], caption: 'Festive jhumka styling' },
  { id: 'insta-2', image: products.find((product) => product.category === 'Necklaces')?.images[2], caption: 'Pearl and gold moodboard' },
  { id: 'insta-3', image: products.find((product) => product.category === 'Bridal Collection')?.images[2], caption: 'Bridal sparkle edit' },
  { id: 'insta-4', image: products.find((product) => product.category === 'Korean Jewelry')?.images[2], caption: 'Soft minimal luxe' },
  { id: 'insta-5', image: products.find((product) => product.category === 'Bangles')?.images[2], caption: 'Stacked gold moments' },
  { id: 'insta-6', image: products.find((product) => product.category === 'Gift Boxes')?.images[2], caption: 'Gifting season ready' },
];

export const recentPurchaseNotifications = [
  `Ankita from Pune just purchased ${products[0].title}`,
  `Riya from Jaipur added ${products[22].title} to her jewelry cart`,
  `Priyanka from Surat just checked out ${products[55].title}`,
  `Madhuri from Hyderabad bought ${products[71].title}`,
  `Sneha from Kolkata grabbed ${products[95].title}`,
];

export const serviceHighlights = [
  {
    title: 'Premium Finishing',
    description: 'Luxury-tone metalwork, polished stone setting, and feminine boutique-level detailing.',
  },
  {
    title: 'Gift-Ready Packaging',
    description: 'Elegant presentation that feels elevated for bridal gifting, festive moments, and special occasions.',
  },
  {
    title: 'Fast Dispatch',
    description: 'Prepaid free shipping, quick handling, and smooth support for last-minute festive styling.',
  },
];

export const saleDeadline = '2026-05-01T23:59:59+05:30';

export const sizeChart = [
  { size: 'Adjustable', ring: 'Fits 6-8', bangle: 'Openable cuffs', notes: 'Best for rings, cuffs, and flexible styles' },
  { size: 'Small', ring: '6', bangle: '2.4', notes: 'Ideal for slimmer wrists and compact ring fits' },
  { size: 'Medium', ring: '7', bangle: '2.6', notes: 'Most common fit across statement jewelry' },
  { size: 'Large', ring: '8', bangle: '2.8', notes: 'Recommended for roomy or stacked styling' },
];

export const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export const getCollectionProducts = (tag) => products.filter((product) => product.tags.includes(tag)).slice(0, 10);

export const getProductBySlug = (slug) => products.find((product) => product.slug === slug);

export const getRelatedProducts = (product) =>
  products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category === product.category || item.tags.some((tag) => product.tags.includes(tag))),
    )
    .slice(0, 10);
