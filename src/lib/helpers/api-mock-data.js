export const users = [
  {
    _id: '1',
    userPrincipalName: 'per.son@fylke.no',
    samAccountName: 'per12051',
    givenName: 'Per',
    userType: 'ansattVFYLKE',
    surName: 'Son',
    displayName: 'Per Son',
    domain: 'login',
    enabled: true,
    countyOU: 'VFYLKE',
    ou: 'AUTO USERS',
    extensionAttribute7: null,
    extensionAttribute9: '1223455',
    extensionAttribute14: 'TFK',
    departmentShort: 'ORG-DIGI',
    departmentAdditional: null,
    office: 'Alkishuset i Tønsberg',
    company: 'Bryggeriet',
    title: 'Ølsmaker',
    state: 'ORG',
    feide: false
  },
  {
    _id: '2',
    userPrincipalName: 'mock.man@fylke.no',
    samAccountName: 'mock200',
    givenName: 'Mock',
    userType: 'ansattVTFK',
    surName: 'Man',
    displayName: 'Mock Man',
    domain: 'login',
    enabled: true,
    countyOU: 'VTFK',
    ou: 'AUTO USERS',
    extensionAttribute7: null,
    extensionAttribute9: '1223455',
    extensionAttribute14: 'TFK',
    departmentShort: 'OBOS-LIGAEN',
    departmentAdditional: null,
    office: 'Hjemmekontor',
    company: 'CIA',
    title: 'CEO',
    state: 'ORG',
    feide: false
  },
  {
    _id: '3',
    userPrincipalName: 'noen.andre@fylke.no',
    samAccountName: 'noe4242',
    givenName: 'Noen',
    userType: 'elevVTFK',
    surName: 'André',
    displayName: 'Noen André',
    domain: 'skole',
    enabled: true,
    countyOU: 'VTFK',
    ou: 'AUTO USERS',
    extensionAttribute7: null,
    extensionAttribute9: '1223455',
    extensionAttribute14: 'TFK',
    departmentShort: 'Livets skole',
    departmentAdditional: null,
    office: 'Skulkekontoret',
    company: 'Livets skole',
    title: 'Elev',
    state: 'Aas pilsner er digg',
    feide: true
  }
]

export const finishedReport = {
  _id: '65c21b1c9b3bf74aca6db437',
  instanceId: '2b65dd13-d5ea-44f4-81d2-076c2ced45fd',
  startedTimestamp: '2024-02-06T11:42:20.898Z',
  running: false,
  queued: true,
  ready: false,
  finishedTimestamp: '2024-02-06T11:42:25.431Z',
  runtime: null,
  user: {
    _id: '65c0c2b9eb182ba33f365b36',
    userPrincipalName: 'per.son@fylke.no',
    samAccountName: 'per12051',
    givenName: 'Per',
    userType: 'ansattVFYLKE',
    surName: 'Son',
    displayName: 'Per Son',
    domain: 'login',
    enabled: true,
    countyOU: 'VFYLKE',
    ou: 'AUTO USERS',
    extensionAttribute7: null,
    extensionAttribute9: '1223455',
    extensionAttribute14: 'TFK',
    departmentShort: 'ORG-DIGI',
    departmentAdditional: null,
    office: 'Alkishuset i Tønsberg',
    company: 'Bryggeriet',
    title: 'Ølsmaker',
    state: 'ORG',
    feide: false
  },
  caller: {
    upn: 'demo.spokelse@vestfoldfylke.no',
    oid: '12345'
  },
  systems: [
    {
      id: 'system_1',
      name: 'Et system',
      description: 'En beskrivelse av systemet',
      failed: false,
      startedTimestamp: '2024-02-06T11:42:21.884Z',
      finishedTimestamp: '2024-02-06T11:42:21.936Z',
      runtime: 52,
      tests: [
        {
          id: 'test_1',
          title: 'Test 1 sin tittel',
          description: 'En beskrivelse av testen',
          waitForAllData: false,
          result: {
            status: 'error',
            message: 'Denne testen har feilet',
            solution: 'Og den har en løsning og'
          }
        },
        {
          id: 'test_2',
          title: 'Test 2 sin tittel',
          description: 'Test 2 sin beskrivelse',
          waitForAllData: true,
          result: {
            status: 'warning',
            message: 'Denne testen har en advarsel'
          }
        },
        {
          id: 'test_3',
          title: 'Test 3 sin tittel',
          description: 'Test 3 sin beskrivelse',
          waitForAllData: true,
          result: {
            status: 'ok',
            message: 'Denne testen gikk bra og har litt data med seg',
            raw: { littData: 'her er litt data', littMer: { inniLittMer: 'her er noe mer' } }
          }
        }
      ],
      data: {
        info: 'Her er all dataen vi hentet for dette systemet',
        merInfo: 'Men, det var ikke så mye data da...'
      }
    },
    {
      id: 'system_2',
      name: 'Et annet system',
      description: 'En beskrivelse av det andre systemet',
      failed: false,
      startedTimestamp: '2024-02-06T11:42:21.884Z',
      finishedTimestamp: '2024-02-06T11:42:21.936Z',
      runtime: 52,
      tests: [
        {
          id: 'test_1',
          title: 'Test 1 sin tittel',
          description: 'En beskrivelse av testen',
          waitForAllData: false,
          result: {
            status: 'ok',
            message: 'Dette gikk fint',
            solution: 'Og vi har med oss litt info',
            raw: 'Og litt data'
          }
        },
        {
          id: 'test_2',
          title: 'Test 2 sin tittel',
          description: 'Test 2 sin beskrivelse',
          waitForAllData: true,
          result: {
            status: 'ok',
            message: 'Dette gikk også fint'
          }
        }
      ],
      data: {
        info: 'Her er all dataen vi hentet for dette systemet',
        merInfo: 'Men, det var ikke så mye data da...'
      }
    },
    {
      id: 'system_3',
      name: 'Et tredje system',
      description: 'En beskrivelse av det tredje systemet',
      failed: false,
      startedTimestamp: '2024-02-06T11:42:21.884Z',
      finishedTimestamp: '2024-02-06T11:42:21.936Z',
      runtime: 52,
      tests: [
        {
          id: 'test_1',
          title: 'Test 1 sin tittel',
          description: 'En beskrivelse av testen',
          waitForAllData: false,
          result: {
            status: 'warning',
            message: 'AIAIA en advarsel',
            solution: 'Her står det litt mer om advarselen',
            raw: ['Og det følger med litt data', 'i en list', 2554343, 'med et tall i og']
          }
        },
        {
          id: 'test_2',
          title: 'Test 2 sin tittel',
          description: 'Test 2 sin beskrivelse',
          waitForAllData: true,
          result: {
            status: 'ok',
            message: 'Dette gikk jo fint!'
          }
        },
        {
          id: 'test_3',
          title: 'Test 3 sin tittel',
          description: 'Test 3 sin beskrivelse',
          waitForAllData: true,
          result: {
            status: 'error',
            message: 'HER ER DET EN FEIL! 🤡'
          }
        },
        {
          id: 'test_4',
          title: 'Test 4 sin tittel',
          description: 'Test 4 sin beskrivelse',
          waitForAllData: true,
          result: {
            status: 'error',
            message: 'STEIKE! Her er enda en feil! 😫',
            solution: 'Men den har løsning da'
          }
        },
        {
          id: 'test_5',
          title: 'Test 5 sin tittel',
          description: 'Test 5 sin beskrivelse',
          waitForAllData: true,
          result: {
            status: 'warning',
            message: 'warning warning!',
            raw: 'Den har litt data da'
          }
        },
        {
          id: 'test_6',
          title: 'Test 6 sin tittel',
          description: 'Test 6 sin beskrivelse',
          waitForAllData: true,
          result: {
            status: 'ok',
            message: 'gikk fint detta',
            raw: 'og data har vi med'
          }
        }
      ],
      data: {
        info: 'Her er all dataen vi hentet for dette systemet',
        merInfo: 'Men, det var ikke så mye data da...'
      }
    },
    {
      id: 'system_4',
      name: 'Et lite system til',
      description: 'En beskrivelse av det fjerde systemet',
      failed: false,
      startedTimestamp: '2024-02-06T11:42:21.884Z',
      finishedTimestamp: '2024-02-06T11:42:21.936Z',
      runtime: 52,
      tests: [
        {
          id: 'test_1',
          title: 'Test 1 sin tittel',
          description: 'En beskrivelse av testen',
          waitForAllData: false,
          result: {
            status: 'warning',
            message: 'Huff'
          }
        },
        {
          id: 'test_2',
          title: 'Test 2 sin tittel',
          description: 'Test 2 sin beskrivelse',
          waitForAllData: true,
          result: {
            status: 'warning',
            message: 'drit'
          }
        }
      ],
      data: {
        info: 'Her er all dataen vi hentet for dette systemet',
        merInfo: 'Men, det var ikke så mye data da...'
      }
    }
  ]
}

export const generateMockReport = (inProgress) => {
  return {
    _id: '65c21b1c9b3bf74aca6db437',
    instanceId: '2b65dd13-d5ea-44f4-81d2-076c2ced45fd',
    startedTimestamp: '2024-02-06T11:42:20.898Z',
    running: false,
    queued: true,
    ready: false,
    finishedTimestamp: inProgress ? null : '2024-02-06T11:42:25.431Z',
    serverRuntime: inProgress ? null : 10578,
    totalRuntime: inProgress ? null : 11698,
    user: {
      _id: '65c0c2b9eb182ba33f365b36',
      userPrincipalName: 'per.son@fylke.no',
      samAccountName: 'per12051',
      givenName: 'Per',
      userType: 'ansattVFYLKE',
      surName: 'Son',
      displayName: 'Per Son',
      domain: 'login',
      enabled: true,
      countyOU: 'VFYLKE',
      ou: 'AUTO USERS',
      extensionAttribute7: null,
      extensionAttribute9: '1223455',
      extensionAttribute14: 'TFK',
      departmentShort: 'ORG-DIGI',
      departmentAdditional: null,
      office: 'Alkishuset i Tønsberg',
      companyName: 'Bryggeriet',
      jobTitle: 'Ølsmaker',
      state: 'ORG',
      feide: false
    },
    caller: {
      upn: 'demo.spokelse@vestfoldfylke.no',
      oid: '12345'
    },
    systems: [
      {
        id: 'system_1',
        name: 'Et system',
        description: 'En beskrivelse av systemet',
        failed: false,
        startedTimestamp: '2024-02-06T11:42:21.884Z',
        finishedTimestamp: inProgress ? null : '2024-02-06T11:42:25.431Z',
        runtime: 52,
        tests: [
          {
            id: 'test_1',
            title: 'Test 1 sin tittel',
            description: 'En beskrivelse av testen',
            waitForAllData: false,
            result: inProgress ? null : {
              status: 'error',
              message: 'Denne testen har feilet',
              solution: 'Og den har en løsning og'
            }
          },
          {
            id: 'test_2',
            title: 'Test 2 sin tittel',
            description: 'Test 2 sin beskrivelse',
            waitForAllData: true,
            result: inProgress ? null : {
              status: 'warning',
              message: 'Denne testen har en advarsel'
            }
          },
          {
            id: 'test_3',
            title: 'Test 3 sin tittel',
            description: 'Test 3 sin beskrivelse',
            waitForAllData: true,
            result: {
              status: 'ok',
              message: 'Denne testen gikk bra og har litt data med seg',
              raw: { littData: 'her er litt data', littMer: { inniLittMer: 'her er noe mer' } }
            }
          }
        ],
        data: {
          info: 'Her er all dataen vi hentet for dette systemet',
          merInfo: 'Men, det var ikke så mye data da...'
        }
      },
      {
        id: 'system_2',
        name: 'Et annet system',
        description: 'En beskrivelse av det andre systemet',
        failed: false,
        startedTimestamp: '2024-02-06T11:42:21.884Z',
        finishedTimestamp: inProgress ? null : '2024-02-06T11:42:21.936Z',
        runtime: 52,
        tests: [
          {
            id: 'test_1',
            title: 'Test 1 sin tittel',
            description: 'En beskrivelse av testen',
            waitForAllData: false,
            result: {
              status: 'ok',
              message: 'Dette gikk fint',
              solution: 'Og vi har med oss litt info',
              raw: 'Og litt data'
            }
          },
          {
            id: 'test_2',
            title: 'Test 2 sin tittel',
            description: 'Test 2 sin beskrivelse',
            waitForAllData: true,
            result: inProgress ? null : {
              status: 'ok',
              message: 'Dette gikk også fint'
            }
          }
        ],
        data: {
          info: 'Her er all dataen vi hentet for dette systemet',
          merInfo: 'Men, det var ikke så mye data da...'
        }
      },
      {
        id: 'system_3',
        name: 'Et tredje system',
        description: 'En beskrivelse av det tredje systemet',
        failed: false,
        startedTimestamp: '2024-02-06T11:42:21.884Z',
        finishedTimestamp: '2024-02-06T11:42:21.936Z',
        runtime: 52,
        tests: [
          {
            id: 'test_1',
            title: 'Test 1 sin tittel',
            description: 'En beskrivelse av testen',
            waitForAllData: false,
            result: {
              status: 'warning',
              message: 'AIAIA en advarsel',
              solution: 'Her står det litt mer om advarselen',
              raw: ['Og det følger med litt data', 'i en list', 2554343, 'med et tall i og']
            }
          },
          {
            id: 'test_2',
            title: 'Test 2 sin tittel',
            description: 'Test 2 sin beskrivelse',
            waitForAllData: true,
            result: {
              status: 'ok',
              message: 'Dette gikk jo fint!'
            }
          },
          {
            id: 'test_3',
            title: 'Test 3 sin tittel',
            description: 'Test 3 sin beskrivelse',
            waitForAllData: true,
            result: {
              status: 'error',
              message: 'HER ER DET EN FEIL! 🤡'
            }
          },
          {
            id: 'test_4',
            title: 'Test 4 sin tittel',
            description: 'Test 4 sin beskrivelse',
            waitForAllData: true,
            result: {
              status: 'error',
              message: 'STEIKE! Her er enda en feil! 😫',
              solution: 'Men den har løsning da'
            }
          },
          {
            id: 'test_5',
            title: 'Test 5 sin tittel',
            description: 'Test 5 sin beskrivelse',
            waitForAllData: true,
            result: {
              status: 'warning',
              message: 'warning warning!',
              raw: 'Den har litt data da'
            }
          },
          {
            id: 'test_6',
            title: 'Test 6 sin tittel',
            description: 'Test 6 sin beskrivelse',
            waitForAllData: true,
            result: {
              status: 'ok',
              message: 'gikk fint detta',
              raw: 'og data har vi med'
            }
          }
        ],
        data: {
          info: 'Her er all dataen vi hentet for dette systemet',
          merInfo: 'Men, det var ikke så mye data da...'
        }
      },
      {
        id: 'system_4',
        name: 'Et lite system til',
        description: 'En beskrivelse av det fjerde systemet',
        failed: false,
        startedTimestamp: '2024-02-06T11:42:21.884Z',
        finishedTimestamp: inProgress ? null : '2024-02-06T11:42:21.936Z',
        runtime: 52,
        tests: [
          {
            id: 'test_1',
            title: 'Test 1 sin tittel',
            description: 'En beskrivelse av testen',
            waitForAllData: false,
            result: inProgress ? null : {
              status: 'warning',
              message: 'Huff'
            }
          },
          {
            id: 'test_2',
            title: 'Test 2 sin tittel',
            description: 'Test 2 sin beskrivelse',
            waitForAllData: true,
            result: inProgress ? null : {
              status: 'warning',
              message: 'drit'
            }
          }
        ],
        data: {
          info: 'Her er all dataen vi hentet for dette systemet',
          merInfo: 'Men, det var ikke så mye data da...'
        }
      }
    ]
  }
}

export const reportId = 'bareTullOgFjas'
