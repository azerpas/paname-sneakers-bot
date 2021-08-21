export type Field = [
    number, // id
    string, // label 
    null | string, // description (nullable)
    
    /** 
     * Type of field
     * 0: Short text input
     * 2: Radio button group input
     * 3: Dropdown select input
     * 4: 
     * 6: Information text
     * 9: Date input
     * 11: Image
     */
    number, // type

    /** informations (nullable) */
    [
        [
            number, // entry.id ? 
            /** options.labels */
            null | [
                string, // label
                null | undefined, null | undefined, null | undefined, number | undefined // unknown values
            ][],
            /** Required */
            number,
            null | undefined, 
            /** Verification */
            null | undefined | [
                [
                    number,
                    number,
                    /** Response to verification question */
                    [ string ],
                    /** Error message */
                    string
                ]
            ],
            null | undefined, null | undefined, null | undefined, number
        ]
    ] | null,
    undefined | null, // ? only on welcome screen
    [
        [
            string, number, number[]
        ], // ? only on welcome screen
    ] | undefined
];