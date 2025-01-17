sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  (Controller, MessageToast, MessageBox, JSONModel) => {
    "use strict";

    return Controller.extend("createcandidate.controller.Create_Candidate", {
      onInit() {
        // Initialiseer een JSON-model voor de kandidaat
        const oCandidateModel = new JSONModel({
          firstName: "",
          lastName: "",
          email: "",
          department_ID: "",
          contractType_ID: "",
          preferredLanguage: "",
          startDate: null,
          seniority: null,
          status: "approved",
        });
        this.getView().setModel(oCandidateModel, "candidateModel");
      },

      onCreateCandidate() {
        // Haal het kandidaatmodel op
        const oModel = this.getView().getModel("candidateModel");
        const oData = oModel.getData();

        // Debug: Log de ingevulde data
        console.log("Candidate Data:", oData);

        // Basisvalidatie voor verplichte velden
        const requiredFields = [
          "firstName",
          "lastName",
          "email",
          "department_ID",
          "contractType_ID",
        ];
        const missingFields = requiredFields.filter(
          (field) => !oData[field] || oData[field].trim() === ""
        );

        if (missingFields.length > 0) {
          MessageToast.show(
            "Please fill in all required fields: " + missingFields.join(", ")
          );
          return;
        }

        // Haal het OData-model op (verbonden aan de backend)
        const oODataModel = this.getOwnerComponent().getModel(); // Zorg dat je `mainService` als default hebt ingesteld
        if (!oODataModel) {
          console.error("OData Model is not found!");
          MessageToast.show("OData Model is not found!");
          return;
        }

        // Stuur een create-aanroep naar de backend
        oODataModel.create("/Candidates", oData, {
          success: (response) => {
            console.log("Candidate created successfully:", response);
            MessageToast.show("Candidate created successfully!");
            this._resetForm();
          },
          error: (oError) => {
            console.error("Error creating candidate:", oError);
            MessageBox.error("Error creating candidate. Please try again.");
          },
        });
      },

      _resetForm() {
        // Reset het formulier na succesvolle creatie
        const oModel = this.getView().getModel("candidateModel");
        oModel.setData({
          firstName: "",
          lastName: "",
          email: "",
          department_ID: "",
          contractType_ID: "",
          preferredLanguage: "",
          startDate: null,
          seniority: null,
          status: "approved",
        });
      },
    });
  }
);
