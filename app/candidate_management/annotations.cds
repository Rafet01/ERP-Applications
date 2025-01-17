using CandidateService as service from '../../srv/services';
annotate service.Candidates with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : firstName,
            },
            {
                $Type : 'UI.DataField',
                Value : lastName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'fullName',
                Value : fullName,
            },
            {
                $Type : 'UI.DataField',
                Value : birthDate,
            },
            {
                $Type : 'UI.DataField',
                Value : city,
            },
            {
                $Type : 'UI.DataField',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'department_ID',
                Value : department_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'contractType_ID',
                Value : contractType_ID,
            },
            {
                $Type : 'UI.DataField',
                Value : reportsTo,
            },
            {
                $Type : 'UI.DataField',
                Value : preferredLanguage,
            },
            {
                $Type : 'UI.DataField',
                Value : startDate,
            },
            {
                $Type : 'UI.DataField',
                Value : seniority,
            },
            {
                $Type : 'UI.DataField',
                Value : status,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : firstName,
        },
        {
            $Type : 'UI.DataField',
            Value : lastName,
        },
        {
            $Type : 'UI.DataField',
            Value : reportsTo,
        },
        {
            $Type : 'UI.DataField',
            Value : status,
        },
        {
            $Type : 'UI.DataField',
            Value : contractType_ID,
        },
        {
            $Type : 'UI.DataField',
            Value : email,
        },
        {
            $Type : 'UI.DataField',
            Value : seniority,
        },
    ],
    UI.SelectionFields : [
        firstName,
        lastName,
        email,
        status,
        reportsTo,
        contractType.ID,
    ],
);

annotate service.Candidates with {
    department @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Departments',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : department_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'maxCandidates',
            },
        ],
    }
};

annotate service.Candidates with {
    contractType @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'ContractTypes',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : contractType_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description',
            },
        ],
    }
};

annotate service.ContractTypes with {
    ID @Common.Label : 'Contract Type'
};

