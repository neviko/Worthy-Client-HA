import React, { useEffect, useState } from 'react';
import _ from 'lodash'
import './App.css';
import { Button, Card, CardContent, CardHeader, Dropdown, Image, Input } from 'semantic-ui-react';
import Spinner from './components/Spinner';


// const GET_EVALUATION_URL = 'localhost:3001/evaluation' // TODO use dotenv 
const COLORS=['D','E','F','G','H','I','J']
const CLARITY = ['SI2','SI1','VS2','VS1','VVS2','VVS1','IF','FL']
const CUT = ['POOR','FAIR','GOOD','VERY_GOOD','IDEAL','SUPER_IDEAL']
const BASE_URL = 'http://localhost:3001'

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

function App() {
  const [carat,setCarat] = useState()
  const [color,setColor] = useState()
  const [clarity,setClarity] = useState()
  const [cut,setCut] = useState()
  const [price,setPrice] = useState(0)
  const [showSpinner,setShowSpinner] = useState(false)
  const [errMessage,setErrMessage] = useState('')
  const [suggestedDiamonds,setSuggestedDiamonds] = useState([])


  useEffect(() => {
    const handleSubmit = async ()=>{
      if(!color || !clarity || !cut){
        return
      }
      if(carat > 0){ // validates it's not a symbol too
        setSuggestedDiamonds([])
        setShowSpinner(true)
  
        try{
          const url = `${BASE_URL}/evaluation?carat_weight=${carat}&color=${color}&clarity=${clarity}&cut=${cut}`
          const response = await fetch(url,{method:'GET'})
          const data = await response.json()
          setPrice(data.evaluatedPrice)
  
        }
        catch(e){
          console.error('something went wrong while fetching data from API',e.message)
        }
        finally{
          setShowSpinner(false)
        }
      }  
    }
    (async ()=>  {
      await handleSubmit()
    })()

  }, [carat,clarity,color,cut])
  

  const handleCaratChange = (event,data)=>{
    event.preventDefault()
    if(data.value > 0 || data.value ==''){
      setCarat(data.value)
      setErrMessage('')
    }
    else{
      setErrMessage('Carat weight should be a positive number')
    }
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

  const handleSuggestions = async (event)=>{
    event.preventDefault()
    setShowSpinner(true)

    try{    
      const url = `${BASE_URL}/similar?price=${price}&amount=${4}`
      const response = await fetch(url,{method:'GET'})
      const data = await response.json()
      setSuggestedDiamonds(data.similarDiamonds)

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
      <h1>Diamonds Price Calculator</h1>
      <div className='main-vertical-container'>
          <dev className='options-container' >
            <Input error={errMessage} placeholder ='Carat Weight' search selection onChange={handleCaratChange}/>
            <Dropdown error={!color} placeholder='Color' search selection options={colorOptions} onChange={handleColorChange}/>   
            <Dropdown error= {!clarity} placeholder='Clarity' search selection options={clarityOptions}onChange={handleClarityChange}/>   
            <Dropdown error= {!cut} placeholder='Cut' search selection options={cutOptions} onChange={handleCutChange} />
          </dev>
          
          {
            showSpinner?
            <Spinner></Spinner> :
            <div></div>
          }
          {
            (!carat || !color || !clarity || !cut) ? 
            <></> :
            <div>
              {/* <Button className='evaluation-button' basic color='violet' type='submit' onClick={handleSubmit} placeholder='Evaluate diamond'>Evaluate Diamond</Button>  */}
              {errMessage}
              <h1>Price: {price}</h1>
              {
              price ? <Button className='evaluation-button' basic color='green' type='submit' onClick={handleSuggestions} placeholder='Find similar goods'>Find Similar Goods</Button> 
              :<></>
              }

            </div>
            
          }

          {
            suggestedDiamonds?
              <div style={{display:'flex', flexDirection:"row", justifyContent:"space-evenly"}}>
                {suggestedDiamonds.map(diamond =>{
                  return <Card color='violet'>
                            <Image src={diamond.imgUrl} />
                            <Card.Content >
                              <Card.Header>
                                {diamond.price}
                              </Card.Header>
                              <Card.Meta textAlign='center'>
                                <span className='date'>{diamond.color}, {diamond.clarity}, {diamond.cut}</span>
                              </Card.Meta>
                            </Card.Content>
                          </Card>
                  
                })}
              </div>
              :<></>
            }
      </div>
    </div>
  );
}

export default App;
