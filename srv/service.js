const cds = require('@sap/cds');
const httpclient = require("@sap-cloud-sdk/http-client");

module.exports = cds.service.impl(async function () {
    const { Candidates, Departments, ContractTypes } = this.entities;

    // Definieer het maximum aantal kandidaten per afdeling in een object
    const MAX_CANDIDATES = {
        HR: 5,
        FIN: 5,
        SAL: 3,
        MKT: 3,
        DEV: 10,
        IT: 5
    };

    // Functie om te controleren of een afdeling de limiet overschrijdt
    async function checkDepartmentCapacity(tx, department) {
        const count = await tx.run(
            SELECT.from(Candidates).where({ department })
        );
        return count.length;
    }

    // Hook voor het controleren van validaties vóór het aanmaken van een kandidaat
    this.before('CREATE', Candidates, async (req) => {
        const { department } = req.data;

        if (!department) {
            req.reject(400, 'Een afdeling is verplicht.');
        }

        if (!MAX_CANDIDATES[department]) {
            req.reject(400, `Afdeling ${department} is niet geldig.`);
        }

        const tx = cds.transaction(req);
        const candidateCount = await checkDepartmentCapacity(tx, department);

        if (candidateCount >= MAX_CANDIDATES[department]) {
            req.reject(400, `Het maximum aantal kandidaten (${MAX_CANDIDATES[department]}) voor afdeling ${department} is bereikt.`);
        }

        // Controleer of de voorkeursstaal geldig is
        const validLanguages = ['EN', 'NL', 'FR', 'DE'];
        if (!validLanguages.includes(req.data.preferredLanguage)) {
            req.reject(400, `De voorkeurstaal moet een van de volgende zijn: ${validLanguages.join(', ')}.`);
        }

        // Controleer of de startdatum niet in de toekomst ligt
        const today = new Date();
        if (new Date(req.data.startDate) > today) {
            req.reject(400, 'De startdatum kan niet in de toekomst liggen.');
        }
    });

    // Hook na het aanmaken van een kandidaat om een workflow te starten
    this.after('CREATE', Candidates, async (req) => {
        const payload = {
            definitionId: 'candidateApprovalProcess',
            context: {
                candidate: {
                    firstName: req.firstName,
                    lastName: req.lastName,
                    dateOfBirth: req.dateOfBirth,
                    residence: req.residence,
                    email: req.email,
                    department: req.department,
                    contractType: req.contractType,
                    reportsTo: req.reportsTo,
                    preferredLanguage: req.preferredLanguage,
                    startDate: req.startDate,
                    seniority: req.seniority,
                    status: 'Pending'
                }
            }
        };

        try {
            const response = await httpclient.executeHttpRequest(
                { destinationName: 'spa_process_destination' },
                {
                    method: 'POST',
                    url: '/workflow/rest/v1/workflow-instances',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: payload
                }
            );
            console.log('Business process gestart:', response.data);
        } catch (error) {
            console.error('Fout bij het starten van het business process:', error.message);
        }
    });

    // Hook voor het ophalen van afdelingen
    this.on('READ', Departments, async () => {
        return [
            { code: 'HR', description: 'Human Resources' },
            { code: 'FIN', description: 'Finance' },
            { code: 'SAL', description: 'Sales' },
            { code: 'MKT', description: 'Marketing' },
            { code: 'DEV', description: 'Development' },
            { code: 'IT', description: 'IT Department' }
        ];
    });

    // Hook voor het ophalen van contracttypes
    this.on('READ', ContractTypes, async () => {
        return [
            { type: 'FullTime', description: 'Full Time Employment' },
            { type: '4/5', description: '4/5 Employment' },
            { type: '3/5', description: '3/5 Employment' },
            { type: 'PartTime', description: 'Part Time Employment' },
            { type: 'Internship', description: 'Stage' }
        ];
    });
});
