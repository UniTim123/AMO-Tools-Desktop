
export interface ChargeMaterial {
  chargeMaterialType?: string,
  gasChargeMaterial?: GasChargeMaterial,
  liquidChargeMaterial?: LiquidChargeMaterial,
  solidChargeMaterial?: SolidChargeMaterial
}

export interface GasChargeMaterial {
  materialName?: string,
  thermicReactionType?: number,
  specificHeatGas?: number,
  feedRate?: number,
  percentVapor?: number,
  initialTemperature?: number,
  dischargeTemperature?: number,
  specificHeatVapor?: number,
  percentReacted?: number,
  reactionHeat?: number,
  additionalHeat?: number,
  heatRequired?: number
}

export interface LiquidChargeMaterial {
  materialName?: string,
  thermicReactionType?: number,
  specificHeatLiquid?: number,
  vaporizingTemperature?: number,
  latentHeat?: number,
  specificHeatVapor?: number,
  chargeFeedRate?: number,
  initialTemperature?: number,
  dischargeTemperature?: number,
  percentVaporized?: number,
  percentReacted?: number,
  reactionHeat?: number,
  additionalHeat?: number,
  heatRequired?: number
}
export interface SolidChargeMaterial {
  materialId?: number,
  thermicReactionType?: number,
  specificHeatSolid?: number,
  latentHeat?: number,
  specificHeatLiquid?: number,
  meltingPoint?: number,
  chargeFeedRate?: number,
  waterContentCharged?: number,
  waterContentDischarged?: number,
  initialTemperature?: number,
  dischargeTemperature?: number,
  waterVaporDischargeTemperature?: number,
  chargeMelted?: number,
  chargeReacted?: number,
  reactionHeat?: number,
  additionalHeat?: number,
  heatRequired?: number
}