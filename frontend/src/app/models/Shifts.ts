export type Shift = {
    shiftID : number,
    employeeID : number,
    shiftDate : string,
    shiftTime : string
}

export interface NewShift {
    employeeID: number;
    shiftDate: string;
    shiftTime: string;
    // Add other required properties for creation
}