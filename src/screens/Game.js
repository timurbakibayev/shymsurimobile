import React, { PureComponent } from "react";
import { AppRegistry, StyleSheet, Dimensions, View, ImageBackground, Text } from "react-native";
import { GameLoop } from "react-native-game-engine";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const RADIUS = 50;
let rotating = 0;
let id = 0;
let roadX = WIDTH/2;
let roadW = RADIUS*2;
let roadZielX = WIDTH/2;
let speed = 2;
let nextLevel = 0;
let dx = 0;
let km = 0;

class Snow {
    constructor(x,y,w) {
        this.x = x;
        this.y = y;
        this.w = w;
        id++;
        this.id = id;
    }
}

export default class BestGameEver extends PureComponent {
  constructor() {
    super();
    this.state = {
        x: 100,
        y: 100,
        realX: 100,
        width: RADIUS,
        height: RADIUS,
        looking: -100,
        snowRoad: [],
        trees: [],
    };
  }

  updateHandler = ({ touches, screen, layout, time }) => {
    nextLevel = nextLevel + time.delta*speed;
    km = km + time.delta;
    if (nextLevel>20000) {
        nextLevel = 0;
        speed = speed + 1;
        if (speed > 7)
            speed = 7;
    }
    let c = time.delta /15;
    let move = touches.find(x => x.type === "move");
    let newX = this.state.realX;
    let newY = this.state.y;
    if (move) {
        rotating = move.delta.pageX;
    }

    let newLooking = this.state.looking + rotating;
    if (newLooking > 100)
        newLooking = 100;
    if (newLooking < -100)
        newLooking = -100;

    dx = dx + newLooking/200*c;
    if (dx<-3)
        dx = -3;
    if (dx>3)
        dx = 3;

    newX = newX + dx*c;
    if (newX<RADIUS/2)
        newX = Math.ceil(RADIUS/2);
    if (newX>WIDTH-RADIUS/2)
        newX = Math.floor(WIDTH-RADIUS/2);

    let snowRoad = this.state.snowRoad;
    let trees = this.state.trees;
    let more = true;
    snowRoad.forEach((snow)=>{
        snow.y = snow.y - speed*c;
        if (snow.y > HEIGHT-snow.w/2)
            more = false;
    });
    snowRoad = snowRoad.filter((snow)=>snow.y>-snow.w);
    trees.forEach((snow)=>{
        snow.y = snow.y - speed*c;
        if (snow.y > HEIGHT-snow.w/2)
            more = false;
    });
    trees = trees.filter((snow)=>snow.y>-snow.w);
    if (more) {
        if (Math.abs(roadX - roadZielX) <= roadW*2)
            roadZielX = Math.floor(Math.random() * WIDTH);
        if (roadX < roadZielX)
            roadX = roadX + roadW/3;
        else
            roadX = roadX - roadW/3;
        snowRoad.push(new Snow(roadX, HEIGHT, roadW));
        let added = 0;
        while (added < 2) {
            let newTreeX = Math.floor(Math.random() * WIDTH);
            if (Math.abs(newTreeX-roadX) > roadW*1.5) {
                added++;
                trees.push(new Snow(newTreeX,HEIGHT, roadW));
            }
        }
    }

    this.setState({
        x: Math.floor(newX),
        realX: newX,
        y: newY,
        looking: newLooking,
        snowRoad: snowRoad,
        trees: trees,
      });

  };

  render() {
    return (
      <GameLoop style={styles.container} onUpdate={this.updateHandler}>


          {this.state.snowRoad.map((snow)=><View key={snow.id} style={[styles.player, {
                left: snow.x,
                top: snow.y,
                width: snow.w,
                height: snow.w}]}>
            <ImageBackground key={snow.id+10000} source={require("../game/snow.png")} style={styles.image}
                    resizeMode="stretch">
            </ImageBackground>
            </View>)}

          {this.state.trees.map((tree)=><View key={tree.id} style={[styles.player, {
                left: tree.x,
                top: tree.y,
                width: tree.w,
                height: tree.w}]}>
            <ImageBackground key={tree.id+10000} source={require("../game/tannenbaum.png")} style={styles.image}
                    resizeMode="stretch">
            </ImageBackground>
            </View>)}


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

            <Text style={{width: WIDTH,  textAlign: "center", fontSize: 40, color: "green"}}
            >{Math.floor(km/400)}</Text>

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
    backgroundColor: "#FFFFFF"
  },
  player: {
    position: "absolute",
  }
});

AppRegistry.registerComponent("BestGameEver", () => BestGameEver);