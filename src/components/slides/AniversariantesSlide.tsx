import { useState, useEffect } from 'react'
import { FirestoreService } from '@/lib/firestore-services'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Aniversariante {
  id: string
  nome: string
  dataAniversario: string | any // Pode ser string ou Timestamp do Firebase
  userId: string
  createdAt?: any
  updatedAt?: any
}

export function AniversariantesSlide() {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([])
  const [loading, setLoading] = useState(true)

  const aniversariantesService = new FirestoreService<Aniversariante>('aniversariantes')

  useEffect(() => {
    const fetchAniversariantes = async () => {
      try {
        const data = await aniversariantesService.getAll()

        // Filtrar aniversariantes do mês atual
        const currentMonth = new Date().getMonth()
        
        const aniversariantesDoMes = data.filter(aniversariante => {
          try {
            let dataAniversario: Date

            if (typeof aniversariante.dataAniversario === 'string') {
              // Extrair ano, mês, dia da string e criar data local
              const datePart = aniversariante.dataAniversario.includes('T') 
                ? aniversariante.dataAniversario.split('T')[0] 
                : aniversariante.dataAniversario
              
              const [year, month, day] = datePart.split('-').map(Number)
              dataAniversario = new Date(year, month - 1, day) // month-1 pois Date usa 0-11
            } else if (aniversariante.dataAniversario?.toDate) {
              // Timestamp do Firebase
              dataAniversario = aniversariante.dataAniversario.toDate()
            } else {
              dataAniversario = new Date(aniversariante.dataAniversario)
            }

            return dataAniversario.getMonth() === currentMonth
          } catch (error) {
            console.error('Erro ao processar data do aniversariante:', aniversariante, error)
            return false
          }
        })

        // Ordenar por dia do mês
        aniversariantesDoMes.sort((a, b) => {
          try {
            let dataA: Date, dataB: Date

            if (typeof a.dataAniversario === 'string') {
              const datePart = a.dataAniversario.includes('T') 
                ? a.dataAniversario.split('T')[0] 
                : a.dataAniversario
              const [year, month, day] = datePart.split('-').map(Number)
              dataA = new Date(year, month - 1, day)
            } else if (a.dataAniversario?.toDate) {
              dataA = a.dataAniversario.toDate()
            } else {
              dataA = new Date(a.dataAniversario)
            }

            if (typeof b.dataAniversario === 'string') {
              const datePart = b.dataAniversario.includes('T') 
                ? b.dataAniversario.split('T')[0] 
                : b.dataAniversario
              const [year, month, day] = datePart.split('-').map(Number)
              dataB = new Date(year, month - 1, day)
            } else if (b.dataAniversario?.toDate) {
              dataB = b.dataAniversario.toDate()
            } else {
              dataB = new Date(b.dataAniversario)
            }

            return dataA.getDate() - dataB.getDate()
          } catch (error) {
            console.error('Erro ao ordenar aniversariantes:', error)
            return 0
          }
        })

        setAniversariantes(aniversariantesDoMes)
      } catch (error) {
        console.error('Erro ao buscar aniversariantes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAniversariantes()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A298] via-[#0B5C5B] to-[#1D3C44] relative overflow-hidden">
        {/* Padrão de fundo animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="text-center z-10">
          <div className="text-8xl mb-8 animate-bounce">🎂</div>
          <div className="text-white text-4xl font-bold animate-pulse">Carregando aniversariantes...</div>
        </div>
      </div>
    )
  }

  if (aniversariantes.length === 0) {
    return (
      <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#00A298] via-[#0B5C5B] to-[#1D3C44] text-white relative overflow-hidden">
        {/* Padrão de fundo decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-9xl">🎂</div>
          <div className="absolute top-20 right-20 text-7xl">🎉</div>
          <div className="absolute bottom-20 left-20 text-8xl">🥳</div>
          <div className="absolute bottom-10 right-10 text-6xl">🎈</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-30">🎊</div>
        </div>

        {/* Conteúdo principal */}
        <div className="text-center z-10 max-w-4xl mx-auto px-8">
          <div className="text-9xl mb-12 animate-bounce">🎂</div>
          <h1 className="text-7xl md:text-8xl font-extrabold mb-8 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-pulse">
            Aniversariantes do Mês
          </h1>
          <div className="text-6xl mb-8">🎉</div>
          <p className="text-3xl md:text-4xl opacity-90 font-light">
            Nenhum aniversariante este mês
          </p>
          <div className="mt-12 w-64 h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Elementos decorativos flutuantes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-white/20 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/20 rounded-full animate-ping delay-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-[#00A298] via-[#0B5C5B] to-[#1D3C44] text-white relative overflow-hidden">
      {/* Padrão de fundo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-9xl animate-pulse">🎂</div>
        <div className="absolute top-20 right-20 text-7xl animate-pulse delay-1000">🎉</div>
        <div className="absolute bottom-20 left-20 text-8xl animate-pulse delay-500">🥳</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-pulse delay-700">🎈</div>
      </div>

      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/10 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-white/10 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/10 rounded-full animate-ping delay-500"></div>
      <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-white/10 rounded-full animate-ping delay-300"></div>

      <div className="relative z-10 flex flex-col h-full min-h-screen p-6 md:p-12">
        {/* Título Principal */}
        <div className="text-center mb-8 flex-shrink-0">
          <div className="text-7xl mb-6 animate-bounce">🎂</div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
            Aniversariantes do Mês
          </h1>
          <div className="w-64 h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Lista de Aniversariantes - área flexível */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-4">
          <div className="w-full h-full flex items-center justify-center">
            {(() => {
              const count = aniversariantes.length

              // Função para renderizar um card de aniversariante
              const renderAniversariante = (aniversariante: Aniversariante, index: number, size: 'large' | 'medium' | 'medium-small' | 'small' | 'tiny') => {
                let dataAniversario: Date

                if (typeof aniversariante.dataAniversario === 'string') {
                  const datePart = aniversariante.dataAniversario.includes('T') 
                    ? aniversariante.dataAniversario.split('T')[0] 
                    : aniversariante.dataAniversario
                  const [year, month, day] = datePart.split('-').map(Number)
                  dataAniversario = new Date(year, month - 1, day)
                } else if (aniversariante.dataAniversario?.toDate) {
                  dataAniversario = aniversariante.dataAniversario.toDate()
                } else {
                  dataAniversario = new Date(aniversariante.dataAniversario)
                }

                const dataFormatada = format(dataAniversario, "dd 'de' MMMM", { locale: ptBR })

                // Configurações baseadas no tamanho - otimizadas para o espaço disponível
                const sizeConfig = {
                  large: {
                    containerClass: "bg-white/15 backdrop-blur-lg rounded-3xl py-8 px-10 border border-white/30 shadow-2xl",
                    nameClass: "text-4xl md:text-5xl font-bold mb-2",
                    dateClass: "text-xl md:text-2xl opacity-90 font-light"
                  },
                  medium: {
                    containerClass: "bg-white/15 backdrop-blur-lg rounded-3xl py-8 px-12 border border-white/30 shadow-xl",
                    nameClass: "text-4xl md:text-5xl font-bold mb-3",
                    dateClass: "text-xl md:text-2xl opacity-90 font-light"
                  },
                  'medium-small': {
                    containerClass: "bg-white/15 backdrop-blur-lg rounded-2xl py-5 px-6 border border-white/30 shadow-xl",
                    nameClass: "text-2xl md:text-3xl font-bold mb-1",
                    dateClass: "text-lg md:text-xl opacity-90 font-light"
                  },
                  small: {
                    containerClass: "bg-white/15 backdrop-blur-lg rounded-xl py-4 px-5 border border-white/30 shadow-lg",
                    nameClass: "text-xl md:text-2xl font-bold mb-1",
                    dateClass: "text-base md:text-lg opacity-90 font-light"
                  },
                  tiny: {
                    containerClass: "bg-white/15 backdrop-blur-lg rounded-xl py-3 px-4 border border-white/30 shadow-lg",
                    nameClass: "text-lg md:text-xl font-bold mb-1",
                    dateClass: "text-sm md:text-base opacity-90 font-light"
                  }
                }

                const config = sizeConfig[size]

                return (
                  <div
                    key={aniversariante.id}
                    className={`${config.containerClass} transform hover:scale-105 transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in`}
                    style={{
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <div className="text-center">
                      <h3 className={config.nameClass}>{aniversariante.nome}</h3>
                      <p className={config.dateClass}>{dataFormatada}</p>
                    </div>
                  </div>
                )
              }

              // Layout baseado na quantidade - redução gradual do tamanho
              if (count === 1) {
                // 1 aniversariante: Card grande, centralizado
                return (
                  <div className="max-w-4xl mx-auto">
                    {aniversariantes.map((aniversariante, index) =>
                      renderAniversariante(aniversariante, index, 'large')
                    )}
                  </div>
                )
              } else if (count === 2) {
                // 2 aniversariantes: Cards médios, dispostos horizontalmente
                return (
                  <div className="flex justify-center gap-8 max-w-6xl mx-auto">
                    {aniversariantes.map((aniversariante, index) =>
                      renderAniversariante(aniversariante, index, 'medium')
                    )}
                  </div>
                )
              } else if (count === 3) {
                // 3 aniversariantes: Cards médios, dispostos horizontalmente
                return (
                  <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                    {aniversariantes.map((aniversariante, index) =>
                      renderAniversariante(aniversariante, index, 'medium')
                    )}
                  </div>
                )
              } else if (count === 4) {
                // 4 aniversariantes: Grid 2x2, cards médios-pequenos
                return (
                  <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {aniversariantes.map((aniversariante, index) =>
                      renderAniversariante(aniversariante, index, 'medium-small')
                    )}
                  </div>
                )
              } else if (count <= 6) {
                // 5-6 aniversariantes: Grid 2 colunas, cards pequenos
                return (
                  <div className="grid grid-cols-2 gap-4 max-w-6xl mx-auto">
                    {aniversariantes.map((aniversariante, index) =>
                      renderAniversariante(aniversariante, index, 'small')
                    )}
                  </div>
                )
              } else if (count <= 8) {
                // 7-8 aniversariantes: Grid 2 colunas, cards pequenos
                return (
                  <div className="grid grid-cols-2 gap-3 max-w-6xl mx-auto">
                    {aniversariantes.map((aniversariante, index) =>
                      renderAniversariante(aniversariante, index, 'small')
                    )}
                  </div>
                )
              } else if (count <= 12) {
                // 9-12 aniversariantes: Grid 2 colunas, cards muito pequenos
                return (
                  <div className="grid grid-cols-2 gap-2 max-w-6xl mx-auto">
                    {aniversariantes.map((aniversariante, index) =>
                      renderAniversariante(aniversariante, index, 'tiny')
                    )}
                  </div>
                )
              } else {
                // 13+ aniversariantes: Grid 2 colunas, cards muito pequenos
                return (
                  <div className="grid grid-cols-2 gap-2 max-w-6xl mx-auto">
                    {aniversariantes.map((aniversariante, index) =>
                      renderAniversariante(aniversariante, index, 'tiny')
                    )}
                  </div>
                )
              }
            })()}
          </div>
        </div>

        {/* Rodapé - sempre visível */}
        <div className="text-center mt-8 flex-shrink-0">
          <p className="text-2xl md:text-3xl opacity-80 font-light">
            Parabéns a todos os aniversariantes!
          </p>
          <div className="mt-6 flex justify-center gap-4 text-4xl">
            <span className="animate-bounce">🎈</span>
            <span className="animate-bounce delay-200">🎊</span>
            <span className="animate-bounce delay-400">🎁</span>
            <span className="animate-bounce delay-600">🍰</span>
          </div>
        </div>
      </div>
    </div>
  )
}