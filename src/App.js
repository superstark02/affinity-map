import React from 'react';
import './App.css';
import getFunction from './getFunction';

class App extends React.Component {

  state = {
    data: null
  }

  componentDidMount() {
    getFunction().then(data => {
      this.setState({ data: data });
    })
  }

  render() {
    return (
      <div>
        {
          this.state.data ? (
            <div  className="grid" >
              {
                this.state.data.map(item => {
                  return (
                    <div><img width="100px" key={item} src={item} alt="dog" /></div>
                  )
                })
              }
            </div>
          ) : (
            <div style={{
              height: '100vh',
              textAlign: "center",
              display:'flex',
              alignItems:"center",
              justifyContent:"center",
              width:"100%"
            }} >
              Please Wait Loading<br />
              (This API is slow, please check console for progress)
            </div>
          )
        }
      </div>
    );
  }

}

export default App;