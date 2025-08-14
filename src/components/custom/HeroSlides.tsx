import React from 'react'

// Brand colors (PLBrasil)
const BRAND_PRIMARY = '#00A298'
const BRAND_DARK = '#1D3C44'

interface HeroProps {
  title: string
  subtitle?: string
}

function BaseHero({ title, subtitle }: HeroProps) {
  return (
    <div className="relative h-full w-full">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 60% at 30% 20%, rgba(0,162,152,0.18) 0%, rgba(0,162,152,0.00) 60%), radial-gradient(50% 50% at 80% 20%, rgba(29,60,68,0.18) 0%, rgba(29,60,68,0.00) 55%), linear-gradient(90deg, rgba(0,162,152,0.14), rgba(29,60,68,0.14))',
        }}
      />
      {/* Content */}
      <div className="relative h-full w-full flex items-center justify-center px-8">
        <div className="text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{
              background: `linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_DARK})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm md:text-base text-foreground/70">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function BrandHeroSlideOne() {
  return (
    <BaseHero
      title="PLBrasil Health & Safety"
      subtitle="Excelência em cuidado, tecnologia e resultados"
    />
  )
}

export function BrandHeroSlideTwo() {
  return (
    <BaseHero
      title="Cuidado que se mede em impacto"
      subtitle="Indicadores integrados de Medicina, Comercial e Operações"
    />
  )
}

export function BrandHeroSlideThree() {
  return (
    <BaseHero
      title="Performance com Humanização"
      subtitle="Evolução contínua alinhada aos valores PLBrasil"
    />
  )
}


