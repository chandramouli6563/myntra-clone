export interface Category {
  id: string;
  name: string;
  image: string;
  url: string;
}

export const categories: Category[] = [
  {
    id: 'men',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800&auto=format&fit=crop',
    url: '/category/men'
  },
  {
    id: 'women',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
    url: '/category/women'
  },
  {
    id: 'kids',
    name: 'Kids',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop',
    url: '/category/kids'
  },
  {
    id: 'footwear',
    name: 'Footwear',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop',
    url: '/category/footwear'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800&auto=format&fit=crop',
    url: '/category/accessories'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    url: '/category/beauty'
  }
];

export interface TrendingCollection {
  id: string;
  title: string;
  image: string;
  cta: string;
  url: string;
}

export const trendingCollections: TrendingCollection[] = [
  {
    id: 'summer',
    title: 'Summer Essentials',
    image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?q=80&w=1200&auto=format&fit=crop',
    cta: 'Shop Now',
    url: '/category/summer-essentials'
  },
  {
    id: 'activewear',
    title: 'Active Lifestyle',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    cta: 'Shop Now',
    url: '/category/activewear'
  },
  {
    id: 'formal',
    title: 'Formal Collection',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    cta: 'Shop Now',
    url: '/category/formal'
  },
  {
    id: 'ethnic',
    title: 'Ethnic Wear',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    cta: 'Shop Now',
    url: '/category/ethnic'
  }
];

export interface Brand {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export const topBrands: Brand[] = [
  {
    id: 'nike',
    name: 'Nike',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    url: '/category/all?brand=nike'
  },
  {
    id: 'puma',
    name: 'Puma',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Puma_logo.svg',
    url: '/category/all?brand=puma'
  },
  {
    id: 'hm',
    name: 'H&M',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg',
    url: '/category/all?brand=hm'
  },
  {
    id: 'levis',
    name: "Levi's",
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Levi%27s_logo.svg',
    url: '/category/all?brand=levis'
  },
  {
    id: 'adidas',
    name: 'Adidas',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    url: '/category/all?brand=adidas'
  },
  {
    id: 'zara',
    name: 'Zara',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg',
    url: '/category/all?brand=zara'
  }
];

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  url: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide1',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop',
    title: 'New Season Arrivals',
    subtitle: 'Discover the latest trends in fashion',
    cta: 'Explore Collection',
    url: '/category/new-arrivals'
  },
  {
    id: 'slide2',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop',
    title: 'Exclusive Sale',
    subtitle: 'Up to 50% off on selected items',
    cta: 'Shop Sale',
    url: '/category/sale'
  },
  {
    id: 'slide3',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop',
    title: 'Premium Collection',
    subtitle: 'Luxury fashion for the modern wardrobe',
    cta: 'View Premium',
    url: '/category/premium'
  }
];

export interface ShopCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  url: string;
  badge?: string;
}

export const shopSaleCards: ShopCard[] = [
  {
    id: 'sale-men',
    title: 'Men\'s Sale',
    subtitle: 'Up to 70% OFF',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1200&auto=format&fit=crop',
    url: '/category/men?sale=true',
    badge: '70% OFF'
  },
  {
    id: 'sale-women',
    title: 'Women\'s Sale',
    subtitle: 'Up to 60% OFF',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    url: '/category/women?sale=true',
    badge: '60% OFF'
  },
  {
    id: 'sale-kids',
    title: 'Kids Sale',
    subtitle: 'Up to 50% OFF',
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e3?q=80&w=1200&auto=format&fit=crop',
    url: '/category/kids?sale=true',
    badge: '50% OFF'
  },
  {
    id: 'sale-footwear',
    title: 'Footwear Sale',
    subtitle: 'Up to 65% OFF',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
    url: '/category/footwear?sale=true',
    badge: '65% OFF'
  }
];

export const newArrivals: ShopCard[] = [
  {
    id: 'new-streetwear',
    title: 'Streetwear',
    subtitle: 'Latest Urban Fashion',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    url: '/category/streetwear',
    badge: 'NEW'
  },
  {
    id: 'new-athleisure',
    title: 'Athleisure',
    subtitle: 'Sport Meets Style',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    url: '/category/athleisure',
    badge: 'NEW'
  },
  {
    id: 'new-formal',
    title: 'Formal Wear',
    subtitle: 'Office Ready',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200&auto=format&fit=crop',
    url: '/category/formal',
    badge: 'NEW'
  },
  {
    id: 'new-accessories',
    title: 'Accessories',
    subtitle: 'Complete Your Look',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1200&auto=format&fit=crop',
    url: '/category/accessories',
    badge: 'NEW'
  }
];
