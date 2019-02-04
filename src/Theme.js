class Theme {
    static get(theme) {
        const themes = {
            circus: {
                backgroundColor: '#000',
                foodColor: '#0da5bd',
                poisonColor: '#ff3838',
                agentBodyColor: '#72ff83',
                agentOutlineColor: '#000',
                edileOutlineColor: '#000',
                agroAgentBodyColor: '#ff803f'
            },
            bloop: {
                backgroundColor: '#223',
                foodColor: '#00f4b6',
                poisonColor: '#bf4fff',
                agentBodyColor: '#3de1ff',
                agentOutlineColor: '#000',
                edibleOutlineColor: '#000',
                agroAgentBodyColor: '#ff5588'
            }
        };
        return themes[theme];
    }
}

export default Theme;
