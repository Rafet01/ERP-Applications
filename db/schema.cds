using {
    cuid,
    managed
} from '@sap/cds/common';

/**
 * Candidate Management
 */
context CandidateManagement {

    entity Departments : cuid, managed {
        key ID          : String(5) @title: 'Department Code';
        description     : String(50) @title: 'Description';
        maxCandidates   : Integer @title: 'Maximum Number of Candidates';
    }
    
    entity ContractTypes : cuid, managed {
        key ID          : String(10) @title: 'Contract Code';
        description     : String(50) @title: 'Description';
    }

    entity Candidates : cuid, managed {
        firstName       : String(50) @title: 'First Name';
        lastName        : String(50) @title: 'Last Name';
        fullName        : String = firstName || ' ' || lastName;
        birthDate       : Date @title: 'Date of Birth';
        city            : String(50) @title: 'City';
        email           : String(100) @title: 'Email Address';
        department      : Association to Departments @title: 'Department';
        contractType    : Association to ContractTypes @title: 'Contract Type';
        reportsTo       : String(50) @title: 'Reports To';
      
       preferredLanguage : String(2) @title: 'Preferred Language' enum {
            EN = 'EN'; // English
            NL = 'NL'; // Dutch
            FR = 'FR'; // French
            DE = 'DE'; // German
        };

        startDate       : Date @title: 'Start Date';
        seniority       : Integer @title: 'Seniority (Years)';

        status : String(10) @title: 'Status' enum {
            approved = 'Approved';
            rejected = 'Rejected';
        };
    };
}
