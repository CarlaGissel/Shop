import { useState, useEffect, useCallback, useRef } from 'react'

const slides = [
  {
    id: 1,
    bg: '#f0ece4',
    tag: 'Nueva colección 2026',
    title: 'Estilo que\nresiste todo',
    subtitle: 'Prendas de calidad para cada momento. Diseñadas para durar, hechas para destacar.',
    cta: 'Ver colección',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80&fit=crop&crop=top',
    dark: false,
  },
  {
    id: 2,
    bg: '#111111',
    tag: 'Envíos gratis',
    title: 'Llevalo a\ntu puerta',
    subtitle: 'Envíos gratis a todo el país desde Gs. 500.000.',
    cta: 'Comprar ahora',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&fit=crop&crop=top',
    dark: true,
  },
  {
    id: 3,
    bg: '#dde8dd',
    tag: 'Temporada de rebajas',
    title: 'Hasta 40%\nde descuento',
    subtitle: 'Aprovechá los mejores precios en cientos de productos seleccionados.',
    cta: 'Ver rebajas',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&fit=crop&crop=top',
    dark: false,
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const timerRef = useRef(null)

  const goTo = useCallback((index) => {
    if (fading) return
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 250)
  }, [fading])

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo])

  useEffect(() => {
    timerRef.current = setInterval(next, 5500)
    return () => clearInterval(timerRef.current)
  }, [next])

  const slide = slides[current]
  const textColor = slide.dark ? '#ffffff' : '#111111'
  const subColor = slide.dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)'

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '540px',
        background: slide.bg,
        overflow: 'hidden',
        transition: 'background 0.5s ease',
      }}
    >
      {/* Text overlay – left side */}
      <div
        style={{
          position: 'absolute',
          left: 'clamp(40px, 6%, 120px)',
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: '420px',
          zIndex: 10,
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      >
        <p style={{
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#f59e0b',
          marginBottom: '12px',
        }}>
          {slide.tag}
        </p>

        <h2 style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: 'clamp(44px, 5vw, 68px)',
          fontWeight: 700,
          lineHeight: 1.1,
          color: textColor,
          whiteSpace: 'pre-line',
          marginBottom: '16px',
        }}>
          {slide.title}
        </h2>

        <p style={{
          fontSize: '14px',
          lineHeight: 1.6,
          color: subColor,
          marginBottom: '28px',
          maxWidth: '340px',
        }}>
          {slide.subtitle}
        </p>

        <button
          onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            display: 'inline-block',
            background: slide.dark ? '#f59e0b' : '#111',
            color: slide.dark ? '#111' : '#fff',
            padding: '13px 28px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {slide.cta}
        </button>
      </div>

      {/* Image – right side */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 'clamp(280px, 42%, 560px)',
          height: '100%',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      >
        <img
          src={slide.image}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
        />
      </div>

      {/* Left arrow */}
      <button
        onClick={prev}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '40px',
          height: '40px',
          background: 'rgba(255,255,255,0.85)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.85)')}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#111" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '40px',
          height: '40px',
          background: 'rgba(255,255,255,0.85)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.85)')}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#111" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute',
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '6px',
        zIndex: 20,
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? '#111' : 'rgba(0,0,0,0.25)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  )
}
