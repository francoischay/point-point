import { createStackNavigator } from 'react-navigation';

import PlayersScreen from '../screens/PlayersScreen';
import AddPlayerScreen from '../screens/AddPlayerScreen';
import EditPlayerScreen from '../screens/EditPlayerScreen';
import PlayerScoreScreen from '../screens/PlayerScoreScreen';

export default Navigator = createStackNavigator(
  {
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
    }
  }
);