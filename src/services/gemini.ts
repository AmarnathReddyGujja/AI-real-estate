import { GoogleGenAI, Type } from "@google/genai";
import { LocationIntelligence } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    areaName: { type: Type.STRING },
    coordinates: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER },
        lng: { type: Type.NUMBER }
      },
      required: ["lat", "lng"]
    },
    ringZone: { type: Type.STRING },
    growthCorridor: { type: Type.STRING },
    authority: { type: Type.STRING },
    verdict: { type: Type.STRING },
    summary: { type: Type.STRING },
    demographics: {
      type: Type.OBJECT,
      properties: {
        population: { type: Type.STRING },
        adminRank: { type: Type.STRING },
        zoningType: { type: Type.STRING }
      }
    },
    strategicAnalysis: {
      type: Type.OBJECT,
      properties: {
        highwayIntersections: { type: Type.ARRAY, items: { type: Type.STRING } },
        nearestBigTown: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            distance: { type: Type.STRING },
            facilities: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        growthRunRate: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            expansionPercentage: { type: Type.STRING },
            visualChange2020vs2025: { type: Type.STRING }
          }
        }
      }
    },
    connectivity: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          distance: { type: Type.STRING },
          travelTime: { type: Type.STRING },
          importance: { type: Type.STRING },
          status: { type: Type.STRING }
        }
      }
    },
    infrastructureMilestones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          milestone: { type: Type.STRING },
          status: { type: Type.STRING },
          date: { type: Type.STRING }
        }
      }
    },
    zoning: {
      type: Type.OBJECT,
      properties: {
        classification: { type: Type.STRING },
        explanation: { type: Type.STRING },
        potential: { type: Type.STRING }
      }
    },
    economicDrivers: {
      type: Type.OBJECT,
      properties: {
        cluster: { type: Type.STRING },
        anchors: { type: Type.ARRAY, items: { type: Type.STRING } },
        socialInfrastructure: {
          type: Type.OBJECT,
          properties: {
            schools: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  name: { type: Type.STRING }, 
                  distance: { type: Type.STRING }, 
                  type: { type: Type.STRING } 
                } 
              } 
            },
            hospitals: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  name: { type: Type.STRING }, 
                  distance: { type: Type.STRING }, 
                  specialty: { type: Type.STRING } 
                } 
              } 
            },
            malls: { type: Type.STRING }
          }
        },
        industrialGrowth: { type: Type.STRING }
      }
    },
    transport: {
      type: Type.OBJECT,
      properties: {
        busStop: { 
          type: Type.OBJECT, 
          properties: { name: { type: Type.STRING }, distance: { type: Type.STRING } } 
        },
        metroStation: { 
          type: Type.OBJECT, 
          properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, line: { type: Type.STRING } } 
        },
        mmtsStation: { 
          type: Type.OBJECT, 
          properties: { name: { type: Type.STRING }, distance: { type: Type.STRING }, status: { type: Type.STRING } } 
        },
        railwayStation: { 
          type: Type.OBJECT, 
          properties: { name: { type: Type.STRING }, distance: { type: Type.STRING } } 
        }
      }
    },
    propertySpecifics: {
      type: Type.OBJECT,
      properties: {
        isSpecificAddress: { type: Type.BOOLEAN },
        frontageRoadWidth: { type: Type.STRING },
        landUseZone: { type: Type.STRING },
        nearbyLandmarks: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    schoolStats: {
      type: Type.OBJECT,
      properties: {
        count: { type: Type.NUMBER },
        radius: { type: Type.STRING },
        context: { type: Type.STRING }
      },
      required: ["count", "radius", "context"]
    },
    growthScore: {
      type: Type.OBJECT,
      properties: {
        total: { type: Type.NUMBER },
        factors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.NUMBER },
              comment: { type: Type.STRING }
            }
          }
        }
      }
    },
    newsSignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          date: { type: Type.STRING },
          impact: { type: Type.STRING },
          source: { type: Type.STRING }
        }
      }
    },
    pricing: {
      type: Type.OBJECT,
      properties: {
        fairRange: {
          type: Type.OBJECT,
          properties: {
            min: { type: Type.NUMBER },
            max: { type: Type.NUMBER }
          }
        },
        marketAverage: { type: Type.NUMBER },
        isOverpriced: { type: Type.BOOLEAN },
        breakdown: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.NUMBER }
            }
          }
        }
      }
    },
    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
    investment: {
      type: Type.OBJECT,
      properties: {
        horizon: { type: Type.STRING },
        recommendedType: { type: Type.STRING },
        developmentPhase: { type: Type.STRING },
        strategy: { type: Type.STRING }
      }
    }
  },
  required: [
    "areaName", "coordinates", "ringZone", "growthCorridor", "authority", 
    "verdict", "summary", "demographics", "strategicAnalysis", "connectivity", 
    "infrastructureMilestones", "zoning", "economicDrivers", "growthScore", 
    "newsSignals", "pricing", "pros", "cons", "investment", "schoolStats"
  ]
};

export async function generateIntelligence(address: string): Promise<LocationIntelligence> {
  const prompt = `
    You are the HydSight Real Estate Intelligence Engine, an expert analyst for Hyderabad, India.
    Analyze the following location: "${address}".
    
    Provide a detailed, data-backed investment report based on the following research strategy:
    
    1. Strategic Analysis (The "Three-Point Strategy"):
       - Highway & Intersection Mapping: Identify intersections of major national highways (NH44, NH65, NH163) with the Regional Ring Road (RRR).
       - Proximity to Urban Hubs: Locate the nearest "Big Towns" (District HQ or Municipality) with existing schools/hospitals.
       - Growth Run Rate: Estimate visual expansion (rooftop density) comparing 2020 vs 2025 based on known development data.
    
    2. Data Points:
       - Demographics: Population size within town/mandal limits and Administrative Rank.
       - Infrastructure: Road widening status (e.g., 6-laning), radial road connections, and project realization milestones.
       - Economic Drivers: Cluster type, Anchor institutions, and Social Infrastructure density.
       - Livability Check: List at least 3 specific Educational Institutions (Schools/Colleges) and 3 Clinics/Hospitals within a 5km radius.
       - School Density: Count the number of schools. If a specific address is provided, count schools within a 2km radius. If only a city/area name is provided, count the total number of schools in that entire city/area. Set schoolStats.radius to "2km" or "City-wide" and schoolStats.context accordingly.
       - Public Transport: Distance to the nearest Bus Stop, Metro Station (e.g., LB Nagar, Miyapur), MMTS extensions, and Railway Stations.
       - Industrial Growth: Specialized "cities" like Future City, Pharma City, or Industrial Parks.
       - Hyper-Local Analysis: If the user provides a specific address (Plot No, House No, Colony, Street), set isSpecificAddress to true. In this case, estimate the frontageRoadWidth (e.g., "30ft", "40ft", "60ft") based on the locality's typical layout or known master plan. Also identify the specific landUseZone (Residential, Commercial, etc.) and mention 2-3 immediate nearbyLandmarks.
    
    3. Qualitative Scoring:
       - Visible Growth Score (1-10) based on population, employment, and sustainability.
       - Investment Horizon: "Short-term Gold Mine (5-8 years)" vs "Long-term Horizon (10-25 years)".
       - Development Phase: "Early Industrial Push" vs "Self-sustained".
    
    Context for Hyderabad:
    - Ring Structure: Inside ORR, Between ORR & RRR, Beyond RRR.
    - Corridors: West, South, North, East, Central.
    - Pricing Formula: Raw Land Cost + Development (800-3500/sq yd) + Marketing + 25% Margin.
    
    Return the analysis in the specified JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: SCHEMA as any,
    },
  });

  return JSON.parse(response.text || "{}");
}
