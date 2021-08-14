import React, { Component } from 'react';
import Draggable from 'react-draggable'; // The default
import "../App.css"
import { Link } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { rdb } from "../firebase"

class Group extends Component {

    state = {
        notes: [],
        disablePan: true,
        x: 0,
        y: 0,
        scale: null,
        buckets: []
    }

    toggleZoom = () => {
        if (this.state.disablePan) {
            this.setState({ disablePan: false })
        } else {
            this.setState({ disablePan: true })
        }
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


    addNote = () => {

        var d = new Date();
        var n = d.getTime();

        var arr = []

        arr = this.state.notes

        arr.push({
            id: n,
            bucket: "New Bucket",
            highlight: "New Highlight",
            x: 0,
            y: 0
        })
        rdb.ref().child("notes").set(arr)
        this.setState({ notes: arr })
    }

    deletNote = (id) => {
        var i
        for (i = 0; i < this.state.notes.length; i++) {
            if (id == this.state.notes[i].id) {
                break;
            }
        }
        var arr = this.state.notes
        arr.splice(i, 1)

        this.setState({ notes: arr })
        rdb.ref().child("notes").set(arr)
    }

    editNote = (id, type, e) => {
        var i
        for (i = 0; i < this.state.notes.length; i++) {
            if (id == this.state.notes[i].id) {
                break;
            }
        }
        var arr = this.state.notes

        if (type === "bucket") {
            arr[i].bucket = e.target.value
        }
        if (type === "highlight") {
            arr[i].highlight = e.target.value
        }
        this.setState({ notes: arr })

        rdb.ref().child("notes").set(arr)
    }

    updateBucket = (e, id) => {

        var sec = 1150 / this.state.buckets.length;

        for (var k = 0; k < this.state.buckets.length; k++) {
            if (e.x > (sec * k) + 150 && e.x < (sec * (k + 1)) + 150) {
                var i
                for (i = 0; i < this.state.notes.length; i++) {
                    if (id == this.state.notes[i].id) {
                        break;
                    }
                }
                var arr = this.state.notes

                arr[i].bucket = this.state.buckets[k].id

                this.setState({ notes: arr })
                //rdb.ref().child("notes").set(arr)
            }
        }



        /*arr[i].x = e.x
        arr[i].y = e.y
        rdb.ref().child("notes").child(i).update({ x: e.x, y: e.y })

        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[i].x - arr[j].x < 233 && arr[i].x - arr[j].x > 0) {
                    arr[i].bucket = arr[j].bucket;
                }
                else if (arr[j].x - arr[i].x < 233 && arr[j].x - arr[i].x > 0) {
                    arr[j].bucket = arr[i].bucket;
                }
            }
        }
        this.setState({ notes: arr })*/
        console.log(e)
    }

    save = () => {
        rdb.ref().child("notes").set(this.state.notes)
    }

    componentDidMount() {
        rdb.ref().child("notes").on('value', (snapshot) => {
            this.setState({ notes: snapshot.val() })

            var arr = []
            var buckets = []
            arr = snapshot.val()

            for (var i = 0; i < arr.length; i++) {
                var b = -1;

                for (var k = 0; k < buckets.length; k++) {
                    if (arr[i].bucket === buckets[k].id) {
                        b = k;
                        break;
                    }
                }

                if (b !== -1) {
                    buckets[b].highlights.push(arr[i])
                }
                else {
                    buckets.push({
                        id: arr[i].bucket,
                        highlights: [arr[i]]
                    })
                }
            }

            for (var j = 0; j < buckets.length; j++) {
                for (var k = 0; k < buckets[j].highlights.length; k++) {

                    var i = arr.indexOf(buckets[j].highlights[k])

                    arr[i].x = 150 + ((1150 / buckets.length) * j);
                    arr[i].y = k * 2;
                }
            }

            console.log(buckets)

            this.setState({ buckets: buckets })
            this.setState({ notes: arr })
            //console.log(buckets)
        });

        rdb.ref().child("PanZoom").on('value', (snapshot) => {
            this.setState({ x: snapshot.val().x })
            this.setState({ y: snapshot.val().y })
            this.setState({ scale: snapshot.val().scale })
        });
    }

    render() {
        if (this.state.scale) {
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
                        <div>
                            <div className="app-bar" >
                                <div>
                                    Affinty Map
                                </div>
                                <div className="btn" >
                                    <div variant="contain" className="btns" onClick={this.addNote} >
                                        Add
                                    </div>
                                    <div variant="contain" className="btns" onClick={this.save} >
                                        Save
                                    </div>
                                    {
                                        !this.state.disablePan ? (
                                            <div variant="contain" className="btns" onClick={this.toggleZoom} >
                                                Zoom On
                                            </div>
                                        ) : (
                                            <div variant="contain" className="btns" onClick={this.toggleZoom} >
                                                Zoom Off
                                            </div>
                                        )
                                    }
                                    <Link >
                                        <div className="btns">
                                            Group Highlights
                                        </div>
                                    </Link>
                                    <a href="https://github.com/superstark02/affinity-map" >
                                        <div className="btns-i" >
                                            <img title="Go To Source Code" src="https://img.icons8.com/material-outlined/24/000000/github.png" width="15px" />
                                        </div>
                                    </a>
                                    <a href="https://drive.google.com/file/d/13fF1Y_K71xic4MtGzkpUlqZb8FUqkUMX/view?usp=sharing" >
                                        <div className="btns-i" >
                                            <img title="Go To Video" src="https://img.icons8.com/material-outlined/24/000000/video.png" width="15px" />
                                        </div>
                                    </a>
                                </div>
                            </div>


                            <TransformComponent>
                                <React.Fragment>
                                    <div style={{ minHeight: "90vh", width: "100vw" }} >
                                        {
                                            this.state.notes.map(note => {
                                                return (
                                                    <Draggable defaultPosition={{ x: note.x, y: note.y }} onStop={(e) => { this.updateBucket(e, note.id) }} >
                                                        <div style={{ backgroundColor: "#cef7f7", width: "200px", height: "200px" }} >
                                                            <div>
                                                                <input value={note.bucket} onChange={(e) => { this.editNote(note.id, "bucket", e) }} />
                                                            </div>
                                                            <div>
                                                                <input value={note.highlight} onChange={(e) => { this.editNote(note.id, "highlight", e) }} />
                                                            </div>
                                                            <button onClick={() => { this.deletNote(note.id) }} >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </Draggable>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="bucket-ctn" >
                                        {
                                            this.state.buckets.map(item => {
                                                return (
                                                    <div className="bucket" >
                                                        <p className="bucket-name" >
                                                            {item.id}
                                                        </p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </React.Fragment>
                            </TransformComponent>
                        </div>
                    )}

                </TransformWrapper>
            );
        }
        else {
            return (<div>Loading</div>)
        }
    }
}

export default Group;