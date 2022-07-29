import React, { useState } from 'react';
import _ from 'lodash'
import './App.css';
import { Button, Dropdown, Input } from 'semantic-ui-react';
import Spinner from './components/Spinner';


// const GET_EVALUATION_URL = 'localhost:3001/evaluation' // TODO use dotenv 
const COLORS=['D','E','F','G','H','I','J']
const CLARITY = ['SI2','SI1','VS2','VS1','VVS2','VVS1','IF','FL']
const CUT = ['POOR','FAIR','GOOD','VERY_GOOD','IDEAL','SUPER_IDEAL']



const colorOptions = _.map(COLORS, (state, index) => ({
  key: index,
  text: state,
  value: state
}));

const clarityOptions = _.map(CLARITY, (state, index) => ({
  key: index,
  text: state,
  value: state
}));

const cutOptions = _.map(CUT, (state, index) => ({
  key: index,
  text: state,
  value: state
}));

const styles= { 
  optionsContainer: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  mainVerticalContainer: {
    marginTop:'50px',
    display:'flex',
    flexDirection:'column',
    alignItems:'center'

  },
  borderColor:{
    border: '5px solid red !important', 
    borderColor:'red!important',
    borderWidth: 5
  }

} 

function App() {
  const [carat,setCarat] = useState()
  const [color,setColor] = useState()
  const [clarity,setClarity] = useState()
  const [cut,setCut] = useState()
  const [price,setPrice] = useState(0)
  const [showSpinner,setShowSpinner] = useState(false)


  const handleCaratChange = (event,data)=>{
    event.preventDefault()
    setCarat(data.value)
  }

  const handleColorChange = (event,data)=>{
    event.preventDefault()
    setColor(data.value)
  }

  const handleClarityChange = (event,data)=>{
    event.preventDefault()
    setClarity(data.value)
  }

  const handleCutChange= (event,data)=>{
    event.preventDefault()
    setCut(data.value)
  }

  const handleSubmit = async (event)=>{
    event.preventDefault()
    setShowSpinner(true)

    try{
      const options={
        mode:'cors',
        headers:{'Content-Type':'application/json', 'Access-Control-Allow-Origin': '*'},
        method:'GET',
        cache: "no-cache"
      }
      const url = `http://localhost:3001/evaluation?carat_weight=${carat}&color=${color}&clarity=${clarity}&cut=${cut}`
      const response = await fetch(url,options)
      const data = await response.json()
      debugger
      setPrice(data.evaluatedPrice)

    }
    catch(e){
      console.error('something went wrong while fetching data from API',e.message)
    }
    finally{
      setShowSpinner(false)
    }
    
  }

  return (
    <div className="App">
      <h1>Title</h1>
      <div style={styles.mainVerticalContainer}>
        <form>
            <dev style={styles.optionsContainer} >
              <Input placeholder ='Carat Weight' search selection onChange={handleCaratChange}/>
              <Dropdown className={styles.borderColor} placeholder='Color' search selection options={colorOptions} onChange={handleColorChange}/>   
              <Dropdown placeholder='Clarity' search selection options={clarityOptions}onChange={handleClarityChange}/>   
              <Dropdown placeholder='Cut' search selection options={cutOptions} onChange={handleCutChange} />
            </dev>
            {
              showSpinner?
              <Spinner></Spinner> :
              <div></div>
            }
            
            <Button type='submit' onClick={handleSubmit} placeholder='Evaluate diamond'>Evaluate Diamond</Button>
            <h1>{price}</h1>
        </form>
        
      </div>
      
           
    </div>
  );
}

export default App;
