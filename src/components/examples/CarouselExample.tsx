import React from 'react';
import {
  ImageCarousel,
  CardCarousel,
  TestimonialCarousel,
  AutoplayCarousel,
  MultiSlideCarousel
} from '@/components/custom/CarouselVariants';
import { Carousel } from '@/components/custom/Carousel';
import type { CarouselItem } from '@/components/custom/Carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CarouselExample: React.FC = () => {
  // Sample data for different carousel types
  const sampleImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      alt: 'Mountain landscape',
      title: 'Beautiful Mountains',
      description: 'Stunning mountain views with crystal clear lakes'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      alt: 'Ocean sunset',
      title: 'Ocean Sunset',
      description: 'Peaceful sunset over the ocean waves'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      alt: 'Forest path',
      title: 'Forest Adventure',
      description: 'Mysterious paths through ancient forests'
    }
  ];

  const sampleCards = [
    {
      id: 1,
      title: 'Feature One',
      description: 'This is a description of the first feature',
      badge: 'New',
      content: <Button variant="outline" size="sm">Learn More</Button>
    },
    {
      id: 2,
      title: 'Feature Two',
      description: 'This is a description of the second feature',
      badge: 'Popular',
      content: <Button variant="outline" size="sm">Get Started</Button>
    },
    {
      id: 3,
      title: 'Feature Three',
      description: 'This is a description of the third feature',
      content: <Button variant="outline" size="sm">Explore</Button>
    },
    {
      id: 4,
      title: 'Feature Four',
      description: 'This is a description of the fourth feature',
      badge: 'Pro',
      content: <Button variant="outline" size="sm">Upgrade</Button>
    }
  ];

  const sampleTestimonials = [
    {
      id: 1,
      content: 'This product has completely transformed how we work. The interface is intuitive and the features are exactly what we needed.',
      author: 'Sarah Johnson',
      role: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      content: 'Outstanding customer service and a product that delivers on all its promises. Highly recommended for any team.',
      author: 'Michael Chen',
      role: 'Tech Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      content: 'The best investment we made this year. The ROI has been incredible and the team loves using it daily.',
      author: 'Emily Rodriguez',
      role: 'CEO',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  // Basic carousel items
  const basicItems: CarouselItem[] = [
    {
      id: 1,
      content: (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Slide 1</CardTitle>
            <CardDescription>This is the first slide</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Basic carousel slide with simple content.</p>
          </CardContent>
        </Card>
      )
    },
    {
      id: 2,
      content: (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Slide 2</CardTitle>
            <CardDescription>This is the second slide</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Another slide with different content to showcase the carousel.</p>
          </CardContent>
        </Card>
      )
    },
    {
      id: 3,
      content: (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Slide 3</CardTitle>
            <CardDescription>This is the third slide</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Final slide demonstrating the basic carousel functionality.</p>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <div className="space-y-12 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Carousel Examples</h1>
        <p className="text-muted-foreground">
          Different types of carousels built with Swiper.js
        </p>
      </div>

      {/* Basic Carousel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Basic Carousel</h2>
        <Carousel
          items={basicItems}
          className="max-w-2xl mx-auto"
          showNavigation={true}
          showPagination={true}
        />
      </section>

      {/* Image Carousel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Image Carousel with Autoplay</h2>
        <div className="max-w-4xl mx-auto">
          <ImageCarousel images={sampleImages} />
        </div>
      </section>

      {/* Card Carousel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Multi-slide Card Carousel</h2>
        <CardCarousel cards={sampleCards} />
      </section>

      {/* Testimonial Carousel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Testimonial Carousel (Fade Effect)</h2>
        <div className="max-w-3xl mx-auto">
          <TestimonialCarousel testimonials={sampleTestimonials} />
        </div>
      </section>

      {/* Autoplay Carousel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Fast Autoplay Carousel</h2>
        <div className="max-w-2xl mx-auto">
          <AutoplayCarousel items={basicItems} delay={2000} />
        </div>
      </section>

      {/* Multi-slide Carousel */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Multi-slide Responsive Carousel</h2>
        <MultiSlideCarousel items={basicItems} slidesPerView={2} />
      </section>
    </div>
  );
};

export default CarouselExample;