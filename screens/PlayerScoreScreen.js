import React from 'react';
import {
    Button,
    KeyboardAvoidingView,
    Text,
    View,
    StyleSheet
} from 'react-native';
import { TextInput } from '../node_modules/react-native-gesture-handler';
import { Base, Colors } from '../styles/Base';

export default class PlayerScoreScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
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
            amount: '',
            amountToDisplay: ''
        }
    }

    componentDidMount() {
        const data = this.props.navigation.state.params;
        const players = this.props.screenProps.store.get("players");
        const order = this.props.screenProps.store.get("order");
        const gamePlayers = []
        let nextIndex;
    
        for (let i = 0; i < order.length; i++) {
            for (let j = 0; j < players.length; j++) {
                const player = players[j];
                if(player.id == order[i]) gamePlayers.push(player)
            }
        }

        for (let i = 0; i < gamePlayers.length; i++) {
            const player = gamePlayers[i];
            if(player.id === this.props.navigation.state.params.id){
                nextIndex = (gamePlayers[i + 1]) ? i+1 : 0;
            }
        }

        this.nextPlayer = gamePlayers[nextIndex];

        this.setState({
            score: data.score,
            scoreToDisplay: data.score,
        })

        this.props.navigation.setParams({ 
            rightButton: this._getRightHeaderButton()
        });

        this.refs.scoreInput.focus();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 12
                }}>
                    <Text style={Base.HEADING_2}>
                        {this.props.navigation.state.params.name}
                    </Text>
                    <Text style={Base.HEADING_2}>
                        {this.state.scoreToDisplay}
                    </Text>
                </View>
                <TextInput 
                    style={styles.input}
                    ref='scoreInput'
                    placeholder='0'
                    onChangeText={(_amount) => this.setState({'amount' : _amount, 'amountToDisplay' : _amount})}
                    value={this.state.amountToDisplay}
                    keyboardType='numeric'
                    clearTextOnFocus={true}
                    textAlign={'center'}
                />
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 12,
                    paddingRight: 12,
                }}>
                    <Button 
                        title='Retirer'
                        onPress={this._onPressRemove}
                    />
                    <Button 
                        title='Ajouter'
                        onPress={this._onPressAdd}
                    />
                </View>
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

        let newAmount;
        if(_diff > 0){
            newAmount = this.state.amount - parseInt(_diff / this.nbSteps * step);
        }
        else{
            newAmount = parseInt(this.state.amount) + parseInt(_diff / this.nbSteps * step);
        }
        
        this.setState({
            scoreToDisplay: newScore,
            amountToDisplay: newAmount.toString()
        })
        
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
        fontSize: 96,
        padding: 24,
        fontWeight: 'bold'
    }
})