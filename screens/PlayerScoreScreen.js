import React from 'react';
import {
    Button,
    Text,
    View,
    StyleSheet
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { TextInput } from '../node_modules/react-native-gesture-handler';

export default class PlayerScoreScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'Joueur'),
            headerRight: navigation.getParam('rightButton')
        };
    };

    constructor(props) {
        super(props);

        this.delay = 650;
        this.nbSteps = 20;

        this.state = {
            score: 0,
            scoreToDisplay: 0,
            amount: ''
        }
    }

    componentDidMount() {
        const data = this.props.navigation.state.params;
        const players = this.props.screenProps.store.get("players");
        let nextIndex;

        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if(player.id === this.props.navigation.state.params.id){
                nextIndex = (players[i + 1]) ? i+1 : 0;
            }
        }

        this.nextPlayer = players[nextIndex];

        this.setState({
            score: data.score,
            scoreToDisplay: data.score,
        })

        this.props.navigation.setParams({ 
            title: data.name,
            rightButton: this._getRightHeaderButton()
        });

        this.refs.scoreInput.focus();
    }

    render() {
        return (
            <View style = {{ flex: 1 }}>
                <Text>Score actuel : {this.state.scoreToDisplay}</Text>
                <TextInput 
                    style={styles.input}
                    ref='scoreInput'
                    placeholder={this.state.amount}
                    onChangeText={(_amount) => this.setState({'amount' : _amount})}
                    value={this.state.amount}
                    keyboardType='numeric'
                    clearTextOnFocus={true}
                />
                <Button 
                    title='Ajouter'
                    onPress={this._onPressAdd}
                />
                <Button 
                    title='Retirer'
                    onPress={this._onPressRemove}
                />
            </View>
        );
    }

    _getRightHeaderButton = () => {
        return <Button title={ this.nextPlayer.name } onPress={ this._gotoNextPlayer } />
    }

    _gotoNextPlayer = () => {
        this.props.navigation.replace("PlayerScore", this.nextPlayer)
    }

    _onPressAdd = () => {
        console.log(this.refs.scoreInput.props.value)
        const newScore = parseInt(this.state.score) + parseInt(this.refs.scoreInput.props.value);
        this._changeScore(newScore);
    }

    _onPressRemove = () => {
        const newScore = parseInt(this.state.score) - parseInt(this.refs.scoreInput.props.value);
        this._changeScore(newScore);
    }

    _changeScore = (_newScore) => {
        const diff = _newScore - this.state.score;

        this.setState({
            counterStep: 0
        })
        this.tickInterval = setInterval(() => {this._updateScoreDisplay(diff)}, this.delay / this.nbSteps)
    }

    _updateScoreDisplay = (_diff) => {
        const step = this.state.counterStep++;
        const newScore = this.state.score + parseInt(_diff / this.nbSteps * step);
        this.setState({scoreToDisplay: newScore})
        
        if(parseInt(step) === parseInt(this.nbSteps)){
            clearInterval(this.tickInterval);
            this._setScore(newScore);
            //this._gotoNextPlayer();
        } 
    }

    _setScore = (_score) => {
        const input = this.refs.scoreInput
        const players = this.props.screenProps.store.get("players");
        let newPlayers = [];

        for (let i = 0; i < players.length; i++) {
            const element = players[i];
            let newPlayer = JSON.parse(JSON.stringify(element));
            if(element.id === this.props.navigation.state.params.id){
                newPlayer.score = _score;
            } 
            newPlayers.push(newPlayer);
        }
        
        this.props.screenProps.store.set("players", newPlayers)

        this.setState({
            'score': _score, 
            'amount': '0'
        })
        input.clear();
    }
}

const styles = StyleSheet.create({
    input: {
        fontSize: 96
    }
})