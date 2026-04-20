/**
 * Electrofik - Product Database
 * Comparative application for electronic products
 */

const products = [
  {
    id: 1,
    name: "Samsung Galaxy S24",
    category: "smartphone",
    brand: "Samsung",
    price: 899,
    image: "📱",
    specs: {
      "Pantalla": "6.2\" AMOLED 120Hz",
      "Procesador": "Exynos 2400 / Snapdragon 8 Gen 3",
      "RAM": "8 GB",
      "Almacenamiento": "256 GB",
      "Cámara principal": "50 MP",
      "Batería": "4000 mAh",
      "Sistema Operativo": "Android 14",
      "5G": "Sí",
      "Peso": "167 g"
    },
    rating: 4.5,
    reviews: 2341
  },
  {
    id: 2,
    name: "iPhone 15",
    category: "smartphone",
    brand: "Apple",
    price: 999,
    image: "📱",
    specs: {
      "Pantalla": "6.1\" Super Retina XDR OLED",
      "Procesador": "Apple A16 Bionic",
      "RAM": "6 GB",
      "Almacenamiento": "128 GB",
      "Cámara principal": "48 MP",
      "Batería": "3279 mAh",
      "Sistema Operativo": "iOS 17",
      "5G": "Sí",
      "Peso": "171 g"
    },
    rating: 4.7,
    reviews: 4102
  },
  {
    id: 3,
    name: "Xiaomi 14",
    category: "smartphone",
    brand: "Xiaomi",
    price: 799,
    image: "📱",
    specs: {
      "Pantalla": "6.36\" AMOLED 120Hz",
      "Procesador": "Snapdragon 8 Gen 3",
      "RAM": "12 GB",
      "Almacenamiento": "256 GB",
      "Cámara principal": "50 MP",
      "Batería": "4610 mAh",
      "Sistema Operativo": "Android 14",
      "5G": "Sí",
      "Peso": "193 g"
    },
    rating: 4.4,
    reviews: 1876
  },
  {
    id: 4,
    name: "MacBook Air M2",
    category: "laptop",
    brand: "Apple",
    price: 1299,
    image: "💻",
    specs: {
      "Pantalla": "13.6\" Liquid Retina",
      "Procesador": "Apple M2",
      "RAM": "8 GB",
      "Almacenamiento": "256 GB SSD",
      "Tarjeta gráfica": "GPU 8 núcleos",
      "Batería": "52.6 Wh",
      "Sistema Operativo": "macOS",
      "Peso": "1.24 kg",
      "Puertos": "2x USB-C, MagSafe"
    },
    rating: 4.8,
    reviews: 3210
  },
  {
    id: 5,
    name: "Dell XPS 13",
    category: "laptop",
    brand: "Dell",
    price: 1149,
    image: "💻",
    specs: {
      "Pantalla": "13.4\" OLED Touch",
      "Procesador": "Intel Core i7-1360P",
      "RAM": "16 GB",
      "Almacenamiento": "512 GB SSD",
      "Tarjeta gráfica": "Intel Iris Xe",
      "Batería": "55 Wh",
      "Sistema Operativo": "Windows 11",
      "Peso": "1.2 kg",
      "Puertos": "2x Thunderbolt 4"
    },
    rating: 4.3,
    reviews: 1654
  },
  {
    id: 6,
    name: "Lenovo ThinkPad X1 Carbon",
    category: "laptop",
    brand: "Lenovo",
    price: 1599,
    image: "💻",
    specs: {
      "Pantalla": "14\" IPS 2.8K",
      "Procesador": "Intel Core i7-1365U",
      "RAM": "16 GB",
      "Almacenamiento": "512 GB SSD",
      "Tarjeta gráfica": "Intel Iris Xe",
      "Batería": "57 Wh",
      "Sistema Operativo": "Windows 11 Pro",
      "Peso": "1.12 kg",
      "Puertos": "2x Thunderbolt 4, 2x USB-A"
    },
    rating: 4.6,
    reviews: 987
  },
  {
    id: 7,
    name: "Sony WH-1000XM5",
    category: "auriculares",
    brand: "Sony",
    price: 349,
    image: "🎧",
    specs: {
      "Tipo": "Over-ear inalámbrico",
      "Cancelación de ruido": "ANC adaptativo",
      "Autonomía": "30 horas",
      "Carga rápida": "3 min → 3h",
      "Códec": "LDAC, SBC, AAC",
      "Drivers": "30 mm",
      "Micrófono": "8 micrófonos",
      "Peso": "250 g",
      "Conectividad": "Bluetooth 5.2"
    },
    rating: 4.8,
    reviews: 5621
  },
  {
    id: 8,
    name: "Bose QuietComfort 45",
    category: "auriculares",
    brand: "Bose",
    price: 329,
    image: "🎧",
    specs: {
      "Tipo": "Over-ear inalámbrico",
      "Cancelación de ruido": "ANC + modo Aware",
      "Autonomía": "24 horas",
      "Carga rápida": "15 min → 3h",
      "Códec": "SBC, AAC",
      "Drivers": "40 mm",
      "Micrófono": "4 micrófonos",
      "Peso": "238 g",
      "Conectividad": "Bluetooth 5.1"
    },
    rating: 4.6,
    reviews: 3890
  },
  {
    id: 9,
    name: "Samsung 65\" QLED 4K",
    category: "tv",
    brand: "Samsung",
    price: 1199,
    image: "📺",
    specs: {
      "Tamaño": "65 pulgadas",
      "Resolución": "4K UHD (3840×2160)",
      "Panel": "QLED",
      "HDR": "HDR10+",
      "Tasa de refresco": "120 Hz",
      "Smart TV": "Tizen OS",
      "HDMI": "4x HDMI 2.1",
      "Procesador": "Neo Quantum Lite 4K",
      "Sonido": "60W 4.0ch"
    },
    rating: 4.5,
    reviews: 2108
  },
  {
    id: 10,
    name: "LG C3 OLED 65\"",
    category: "tv",
    brand: "LG",
    price: 1799,
    image: "📺",
    specs: {
      "Tamaño": "65 pulgadas",
      "Resolución": "4K UHD (3840×2160)",
      "Panel": "OLED evo",
      "HDR": "Dolby Vision IQ, HDR10",
      "Tasa de refresco": "120 Hz",
      "Smart TV": "webOS 23",
      "HDMI": "4x HDMI 2.1",
      "Procesador": "α9 Gen6 AI 4K",
      "Sonido": "60W 2.2ch Dolby Atmos"
    },
    rating: 4.9,
    reviews: 3456
  }
];

const categories = [
  { id: "all", label: "Todos", icon: "🔌" },
  { id: "smartphone", label: "Smartphones", icon: "📱" },
  { id: "laptop", label: "Laptops", icon: "💻" },
  { id: "auriculares", label: "Auriculares", icon: "🎧" },
  { id: "tv", label: "Televisores", icon: "📺" }
];
