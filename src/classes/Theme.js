class Theme {
  static get (theme) {
    const themes = {
      solar: {
        backgroundColor: '#1a3c54',
        foodColor: '#0cd6b3',
        poisonColor: '#c51d21',
        agentBodyColor: '#e29e00',
        agentOutlineColor: '#1a3c54',
        edibleOutlineColor: '#1a3c54',
        agroAgentBodyColor: '#f96b0e'
      },
      jah: {
        backgroundColor: '#000',
        foodColor: '#e6cf10',
        poisonColor: '#444',
        agentBodyColor: '#005c25',
        agentOutlineColor: '#000',
        edibleOutlineColor: null,
        agroAgentBodyColor: '#740028'
      },
      halloween: {
        backgroundColor: '#000',
        foodColor: '#20d8d2',
        poisonColor: '#444',
        agentBodyColor: '#f7e200',
        agentOutlineColor: '#000',
        edibleOutlineColor: null,
        agroAgentBodyColor: '#f4561c'
      },
      original: {
        backgroundColor: '#112',
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
