import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Star, Zap } from 'lucide-react';

// Import our custom animation components
import { 
  AnimatedDiv, 
  AnimatedCard, 
  AnimatedList,
  fadeInUp,
  slideInLeft,
  slideInRight,
  scaleIn
} from '@/components/custom/AnimatedComponents';
import { PageTransition } from '@/components/custom/PageTransition';
import { 
  AnimatedModal, 
  AnimatedCollapsible, 
  AnimatedNotification 
} from '@/components/custom/AnimatedEntryExit';
import { 
  InteractiveButton, 
  InteractiveCard, 
  FloatingButton,
  MagneticButton,
  RippleButton,
  AnimatedIconButton
} from '@/components/custom/InteractiveAnimations';

export const FramerMotionExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const cardData = [
    { title: 'Animação Básica', description: 'Fade in up animation', icon: Star },
    { title: 'Slide Animation', description: 'Slide from left', icon: Zap },
    { title: 'Scale Animation', description: 'Scale in animation', icon: Heart },
  ];

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <AnimatedDiv variant={fadeInUp} className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Framer Motion Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Demonstração completa das animações implementadas com Framer Motion
          </p>
        </AnimatedDiv>

        {/* Basic Animations Section */}
        <AnimatedDiv variant={slideInLeft} delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Animações Básicas</CardTitle>
              <CardDescription>
                Componentes com animações de entrada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedList className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cardData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <AnimatedCard
                      key={index}
                      variant={index === 0 ? fadeInUp : index === 1 ? slideInLeft : scaleIn}
                      delay={index * 0.1}
                      className="p-4 bg-white rounded-lg border shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </AnimatedCard>
                  );
                })}
              </AnimatedList>
            </CardContent>
          </Card>
        </AnimatedDiv>

        {/* Interactive Animations Section */}
        <AnimatedDiv variant={slideInRight} delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle>Animações Interativas</CardTitle>
              <CardDescription>
                Botões e componentes com animações de hover e clique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <InteractiveButton
                  variant="scale"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => console.log('Scale button clicked')}
                >
                  Scale Hover
                </InteractiveButton>

                <InteractiveButton
                  variant="lift"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => console.log('Lift button clicked')}
                >
                  Lift Hover
                </InteractiveButton>

                <InteractiveButton
                  variant="rotate"
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => console.log('Rotate button clicked')}
                >
                  Rotate Hover
                </InteractiveButton>

                <InteractiveButton
                  variant="glow"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => console.log('Glow button clicked')}
                >
                  Glow Hover
                </InteractiveButton>

              </div>

              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <MagneticButton
                    className="bg-red-500 text-white px-6 py-3 rounded-lg"
                    onClick={() => console.log('Magnetic button clicked')}
                  >
                    Magnetic Button
                  </MagneticButton>

                  <RippleButton
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg"
                    onClick={() => console.log('Ripple button clicked')}
                  >
                    Ripple Effect
                  </RippleButton>
                </div>

                <div className="flex space-x-4">
                  <AnimatedIconButton
                    iconAnimation="spin"
                    className="bg-gray-200 p-3 rounded-full"
                    onClick={() => console.log('Spin icon clicked')}
                  >
                    <Star className="h-5 w-5" />
                  </AnimatedIconButton>

                  <AnimatedIconButton
                    iconAnimation="bounce"
                    className="bg-gray-200 p-3 rounded-full"
                    onClick={() => console.log('Bounce icon clicked')}
                  >
                    <Heart className="h-5 w-5" />
                  </AnimatedIconButton>

                  <AnimatedIconButton
                    iconAnimation="pulse"
                    className="bg-gray-200 p-3 rounded-full"
                    onClick={() => console.log('Pulse icon clicked')}
                  >
                    <Zap className="h-5 w-5" />
                  </AnimatedIconButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedDiv>

        {/* Interactive Cards */}
        <AnimatedDiv variant={fadeInUp} delay={0.6}>
          <Card>
            <CardHeader>
              <CardTitle>Cards Interativos</CardTitle>
              <CardDescription>
                Cards com animações de hover
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <InteractiveCard
                    key={item}
                    className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg border"
                    onClick={() => console.log(`Card ${item} clicked`)}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Interactive Card {item}</h3>
                      <p className="text-sm text-gray-600">
                        Hover para ver a animação de elevação
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        Hover me!
                      </Badge>
                    </div>
                  </InteractiveCard>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedDiv>

        {/* Entry/Exit Animations Section */}
        <AnimatedDiv variant={slideInLeft} delay={0.8}>
          <Card>
            <CardHeader>
              <CardTitle>Animações de Entrada/Saída</CardTitle>
              <CardDescription>
                Modais, colapsáveis e notificações animadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  Abrir Modal Animado
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
                >
                  {isCollapsibleOpen ? 'Fechar' : 'Abrir'} Colapsável
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 3000);
                  }}
                >
                  Mostrar Notificação
                </Button>
              </div>

              <AnimatedCollapsible 
                isOpen={isCollapsibleOpen}
                className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <h4 className="font-semibold text-blue-900 mb-2">Conteúdo Colapsável</h4>
                <p className="text-blue-800">
                  Este conteúdo aparece e desaparece com animação suave de expansão.
                  A animação inclui mudanças de opacidade, altura e escala para criar
                  um efeito visual agradável.
                </p>
              </AnimatedCollapsible>
            </CardContent>
          </Card>
        </AnimatedDiv>

        {/* Floating Action Button */}
        <FloatingButton
          className="bg-blue-500 text-white p-4"
          onClick={() => {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 2000);
          }}
        >
          <Plus className="h-6 w-6" />
        </FloatingButton>

        {/* Modal */}
        <AnimatedModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Modal Animado</h3>
            <p className="text-gray-600 mb-6">
              Este modal aparece com animação de escala e fade. 
              Clique fora ou no botão para fechar.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Confirmar
              </Button>
            </div>
          </div>
        </AnimatedModal>

        {/* Notification */}
        <AnimatedNotification
          isVisible={showNotification}
          className="bg-green-500 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Notificação animada apareceu!</span>
          </div>
        </AnimatedNotification>

      </div>
    </PageTransition>
  );
};