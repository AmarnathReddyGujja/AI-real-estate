export interface LocationIntelligence {
  areaName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  ringZone: 'Inside ORR' | 'Between ORR & RRR' | 'Beyond RRR';
  growthCorridor: 'West' | 'South' | 'North' | 'East' | 'Central';
  authority: 'HMDA' | 'GHMC' | 'FCDA' | 'DTCP';
  verdict: string;
  summary: string;
  
  // New: Demographics & Admin
  demographics: {
    population: string;
    adminRank: 'District Headquarters' | 'Municipality' | 'Newly Formed Municipality' | 'Village Panchayat';
    zoningType: 'Metro' | 'Urban' | 'Rural' | 'Pre-urban' | 'Conservation';
  };

  // New: Strategic Framework
  strategicAnalysis: {
    highwayIntersections: string[];
    nearestBigTown: {
      name: string;
      distance: string;
      facilities: string[];
    };
    growthRunRate: {
      description: string;
      expansionPercentage: string; // e.g. "40% increase in rooftop density"
      visualChange2020vs2025: string;
    };
  };

  connectivity: {
    label: string;
    distance: string;
    travelTime: string;
    importance: 'High' | 'Medium' | 'Low';
    status?: string; // e.g. "6-laning in progress"
  }[];

  infrastructureMilestones: {
    milestone: string;
    status: 'Completed' | 'In Progress' | 'Proposed' | 'Delayed';
    date?: string;
  }[];
  
  zoning: {
    classification: string;
    explanation: string;
    potential: string;
  };
  
  economicDrivers: {
    cluster: 'IT' | 'Manufacturing' | 'Logistics' | 'Agriculture' | 'Ecotourism' | 'Pharma';
    anchors: string[];
    socialInfrastructure: {
      schools: { name: string; distance: string; type: string }[];
      hospitals: { name: string; distance: string; specialty: string }[];
      malls: string;
    };
    industrialGrowth: string;
  };

  transport: {
    busStop: { name: string; distance: string };
    metroStation: { name: string; distance: string; line: string };
    mmtsStation: { name: string; distance: string; status: string };
    railwayStation: { name: string; distance: string };
  };

  propertySpecifics?: {
    isSpecificAddress: boolean;
    frontageRoadWidth?: string;
    landUseZone?: string;
    nearbyLandmarks?: string[];
  };

  schoolStats: {
    count: number;
    radius: string;
    context: string;
  };

  growthScore: {
    total: number;
    factors: {
      name: string;
      score: number;
      comment: string;
    }[];
  };
  
  newsSignals: {
    title: string;
    summary: string;
    date: string;
    impact: 'Positive' | 'Neutral' | 'Negative';
    source?: string;
  }[];
  
  pricing: {
    fairRange: {
      min: number;
      max: number;
    };
    marketAverage: number;
    isOverpriced: boolean;
    breakdown: {
      label: string;
      value: number;
    }[];
  };
  
  pros: string[];
  cons: string[];
  
  investment: {
    horizon: 'Short-term Gold Mine (5-8 years)' | 'Long-term Horizon (10-25 years)';
    recommendedType: 'Open Plots' | 'Apartments' | 'Villas' | 'Commercial';
    developmentPhase: 'Early Industrial Push' | 'Self-sustained' | 'Speculative';
    strategy: string;
  };
}
