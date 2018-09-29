import EStyleSheet from 'react-native-extended-stylesheet';

export const Colors = {
    BACKGROUND : '#FAFAFA',
    DARK_GREY: '#0D2B3F',
    GREEN: '#0E7D6E'
}

export const Base = EStyleSheet.create({
    TEXT : {
        fontSize: '1.5rem',
        color: Colors.DARK_GREY,
        fontWeight: '500'
    },
    ROW: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        marginBottom: 1,
        flex: 1,
        padding: '1rem',
        width: window.width - 30 * 2,

        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOpacity: 0.2,
        shadowOffset: {height: 3, width: 0},
        shadowRadius: 10,

        elevation: 0
    },
    'ROW:last-child': {
        borderRadius: 12
    },
    HEADING_2: {
        fontSize: 36,
        fontWeight: 'bold'
    },
    EMOJI: {
        fontSize: '4rem'
    },
    NAME_INPUT: {
        fontSize: '4rem',
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center'
    }
})
