import { createStackNavigator } from 'react-navigation';

import PlayersScreen from '../screens/PlayersScreen';
import GameScreen from '../screens/GameScreen';
import AddPlayerScreen from '../screens/AddPlayerScreen';
import EditPlayerScreen from '../screens/EditPlayerScreen';
import PlayerScoreScreen from '../screens/PlayerScoreScreen';

export default Navigator = createStackNavigator(
  {
    Game: {
      screen: GameScreen
    },
    Players: {
      screen: PlayersScreen
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
  },
  {
    navigationOptions: {
/*      headerStyle: {
        backgroundColor: '#0D2B3F',
      },
      headerTintColor: '#fff',*/
    }
  }
);