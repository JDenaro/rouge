import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  type FAQItem,
  FAQ_CATEGORY_LABELS,
  groupFAQByCategory,
} from '@/lib/faq'

type FAQProps = {
  items: FAQItem[]
  showCta?: boolean
  groupByCategory?: boolean
}

// Convert "text with [label](url) inline" to ReactNodes — links become <Link> for
// internal hrefs, <a> for external. Only one helper handles the whole answer body.
function parseAnswer(text: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g
  const out: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push(text.slice(lastIndex, match.index))
    }
    const [, label, href] = match
    const isInternal = href.startsWith('/')
    if (isInternal) {
      out.push(
        <Link
          key={key++}
          href={href}
          style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
        >
          {label}
        </Link>,
      )
    } else {
      out.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
        >
          {label}
        </a>,
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex))
  }
  return out
}

function FAQList({ items }: { items: FAQItem[] }) {
  return (
    <div>
      {items.map((item) => (
        <details key={item.id} className="rouge-faq-item">
          <summary>{item.question}</summary>
          <div className="rouge-faq-answer">{parseAnswer(item.answer)}</div>
        </details>
      ))}
    </div>
  )
}

export function FAQ({ items, showCta, groupByCategory }: FAQProps) {
  const grouped = groupByCategory ? groupFAQByCategory() : null

  return (
    <section className="rouge-faq-section">
      <div className="rouge-faq-container">
        {grouped ? (
          (Object.keys(grouped) as Array<keyof typeof grouped>).map((cat) => {
            const list = grouped[cat]
            if (list.length === 0) return null
            return (
              <div key={cat} className="rouge-faq-group">
                <h3 className="rouge-faq-cat">{FAQ_CATEGORY_LABELS[cat]}</h3>
                <FAQList items={list} />
              </div>
            )
          })
        ) : (
          <FAQList items={items} />
        )}

        {showCta && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              href="/faq"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              Ver todas las preguntas
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .rouge-faq-section {
          padding: 5rem 1.5rem;
        }
        .rouge-faq-container {
          max-width: 720px;
          margin: 0 auto;
        }
        .rouge-faq-group + .rouge-faq-group {
          margin-top: 2.5rem;
        }
        .rouge-faq-cat {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin: 0 0 1rem;
        }
        .rouge-faq-item {
          border-bottom: 1px solid rgba(192, 68, 90, 0.12);
        }
        .rouge-faq-item > summary {
          list-style: none;
          cursor: pointer;
          padding: 1.25rem 2.5rem 1.25rem 0;
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--color-fg);
          position: relative;
          transition: color var(--dur-fast) var(--ease-out);
        }
        .rouge-faq-item > summary::-webkit-details-marker {
          display: none;
        }
        .rouge-faq-item > summary::after {
          content: '+';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-body);
          font-size: 1.5rem;
          font-weight: 300;
          color: var(--color-primary);
          transition: transform var(--dur-mid) var(--ease-out);
        }
        .rouge-faq-item[open] > summary::after {
          transform: translateY(-50%) rotate(45deg);
        }
        .rouge-faq-item > summary:hover {
          color: var(--color-primary);
        }
        .rouge-faq-answer {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--color-fg);
          opacity: 0.85;
          padding: 0 0 1.25rem;
        }
      `}</style>
    </section>
  )
}
