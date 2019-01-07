import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import io from 'socket.io-client';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('this is the ctor');
    this.state = { msg: "waiting..." };
    this.socket = io('http://192.168.1.223:3000');
    this.socket.on('connect', () => {
      console.log('connected')
    });
    this.socket.on('MA', (data) => {
      console.log('Data recieved from server');
      this.setState(data);      
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Oren Juster co up App.js to start working on your app!</Text>
        <Text>Got from socket: {this.state.msg}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
