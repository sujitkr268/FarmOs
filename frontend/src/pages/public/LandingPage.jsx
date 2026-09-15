import React from 'react'
import { HeroSection } from '../../components/landing/HeroSection'
import { SmartAgSection } from '../../components/landing/SmartAgSection'
import { DataSection } from '../../components/landing/DataSection'
import { HowFarmOSWorks } from '../../components/landing/HowFarmOSWorks'
import { OpportunitySection } from '../../components/landing/OpportunitySection'
import { MarketComparisonSection } from '../../components/landing/MarketComparisonSection'
import { BuyerSection } from '../../components/landing/BuyerSection'
import { WeatherSection } from '../../components/landing/WeatherSection'
import { AISection } from '../../components/landing/AISection'
import { FarmerSection } from '../../components/landing/FarmerSection'
import { TestimonialsSection } from '../../components/landing/TestimonialsSection'
import { FAQSection } from '../../components/landing/FAQSection'
import { FinalCTA } from '../../components/landing/FinalCTA'

export const LandingPage = () => {
  return (
    <div style={{ backgroundColor: '#022c22', width: '100%', overflowX: 'hidden' }}>
      {/* 1. Full-screen Agricultural Hero */}
      <HeroSection />

      {/* 2. Smart Agriculture (6 Cards) */}
      <SmartAgSection />

      {/* 3. Data + AI Section (Dashboard Mockup) */}
      <DataSection />

      {/* 4. How FarmOS Works (6-step Process Flow) */}
      <HowFarmOSWorks />

      {/* 5. Best Opportunity Showcase Engine */}
      <OpportunitySection />

      {/* 6. Market Comparison Grid */}
      <MarketComparisonSection />

      {/* 7. Connect With Potential Buyers */}
      <BuyerSection />

      {/* 8. Weather Intelligence */}
      <WeatherSection />

      {/* 9. Meet Your FarmOS AI Assistant */}
      <AISection />

      {/* 10. Farmer Showcase & Statistics */}
      <FarmerSection />

      {/* 11. Testimonials */}
      <TestimonialsSection />

      {/* 12. FAQ Section */}
      <FAQSection />

      {/* 13. Final Call To Action */}
      <FinalCTA />
    </div>
  )
}

export default LandingPage
