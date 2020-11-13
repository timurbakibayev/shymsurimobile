import React, { PureComponent } from "react";
import { AppState, AsyncStorage, AppRegistry, StyleSheet, Dimensions, View, ImageBackground, Text } from "react-native";
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
let fail = false;
let counter = 0;
let active = true;
let highScore = -1;

class Snow {
    constructor(x,y,w) {
        this.x = x;
        this.y = y;
        this.w = w;
        id++;
        this.id = id;
        this.rnd = Math.floor(Math.random() * 100);
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
        goraY: 0,
    };
  }

  _storeData = async () => {
      try {
            await AsyncStorage.setItem(
              'highscore',
              highScore.toString()
            );
      } catch (error) {
          console.log("error saving data")
      }
    };

  _retrieveData = async () => {
      console.log("retrieving");
      try {
        const value = await AsyncStorage.getItem('highscore');
        if (value !== null) {
          // We have data!!
          highScore = parseInt(value);
        } else {
            highScore = 0;
        }
      } catch (error) {
        console.log("there was no highscore")
        highScore = 0;
      }
    };

  updateHandler = ({ touches, screen, layout, time }) => {
    counter++;
    if (counter>30) {
        counter = 0;

        if (highScore === -1) {
            this._retrieveData();
        }
        if (highScore>=0 && highScore<km) {
            highScore = km;
            this._storeData();
            console.log("new highscore");
            console.log(highScore);
        }

        if (AppState.currentState !== "active") {
            active = false;
            this.props.stopGame();
        } else {
            active = true;
        }
    }
    if (!active)
        return;

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
    let press = touches.find(x => x.type === "press");
    let newX = this.state.realX;
    let newY = this.state.y;
    let goraY = this.state.goraY;
    if (move) {
        rotating = move.delta.pageX;
    } else {
        rotating = 0;
    }
    if (press) {
        if (press.event.pageY < 100)
            this.props.stopGame();
    }

    let newLooking = this.state.looking + rotating;
    if (newLooking > 100)
        newLooking = 100;
    if (newLooking < -100)
        newLooking = -100;

    dx = dx + newLooking/300*c;
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
    goraY = goraY - speed*c;
    snowRoad = snowRoad.filter((snow)=>snow.y>-snow.w);
    let checkX = 0;
    let checkY = newY;
    let checkW = 0;

    if (newLooking>=0) {
        checkX = Math.round(newX-RADIUS*newLooking/100/2);
        checkW = Math.round(this.state.width*this.state.looking/100);
    } else {
        checkX = Math.round(newX - RADIUS*(-newLooking)/100 -
                    RADIUS*newLooking/100/2);
        checkW = Math.round(-this.state.width*this.state.looking/100)
    }
    if (checkW <= 1)
      checkW = 1;
    checkX = checkX + checkW/2;

    fail = false;
    trees.forEach((tree)=>{
        tree.y = tree.y - speed*c;
        if (tree.y > HEIGHT-tree.w/2)
            more = false;
        if ((tree.x < checkX) && (checkX < tree.x + tree.w) &&
            (tree.y < checkY) && (checkY < tree.y + tree.w) )
            fail = true;
    });
    if (fail) {
        km = km - time.delta*10;
        if (km<0)
            km = 0;
        speed = 1;
    }
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
        goraY: goraY,
      });

  };

  render() {
      let new_style = {};
      Object.assign(new_style, styles.player);
      if (fail) {
          new_style.backgroundColor = "#aa222299";
          new_style.borderRadius = 50;
      }
    return (
      <GameLoop style={styles.container} onUpdate={this.updateHandler}>

          {this.state.goraY > - Math.floor(WIDTH/4*6) && <View key={300010} style={[styles.player, {
                left: 0,
                top: this.state.goraY,
                width: WIDTH,
                height: Math.floor(WIDTH/4*6)}]}>
            <ImageBackground key={300011} source={
                require("../game/shymbulak1.png")
            } style={styles.image}
                    resizeMode="stretch">
            </ImageBackground>
            </View>}

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
            <ImageBackground key={tree.id+10000} source={
                tree.rnd>50?
                require("../game/tannenbaum.png"):require("../game/tannenbaum2.png")
            } style={styles.image}
                    resizeMode="stretch">
            </ImageBackground>
            </View>)}


            {this.state.looking>=0 && <View style={[new_style, {
              left: Math.round(this.state.x-this.state.width*this.state.looking/100/2),
              top: this.state.y + (this.state.goraY < - Math.floor(WIDTH)?
                        0:
                        Math.floor(WIDTH)+this.state.goraY
                ), width: Math.round(this.state.width*this.state.looking/100), height: this.state.height}]}>
            <ImageBackground source={require("../game/skier-google_right.png")} style={styles.image}
                    resizeMode="stretch">
            </ImageBackground>
            </View>}
          {this.state.looking<0 &&
            <View style={[new_style, {
                left: Math.round(this.state.x - RADIUS*(-this.state.looking)/100 -
                    this.state.width*this.state.looking/100/2),
                top: this.state.y + (this.state.goraY < - Math.floor(WIDTH)?
                        0:
                        Math.floor(WIDTH)+this.state.goraY
                ),
                width: Math.round(-this.state.width*this.state.looking/100),
                height: this.state.height}]}>
            <ImageBackground source={require("../game/skier-google_left.png")} style={styles.image}
                    resizeMode="stretch">
            </ImageBackground>
            </View>}

            <View style={{display: "flex", width: WIDTH, flexDirection: "row"}}>
                <Text style={{flex: 0.5,  textAlign: "center", fontSize: 40, color: "green"}}
                >{Math.floor(km/400)}</Text>
                {highScore>0 && <Text style={{flex: 0.5,  textAlign: "center", fontSize: 40, color: "green"}}
                >{Math.floor(highScore/400)}</Text>}
                {highScore<=0 && <Text style={{flex: 0.5,  textAlign: "center", fontSize: 40, color: "green"}}
                >...</Text>}
            </View>

            <View style={{position: "absolute", top: 0, left: Math.round(WIDTH/2-25), width: 50,
                height: 50}}>
                <ImageBackground source={require("../game/close.png")} style={styles.image}
                    resizeMode="stretch">
                </ImageBackground>
            </View>


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