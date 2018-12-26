import { createStackNavigator } from 'react-navigation';

import GameChoiceScreen from '../screens/GameChoiceScreen';
import PlayersScreen from '../screens/PlayersScreen';
import GameScreen from '../screens/GameScreen';
import AddPlayerScreen from '../screens/AddPlayerScreen';
import EditPlayerScreen from '../screens/EditPlayerScreen';
import PlayerScoreScreen from '../screens/PlayerScoreScreen';
import PlayerDistributePointsScreen from '../screens/PlayerDistributePointsScreen';

export default Navigator = createStackNavigator(
  {
    GameChoice: {
      screen: GameChoiceScreen
    },
    Players: {
      screen: PlayersScreen
    },
    Game: {
      screen: GameScreen
    },
    AddPlayer: {
      screen: AddPlayerScreen,
    },
    EditPlayer: {
      screen: EditPlayerScreen,
    },
    PlayerScore: {
      screen: PlayerScoreScreen
    },
    PlayerDistributePoints: {
      screen: PlayerDistributePointsScreen
    }
  },
  {
    initialRouteName: 'GameChoice'
  }
);