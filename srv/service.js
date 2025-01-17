const cds = require("@sap/cds");
const httpclient = require("@sap-cloud-sdk/http-client");

module.exports = cds.service.impl(async function () {
  const { Candidates, Departments } = this.entities;

  // Validatie vóór het aanmaken van een kandidaat
  this.before("CREATE", "Candidates", async (req) => {
    const { department_ID } = req.data;

    // Haal het aantal kandidaten per afdeling op
    const existingCount = await SELECT.from(Candidates)
      .where({ department_ID })
      .count();

    // Maximale aantallen per afdeling
    const maxPerDepartment = {
      HR: 5,
      FIN: 5,
      SAL: 3,
      MKT: 3,
      DEV: 10,
      IT: 5,
    };

    if (existingCount >= maxPerDepartment[department_ID]) {
      return req.error(
        400,
        `The maximum number of candidates for the ${department_ID} department has been reached.`
      );
    }
  });

  // Validatie vóór het updaten van een kandidaat
  this.before(["UPDATE", "PATCH"], "Candidates", (req) => {
    const { preferredLanguage } = req.data;
    if (
      preferredLanguage &&
      !["EN", "NL", "FR", "DE"].includes(preferredLanguage)
    ) {
      req.error(400, "Preferred language must be one of EN, NL, FR, or DE.");
    }
  });

  // Voeg extra gegevens toe bij het ophalen van kandidaten
  this.after("READ", "Candidates", (candidates) => {
    if (!Array.isArray(candidates)) candidates = [candidates];
    for (const candidate of candidates) {
      if (candidate.department_ID) {
        switch (candidate.department_ID) {
          case "HR":
            candidate.departmentName = "Human Resources";
            break;
          case "FIN":
            candidate.departmentName = "Finance";
            break;
          case "SAL":
            candidate.departmentName = "Sales";
            break;
          case "MKT":
            candidate.departmentName = "Marketing";
            break;
          case "DEV":
            candidate.departmentName = "Development";
            break;
          case "IT":
            candidate.departmentName = "IT Department";
            break;
          default:
            candidate.departmentName = "Unknown Department";
        }
      }
    }
  });

  // Export naar Excel
  this.on("ExportToExcel", async (req) => {
    console.log("ExportToExcel action triggered...");
    const candidates = await SELECT.from(Candidates);
    console.log("Fetched candidates:", candidates);

    if (!candidates.length) {
      req.error(404, "No candidates found to export.");
    }

    return candidates.map((candidate) => ({
      ID: candidate.ID,
      Name: `${candidate.firstName || ""} ${candidate.lastName || ""}`,
      Department: candidate.department_ID || "N/A",
      Status: candidate.status || "N/A",
      Email: candidate.email || "N/A",
    }));
  });

  // Externe API-aanroep (voorbeeld, gebaseerd op gedeelde code)
  this.on("GetExternalData", async (req) => {
    console.log("Fetching external data from Northwind...");
    const externalData = await getFirstProductFromNorthwind();
    console.log("External Data:", externalData);
    return externalData;
  });
});

// Functie om externe data op te halen
async function getFirstProductFromNorthwind() {
  let response = await httpclient
    .executeHttpRequest(
      {
        destinationName: "northwind",
      },
      {
        method: "GET",
        url: "/Products",
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          top: 1,
          format: "json",
        },
        parameterEncoder: httpclient.encodeAllParameters,
      }
    )
    .catch((error) => {
      console.error("Error fetching external data:", error);
      return null;
    });
  return response?.data || [];
}
