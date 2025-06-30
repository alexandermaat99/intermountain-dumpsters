import { Suspense } from 'react';
import Footer from './Footer';

export default function ConditionalFooter() {
  return (
    <Suspense fallback={
      <footer className="w-full border-t border-transparent bg-brand-green-dark text-white">
        <div className="max-w-7xl mx-auto px-5 py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
      </footer>
    }>
      <Footer />
    </Suspense>
  );
} 