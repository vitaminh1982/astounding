import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Brain, 
  Workflow, 
  BarChart3, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react';
import OnboardingHeader from '../components/onboarding/OnboardingHeader';
import PlatformOverview from '../components/onboarding/PlatformOverview';
import CoreFeatures from '../components/onboarding/CoreFeatures';
import HumanCenteredAI from '../components/onboarding/HumanCenteredAI';
import TrustFramework from '../components/onboarding/TrustFramework';
import GettingStarted from '../components/onboarding/GettingStarted';
import OnboardingProgress from '../components/onboarding/OnboardingProgress';
import { useEffect, useRef } from 'react';
import { Page } from '../App';

interface OnboardingPageProps {
  onNavigate?: (page: Page) => void;
}

export default function OnboardingPage({ onNavigate }: OnboardingPageProps) {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sections data for the progress tracker
  const sections = [
    { id: 0, title: 'Platform Overview', icon: ShieldCheck },
    { id: 1, title: 'Core Features', icon: Brain },
    { id: 2, title: 'Human-Centered AI', icon: Users },
    { id: 3, title: 'Trust Framework', icon: ShieldCheck },
    { id: 4, title: 'Getting Started', icon: Workflow }
  ];

  // Handle section navigation
  const navigateToSection = (sectionId: number) => {
    setActiveSection(sectionId);
    
    // Scroll to top of content area
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback if ref is not available
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }, 100);
    
    // Mark section as completed if it's not already
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  // Handle next section navigation
  const handleNextSection = () => {
    if (activeSection < sections.length - 1) {
      navigateToSection(activeSection + 1);
    }
  };

  const handleCloseOnboarding = () => {
    // Navigate back to dashboard when onboarding is closed
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  // Render the active section content
  const renderActiveSection = () => {
    switch (activeSection) {
      case 0:
        return <PlatformOverview onNext={handleNextSection} />;
      case 1:
        return <CoreFeatures onNext={handleNextSection} />;
      case 2:
        return <HumanCenteredAI onNext={handleNextSection} />;
      case 3:
        return <TrustFramework onNext={handleNextSection} />;
      case 4:
        return <GettingStarted />;
      default:
        return <PlatformOverview onNext={handleNextSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <OnboardingHeader 
          onNavigate={onNavigate}
          onClose={handleCloseOnboarding}
        />
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Sidebar with progress tracker */}
          <div className="lg:col-span-3">
            <OnboardingProgress 
              sections={sections}
              activeSection={activeSection}
              completedSections={completedSections}
              onSectionClick={navigateToSection}
            />
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-9">
            <div ref={contentRef} className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}