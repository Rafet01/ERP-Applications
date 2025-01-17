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
          birthDate: null, // Toegevoegd veld
          city: "", // Toegevoegd veld
          email: "",
          department_ID: "",
          contractType_ID: "",
          reportsTo: "", // Toegevoegd veld
          preferredLanguage: "",
          startDate: null,
          seniority: null,
          status: "approved",
        });
        this.getView().setModel(oCandidateModel, "candidateModel");
      },

      onCreateCandidate: function () {
        // Haal het V4-model op
        const oModel = this.getOwnerComponent().getModel();
        // Haal de data uit het JSONModel 'candidateModel'
        const oData = this.getView().getModel("candidateModel").getData();

        // Format the dates to YYYY-MM-DD
        if (oData.startDate) {
          const startDate = new Date(oData.startDate);
          oData.startDate = startDate.toISOString().split("T")[0];
        }
        if (oData.birthDate) {
          const birthDate = new Date(oData.birthDate);
          oData.birthDate = birthDate.toISOString().split("T")[0];
        }

        // 1) Maak een ListBinding op de entity-set "/Candidates"
        const oListBinding = oModel.bindList(
          "/Candidates",
          undefined,
          undefined,
          undefined,
          {
            $$updateGroupId: "createCandidate",
          }
        );

        // 2) Maak een "pending create" entry
        const oNewContext = oListBinding.create(oData);

        // 3) Verstuur de batch
        oModel
          .submitBatch("createCandidate")
          .then(() => {
            MessageToast.show("Candidate created successfully!");
            this._resetForm(); // Reset het formulier na succesvolle creatie
          })
          .catch((err) => {
            MessageBox.error("Error creating candidate.");
            console.error(err);
          });
      },

      _resetForm() {
        // Reset het formulier na succesvolle creatie
        const oModel = this.getView().getModel("candidateModel");
        oModel.setData({
          firstName: "",
          lastName: "",
          birthDate: null, // Reset veld
          city: "", // Reset veld
          email: "",
          department_ID: "",
          contractType_ID: "",
          reportsTo: "", // Reset veld
          preferredLanguage: "",
          startDate: null,
          seniority: null,
          status: "approved",
        });
      },
    });
  }
);
