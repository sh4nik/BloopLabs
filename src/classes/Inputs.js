let Inputs = {
  nearestAgentX: {
    displayName: 'Nearest Agent X',
    process: (env, agent, entities) => {
      return env.nearestAgentVector ? env.nearestAgentVector.x : 0;
    }
  },
  nearestAgentY: {
    displayName: 'Nearest Agent Y',
    process: (env, agent, entities) => {
      return env.nearestAgentVector ? env.nearestAgentVector.y : 0;
    }
  },
  nearestAgentIsAgro: {
    displayName: 'Nearest Agent Agro/Peaceful',
    process: (env, agent, entities) => {
      return env.nearestAgent ? env.nearestAgent.isAgro ? 1 : -1 : 0;
    }
  },
  nearestEdibleX: {
    displayName: 'Nearest Edible X',
    process: (env, agent, entities) => {
      return env.nearestEdibleVector ? env.nearestEdibleVector.x : 0;
    }
  },
  nearestEdibleY: {
    displayName: 'Nearest Edible Y',
    process: (env, agent, entities) => {
      return env.nearestEdibleVector ? env.nearestEdibleVector.y : 0;
    }
  },
  nearestEdibleIsPoison: {
    displayName: 'Nearest Edible Food/Poison',
    process: (env, agent, entities) => {
      return env.nearestEdible.healthImpact < 0 ? 1 : -1;
    }
  }
};

export default Inputs;
