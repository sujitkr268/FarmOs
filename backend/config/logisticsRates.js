/**
 * FarmOS Smart Freight Logistics Config
 * 
 * Defines standard vehicle categories, capacities, base rates per km,
 * and minimum freight charges for agricultural crop transport in India.
 */

const LOGISTICS_RATES = {
  mini_truck: {
    id: "mini_truck",
    name: "Mini Truck (e.g., Tata Ace / Mahindra Bolero Pickup)",
    capacity_kg: 1000, // 1 Ton
    base_rate_per_km: 20, // ₹20 / km
    min_charge: 500 // ₹500 minimum trip charge
  },
  small_truck: {
    id: "small_truck",
    name: "Small Truck (e.g., 14ft Eicher / Canter)",
    capacity_kg: 3000, // 3 Tons
    base_rate_per_km: 30, // ₹30 / km
    min_charge: 1000
  },
  medium_truck: {
    id: "medium_truck",
    name: "Medium Truck (6-Wheeler / 17ft Eicher)",
    capacity_kg: 9000, // 9 Tons
    base_rate_per_km: 45, // ₹45 / km
    min_charge: 2000
  },
  large_truck: {
    id: "large_truck",
    name: "Heavy Truck (10-Wheeler / Multi-Axle)",
    capacity_kg: 20000, // 20 Tons
    base_rate_per_km: 65, // ₹65 / km
    min_charge: 3500
  }
};

/**
 * Automatically select the smallest suitable vehicle category for a given crop quantity
 * @param {number} quantityKg - Harvest weight in kilograms
 */
const selectDefaultVehicle = (quantityKg) => {
  const qty = Number(quantityKg) || 500;
  if (qty <= 1000) return "mini_truck";
  if (qty <= 3000) return "small_truck";
  if (qty <= 9000) return "medium_truck";
  return "large_truck";
};

module.exports = {
  LOGISTICS_RATES,
  selectDefaultVehicle
};
