sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'candidatemanagement/test/integration/FirstJourney',
		'candidatemanagement/test/integration/pages/CandidatesList',
		'candidatemanagement/test/integration/pages/CandidatesObjectPage'
    ],
    function(JourneyRunner, opaJourney, CandidatesList, CandidatesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('candidatemanagement') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheCandidatesList: CandidatesList,
					onTheCandidatesObjectPage: CandidatesObjectPage
                }
            },
            opaJourney.run
        );
    }
);