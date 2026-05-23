export type FAQCategory = 'made-to-order' | 'sizing' | 'shipping' | 'payments'

export type FAQItem = {
  id: number
  category: FAQCategory
  question: string
  answer: string
  featured: boolean
}

export const FAQ_CATEGORY_LABELS: Record<FAQCategory, string> = {
  'made-to-order': 'Hechas a medida',
  sizing: 'Talles y medidas',
  shipping: 'Envíos',
  payments: 'Pagos',
}

export const FAQ_ITEMS: readonly FAQItem[] = [
  {
    id: 1,
    category: 'made-to-order',
    question: '¿Cuánto demora una prenda hecha a medida?',
    answer:
      'Cada pieza se confecciona en 15-20 días hábiles desde que se confirma el pago.',
    featured: true,
  },
  {
    id: 2,
    category: 'made-to-order',
    question: '¿Puedo elegir telas y colores?',
    answer:
      'Sí, en cada producto se muestran las opciones disponibles. Para variaciones específicas, escribinos por WhatsApp.',
    featured: false,
  },
  {
    id: 3,
    category: 'made-to-order',
    question: '¿Hacen modelos personalizados?',
    answer:
      'Sí, adaptamos cualquier modelo a tu talla y preferencias. Consultanos por WhatsApp con la idea.',
    featured: false,
  },
  {
    id: 4,
    category: 'made-to-order',
    question: '¿Vienen con packaging especial?',
    answer:
      'Sí, todas las prendas se envían en empaque Rouge Intime listo para regalo.',
    featured: false,
  },
  {
    id: 5,
    category: 'sizing',
    question: '¿Cómo me tomo las medidas?',
    answer:
      'Seguí nuestra [guía de talles](/guia-de-talles) paso a paso. Si tenés dudas, contactanos por WhatsApp.',
    featured: true,
  },
  {
    id: 6,
    category: 'sizing',
    question: '¿Atienden talles grandes?',
    answer:
      'Sí, trabajamos desde el 85 hasta el 140+ en corpiños y desde S hasta 5XL en bombachas.',
    featured: true,
  },
  {
    id: 7,
    category: 'sizing',
    question: '¿Qué pasa si la prenda no me queda?',
    answer:
      'Por ser hecha a medida no aceptamos cambios por talle salvo defecto de confección. Por eso es clave [medirse bien antes de pedir](/politica-de-cambios).',
    featured: true,
  },
  {
    id: 8,
    category: 'shipping',
    question: '¿Hacen envíos a todo el país?',
    answer:
      'Sí, enviamos a todo el país por Andreani / Correo Argentino con tracking.',
    featured: true,
  },
  {
    id: 9,
    category: 'shipping',
    question: '¿Cuánto demora el envío?',
    answer:
      '3-7 días hábiles desde que despachamos (luego de los 15-20 días de confección).',
    featured: false,
  },
  {
    id: 10,
    category: 'shipping',
    question: '¿Hacen envíos al exterior?',
    answer: 'Por el momento solo enviamos dentro de Argentina.',
    featured: false,
  },
  {
    id: 11,
    category: 'payments',
    question: '¿Qué medios de pago aceptan?',
    answer:
      'Transferencia bancaria (12% OFF), tarjeta de crédito hasta 3 cuotas sin interés, y Mercado Pago.',
    featured: true,
  },
  {
    id: 12,
    category: 'payments',
    question: '¿Cuándo se confirma mi pago?',
    answer:
      'Las transferencias se confirman en horas hábiles tras recibir el comprobante. Mercado Pago y tarjeta son inmediatos.',
    featured: false,
  },
  {
    id: 13,
    category: 'payments',
    question: '¿Es seguro pagar online?',
    answer:
      'Sí, los pagos con tarjeta se procesan por Mercado Pago. La transferencia es a cuenta bancaria a nombre de la marca.',
    featured: false,
  },
]

export function getFeaturedFAQ(): FAQItem[] {
  return FAQ_ITEMS.filter((i) => i.featured)
}

export function groupFAQByCategory(): Record<FAQCategory, FAQItem[]> {
  const groups: Record<FAQCategory, FAQItem[]> = {
    'made-to-order': [],
    sizing: [],
    shipping: [],
    payments: [],
  }
  for (const item of FAQ_ITEMS) {
    groups[item.category].push(item)
  }
  return groups
}

type FAQPageSchema = {
  '@context': 'https://schema.org'
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

// Strip markdown-style [text](url) links from a string, leaving just the text.
function stripMarkdownLinks(input: string): string {
  return input.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

export function buildFAQPageSchema(items: readonly FAQItem[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripMarkdownLinks(item.answer),
      },
    })),
  }
}
