import EStyleSheet from 'react-native-extended-stylesheet';

export const Colors = {
  BACKGROUND : '#FAFAFA',
  DARK_GREY: '#0D2B3F',
  GREY: '#CCC',
  GREEN: '#22AA99'
}

export const Base = EStyleSheet.create({
    TEXT : {
      fontSize: '1.5rem',
      color: Colors.DARK_GREY,
      fontWeight: '500'
    },
    ROW: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundColor: '#fff',
      borderWidth: 0,
      borderColor: '#D4EEEB',
      flex: 1,
      padding: '1.5rem',
      width: window.width - 30 * 2,
      marginTop: -1,

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
      fontSize: '2rem',
      fontWeight: 'bold'
    },
    EMOJI: {
      fontSize: '4rem'
    },
    NAME_INPUT: {
      fontSize: '4rem',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    TEXT_INPUT: {
      fontSize: '1.5rem',
      borderWidth: 1,
      borderColor: Colors.BACKGROUND,
      borderRadius: 6,
      paddingHorizontal: '1rem',
      paddingVertical: '0.75rem'
    }
})
