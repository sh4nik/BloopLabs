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
        agroAgentBodyColor: '#f96b0e',
        agroAgentFangColor: '#0cd6b3'
      },
      jah: {
        backgroundColor: '#100600',
        foodColor: '#e6cf10',
        poisonColor: '#777',
        agentBodyColor: '#006b2a',
        agentOutlineColor: '#000',
        edibleOutlineColor: '#100600',
        agroAgentBodyColor: '#740028',
        agroAgentFangColor: '#e6cf10'
      },
      halloween: {
        backgroundColor: '#000',
        foodColor: '#20d8d2',
        poisonColor: '#444',
        agentBodyColor: '#f7e200',
        agentOutlineColor: '#000',
        edibleOutlineColor: '#000',
        agroAgentBodyColor: '#f4561c',
        agroAgentFangColor: '#20d8d2'
      },
      mojojojo: {
        backgroundColor: '#171b21',
        foodColor: '#00aace',
        poisonColor: '#6f23b4',
        agentBodyColor: '#53c285',
        agentOutlineColor: '#171b21',
        edibleOutlineColor: '#171b21',
        agroAgentBodyColor: '#b456d0',
        agroAgentFangColor: '#00aace'
      },
      mojojojoHex: {
        backgroundColor: 0x171b21,
        foodColor: 0x00aace,
        poisonColor: 0x6f23b4,
        agentBodyColor: 0x53c285,
        agentOutlineColor: 0x171b21,
        edibleOutlineColor: 0x171b21,
        agroAgentBodyColor: 0xb456d0,
        agroAgentFangColor: 0x00aace
      },
      original: {
        backgroundColor: '#112',
        foodColor: '#00f4b6',
        poisonColor: '#bf4fff',
        agentBodyColor: '#3de1ff',
        agentOutlineColor: '#112',
        edibleOutlineColor: '#000',
        agroAgentBodyColor: '#ff5588',
        agroAgentFangColor: '#00f4b6'
      }
    };
    return themes[theme];
  }
}

export default Theme;
