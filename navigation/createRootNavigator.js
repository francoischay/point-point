import { createStackNavigator } from 'react-navigation';

import PlayersScreen from '../screens/PlayersScreen';
import GameScreen from '../screens/GameScreen';
import AddPlayerScreen from '../screens/AddPlayerScreen';
import EditPlayerScreen from '../screens/EditPlayerScreen';
import PlayerScoreScreen from '../screens/PlayerScoreScreen';

export const createRootNavigator = (load="Players") => {
    console.log(load)
    return createStackNavigator(
        {
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
        },
        {
          initialRouteName: load
        }
    );
  }


  