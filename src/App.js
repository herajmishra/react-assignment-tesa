import React, { Button, ButtonToolBar } from 'react';
import './App.css';
import JqxComboBox, { IComboBoxProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxcombobox';
import JqxButton from './assets/jqwidgets-react/react_jqxbuttons'
import map1 from './map.PNG';
import map2 from './map2.PNG';
import loading from './loading.gif';

class App extends React.Component {


    constructor(props) {
        super(props);
        this.pois = null;
        this.locations = null;
        this.selectedPoi = null;
        this.error = null;

        this.state = {
            stateFlag: true,
            index: 0,
            imgList: [map1, map2, loading],
            result: null
        }
    }

    onChange = event => {
        if (this.state.stateFlag) {
            this.setState({ index: 2 });
            this.setState({ stateFlag: false });
        }

        let source = event.target;
        let param = event.args.item.value;
        if (source.parentElement.id == 'location' && param != "locations") {
            fetch("http://localhost:8080/happening/locations/" + param, { mode: 'cors' })
                .then(res => res.json())
                .then(
                    (result) => {
                        this.locations = result;
                        console.log(this.locations);
                    },
                    (error) => {
                        alert(error + " locations")
                    })

        }

        if (source.parentElement.id == "selection" && param != "types") {
            this.selectedPoi = param;
            fetch("http://localhost:8080/poi/" + param, { mode: 'cors' })
                .then(res => res.json())
                .then(
                    (result) => {
                        this.pois = result;
                        console.log(this.pois);
                    },
                    (error) => {
                        alert(error + " pois ")
                    }
                )
        }
    }

    onClick = event => {
        let result = [];
        let removeIndices = [];
        for (var location in this.locations) {
            for (var poi in this.pois) {
                if (this.locations[location].x == this.pois[poi].coOrdinates.x && this.locations[location].y == this.pois[poi].coOrdinates.y) {
                    var key = JSON.stringify(this.locations[location]);
                    var flag = true;
                    for (var res in result) {
                        var object = JSON.parse(JSON.stringify(result[res]));
                        var res1 = result[res];
                        for (var obj in object) {
                            if (obj == key) {
                                removeIndices.push({ res1 });
                                var temp = [];
                                temp.push({
                                    [key]: res1[obj] + ", " + this.pois[poi].name
                                });
                                result[res] = temp[0];
                                flag = false;
                            }
                        }
                    }
                    if (flag) {
                        result.push({
                            [key]: this.selectedPoi + ": " + this.pois[poi].name
                        });
                    }
                }
            }
        }
        console.log(result);
        this.setState({result:JSON.stringify(result)})
        this.setState({ index: 1 });
    }

    render() {
        let location = new Array("locations", "Hinjawadi", "Magarpatta", "Vimannagar");
        let selectType = new Array("types", "Hotels", "Hospitals");

        return (
            <div className="App">
                <header className="App-header">
                    <img id="map" src={this.state.imgList[this.state.index]} className="image" alt="map" />
                    <div id="location">
                        <JqxComboBox id="locCombo" onChange={this.onChange}
                            width={150} height={20}
                            source={location} selectedIndex={0}
                        />
                    </div>
                    <div id="selection">
                        <JqxComboBox id="selCombo" onChange={this.onChange}
                            width={150} height={20}
                            source={selectType} selectedIndex={0}
                        />
                    </div>
                    <button onClick={this.onClick}>Submit</button>
                </header>
                <div id="response">
                    <p>{this.state.result}</p>
                </div>
            </div>
        );
    }
}

export default App;