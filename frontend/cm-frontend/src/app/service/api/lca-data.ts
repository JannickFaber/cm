export interface LCAData {
    internalUUID: string;
    flowName: string;
    type: string;
    CAS: string;
    processName: string;
    country: string;
    ISOTwoLetterCountryCode: string;
    processDescription: string;
    bioCarbonContent: number;
    carbonContent: number;
    allocationType: string;
    declaredUnit: string;
    referencePeriod: string;
    TechRep: string;
    TimeRep: string;
    GeoRep: string;
    Completeness: string;
    Reliability: string;
    MethodConsistency: string;
    OverallQuality: string;
    TechRep_TfS: string;
    TimeRep_TfS: string;
    GeoRep_TfS: string;
    Completeness_TfS: string;
    Reliability_TfS: string;
    OverallQuality_TfS: string;
    DQRShort_TfS: number;
    PDS_TfS: string;
    "Carbon Minds ISO 14067 (based on IPCC 2021) - climate change - global warming potential (GWP100) [kg CO2-Eq]": number;
    "Carbon Minds ISO 14067 (based on IPCC 2021) - climate change: biogenic emissions - global warming potential (GWP100) [kg CO2-Eq]": number;
    "Carbon Minds ISO 14067 (based on IPCC 2021) - climate change: biogenic removal - global warming potential (GWP100) [kg CO2-Eq]": number;
    "Carbon Minds ISO 14067 (based on IPCC 2021) - climate change: fossil - global warming potential (GWP100) [kg CO2-Eq]": number;
    "Carbon Minds ISO 14067 (based on IPCC 2021) - climate change: land use - global warming potential (GWP100) [kg CO2-Eq]": number;
  }
  