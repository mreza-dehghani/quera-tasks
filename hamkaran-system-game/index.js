const CONFIG = {
    TEAMS_ENDPOINT_URL: "http://localhost:3000/teams",
    MEMBERS_ENDPOINT_URL: "http://localhost:3000/scoreboard",
}


// Utils...
const logger = (logMessage, logData) =>
    console.log(logMessage, logData);

const ApiCaller = async (url, config) => {
    try {
        const response = await fetch(url, config && config)
        const result = response && await response.json()

        return Promise.resolve(result)
    } catch (error) {
        logger("API_CALLER Error: ", error)
        return Promise.reject(error)
    }
}

const scoreCalculator = (member) => {
    const {
        kills,
        revives,
        assists,
    } = member
    return (kills * 100) + (revives * 75) + (assists * 50)
}

const rankCalculator = rank => {
    switch (rank) {
        case 1:
            return '🥇';
        case 2:
            return '🥈';
        case 3:
            return '🥉';
        default:
            return rank
    }
}

// Services...
const getTeamsService = async () => {
    try {
        const teams = await ApiCaller(CONFIG.TEAMS_ENDPOINT_URL)
        return Promise.resolve(teams)
    } catch (error) {
        logger("GET_TEAMS_SERVICE Error: ", error)
        return Promise.reject(error)
    }
}

const getMembersService = async () => {
    try {
        const teams = await ApiCaller(CONFIG.MEMBERS_ENDPOINT_URL)
        return Promise.resolve(teams)
    } catch (error) {
        logger("GET_TEAMS_SERVICE Error: ", error)
        return Promise.reject(error)
    }
}

// DOM Manipulator...
class TableElement {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    #elementDefine(htmlTagName) {
        return document.createElement(htmlTagName)
    }

    #createTableTH(tableContainer, dataFields) {
        const trElement = this.#elementDefine('tr')

        for (let i of dataFields) {
            const tdElement = this.#elementDefine('td')
            tdElement.textContent = i
            trElement.appendChild(tdElement)
        }

        tableContainer.appendChild(trElement)
    }

    #createTableROW(tableContainer, data) {
        for (let i = 0; i < data.length; i++) {
            const trElement = this.#elementDefine('tr')

            for (let j of Object.values(data[i])) {
                const tdElement = this.#elementDefine('td')
                tdElement.textContent = j
                trElement.appendChild(tdElement)
            }

            tableContainer.appendChild(trElement)

        }
    }

    #createContainer() {
        const tableContainer = this.#elementDefine('div')
        tableContainer.setAttribute('class', 'teams')
        this.tableContainer = tableContainer
    }

    #createTitle(title) {
        const element = this.#elementDefine('h1')
        element.textContent = title
        this.tableContainer.appendChild(element)
    }

    #createTable(data) {
        const table = this.#elementDefine('table')

        this.#createTableTH(table, Object.keys(data[0]))

        this.#createTableROW(table, data)

        this.tableContainer.appendChild(table)
    }

    create(data, title) {
        this.#createContainer()

        this.#createTitle(title)

        this.#createTable(data)

        this.container.appendChild(this.tableContainer)
    }
}

async function initializeTablesData() {
    try {
        const teams = await getTeamsService()
        const members = await getMembersService()
        const teamsData = {}

        for (let t of teams) {
            const index = t.name
            const set = {
                name: t.name, id: t.id, members: []
            }
            const tMembers = []
            let sumScore = 0

            for (let m of members) {
                if (t.id === m.team) {
                    const memberScore = scoreCalculator(m)

                    sumScore += memberScore
                    tMembers.push({...m, score: memberScore})
                }
            }
            set.members = [...tMembers].sort((a, b) => b.score - a.score).map((el, key) => ({
                    rank: rankCalculator(key + 1),
                    ...el
                })
            )

            teamsData[index] = {...set, teamScore: sumScore}
        }

        return teamsData
    } catch (error) {
        logger("INITIALIZE_TABLE_DATA Error: ", error)
        return Promise.reject(error)
    }
}

function initializeWinnerTeam(winner) {
    const element = document.getElementsByClassName('status')
    element[0].textContent = `${winner} Has The Upper Hand!`
}

function initializeTable(team) {
    const table = new TableElement('TEAM_ID')
    table.create(team.members, team.name)
}

function renderDocuments(data) {
    let winnerTeam = {
        score: 0,
        name: ''
    }
    for (let el in data) {
        initializeTable(data[el])

        if (data[el].teamScore > winnerTeam.score) {
            winnerTeam.score = data[el].teamScore
            winnerTeam.name = data[el].name
        }
    }
    initializeWinnerTeam(winnerTeam.name)
}


async function app() {
    try {
        const data = await initializeTablesData()
        renderDocuments(data)
    } catch (error) {
        logger("APP Error: ", error)
    }
}

app().then(r => null)

