import React from 'react';
import { 
    AsyncStorage, 
    TouchableOpacity, 
    Text 
} from 'react-native';

export default class PreviousName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canDelete: false
        }
    }

    render() {
        const removeButtonStyle = this.state.canDelete ? 
        {
            marginTop: 6,
            marginLeft: 6,
            display: 'flex'
        }:
        {
            display: 'none'
        }

        return (
            <TouchableOpacity 
                style={{
                    padding: 12,
                    marginLeft: 12,
                    flexDirection: 'row'
                }}
                onPress={this.props.onPress}
                onLongPress={this._onLongPress}
            >
                <Text style={{
                    fontSize: 18,
                    color: '#007AFF'
                }}>
                    {this.props.title}
                </Text>
                <TouchableOpacity 
                    style={removeButtonStyle}
                    onPress={this._onDeletePress}
                >
                    <Text style={{
                        color: 'red',
                        fontSize: 12
                    }}>
                        Supprimer
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    _onLongPress = () => {
        this.setState({
            canDelete: true
        })
    }

    _onDeletePress = async() => {
        try {
            const previousNames = await AsyncStorage.getItem('previousNames');
            let _namesToSave = previousNames.split(',')
            _namesToSave.splice(_namesToSave.findIndex((_element) => {
                return _element == this.props.title
            }), 1)
            
            this.setState({canDelete : false})
            this.props.store.set('previousNames', _namesToSave)
          } 
          catch(error) {
            console.log('error: ', error);
          }
    }
}