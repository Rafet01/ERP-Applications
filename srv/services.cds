using CandidateManagement from '../db/schema';

/**
 * Candidate Services
 */
service CandidateService {

    /**
     * Expose Candidates entity
     */
    entity Candidates as projection on CandidateManagement.Candidates;

    /**
     * Expose Departments entity
     */
    entity Departments as projection on CandidateManagement.Departments;

    /**
     * Expose ContractTypes entity
     */
    entity ContractTypes as projection on CandidateManagement.ContractTypes;
}