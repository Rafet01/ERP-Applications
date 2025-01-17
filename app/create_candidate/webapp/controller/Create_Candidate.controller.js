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

      onCreateCandidate: function () {
        // Haal het V4-model op
        const oModel = this.getOwnerComponent().getModel();
        // Stel dat je een JSONModel 'candidateModel' hebt:
        const oData = this.getView().getModel("candidateModel").getData();

        // Format the date to YYYY-MM-DD
        if (oData.startDate) {
          const oDate = new Date(oData.startDate);
          oData.startDate = oDate.toISOString().split("T")[0];
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
            sap.m.MessageToast.show("Candidate created successfully!");
            // reset form etc.
          })
          .catch((err) => {
            sap.m.MessageBox.error("Error creating candidate.");
            console.error(err);
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
