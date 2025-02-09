export interface GWPValues {
        name: string;
        cas: string; // Chemische Abstracts Service (CAS)-Nummer
        country: string;
        gwpTotal: number; // Gesamtwert des Treibhauspotenzials über 100 Jahre (Standard in LCA-Analysen)
        gwpBiogenicEmissions: number; // Beitrag aus biogenen Quellen (z. B. Biomasse, biogene Reststoffe)
        gwpBiogenicRemoval: number; // Entnahme von CO₂ aus der Atmosphäre durch biogene Prozesse (z. B. Pflanzenwachstum oder Kohlenstoffbindung).
        gwpFossil: number; // Beitrag aus fossilen Quellen (z. B. Erdöl, Erdgas)
        gwpLandUse: number; // Emissionen durch Landnutzungsänderungen (z. B. Abholzung)
}