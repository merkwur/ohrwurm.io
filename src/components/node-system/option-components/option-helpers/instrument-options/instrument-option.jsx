import React from 'react'

const InstrumentOption = ({ id, 
                            type, 
                            size, 
                            name,
                            parameters,
                            getParameter, 
                            getWaveType}) => {
  const [openProperties, setOpenProperties] = useState(false)
  const oneSide = parameters.modulator ? Object.keys(parameters).length + Object.keys(parameters.modulator).length - 1 <= 8 : false

  return (
    <div className='source-options-wrapper'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {name}
        </div>
      </div>
      <>
        { openProperties ? (
          <div className='parameters'
              style={{flexDirection: oneSide ? "column" : "row", borderRight: `1px solid ${colorScheme[type]}`}}
            >
              {name.includes("Oscillator") ? (
                <React.Fragment>
                  <div>
                    {Object.keys(parameters).map((param, index) => (
                      <React.Fragment key={param+index} >
                        <Oscillator 
                          whichOscillator={"main"}
                          value={parameters[param]}
                          parameterName={param}
                          state={initialStates[param]}
                          type={type}
                          id={id}
                          getOscillatorState={getOscillatorState}
                          getParameter={getParameter}
                          getWaveType={getWaveType}

                        />
                      </React.Fragment>       
                    ))}      
                  </div>
                  {parameters.hasOwnProperty("modulator") ? (
                    <div className='oscillator-addition'
                          style={{display: "flex", flexDirection: "row"

                          }}
                    >
                      <div className='separator'>
                        <div className='separator-text'>
                          modulator
                        </div>
                      </div>
                      <div>
                        {Object.keys(parameters.modulator).map((param, index) => (
                          <React.Fragment key={param+index} >
                            <Oscillator
                              whichOscillator={"modulator"} 
                              value={parameters.modulator[param]}
                              parameterName={param}
                              state={initialStates[param]}
                              type={type}
                              id={id}
                              getOscillatorState={getOscillatorState}
                              getParameter={getParameter}
                              getWaveType={getWaveType}

                            />
                          </React.Fragment>       
                        ))}      
                      </div>
                    </div>              
                  ) : null}
                </React.Fragment>
              ) : name === "LFO" ? (
                <LFO 
                  parameters={parameters}
                  state={LFOStates}
                  type={type}
                  id={id}
                  getOscillatorState={getOscillatorState}
                  getParameter={getParameter}
                  getWaveType={getWaveType}
                />
              ) : null} 
          </div>
        ) : null }

        </>
    </div>
  )
}

export default InstrumentOption
