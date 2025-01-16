using Talent from '../db/schema';

service TalentService {
    // Expose de Candidates-entiteit met standaard CRUD-operaties
    entity Candidates as projection on Talent.Candidates;

    // Expose de Departments-entiteit met standaard CRUD-operaties
    entity Departments as projection on Talent.Departments;

    // Expose de ContractTypes-entiteit met standaard CRUD-operaties
    entity ContractTypes as projection on Talent.ContractTypes;

}