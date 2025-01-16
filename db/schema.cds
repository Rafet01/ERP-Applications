using {
    cuid,     // CUID is een gestandaardiseerde ID-generator voor unieke sleutels
    managed,  // Managed voegt auditvelden zoals createdAt en modifiedAt toe
} from '@sap/cds/common';

// Context voor de Talent Management module
context Talent {

    // Entiteit voor Kandidaten
    entity Candidates: cuid, managed {
        firstName          : String(50);    // Voornaam van de kandidaat
        lastName           : String(50);    // Achternaam van de kandidaat
        dateOfBirth        : Date;          // Geboortedatum
        residence          : String(100);   // Woonplaats
        email              : String(100);   // E-mailadres
        department         : Association to Departments; // Relatie naar afdeling (bijv. HR, IT)
        contractType       : Association to ContractTypes; // Relatie naar contracttype (bijv. FullTime)
        reportsTo          : String(100);   // Naam van leidinggevende
        preferredLanguage  : String(2);     // Voorkeurstaal in twee hoofdletters (bijv. "EN", "NL", "FR", "DE")
        startDate          : Date;          // Startdatum van de kandidaat
        seniority          : Integer;       // Anciënniteit in jaren
        status             : String(10);    // Status van de kandidaat ("Approved", "Rejected")
    }

    // Entiteit voor Afdelingen
    entity Departments: managed {
        key code          : String(3);      // Unieke code voor de afdeling (bijv. "HR")
        description       : String(50);     // Beschrijving van de afdeling (bijv. "Human Resources")
    }

    // Entiteit voor Contracttypen
    entity ContractTypes: managed {
        key type          : String(20);     // Unieke type-indicator (bijv. "FullTime", "PartTime")
        description       : String(50);     // Beschrijving van het contracttype (bijv. "Full Time Employment")
    }
}
