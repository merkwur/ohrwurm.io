import React, { useEffect, useState } from 'react'
import "./midi.scss"
import Output from '../component-helpers/output/output'
import { abbreviates } from '../../node-helpers/nodeData'
import { colorScheme } from '../../node-helpers/helperFunctions'
import { Scale } from 'tonal'


const MIDI = ({node, tone}) => {
  const outputs = ["Velocity", "Key", "Gate"]
  const chroma = Scale.get("C chromatic").notes
  const [key, setKey] = useState()
  const [velocity, setVelocity] = useState()
  /*
  command 159 note-on for M-audio Oxygen-49
  command 142 note-off
  */
  
  const triggerStart = (k, v) => {
    console.log(k, v)
    node.connection.forEach((n, i) => {   

      const id = n.split("=")[0].split(">")[1]
      tone[id].tone.triggerAttack(k, 0., v)
      
    })
  }

  const triggerStop = () => {
    node.connection.forEach((n, i) => {   
      const id = n.split("=")[0].split(">")[1]
      tone[id].tone.triggerRelease()
      
    })
  }

  console.log(tone)
  useEffect(() => {
    // Initialize an array to keep track of subscribed MIDI inputs
    const subscribedInputs = [];
    
    // Function to handle incoming MIDI messages
    const handleMIDIMessage = (event) => {
      const [command, note, velocity] = event.data;
      //console.log(`Command: ${command}, Note: ${note}, Velocity: ${velocity}`);
      // Here, you can add logic to control your DAW parameters based on the MIDI message
      if (command === 159) {
        // console.log("key pressed",  chroma[note%12]+(Math.floor(note/12)-1).toString())
        triggerStart(chroma[note%12]+(Math.floor(note/12)-1).toString(), velocity)


      }

      if (command === 143) {
        triggerStop()
      }
    };

    // Function to set up MIDI access and listeners
    const requestMIDIAccess = () => {
      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(
          (midiAccess) => {
            console.log('MIDI access obtained');
            // Listen to MIDI devices
            for (let input of midiAccess.inputs.values()) {
              input.onmidimessage = handleMIDIMessage;
              subscribedInputs.push(input); // Keep track of the input for later cleanup
            }
          },
          () => {
            console.log('Could not access your MIDI devices.');
          }
        );
      } else {
        console.log('Web MIDI API not supported in this browser.');
      }
    };

    // Request MIDI access when the component mounts
    requestMIDIAccess();

    // Cleanup function to remove event listeners
    return () => {
      subscribedInputs.forEach(input => {
        input.onmidimessage = null; // Remove the event listener
      });
      console.log('Cleaned up MIDI inputs');
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount


  return (
    <div 
      className='source-container'
      id={node.id}
      style={{
        height: `${node.size.y}px`,
        width :`${node.size.x}px`,
      }}
    >

      <div 
        className='background-hint'
        style={{
          position: "absolute",
          left: 0,
          top: 0, 
          color: `${colorScheme[node.type]}`,
          fontSize: `${7}pt`,    
        }}
        >
          {abbreviates[node.name] ? abbreviates[node.name] : node.name}
      </div> 
      {outputs.map((o, i) => (
        <React.Fragment 
          key={o+i}
        >
          <Output 
            id={node.id}
            outputType={o} 
            whichParent={node.type}
            yPosition={node.size.y / (outputs.length + 1)  * (i + 1) - 6}
          />
        </React.Fragment>
      ))}
        
    </div>
  )
}

export default MIDI
