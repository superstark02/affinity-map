import React, { Component } from 'react';
import ReactStickies from 'react-stickies';
import { Link } from 'react-router-dom';
import "../App.css"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

class Home extends Component {

    state = {
        notes: [],
        disablePan: false,
        x: 0,
        y: 0,
        scale: 1,
        buckets: []
    }

    toggleZoom = () => {
        if(this.state.disablePan){
            this.setState({disablePan:false})
        }else{
            this.setState({disablePan:true})
        }
    }

    onChange = (notes) => {

        for (var i = 0; i < notes.length; i++) {
            for (var j = 0; j < notes.length; j++) {
                if (notes[i].grid.x - notes[j].grid.x === 2) {
                    notes[i].title = notes[j].title;
                }
                else if (notes[i].grid.x - notes[j].grid.x === -2) {
                    notes[j].title = notes[i].title;
                }
            }
        }

        this.setState({
            notes
        })
    }

    onPanStop = (e) => {
        console.log(e)
        this.setState({ x: e.state.positionX })
        this.setState({ y: e.state.positionY })
        this.setState({ x: e.state.scale })
    }

    render() {
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
            >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <React.Fragment>
                        <div className="app-bar" >
                            <div>
                                Affinty Map
                            </div>
                            <div className="btn" >
                                <div variant="contain" className="btns">
                                    Zoom And Pan
                                </div>
                                <Link to="/zoom" >
                                    <div className="btns" >
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
                            <div style={{ minHeight: "90vh", width: "100vw", display: "flex", flexWrap: "wrap" }} >
                                <ReactStickies
                                    notes={this.state.notes}
                                    onChange={this.onChange}
                                />
                                {/*<div className="bucket-ctn" >
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
                                </div>*/}
                            </div>
                        </TransformComponent>
                    </React.Fragment>
                )}

            </TransformWrapper>
        );
    }
}

export default Home;

