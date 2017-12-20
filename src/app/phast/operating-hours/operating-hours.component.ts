import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { PHAST, OperatingHours } from '../../shared/models/phast/phast';

@Component({
  selector: 'app-operating-hours',
  templateUrl: 'operating-hours.component.html',
  styleUrls: ['operating-hours.component.css']
})
export class OperatingHoursComponent implements OnInit {
  @Input()
  phast: PHAST;
  @Output('save')
  save = new EventEmitter<boolean>();
  @Input()
  saveClicked: boolean;
  timeError: string = null;
  weeksPerYearError: string = null;
  daysPerWeekError: string = null;
  shiftsPerDayError: string = null;
  hoursPerShiftError: string = null;
  yearFormat: any;
  isFirstChange: boolean = true;
  counter: any;
  constructor() { }

  ngOnInit() {
    if (!this.phast.operatingHours) {
      let defaultHours: OperatingHours = {
        weeksPerYear: 52,
        daysPerWeek: 7,
        shiftsPerDay: Infinity,
        hoursPerShift: 8,
        hoursPerYear: 8736
      }
      this.phast.operatingHours = defaultHours;
      this.calculatHrsPerYear();
    } else if (!this.phast.operatingHours.hoursPerYear) {
      this.calculatHrsPerYear();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.saveClicked && !this.isFirstChange) {
      this.save.emit(true);
    } else {
      this.isFirstChange = false;
    }
  }

  calculatHrsPerYear() {
    let timeCheck = this.phast.operatingHours.shiftsPerDay * this.phast.operatingHours.hoursPerShift;
    if (timeCheck > 24) {
      this.timeError = "Invalid input. There is 24 hours per day. " + "Your day have" + " "  + timeCheck.toFixed(2) + " " + "hours." + " " + "Please, check your input.";
    } else {
      this.timeError = null;
    }
    if (this.phast.operatingHours.weeksPerYear > 52 || this.phast.operatingHours.weeksPerYear <= 0) {
      this.weeksPerYearError = "The number of Weeks per Year must me greater than 0 and equal or less than 52";
    } else {
      this.weeksPerYearError = null;
    }
    if (this.phast.operatingHours.daysPerWeek > 7 || this.phast.operatingHours.daysPerWeek <= 0) {
      this.daysPerWeekError = "The number of Days per Week must be greater than 0 and equal or less than 7";
    } else {
      this.daysPerWeekError = null;
    }
    if (this.phast.operatingHours.shiftsPerDay <= 0) {
      this.shiftsPerDayError = "Number of Shifts per Day must be greater than 0";
    } else {
      this.shiftsPerDayError = null;
    }
     if ( this.phast.operatingHours.hoursPerShift > 24 || this.phast.operatingHours.hoursPerShift <= 0) {
      this.hoursPerShiftError = " Number of Hours per Shift must be greater then 0 and equal or less than 24 ";
    } else {
      this.hoursPerShiftError = null;
    }
    this.startSavePolling();
    this.phast.operatingHours.isCalculated = true;
    this.phast.operatingHours.hoursPerYear = this.phast.operatingHours.hoursPerShift * this.phast.operatingHours.shiftsPerDay * this.phast.operatingHours.daysPerWeek * this.phast.operatingHours.weeksPerYear;
    this.yearFormat = this.phast.operatingHours.hoursPerYear.toFixed(2);
  }

  setNotCalculated() {
    this.startSavePolling();
    this.phast.operatingHours.isCalculated = false;
  }

  addShift() {
    this.phast.operatingHours.shiftsPerDay += 1;
    this.calculatHrsPerYear();
  }

  subtractShift() {
    this.phast.operatingHours.shiftsPerDay -= 1;
    this.calculatHrsPerYear();
  }
  subtractShiftHr() {
    this.phast.operatingHours.hoursPerShift -= 1;
    this.calculatHrsPerYear();
  }
  addShiftHr() {
    this.phast.operatingHours.hoursPerShift += 1;
    this.calculatHrsPerYear();
  }

  subtractWeekDay() {
    this.phast.operatingHours.daysPerWeek -= 1;
    this.calculatHrsPerYear();
  }
  addWeekDay() {
    this.phast.operatingHours.daysPerWeek += 1;
    this.calculatHrsPerYear();
  }

  addWeek() {
    this.phast.operatingHours.weeksPerYear += 1;
    this.calculatHrsPerYear();
  }

  subtractWeek() {
    this.phast.operatingHours.weeksPerYear -= 1;
    this.calculatHrsPerYear();
  }

  startSavePolling() {
    if (this.counter) {
      clearTimeout(this.counter);
    }
    this.counter = setTimeout(() => {
      this.save.emit(true);
    }, 3000)
  }

}
