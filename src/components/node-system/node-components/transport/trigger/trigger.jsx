import React from 'react'

const Trigger = ({node}) => {

  const inputs = node.input ? Object.keys(node.input) : null

  return (
    <div 
      className='trigger-container'
      id={node.id}
      style={{
        height: `${node.size.y}px`,
        width :`${node.size.x}px`,
      }}
    >
      <>
        {inputs ? (
          <>
            {inputs.map((input, index) => (
              <React.Fragment key={node.id + index}>
                <Input 
                  id={node.id}
                  inputType={input} 
                  whichParent={input === "trigger" ? node.type : "natural"}
                  yPosition={node.size.y / (inputs.length + 1)  * (index + 1) - 6}
                />
              </React.Fragment>
            ))}
         </>
        ) : null }
      </>
        <Output 
          id={node.id}
          outputType={"node"} 
          whichParent={node.type}
          yPosition={node.size.y / 2 - 6}
        />
    </div>
  )
}

export default Trigger
