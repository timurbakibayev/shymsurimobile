import React, { PureComponent } from "react";
import { AppRegistry, StyleSheet, Dimensions, View, ImageBackground, Text } from "react-native";
import { GameLoop } from "react-native-game-engine";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const RADIUS = 50;
let rotating = 0;

export default class BestGameEver extends PureComponent {
  constructor() {
    super();
    this.state = {
        x: 100,
        y: 100,
        width: RADIUS,
        height: RADIUS,
        looking: -100,
    };
  }

  updateHandler = ({ touches, screen, layout, time }) => {
    let move = touches.find(x => x.type === "move");
    let newX = this.state.x;
    let newY = this.state.y;
    if (move) {
        rotating = move.delta.pageX;
    };

    let newLooking = this.state.looking + rotating;
    if (newLooking > 100)
        newLooking = 100;
    if (newLooking < -100)
        newLooking = -100;

    this.setState({
        x: newX,
        y: newY,
        looking: newLooking,
      });


  };

  render() {
    return (
      <GameLoop style={styles.container} onUpdate={this.updateHandler}>

          {this.state.looking>=0 && <View style={[styles.player, {
              left: Math.round(this.state.x-this.state.width*this.state.looking/100/2),
              top: this.state.y, width: Math.round(this.state.width*this.state.looking/100), height: this.state.height}]}>
            <ImageBackground source={require("../game/skier-google_right.png")} style={styles.image}
                    resizeMode="stretch">
            </ImageBackground>
            </View>}
          {this.state.looking<0 &&
            <View style={[styles.player, {
                left: Math.round(this.state.x - RADIUS*(-this.state.looking)/100 -
                    this.state.width*this.state.looking/100/2),
                top: this.state.y,
                width: Math.round(-this.state.width*this.state.looking/100),
                height: this.state.height}]}>
            <ImageBackground source={require("../game/skier-google_left.png")} style={styles.image}
                    resizeMode="stretch">
            </ImageBackground>
            </View>}

            <Text>{Math.round(this.state.x - RADIUS*(-this.state.looking)/100)}</Text>
            <Text>{this.state.y}</Text>
            <Text>{Math.round(-this.state.width*this.state.looking/100)}</Text>
            <Text>{this.state.height}</Text>

      </GameLoop>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "stretch",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "blue"
  },
  player: {
    position: "absolute",
  }
});

AppRegistry.registerComponent("BestGameEver", () => BestGameEver);