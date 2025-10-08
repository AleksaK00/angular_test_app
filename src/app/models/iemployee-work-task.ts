export interface IEmployeeWorkTask {
    Id: string;
    EmployeeName: string;
    EntryNotes: string;
    StarTimeUtc: string; //Typo in the API, object will use this name for simplicity
    EndTimeUtc: string;
    DeletedOn: string | null;
}
