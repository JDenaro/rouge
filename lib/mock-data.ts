const CDN = 'https://acdn-us.mitiendanube.com/stores/004/099/592'

export const categories = [
  {
    slug: 'sets',
    label: 'Sets',
    description: '3 y 4 piezas',
    image: `${CDN}/categories/sets-1920-1920.webp?w=480`,
  },
  {
    slug: 'baby-doll',
    label: 'Baby Doll',
    description: 'Romántico y sensual',
    image: `${CDN}/categories/baby-doll-1920-1920.webp?w=480`,
  },
  {
    slug: 'body',
    label: 'Body',
    description: 'Para usar bajo o sobre',
    image: `${CDN}/categories/body-1920-1920.webp?w=480`,
  },
  {
    slug: 'bata',
    label: 'Bata',
    description: 'Salida ligera',
    image: `${CDN}/categories/bata-1920-1920.webp?w=480`,
  },
  {
    slug: 'corsets',
    label: 'Corsets',
    description: 'Estructura y forma',
    image: `${CDN}/categories/corsets-1920-1920.webp?w=480`,
  },
  {
    slug: 'pijamas',
    label: 'Pijamas',
    description: 'Confort a medida',
    image: `${CDN}/categories/pijamas-1920-1920.webp?w=480`,
  },
  {
    slug: 'disfraces',
    label: 'Disfraces',
    description: 'Fantasía y juego',
    image: `${CDN}/categories/disfraces-1920-1920.webp?w=480`,
  },
  {
    slug: 'sexshop',
    label: 'Sexshop',
    description: 'Bienestar íntimo',
    image: `${CDN}/categories/sexshop-1920-1920.webp?w=480`,
  },
] as const

export const featuredProducts = [
  {
    slug: 'black-ritual',
    name: 'Black Ritual',
    price: 80000,
    transferPrice: 72000,
    image: `${CDN}/products/black-ritual-1024-1024.webp?w=640`,
  },
  {
    slug: 'dominia',
    name: 'Dominia',
    price: 77000,
    transferPrice: 69300,
    image: `${CDN}/products/dominia-1024-1024.webp?w=640`,
  },
  {
    slug: 'reina-roja',
    name: 'Reina Roja',
    price: 75000,
    transferPrice: 67500,
    image: `${CDN}/products/reina-roja-roja-1-cb476571a3a82fb88317481862828183-1024-1024.webp?w=640`,
  },
  {
    slug: 'venecia-secreta',
    name: 'Venecia Secreta',
    price: 77000,
    transferPrice: 69300,
    image: `${CDN}/products/venecia-secreta-1024-1024.webp?w=640`,
  },
] as const

export function formatARS(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}
