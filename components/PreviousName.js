import React from 'react';
import { 
    AsyncStorage, 
    TouchableOpacity, 
    Text 
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

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
                    flexDirection: 'row',
                }}
                onPress={this.props.onPress}
                onLongPress={this._onLongPress}
            >
                <Text style={styles.nameButton}>
                    {this.props.title}
                </Text>
                <TouchableOpacity 
                    style={removeButtonStyle}
                    onPress={this._onDeletePress}
                >
                    <Text style={styles.deleteNameButton}>
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

const styles = EStyleSheet.create({
    nameButton: {
        fontSize: '1.25rem',
        color: '#007AFF'
    },
    deleteNameButton: {
        color: 'red',
        fontSize: '1rem'
    }
})