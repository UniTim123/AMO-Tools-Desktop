import { InventoryItem } from "../shared/models/inventory/inventory";



export const MockPumpInventory: InventoryItem = {
    "pumpInventoryData": {
        "co2SavingsData": {
            "energyType": 'electricity',
            "energySource": '',
            "fuelType": '',
            "totalEmissionOutputRate": 401.07,
            "electricityUse": 0,
            "eGridRegion": '',
            "eGridSubregion": 'U.S. Average',
            "totalEmissionOutput": 0,
            "userEnteredBaselineEmissions": false,
            "userEnteredModificationEmissions": true,
            "zipcode": '00000',
        },
        "departments": [
            {
                "name": "QC Dept",
                "operatingHours": 8760,
                "description": "Main building",
                "id": "l6rd7tt1i",
                "catalog": [
                    {
                        "id": "59264rw8x",
                        "departmentId": "l6rd7tt1i",
                        "description": "Main pump",
                        "name": "Pump A",

                        "nameplateData": {
                            "manufacturer": "Pumps inc.",
                            "model": "A",
                            "serialNumber": "p33333",
                        },
                        "fieldMeasurements": {
                            "pumpSpeed": 2000,
                            "yearlyOperatingHours": 8760,
                            "staticSuctionHead": 333,
                            "staticDischargeHead": 234,
                            "efficiency": 70,
                            "assessmentDate": '3333',
                            "operatingFlowRate": 2500,
                            "operatingHead": 410,
                            "measuredPower": 88.2,
                            "measuredCurrent": 370,
                            "measuredVoltage": 460,
                        },
                        "fluid": {
                            "fluidType": 'Water',
                            "fluidDensity": 1.2
                        },
                        "pumpEquipment": {
                            "pumpType": 6,
                            "shaftOrientation": 0,
                            "shaftSealType": 0,
                            "numStages": 33,
                            "inletDiameter": 30,
                            "outletDiameter": 32,
                            "maxWorkingPressure": 33,
                            "maxAmbientTemperature": 33,
                            "maxSuctionLift": 33,
                            "displacement": 33,
                            "startingTorque": 1,
                            "ratedSpeed": 2000,
                            "impellerDiameter": 33,
                            "minFlowSize": 33,
                            "pumpSize": 33,
                            "designHead": 33,
                            "designFlow": 33,
                            "designEfficiency": 65,
                        },
                        "pumpMotor": {
                            "motorRPM": 2000,
                            "lineFrequency": 60,
                            "motorRatedPower": 300,
                            "motorEfficiencyClass": 0,
                            "motorRatedVoltage": 460,
                            "motorFullLoadAmps": 389.08,
                            "motorEfficiency": 95,
                        },
                        "pumpStatus": {
                            "status": 1,
                            "priority": 0,
                            "yearInstalled": 33,
                        },
                        "systemProperties": {
                            "driveType": 1,
                            "flangeConnectionClass": 'Class A',
                            "flangeConnectionSize": 0,
                            "componentId": 'pump-123',
                            "system": 'Cooling',
                            "location": 'Building A',
                        }
                    },
                    {
                        "id": "19163yw8i",
                        "departmentId": "l6rd7tt1i",
                        "description": "New Pump installed 2021",
                        "name": "Pump B",

                        "nameplateData": {
                            "manufacturer": "Pumps Inc.",
                            "model": "B",
                            "serialNumber": "p33333",
                        },
                        "fieldMeasurements": {
                            "pumpSpeed": 2000,
                            "yearlyOperatingHours": 8760,
                            "staticSuctionHead": 333,
                            "staticDischargeHead": 333,
                            "efficiency": 33,
                            "assessmentDate": '3333',
                            "operatingFlowRate": 2500,
                            "operatingHead": 410,
                            "measuredPower": 88.2,
                            "measuredCurrent": 370,
                            "measuredVoltage": 460,
                        },
                        "fluid": {
                            "fluidType": 'Water',
                            "fluidDensity": 1.2
                        },
                        "pumpEquipment": {
                            "pumpType": 2,
                            "shaftOrientation": 0,
                            "shaftSealType": 0,
                            "numStages": 33,
                            "inletDiameter": 30,
                            "outletDiameter": 32,
                            "maxWorkingPressure": 33,
                            "maxAmbientTemperature": 33,
                            "maxSuctionLift": 33,
                            "displacement": 33,
                            "startingTorque": 1,
                            "ratedSpeed": 1500,
                            "impellerDiameter": 33,
                            "minFlowSize": 33,
                            "pumpSize": 33,
                            "designHead": 33,
                            "designFlow": 33,
                            "designEfficiency": 85,
                        },
                        "pumpMotor": {
                            "motorRPM": 1500,
                            "lineFrequency": 60,
                            "motorRatedPower": 350,
                            "motorEfficiencyClass": 0,
                            "motorRatedVoltage": 600,
                            "motorFullLoadAmps": 389.08,
                            "motorEfficiency": 95,
                        },
                        "pumpStatus": {
                            "status": 0,
                            "priority": 0,
                            "yearInstalled": 33,
                        },
                        "systemProperties": {
                            "driveType": 1,
                            "flangeConnectionClass": 'Class A',
                            "flangeConnectionSize": 0,
                            "componentId": 'pump-124',
                            "system": 'Cooling',
                            "location": 'Building B',
                        }
                    },
                ]
            },
            {
                "name": "Manufacturing Dept",
                "operatingHours": 8760,
                "description": "",
                "id": "a2jd7ua9i",
                "catalog": [
                    {
                        "id": "222y4rw8x",
                        "departmentId": "a2jd7ua9i",
                        "description": "Other pump",
                        "name": "Pump C",

                        "nameplateData": {
                            "manufacturer": "Pumps inc.",
                            "model": "C",
                            "serialNumber": "p33333",
                        },
                        "fieldMeasurements": {
                            "pumpSpeed": 2000,
                            "yearlyOperatingHours": 8760,
                            "staticSuctionHead": 333,
                            "staticDischargeHead": 333,
                            "efficiency": null,
                            "assessmentDate": '3333',
                            "operatingFlowRate": 2500,
                            "operatingHead": 410,
                            "measuredPower": 88.2,
                            "measuredCurrent": 370,
                            "measuredVoltage": 460,
                        },
                        "fluid": {
                            "fluidType": 'Water',
                            "fluidDensity": 1.2
                        },
                        "pumpEquipment": {
                            "pumpType": 7,
                            "shaftOrientation": 0,
                            "shaftSealType": 0,
                            "numStages": 33,
                            "inletDiameter": 30,
                            "outletDiameter": 32,
                            "maxWorkingPressure": 33,
                            "maxAmbientTemperature": 33,
                            "maxSuctionLift": 33,
                            "displacement": 33,
                            "startingTorque": 1,
                            "ratedSpeed": 2000,
                            "impellerDiameter": 33,
                            "minFlowSize": 33,
                            "pumpSize": 33,
                            "designHead": 33,
                            "designFlow": 33,
                            "designEfficiency": 33,
                        },
                        "pumpMotor": {
                            "motorRPM": 1500,
                            "lineFrequency": 50,
                            "motorRatedPower": 400,
                            "motorEfficiencyClass": 1,
                            "motorRatedVoltage": 300,
                            "motorFullLoadAmps": 389.08,
                            "motorEfficiency": 95,
                        },
                        "pumpStatus": {
                            "status": 0,
                            "priority": 0,
                            "yearInstalled": 33,
                        },
                        "systemProperties": {
                            "driveType": 1,
                            "flangeConnectionClass": 'Class A',
                            "flangeConnectionSize": 0,
                            "componentId": 'pump-123',
                            "system": 'Line',
                            "location": 'Building B',
                        }
                    },
                    {
                        "id": "54n63yw8i",
                        "departmentId": "a2jd7ua9i",
                        "description": "Another pump",
                        "name": "Pump D",

                        "nameplateData": {
                            "manufacturer": "Pumps Inc.",
                            "model": "D",
                            "serialNumber": "p33333",
                        },
                        "fieldMeasurements": {
                            "pumpSpeed": 2000,
                            "yearlyOperatingHours": 8760,
                            "staticSuctionHead": 333,
                            "staticDischargeHead": 333,
                            "efficiency": 33,
                            "assessmentDate": '3333',
                            "operatingFlowRate": 2500,
                            "operatingHead": 410,
                            "measuredPower": 88.2,
                            "measuredCurrent": 370,
                            "measuredVoltage": 460,
                        },
                        "fluid": {
                            "fluidType": 'Water',
                            "fluidDensity": 1.2
                        },
                        "pumpEquipment": {
                            "pumpType": 6,
                            "shaftOrientation": 0,
                            "shaftSealType": 0,
                            "numStages": 33,
                            "inletDiameter": 30,
                            "outletDiameter": 32,
                            "maxWorkingPressure": 33,
                            "maxAmbientTemperature": 33,
                            "maxSuctionLift": 33,
                            "displacement": 33,
                            "startingTorque": 1,
                            "ratedSpeed": 1500,
                            "impellerDiameter": 33,
                            "minFlowSize": 33,
                            "pumpSize": 33,
                            "designHead": 33,
                            "designFlow": 33,
                            "designEfficiency": 66,
                        },
                        "pumpMotor": {
                            "motorRPM": 4000,
                            "lineFrequency": 50,
                            "motorRatedPower": 300,
                            "motorEfficiencyClass": 0,
                            "motorRatedVoltage": 700,
                            "motorFullLoadAmps": 389.08,
                            "motorEfficiency": 95,
                        },
                        "pumpStatus": {
                            "status": 1,
                            "priority": 0,
                            "yearInstalled": 33,
                        },
                        "systemProperties": {
                            "driveType": 1,
                            "flangeConnectionClass": 'Class A',
                            "flangeConnectionSize": 0,
                            "componentId": 'pump-124',
                            "system": 'Line',
                            "location": 'Building D',
                        }
                    },
                ]
            }
        ],
        displayOptions: {
            nameplateDataOptions: {
                displayNameplateData: true,
                manufacturer: true,
                model: true,
                serialNumber: false,
            },
            pumpStatusOptions: {
                displayPumpStatus: false,
                status: false,
                priority: false,
                yearInstalled: false,
            },
            pumpPropertiesOptions: {
                displayPumpProperties: true,
                pumpType: true, 
                shaftOrientation: false, 
                shaftSealType: false, 
                numStages: true, 
                inletDiameter: true, 
                outletDiameter: true,
                maxWorkingPressure: false,
                maxAmbientTemperature: false, 
                maxSuctionLift: false, 
                displacement: false, 
                startingTorque: false,
                ratedSpeed: false, 
                impellerDiameter: false, 
                minFlowSize: false, 
                pumpSize: false, 
                designHead: false,
                designFlow: false,
                designEfficiency: false,
              },
              fluidPropertiesOptions: {
                displayFluidProperties: true,
                fluidType: true,
                fluidDensity: true
              },
              systemPropertiesOptions: {
                displaySystemProperties: true,
                driveType: true,
                flangeConnectionClass: false,
                flangeConnectionSize: false,
                componentId: false,
                system: false,
                location: false 
              },
              fieldMeasurementOptions: {
                displayFieldMeasurements: true,
                pumpSpeed: true,
                yearlyOperatingHours: true,
                staticSuctionHead: false,
                staticDischargeHead: false,
                efficiency: false,
                assessmentDate: false,
                operatingFlowRate: true,
                operatingHead: true,
                measuredPower: true,
                measuredCurrent: true,
                measuredVoltage: true,
              },
              pumpMotorPropertiesOptions: {
                displayPumpMotorProperties: true,
                motorRPM: true,
                lineFrequency: true,
                motorRatedPower: true,
                motorEfficiencyClass: true,
                motorRatedVoltage: true,
                motorFullLoadAmps: true,
                motorEfficiency: true,
              }
        }
    },
    "createdDate": new Date(),
    "modifiedDate": new Date(),
    "type": "pumpInventory",
    "name": "Example Pump Inventory",
    "appVersion": "0.10.0-beta",
    "isExample": true,
}