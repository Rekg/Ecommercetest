import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
})
export class CarouselComponent implements OnInit, OnDestroy {
  currentSlide = signal(0);
  private timerId: any;

  slides = [
    { 
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=2000', 
      title: 'Christmas Spirit', 
      desc: 'Give the gift of premium footwear this holiday season.' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=2000', 
      title: 'Holiday Tech', 
      desc: 'Exclusive gadgets designed for the perfect winter surprise.' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=2000', 
      title: 'Luxury Watches', 
      desc: 'Timeless elegance for those who matter most.' 
    }
  ];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.timerId = setInterval(() => this.next(), 6000);
  }

  stopAutoPlay() {
    if (this.timerId) clearInterval(this.timerId);
  }

  next() {
    this.currentSlide.update(v => (v + 1) % this.slides.length);
  }

  prev() {
    this.currentSlide.update(v => (v - 1 + this.slides.length) % this.slides.length);
  }

  setSlide(index: number) {
    this.currentSlide.set(index);
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}