import React from 'react';
import {Button,
    Image,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import { TextInput, FlatList } from '../node_modules/react-native-gesture-handler';
import { Base, Colors } from '../styles/Base';
import PPButton from '../components/PPButton'
import PPHoveringButton from '../components/PPHoveringButton'
import EStyleSheet from 'react-native-extended-stylesheet';

const defaultBackImage = require('../assets/images/back-icon.png');

export default class PlayerScoreScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerStyle: {
              backgroundColor: '#22AA99',
              elevation: 0, // remove shadow on Android
              shadowOpacity: 0, // remove shadow on iOS
              borderBottomWidth: 0,    
            },
            headerLeft: navigation.getParam('leftButton'),
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
            playerId: this.props.navigation.state.params.id,
            scoreToDisplay: data.score
        })
        this.log = data.log

        this.props.navigation.setParams({ 
            leftButton: this._renderLeftHeaderButton(),
            rightButton: this._renderRightHeaderButton()
        });

        this.refs.scoreInput.focus();
    }

    componentDidUpdate = () => {
        const player = this.props.screenProps.store.get("players")[this.state.playerId];
        this.log = player.log
    }

    render() {
        const data = this.props.navigation.state.params;

        return (
            <ScrollView style={{
                backgroundColor: Colors.GREEN,
                flex: 1
            }}>
                <View
                    style={styles.card}
                >
                    <View style={
                        styles.nameContainer
                    }>
                        <Text style={Base.HEADING_2}>
                            {data.icon.item}
                            {data.name}
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
                        underlineColorAndroid='transparent'
                    />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>
                        <PPButton 
                            title='Retirer'
                            onPress={this._onPressRemove}
                        />
                        <PPButton 
                            title='Ajouter'
                            onPress={this._onPressAdd}
                        />
                    </View>
                </View>
                <FlatList
                    style={styles.logList}
                    data={this.log}
                    renderItem = {({item}) => this._renderLogItem(item)}
                />
            </ScrollView>
        );
    }

    _renderLogItem = (_data) => {
        return <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}>
            <Text style={styles.logListItem}>{_data.points}</Text> 
        </View>
    }

    _renderLeftHeaderButton = () => {
        return (
            <TouchableOpacity 
                onPress={ this._goBack } 
                style={ styles.headerButtonContainer }
            >
                <Image
                    style={ styles.icon }
                    source={ defaultBackImage }
                />
                <Text
                    style={ styles.headerButtonText }
                >
                    Score
                </Text>
            </TouchableOpacity>)
    }

    _renderRightHeaderButton = () => {
        return (
        <TouchableOpacity 
            onPress={ this._gotoNextPlayer } 
            style={ styles.headerButtonContainer }
        >
            <Text
                style={ styles.headerButtonText }
            >
                { this.nextPlayer.name }
            </Text>
            <Image
                style={ styles.iconBack }
                source={ defaultBackImage }
            />
        </TouchableOpacity>)
    }

    _goBack = () => {
        this.props.navigation.goBack()
    }

    _gotoNextPlayer = () => {
        this.props.navigation.replace("PlayerScore", this.nextPlayer)
    }

    _onPressAdd = () => {
        const points = parseInt(this.refs.scoreInput.props.value);
        this._changeScore(points);
    }

    _onPressRemove = () => {
        const points = -parseInt(this.refs.scoreInput.props.value);
        this._changeScore(points);
    }

    _changeScore = (_points) => {
        this.setState({
            counterStep: 0
        })
        this.tickInterval = setInterval(() => {this._updateScoreDisplay(_points)}, this.delay / this.nbSteps)
    }

    _updateScoreDisplay = (_points) => {
        const step = this.state.counterStep++;
        const newScore = this._getTotalFromLog() + parseInt(_points / this.nbSteps * step);

        let newAmount;
        if(_points > 0){
            newAmount = this.state.amount - parseInt(_points / this.nbSteps * step);
        }
        else{
            newAmount = parseInt(this.state.amount) + parseInt(_points / this.nbSteps * step);
        }
        
        this.setState({
            scoreToDisplay: newScore,
            amountToDisplay: newAmount.toString()
        })
        
        if(parseInt(step) === parseInt(this.nbSteps)){
            clearInterval(this.tickInterval);
            this._saveScore(_points, newScore);
            //this._gotoNextPlayer();
        } 
    }

    _saveScore = (_points, _score) => {
        const input = this.refs.scoreInput
        const players = this.props.screenProps.store.get("players");
        let newPlayers = [];

        for (let i = 0; i < players.length; i++) {
            const element = players[i];
            let newPlayer = JSON.parse(JSON.stringify(element));
            if(element.id === this.props.navigation.state.params.id){
                newPlayer.score = _score;
                newPlayer.log.unshift({
                    timestamp: new Date(),
                    points: _points
                })
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

    _getTotalFromLog = () => {
        let total = 0;
        for (let i = 0; i < this.log.length; i++) {
            total += this.log[i].points
        }
        return total;
    }
}

const styles = EStyleSheet.create({
    card: {
        backgroundColor: 'white',
        margin: 24,
        borderRadius: 12,
        padding: 18
    },
    input: {
        fontSize: '5rem',
        fontWeight: 'bold',
        marginVertical: '3rem'
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerButtonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerButtonText: {
        color: '#007AFF',
        fontSize: '1.25rem'
    },
    icon: {
        height: 21,
        width: 12,
        marginLeft: '1.5rem',
        marginRight: 6,
        marginVertical: 12,
        resizeMode: 'contain'
    },
    iconBack: {
        height: 21,
        width: 12,
        marginLeft: 6,
        marginRight: '1.5rem',
        marginVertical: 12,
        resizeMode: 'contain',
        transform: [{ scaleX: -1 }],
    },
    logList: {
        paddingHorizontal: '2.5rem'
    },
    logListItem: {
        fontSize: '1rem',
        paddingVertical: '0.5rem'
    }
})