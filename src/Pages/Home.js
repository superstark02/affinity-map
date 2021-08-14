import React, { Component } from 'react';
import ReactStickyNotes from '@react-latest-ui/react-sticky-notes';
import { Link } from 'react-router-dom';
import "../App.css"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { rdb } from "../firebase"

class Home extends Component {

    state = {
        notes: null,
        disablePan: true,
        x: 0,
        y: 0,
        scale: null,
        buckets: [],
    }

    toggleZoom = () => {
        if (this.state.disablePan) {
            this.setState({ disablePan: false })
        } else {
            this.setState({ disablePan: true })
        }
    }

    onChange = (type, payload, notes) => {

        if(type==="add"){
            notes[0]["bucket"] = "Bucket Name";
            notes[0]["highlight"] = "Highlight";
            notes[0].text = "Bucket Name" + " : "  + "Highlight";
        }

        if(type === "update"){
            for(var i = 0; i < notes.length; i++){
                if(payload.data.id === notes[i].id){
                    var temp = notes[i].text.split(" : ");
                    notes[i]["bucket"] = temp[0];
                    notes[i]["highlight"] = temp[1];
                }
            }
        }

        for (var i = 0; i < notes.length; i++) {
            for (var j = 0; j < notes.length; j++) {
                if (notes[i].position.x - notes[j].position.x < 218 && notes[i].position.x - notes[j].position.x > 0) {
                    notes[i].bucket = notes[j].bucket;
                    var temp = notes[i].text.split(" : ");
                    notes[i].text = notes[j].bucket + " : " + temp[1]
                }
                else if (notes[i].position.x - notes[j].position.x < 218 && notes[i].position.x - notes[j].position.x > 0) {
                    notes[j].bucket = notes[i].bucket;
                    var temp = notes[j].text.split(" : ");
                    notes[j].text = notes[i].bucket + " : " + temp[1]
                }
            }
        }

        this.setState({
            notes
        })

        if(notes.length !== 0){
            rdb.ref().child("notes").set(notes)
        }

        console.log(type)
        console.log(payload)
        console.log(notes)
    }

    onPanStop = (e) => {
        this.setState({ x: e.state.positionX })
        this.setState({ y: e.state.positionY })
        this.setState({ scale: e.state.scale })
        rdb.ref().child("PanZoom").set({
            x: e.state.positionX,
            y: e.state.positionY,
            scale: e.state.scale
        })
    }

    onZoomStop = (e) => {
        this.setState({ x: e.state.positionX })
        this.setState({ y: e.state.positionY })
        this.setState({ scale: e.state.scale })
        rdb.ref().child("PanZoom").set({
            x: e.state.positionX,
            y: e.state.positionY,
            scale: e.state.scale
        })
    }

    componentDidMount() {
        rdb.ref().child("notes").on('value', (snapshot) => {
            this.setState({ notes: snapshot.val() })
            console.log(this.state.notes)
        });

        rdb.ref().child("PanZoom").on('value', (snapshot) => {
            this.setState({ x: snapshot.val().x })
            this.setState({ y: snapshot.val().y })
            this.setState({ scale: snapshot.val().scale })
        });
    }

    render() {
        if (this.state.notes && this.state.scale) {
            return (
                <TransformWrapper
                    initialScale={this.state.scale}
                    initialPositionX={this.state.x}
                    initialPositionY={this.state.y}
                    disabled={this.state.disablePan}
                    doubleClick={
                        {
                            disabled: true
                        }
                    }
                    onPanningStop={this.onPanStop}
                    onZoomStop={this.onZoomStop}
                >
                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                        <React.Fragment>
                            <div className="app-bar" >
                                <div>
                                    Affinty Map
                                </div>
                                <div className="btn" >
                                    <div variant="contain" className="btns" onClick={this.toggleZoom} >
                                        Zoom And Pan
                                    </div>
                                    <Link >
                                        <div className="btns">
                                            Group Highlights
                                        </div>
                                    </Link>
                                    <a href="https://github.com/superstark02/affiliate-map" >
                                        <div className="btns-i" >
                                            <img title="Go To Source Code" src="https://img.icons8.com/material-outlined/24/000000/github.png" width="15px" />
                                        </div>
                                    </a>
                                    <a href="https://drive.google.com/file/d/1YFMy3DLDIFezlxw42Cqgj4A9AgCiiL1L/view?usp=sharing" >
                                        <div className="btns-i" >
                                            <img title="Go To Video" src="https://img.icons8.com/material-outlined/24/000000/video.png" width="15px" />
                                        </div>
                                    </a>
                                    <div className="btns-i" >
                                        <img title="Open Info" onClick={() => { this.setState({ openInfo: true }) }} src="https://img.icons8.com/material-outlined/24/000000/info.png" width="15px" />
                                    </div>
                                </div>
                            </div>

                            <TransformComponent>
                                <div style={{ minHeight: "90vh", width: "100vw" }} >
                                    <ReactStickyNotes
                                        notes={this.state.notes}
                                        onChange={this.onChange}
                                        footer={true}
                                    />
                                    <div className="bucket-ctn" >
                                        {
                                            this.state.buckets.map(item => {
                                                return (
                                                    <div className="bucket" >
                                                        <p className="bucket-name" >{item.title}</p>
                                                        <div>
                                                            <img onClick={()=>{this.deleteBucket(item.id)}} style={{ marginRight: "10px", cursor: "pointer" }} src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" width="10px" />
                                                            <img style={{ cursor: "pointer" }} src="https://img.icons8.com/material-outlined/24/000000/pencil--v1.png" width="10px" />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </TransformComponent>
                        </React.Fragment>
                    )}

                </TransformWrapper>
            );
        }else{
            return(<div>Loading</div>)
        }
    }
}

export default Home;

