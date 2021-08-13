{
  "name": "gamepuzzle",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "@react-navigation/native": "^6.0.2",
    "@react-navigation/stack": "^6.0.3",
    "react": "17.0.1",
    "react-native": "0.64.2",
    "react-native-dialog": "^8.2.0",
    "react-native-gesture-handler": "^1.10.3",
    "react-native-safe-area-context": "^3.3.0",
    "react-native-screens": "^3.5.0"
  },
  "devDependencies": {
    "@babel/core": "^7.12.9",
    "@babel/runtime": "^7.12.5",
    "@react-native-community/eslint-config": "^2.0.0",
    "babel-jest": "^26.6.3",
    "eslint": "7.14.0",
    "jest": "^26.6.3",
    "metro-react-native-babel-preset": "^0.64.0",
    "react-test-renderer": "17.0.1"
  },
  "jest": {
    "preset": "react-native"
  }
}




import React from 'react';
import {Text, View, StyleSheet, FlatList, TouchableHighlight, Dimensions} from 'react-native';

const deviceWidh = Dimensions.get('window').width;
export default class Board extends React.Component {

      componentWillMount() {
        this.findClickables(this.props.board, this.props.size);
      }

      componentWillReceiveProps(nextProps) {
        this.findClickables(nextProps.board, nextProps.size);
      }

      shouldComponentUpdate = (nextProps) => {
        const curr = this.props.board.join('');
        const next = nextProps.board.join('');
        
        return curr != next;
      }

      findClickables = (board, size) => {
        const zeroIndex = board.indexOf(0);
        const zeroCoordinate = this.getCoordFromIndex(zeroIndex, size);
        const possibleTopIdx = zeroCoordinate.row > 0 ? this.getIndexFromCoord(zeroCoordinate.row - 1, zeroCoordinate.column, size) : null;
        const possiblRightIdx = zeroCoordinate.column < size ? this.getIndexFromCoord(zeroCoordinate.row, zeroCoordinate.column + 1, size) : null;
        const possiblBottomIdx = zeroCoordinate.row < size ? this.getIndexFromCoord(zeroCoordinate.row + 1, zeroCoordinate.column, size) : null;
        const possibleLeftIdx = zeroCoordinate.column > 0 ? this.getIndexFromCoord(zeroCoordinate.row, zeroCoordinate.column - 1, size) : null;
    
        this.setState({ 
          zero: zeroIndex, 
          possibleTopIdx: possibleTopIdx, 
          possiblRightIdx: possiblRightIdx,
          possiblBottomIdx: possiblBottomIdx,
          possibleLeftIdx: possibleLeftIdx
        });
      }

      cellClickHandler = (index) => {
        if (index === this.state.possibleTopIdx || index === this.state.possiblRightIdx || 
            index === this.state.possiblBottomIdx || index === this.state.possibleLeftIdx) this.nextBoard(index);
      }
      
      nextBoard = (index) => {
        const board = this.props.board.slice();
        const temp = board[index];
        board[index] = board[this.state.zero];
        board[this.state.zero] = temp;
        this.props.updateBoard(board);
      }

      getIndexFromCoord = (row, col, size) => {
        return (size * (row - 1)) + col - 1; 
      }

      getCoordFromIndex = (idx, size) => {
        return {row: Math.floor(idx / size) + 1, column: (idx % size) + 1};
      }

      render() {
        return (
          <View style={styles.board}> 
            <FlatList data={this.props.board} numColumns={this.props.size} 
              renderItem={({item, index}) => (<Cell value={item} size={this.props.size} onPress={this.cellClickHandler.bind(this,index)}/>)}  
                keyExtractor={item => item}/>
          </View>
        );
      }
}

function Cell(props) {
    return (
      <TouchableHighlight style={cellStyle(props.size, props.value)} onPress={props.onPress} key={props.index}>
        <Text style={{textAlign:'center', fontSize:(deviceWidh-props.size)/props.size/2}}>
           {props.value !=0 ? props.value : ""}
        </Text>
      </TouchableHighlight>
    )
}

function cellStyle(size, value) {
  return {
    width: (deviceWidh-size)/size,
    height: (deviceWidh-size)/size,
    backgroundColor: value != 0 ? 'red' : 'white',
    margin: 0.5,
  }
}

const styles = StyleSheet.create({
  board: {
    alignItems:'center', 
    borderWidth:0.5,
    borderColor:'white',
  }
})



import React from 'react';
import {View,Text, StyleSheet,TouchableHighlight, ScrollView } from 'react-native';

const btnLevels = [
    {id: 1, title:"Level 3x3", size: 3}, 
    {id: 2,title:"Level 4x4", size: 4}, 
    {id: 3,title:"Level 5x5", size: 5}, 
    {id: 4,title: "Level 6x6", size: 6}, 
    {id: 5,title: "Level 7x7", size: 7},
    {id: 6,title: "Level 8x8", size: 8},
    {id: 7,title: "Level 9x9", size: 9},
    {id: 8,title: "Level 10x10", size: 10}
];

export default class Menu extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.level}>Level</Text>
                <BtnLevels btnLevels={btnLevels} _navigation={this.props.navigation}/>
            </View>
        )
    }
}

function BtnLevels(props) {
    return (
        <View>
            <ScrollView>
            {props.btnLevels.map((btnLevel) => {
                    return (<View style={styles.btnLevel} key={btnLevel.id}>
                        <TouchableHighlight style={{margin: 10}} 
                            onPress={() => props._navigation.navigate('Puzzle', {size: btnLevel.size})}>
                            <View style={styles.button}>
                                <Text style={styles.btnLevelText}>{btnLevel.title}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>)
                })}
            </ScrollView> 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "slateblue",
        flex: 1
    },

    level: {
        textAlign:'center',
        color: 'white',
        fontSize: 40,
        padding: 25,
        fontFamily: 'fantasy',
    },
    btnLevel: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: "space-between",
    },
    button: {
        backgroundColor: 'white',
        borderRadius:5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 50
    },
    btnLevelText: {
        fontFamily: 'fantasy',
        fontSize: 20
    }
})


import React from 'react';
import {View, Text} from 'react-native';
import Dialog from "react-native-dialog";
import Board from './Board'

var time = 0;
export default class Puzzle extends React.Component {
      constructor(props) {
        super(props);
        let size = this.props.route.params.size;
        let board = new Array(size * size);
        for (let i = 0; i < size * size; ++i) board[i] = i;
        board = this.shuffle(board);
        this.state = { 
          board: board, 
          size: size,
          timerCount: "00:00:00",
          visible: false
        };
      }

      // componentDidMount() {
      //   setInterval(this.timer, 1000);
      // }

      updateBoard = (board) => {
        this.setState({visible: true});
        // this.setState({ board: board});
        // const _board = board.slice();
        // if(JSON.stringify(_board.sort((cur, next)=> {return cur -next})) === JSON.stringify(board)) {
        //   this.setState({visible: true});
        // }
      }

      shuffle(o) {
        const temp = o.slice();
        for(var j, x, i = temp.length; i; j = Math.floor(Math.random() * i), x = temp[--i], temp[i] = temp[j], temp[j] = x);
        return temp;
      }
      
      timer = () => { 
        ++time;
        var hour = Math.floor(time /3600);
        var minute = Math.floor((time - hour*3600)/60);
        var seconds = time - (hour*3600 + minute*60);
        if(hour < 10)
          hour = "0"+hour;
        if(minute < 10)
          minute = "0"+minute;
        if(seconds < 10)
          seconds = "0"+seconds;
        this.setState({timerCount: `${hour}:${minute}:${seconds}`});
      }

      handleCancel = () => {
        this.setState({visible: false});
      }

      handleGoNextLevel = () => {
        this.props.navigation.push('Puzzle', {size: this.state.size + 1});
        this.setState({visible: false});
      }

      render() {
        return (
          <View style={{flex: 1, justifyContent:'center',backgroundColor: 'white'}}>
            <View style={{backgroundColor:'white', flex: 0.2}}>
              <Text style={{textAlign:'center', fontSize: 60}}>{this.state.timerCount}</Text>
            </View>
            <View style={{flex:1}}>
              {this.state && this.state.board ? <Board size={this.state.size} 
                board={this.state.board} updateBoard={this.updateBoard}/>: null}
            </View>
            <Dialog.Container visible={this.state.visible}>
              <Dialog.Title>Congratulations</Dialog.Title>
              <Dialog.Description>
                Do you want to next level?
              </Dialog.Description>
              <Dialog.Button label="Cancel" onPress={this.handleCancel} />
              <Dialog.Button label="OK" onPress={this.handleGoNextLevel} />
            </Dialog.Container>
          </View>
        )
      }
}
