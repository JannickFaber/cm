import { LCAData } from "../service/api/lca-data";

export interface ChemicalProcessData {
  id: string;
  name: string;
  type: string; // Spezifische Technologie, vereinfacht dargestellt
  cas: string; // Chemische Abstracts Service (CAS)-Nummer
  process: string; // Produktionsmethode
  country: string;
  isoCode: string;
  description: string; // Prozessbeschreibung
  bioCarbon: number;
  carbon: number; // CO2 Anteil
  allocation: string; // Biogener CO2 Anteil
  unit: string; // Produktionsmenge
  period: string; // Zeitraum
  techRep: string; // Repräsentativität der Produktionsmethode
  timeRep: string; // Zeitliche Repräsentativität
  geoRep: string;
  completeness: string; // Vollständigkeit
  reliability: string; // Zuverlässigkeit
  methodConsistency: string; // Konsistenz
  overallQuality: string; // Gesamtqualität
  techRepTfS: string;
  timeRepTfS: string;
  geoRepTfS: string;
  completenessTfS: string;
  reliabilityTfS: string;
  overallQualityTfS: string;
  dqrShortTfS: number;
  pdsTfS: string;
  gwpTotal: number; // Gesamtwert des Treibhauspotenzials über 100 Jahre (Standard in LCA-Analysen)
  gwpBiogenicEmissions: number; // Beitrag aus biogenen Quellen (z. B. Biomasse, biogene Reststoffe)
  gwpBiogenicRemoval: number; // Entnahme von CO₂ aus der Atmosphäre durch biogene Prozesse (z. B. Pflanzenwachstum oder Kohlenstoffbindung).
  gwpFossil: number; // Beitrag aus fossilen Quellen (z. B. Erdöl, Erdgas)
  gwpLandUse: number; // Emissionen durch Landnutzungsänderungen (z. B. Abholzung)
}

export function mapToChemicalProcessDataArray(data: LCAData[]): ChemicalProcessData[] {
  return data.map(lcaData => mapToChemicalProcessData(lcaData));
}

function mapToChemicalProcessData(data: LCAData): ChemicalProcessData {
  return {
    id: data.internalUUID,
    name: data.flowName,
    type: data.type,
    cas: data.CAS,
    process: data.processName,
    country: data.country,
    isoCode: data.ISOTwoLetterCountryCode,
    description: data.processDescription,
    bioCarbon: data.bioCarbonContent,
    carbon: data.carbonContent,
    allocation: data.allocationType,
    unit: data.declaredUnit,
    period: data.referencePeriod,
    techRep: data.TechRep,
    timeRep: data.TimeRep,
    geoRep: data.GeoRep,
    completeness: data.Completeness,
    reliability: data.Reliability,
    methodConsistency: data.MethodConsistency,
    overallQuality: data.OverallQuality,
    techRepTfS: data.TechRep_TfS,
    timeRepTfS: data.TimeRep_TfS,
    geoRepTfS: data.GeoRep_TfS,
    completenessTfS: data.Completeness_TfS,
    reliabilityTfS: data.Reliability_TfS,
    overallQualityTfS: data.OverallQuality_TfS,
    dqrShortTfS: data.DQRShort_TfS,
    pdsTfS: data.PDS_TfS,
    gwpTotal: data["Carbon Minds ISO 14067 (based on IPCC 2021) - climate change - global warming potential (GWP100) [kg CO2-Eq]"],
    gwpBiogenicEmissions: data["Carbon Minds ISO 14067 (based on IPCC 2021) - climate change: biogenic emissions - global warming potential (GWP100) [kg CO2-Eq]"],
    gwpBiogenicRemoval: data["Carbon Minds ISO 14067 (based on IPCC 2021) - climate change: biogenic removal - global warming potential (GWP100) [kg CO2-Eq]"],
    gwpFossil: data["Carbon Minds ISO 14067 (based on IPCC 2021) - climate change: fossil - global warming potential (GWP100) [kg CO2-Eq]"],
    gwpLandUse: data["Carbon Minds ISO 14067 (based on IPCC 2021) - climate change: land use - global warming potential (GWP100) [kg CO2-Eq]"],
  };
}