export interface IEmployeeWorkTask {
    Id: string;
    EmployeeName: string;
    EntryNotes: string;
    StarTimeUtc: string; //Typo in the API, object will use typoed name in the test for simplicity
    EndTimeUtc: string;
    DeletedOn: string | null;
}
